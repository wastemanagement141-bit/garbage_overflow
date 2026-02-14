import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { getRegistry, addRegistry, updateRegistry, deleteRegistry } from '../services/api';

const SettingsModal = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [bins, setBins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBin, setCurrentBin] = useState({ id: null, deviceId: '', name: '', details: '' });

    const fetchBins = async () => {
        setLoading(true);
        const data = await getRegistry();
        setBins(data);
        setLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            fetchBins();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateRegistry(currentBin);
            } else {
                await addRegistry(currentBin);
            }
            setCurrentBin({ id: null, deviceId: '', name: '', details: '' });
            setIsEditing(false);
            fetchBins();
        } catch (error) {
            alert('Error saving bin: ' + error.message);
        }
    };

    const handleEdit = (bin) => {
        const isUnregistered = bin.id && bin.id.toString().startsWith('temp-');
        setCurrentBin({
            id: isUnregistered ? null : bin.id,
            deviceId: bin.deviceid,
            name: bin.name,
            details: bin.details || ''
        });
        setIsEditing(true);
    };

    const handleDelete = async (binId) => {
        if (binId && binId.toString().startsWith('temp-')) {
            alert('Cannot delete a discovered device record. It will disappear once registered or when no longer sending data.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this bin?')) {
            try {
                await deleteRegistry(binId);
                fetchBins();
            } catch (error) {
                alert('Error deleting bin: ' + error.message);
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                {t('settings')}
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {/* Form */}
                            <form onSubmit={handleSubmit} className="mb-8 p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                                <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 mb-4 flex items-center gap-2">
                                    {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
                                    {isEditing ? t('editBin') : t('addBin')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">{t('binName')}</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Main Lobby Bin"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            value={currentBin.name}
                                            onChange={(e) => setCurrentBin({ ...currentBin, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">{t('deviceIdLabel')}</label>
                                        <input
                                            type="text"
                                            required
                                            disabled={isEditing}
                                            placeholder="BIN001"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all disabled:opacity-50"
                                            value={currentBin.deviceId}
                                            onChange={(e) => setCurrentBin({ ...currentBin, deviceId: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">{t('binDetails')}</label>
                                        <input
                                            type="text"
                                            placeholder="Floor 1, West Wing"
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                            value={currentBin.details}
                                            onChange={(e) => setCurrentBin({ ...currentBin, details: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end gap-3">
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setCurrentBin({ id: null, deviceId: '', name: '', details: '' });
                                            }}
                                            className="px-6 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all"
                                        >
                                            {t('cancel')}
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2 transition-all"
                                    >
                                        <Save size={18} />
                                        {t('save')}
                                    </button>
                                </div>
                            </form>

                            {/* List */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('allBins')}</h3>
                                {loading ? (
                                    <div className="py-10 text-center animate-pulse text-slate-400">Loading...</div>
                                ) : bins.length === 0 ? (
                                    <div className="py-10 text-center text-slate-400 bg-slate-50 dark:bg-slate-900/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                        {t('noBins')}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                        {Array.isArray(bins) && bins.map(bin => (
                                            <div key={bin.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all shadow-sm">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-slate-800 dark:text-white">{bin.name}</h4>
                                                        {bin.isUnregistered && (
                                                            <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">New</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono uppercase tracking-wider">{bin.deviceid}</span>
                                                        {bin.details && <span>• {bin.details}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(bin)} className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(bin.id)} className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
