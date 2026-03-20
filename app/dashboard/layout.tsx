import { Sidebar } from "@/app/components/SideBar";
import { Toaster } from "@/app/components/ui/sonner";
import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6">
                {children}
            </main>
            <Toaster position="bottom-right" richColors />
        </div>
    );
}
