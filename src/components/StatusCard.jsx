import React from 'react';
import { Trash2, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

const StatusCard = ({ data }) => {
    const { deviceId, fillPercentage, status } = data || { deviceId: 'Loading...', fillPercentage: 0, status: 'UNKNOWN' };

    let statusColor = 'bg-emerald-500';
    let statusText = 'text-emerald-700';
    let statusBg = 'bg-emerald-100';
    let Icon = CheckCircle;

    if (status === 'HALF') {
        statusColor = 'bg-amber-500'; // Modern yellow/orange
        statusText = 'text-amber-700';
        statusBg = 'bg-amber-100';
        Icon = AlertTriangle;
    } else if (status === 'FULL') {
        statusColor = 'bg-rose-600'; // Modern red
        statusText = 'text-rose-700';
        statusBg = 'bg-rose-100';
        Icon = AlertOctagon;
    }

    // Calculate width for progress bar
    const width = `${Math.min(Math.max(fillPercentage, 0), 100)}%`;

    return (
        <div className="bg-white rounded-3xl shadow-xl p-8 transform hover:scale-[1.02] transition-transform duration-300 border border-slate-100">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Device ID</p>
                    <h3 className="text-2xl font-bold text-slate-800">{deviceId || 'Waiting...'}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${statusBg}`}>
                    <Trash2 className={`w-6 h-6 ${statusText}`} />
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-5xl font-extrabold text-slate-900">
                        {fillPercentage}%
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${statusBg} ${statusText} border border-opacity-20 flex items-center gap-2`}>
                        <Icon size={16} />
                        {status}
                    </span>
                </div>

                {/* Progress Bar Container */}
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden relative">
                    <div
                        className={`h-full ${statusColor} rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                        style={{ width: width }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute top-0 left-0 bottom-0 right-0 bg-white opacity-20 w-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            <div className="text-slate-400 text-sm flex items-center justify-between">
                <span>Capacity Usage</span>
                <span>{fillPercentage > 100 ? 100 : fillPercentage}/100 Units</span>
            </div>
        </div>
    );
};

export default StatusCard;
