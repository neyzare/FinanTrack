'use client';

import { useState } from 'react';
import { Sidebar } from "@/app/components/SideBar";

export default function DashboardPage() {
    const [currentPage, setCurrentPage] = useState('dashboard');

    const handleNavigate = (page: string) => {
        setCurrentPage(page);
        // You can add navigation logic here, e.g., using Next.js router
    };

    return (
        <>
            <Sidebar currentPage={currentPage} onNavigate={handleNavigate}/>
        </>
    )
}