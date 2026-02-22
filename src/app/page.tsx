"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState("載入中...");
  const [authCode, setAuthCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const generateDeviceId = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.textBaseline = "top";
        ctx.font = "14px Arial";
        ctx.fillText("DeviceID", 2, 2);
      }
      const canvasData = canvas.toDataURL();
      // 把所有特徵都 hash 進去，不直接顯示解析度數字
      const raw = [
        canvasData,
        screen.width,
        screen.height,
        screen.colorDepth,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        navigator.language,
        navigator.hardwareConcurrency,
      ].join("|");

      let h1 = 0, h2 = 0;
      for (let i = 0; i < raw.length; i++) {
        const c = raw.charCodeAt(i);
        h1 = Math.imul(h1 ^ c, 0x9e3779b9);
        h2 = Math.imul(h2 ^ c, 0x85ebca6b);
        h1 ^= h2 >>> 13;
        h2 ^= h1 >>> 7;
      }
      const part1 = (Math.abs(h1) >>> 0).toString(16).toUpperCase().padStart(8, "0");
      const part2 = (Math.abs(h2) >>> 0).toString(16).toUpperCase().padStart(8, "0");
      return `FP-${part1}-${part2}`;
    };

    setDeviceId(generateDeviceId());
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(deviceId);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  const handleSubmit = async () => {
    setError("");
    if (!authCode) {
      setError("請輸入授權碼");
      return;
    }
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    if (authCode === "admin") {
      router.push("/dashboard");
    } else {
      setError("授權碼錯誤，請重新輸入");
      setIsLoading(false);
    }
  };

  return (
      <div
          className="min-h-screen flex items-center justify-center p-4"
          style={{ backgroundColor: "#F4F4F4" }}
      >
        {/* 隱藏瀏覽器內建密碼眼睛按鈕 */}
        <style>{`
        input::-ms-reveal,
        input::-ms-clear,
        input::-webkit-contacts-auto-fill-button,
        input::-webkit-credentials-auto-fill-button {
          display: none !important;
          visibility: hidden;
          pointer-events: none;
        }
      `}</style>

        {/* Toast 通知 */}
        <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300"
            style={{
              opacity: toast ? 1 : 0,
              transform: `translateX(0) translateY(${toast ? "0px" : "20px"})`,
              pointerEvents: "none",
            }}
        >
          <div className="bg-gray-800 text-white text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            裝置 ID 已複製！
          </div>
        </div>

        {/* 主卡片 */}
        <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8">
          {/* 裝置 ID 區塊 */}
          <div className="mb-8">
            <h2 className="text-center text-lg font-semibold text-gray-800 mb-3">
              裝置 ID
            </h2>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 gap-2">
            <span className="flex-1 text-sm text-gray-600 font-mono tracking-wider">
              {deviceId}
            </span>
              <button
                  onClick={handleCopy}
                  title="複製 ID"
                  className="shrink-0 text-gray-400 hover:text-green-600 transition-colors p-1 rounded"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              </button>
            </div>
          </div>

          {/* 分隔線 */}
          <hr className="border-gray-100 mb-6" />

          {/* 授權碼輸入 */}
          <div className="mb-4">
            <div className="relative">
              <input
                  type={showCode ? "text" : "password"}
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="輸入授權碼"
                  autoComplete="new-password"
                  className="w-full border-b border-gray-300 focus:border-green-500 outline-none py-2 text-sm text-gray-700 placeholder-gray-400 transition-colors bg-transparent"
                  style={{ paddingRight: authCode ? "2.5rem" : "0" }}
              />
              {/* 只在有輸入內容時才顯示切換按鈕 */}
              {authCode && (
                  <button
                      onClick={() => setShowCode(!showCode)}
                      tabIndex={-1}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showCode ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                  </button>
              )}
            </div>
          </div>

          {/* 錯誤訊息 */}
          {error && (
              <p className="text-red-500 text-xs mb-4 text-center">{error}</p>
          )}

          {/* 驗證按鈕 */}
          <div className="flex justify-center mt-6">
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-sm font-medium px-8 py-2 rounded-md transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    驗證中...
                  </>
              ) : (
                  "驗證並進入"
              )}
            </button>
          </div>
        </div>
      </div>
  );
}