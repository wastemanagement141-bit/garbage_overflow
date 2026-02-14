import React from 'react';
import { Clock, Battery, Activity } from 'lucide-react';

const HistoryTable = ({ historyData }) => {
    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    Recent Activity
                </h3>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last 20 Records</span>
            </div>

            <div className="overflow-y-auto flex-1 h-full">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Device</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fill Level</th>
                            <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {Array.isArray(historyData) && historyData.map((record, index) => {
                            const date = new Date(record.createdAt);
                            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                            const dateStr = date.toLocaleDateString();

                            let statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';
                            if (record.status === 'HALF') statusColor = 'text-amber-600 bg-amber-50 border-amber-100';
                            if (record.status === 'FULL') statusColor = 'text-rose-600 bg-rose-50 border-rose-100';

                            return (
                                <tr key={record.id || index} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-700">{timeStr}</div>
                                        <div className="text-xs text-slate-400">{dateStr}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 font-mono text-sm">
                                        {record.deviceId}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${record.status === 'FULL' ? 'bg-rose-500' : record.status === 'HALF' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${record.fillPercentage}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{record.fillPercentage}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {(!Array.isArray(historyData) || historyData.length === 0) && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-400">
                                    No history data available yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryTable;
