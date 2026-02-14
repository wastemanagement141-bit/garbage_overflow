import React from 'react';
import { CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import DustbinAnimation from './DustbinAnimation';

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



    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 md:p-8 transform hover:scale-[1.02] transition-all duration-300 border border-slate-100 dark:border-slate-700">
            <div className="mb-6">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Device ID</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{deviceId || 'Waiting...'}</h3>
            </div>

            <div className="mb-2 flex flex-col items-center justify-center">
                <div>
                    <DustbinAnimation fillPercentage={fillPercentage} />
                </div>

                <div className={`mt-2 px-4 py-1.5 rounded-full text-xs font-bold ${statusBg} ${statusText} dark:bg-opacity-20 border border-opacity-20 flex items-center gap-2 uppercase tracking-wide shadow-sm`}>
                    <Icon size={14} />
                    {status}
                </div>
            </div>

            <div className="text-slate-400 dark:text-slate-500 text-sm flex items-center justify-between">
                <span>Capacity Usage</span>
                <span>{fillPercentage > 100 ? 100 : fillPercentage}/100 Units</span>
            </div>
        </div>
    );
};

export default StatusCard;
