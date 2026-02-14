import React, { useState, useEffect } from 'react';
import { getBinStatus, getHistory } from '../services/api';
import StatusCard from './StatusCard';
import AlertBox from './AlertBox';
import HistoryTable from './HistoryTable';
import { RefreshCw } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Dashboard = () => {
    const [statusData, setStatusData] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchData = async () => {
        try {
            const [statusRes, historyRes] = await Promise.all([
                getBinStatus(),
                getHistory()
            ]);

            if (statusRes) setStatusData(statusRes);
            if (historyRes && Array.isArray(historyRes)) {
                setHistory(historyRes);
            } else {
                setHistory([]);
            }
            setLastUpdated(new Date());
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const isFull = statusData?.status === 'FULL' || (statusData?.fillPercentage || 0) > 80;

    return (
        <div className="h-screen w-full overflow-hidden flex flex-col relative z-10 p-4 md:p-6 lg:p-8 text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <AlertBox isVisible={isFull} />

            <header className="flex-none flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-800 dark:text-white">
                        Smart<span className="text-indigo-600 dark:text-indigo-400">Waste</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-sm md:text-base">IoT Garbage Overflow Management System</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs md:text-sm bg-white dark:bg-slate-800 px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-slate-100 dark:border-slate-700">
                        <RefreshCw className="w-3 h-3 md:w-4 md:h-4 animate-spin" style={{ animationDuration: '3s' }} />
                        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 min-h-0 overflow-y-auto lg:overflow-hidden pb-2">
                {/* Left Column: Status Card */}
                <div className="lg:col-span-1 flex flex-col h-auto lg:h-full">
                    <div className="h-full flex flex-col justify-center">
                        {loading && !statusData ? (
                            <div className="bg-white dark:bg-slate-800 h-96 w-full rounded-3xl shadow-xl p-8 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400"></div>
                            </div>
                        ) : (
                            <StatusCard data={statusData} />
                        )}
                    </div>
                </div>

                {/* Right Column: History Table */}
                <div className="lg:col-span-2 h-[400px] lg:h-full flex flex-col overflow-hidden">
                    <HistoryTable historyData={history} />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
