"use client";

export default function DashboardPage() {
    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ backgroundColor: "#F4F4F4" }}
        >
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Dashboard</h1>
                <p className="text-gray-400 text-sm">登入成功，歡迎回來！</p>
            </div>
        </div>
    );
}