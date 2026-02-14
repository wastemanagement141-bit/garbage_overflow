import React, { useState, useEffect } from 'react';
import { getBinStatus, getHistory } from '../services/api';
import StatusCard from './StatusCard';
import AlertBox from './AlertBox';
import HistoryTable from './HistoryTable';
import { RefreshCw } from 'lucide-react';

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
        <div className="p-6 max-w-7xl mx-auto space-y-8 relative z-10">
            <AlertBox isVisible={isFull} />

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                        Smart<span className="text-indigo-600">Waste</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">IoT Garbage Overflow Management System</p>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                    <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                    <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Status Card */}
                <div className="lg:col-span-1">
                    {loading && !statusData ? (
                        <div className="bg-white h-96 rounded-3xl shadow-xl p-8 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
                        </div>
                    ) : (
                        <StatusCard data={statusData} />
                    )}
                </div>

                {/* Right Column: History Table */}
                <div className="lg:col-span-2 h-[500px]">
                    <HistoryTable historyData={history} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
