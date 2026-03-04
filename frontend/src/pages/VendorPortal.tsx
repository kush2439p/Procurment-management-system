import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import API from '@/api/axiosInstance';
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/AnimatedPage';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Package, Truck, CheckCircle, Upload, FileText, Download, Building2, Clock, Box, BadgeCheck } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';

const VendorPortal = () => {
    const { isVendor, username } = useAuth();
    const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState<number | null>(null);
    const [documents, setDocuments] = useState<Record<number, any[]>>({});

    if (!isVendor()) {
        return <Navigate to="/dashboard" replace />;
    }

    const fetchPOs = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/api/vendor-portal/purchase-orders');
            setPurchaseOrders(data);
            data.forEach(async (po: any) => {
                try {
                    const res = await API.get(`/api/vendor-portal/purchase-orders/${po.id}/documents`);
                    setDocuments(prev => ({ ...prev, [po.id]: res.data }));
                } catch (e) { }
            });
        } catch {
            toast.error('Failed to load purchase orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPOs(); }, []);

    const handleAccept = async (id: number) => {
        try {
            await API.put(`/api/vendor-portal/purchase-orders/${id}/accept`);
            toast.success('✅ Order accepted! You can now mark it as Shipped.');
            fetchPOs();
        } catch (error: any) {
            toast.error(error.response?.data || 'Failed to accept order');
        }
    };

    const handleReject = async (id: number) => {
        if (!confirm('Reject this purchase order? This cannot be undone.')) return;
        try {
            await API.put(`/api/vendor-portal/purchase-orders/${id}/reject`);
            toast.success('Order rejected.');
            fetchPOs();
        } catch (error: any) {
            toast.error(error.response?.data || 'Failed to reject order');
        }
    };

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            await API.put(`/api/vendor-portal/purchase-orders/${id}/status`, { status });
            toast.success(`Order marked as ${status}`);
            fetchPOs();
        } catch (error: any) {
            toast.error(error.response?.data || 'Failed to update status');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, poId: number) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setUploadingId(poId);
        try {
            await API.post(`/api/vendor-portal/purchase-orders/${poId}/documents`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Document uploaded');
            const res = await API.get(`/api/vendor-portal/purchase-orders/${poId}/documents`);
            setDocuments(prev => ({ ...prev, [poId]: res.data }));
        } catch (error: any) {
            toast.error(error.response?.data || 'Upload failed');
        } finally {
            setUploadingId(null);
            if (e.target) e.target.value = '';
        }
    };

    const handleDownload = async (docId: number, fileName: string) => {
        try {
            const response = await API.get(`/api/vendor-portal/documents/${docId}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch {
            toast.error('Download failed');
        }
    };

    const stats = {
        total: purchaseOrders.length,
        pending: purchaseOrders.filter(p => p.status === 'PENDING').length,
        approved: purchaseOrders.filter(p => p.status === 'APPROVED').length,
        delivered: purchaseOrders.filter(p => p.status === 'DELIVERED').length,
    };

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, hsl(220,35%,7%) 0%, hsl(222,40%,5%) 100%)' }}>
            {/* Header Banner */}
            <div className="relative overflow-hidden px-8 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, hsla(173,80%,40%,0.15) 0%, hsla(210,100%,45%,0.08) 100%)', borderBottom: '1px solid hsla(173,80%,40%,0.15)' }}>
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-10" style={{ background: 'hsl(173,80%,40%)' }} />
                <div className="relative z-10 flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(173,80%,40%), hsl(210,100%,45%))', boxShadow: '0 0 20px hsla(173,80%,40%,0.4)' }}>
                        <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-white">Vendor Portal</h1>
                        <p className="text-sm" style={{ color: 'hsl(173,80%,70%)' }}>Welcome, <strong>{username}</strong> — Manage your assigned orders below</p>
                    </div>
                </div>

                {/* Stats Row */}
                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Total Orders', value: stats.total, icon: Box, color: 'hsla(252,87%,67%,0.15)', border: 'hsla(252,87%,67%,0.25)', text: 'hsl(252,87%,72%)' },
                        { label: 'Pending', value: stats.pending, icon: Clock, color: 'hsla(38,92%,50%,0.12)', border: 'hsla(38,92%,50%,0.25)', text: 'hsl(38,92%,60%)' },
                        { label: 'Approved', value: stats.approved, icon: BadgeCheck, color: 'hsla(210,100%,45%,0.12)', border: 'hsla(210,100%,45%,0.25)', text: 'hsl(210,100%,65%)' },
                        { label: 'Delivered', value: stats.delivered, icon: CheckCircle, color: 'hsla(160,84%,39%,0.12)', border: 'hsla(160,84%,39%,0.25)', text: 'hsl(160,84%,55%)' },
                    ].map(({ label, value, icon: Icon, color, border, text }) => (
                        <motion.div key={label} variants={staggerItem} className="rounded-xl p-4 flex items-center gap-3" style={{ background: color, border: `1px solid ${border}` }}>
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: color }}>
                                <Icon className="w-4 h-4" style={{ color: text }} />
                            </div>
                            <div>
                                <p className="text-xl font-bold" style={{ color: text }}>{value}</p>
                                <p className="text-xs" style={{ color: 'hsl(215,20%,50%)' }}>{label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Orders */}
            <AnimatedPage>
                <div className="space-y-5 mt-6">
                    {/* Role Info Card */}
                    <div className="glass-card p-5 border" style={{ borderColor: 'hsla(173,80%,40%,0.2)', background: 'hsla(173,80%,40%,0.04)' }}>
                        <h3 className="text-sm font-semibold mb-3" style={{ color: 'hsl(173,80%,65%)' }}>📋 Your Role as a Vendor</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs" style={{ color: 'hsl(215,20%,55%)' }}>
                            <div className="flex items-start gap-2">
                                <span className="text-base">📦</span>
                                <div><strong className="block mb-0.5" style={{ color: 'hsl(214,32%,75%)' }}>View Orders</strong>See all purchase orders assigned to you by the procurement team.</div>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-base">✅</span>
                                <div><strong className="block mb-0.5" style={{ color: 'hsl(214,32%,75%)' }}>Accept or Reject</strong>Review PENDING orders and decide if you can fulfill them based on stock availability.</div>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-base">🚚</span>
                                <div><strong className="block mb-0.5" style={{ color: 'hsl(214,32%,75%)' }}>Update Delivery Status</strong>Mark accepted orders as Shipped or Delivered to keep the team informed.</div>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-base">📄</span>
                                <div><strong className="block mb-0.5" style={{ color: 'hsl(214,32%,75%)' }}>Upload Documents</strong>Attach invoices, packing lists, delivery receipts for each order.</div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-16" style={{ color: 'hsl(215,20%,50%)' }}>
                            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            Loading your orders...
                        </div>
                    ) : purchaseOrders.length === 0 ? (
                        <div className="glass-card flex flex-col items-center justify-center py-20">
                            <Package className="w-14 h-14 mb-4 opacity-20" style={{ color: 'hsl(173,80%,55%)' }} />
                            <p className="font-semibold mb-1" style={{ color: 'hsl(214,32%,80%)' }}>No purchase orders yet</p>
                            <p className="text-sm" style={{ color: 'hsl(215,20%,45%)' }}>Orders assigned to your company will appear here</p>
                        </div>
                    ) : (
                        purchaseOrders.map(po => {
                            const total = po.items?.reduce((s: number, i: any) => s + (i.quantity * i.unitPrice), 0) || po.totalAmount || 0;
                            return (
                                <motion.div key={po.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
                                    <div className="p-5 flex flex-wrap items-center justify-between gap-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Package className="w-4 h-4" style={{ color: 'hsl(173,80%,55%)' }} />
                                                <h3 className="font-bold text-white">{po.poNumber}</h3>
                                                <StatusBadge status={po.status} />
                                            </div>
                                            <p className="text-xs" style={{ color: 'hsl(215,20%,50%)' }}>
                                                Created: {po.createdAt ? new Date(po.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                                &nbsp;·&nbsp;
                                                <span className="font-semibold" style={{ color: 'hsl(160,84%,55%)' }}>₹{total.toLocaleString('en-IN')}</span>
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {po.status === 'PENDING' && (
                                                <>
                                                    <button onClick={() => handleAccept(po.id)}
                                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                                                        style={{ background: 'linear-gradient(135deg, hsl(160,84%,36%), hsl(160,70%,30%))' }}>
                                                        <CheckCircle className="w-4 h-4" /> Accept Order
                                                    </button>
                                                    <button onClick={() => handleReject(po.id)}
                                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                                                        style={{ background: 'linear-gradient(135deg, hsl(0,84%,50%), hsl(0,70%,42%))' }}>
                                                        <span className="text-base leading-none">✕</span> Reject Order
                                                    </button>
                                                </>
                                            )}
                                            {po.status === 'APPROVED' && (
                                                <button onClick={() => handleStatusUpdate(po.id, 'SHIPPED')}
                                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                                                    style={{ background: 'linear-gradient(135deg, hsl(210,100%,45%), hsl(210,80%,38%))' }}>
                                                    <Truck className="w-4 h-4" /> Mark Shipped
                                                </button>
                                            )}
                                            {po.status === 'SHIPPED' && (
                                                <button onClick={() => handleStatusUpdate(po.id, 'DELIVERED')}
                                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                                                    style={{ background: 'linear-gradient(135deg, hsl(160,84%,36%), hsl(160,70%,30%))' }}>
                                                    <CheckCircle className="w-4 h-4" /> Mark Delivered
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Items */}
                                        <div>
                                            <h4 className="text-sm font-semibold mb-3 pb-2" style={{ color: 'hsl(214,32%,75%)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>Order Items</h4>
                                            <div className="space-y-2">
                                                {po.items?.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex justify-between items-center text-sm rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <span style={{ color: 'hsl(214,32%,85%)' }}>{item.itemName}</span>
                                                        <span className="text-xs" style={{ color: 'hsl(215,20%,50%)' }}>Qty: {item.quantity} &times; ₹{item.unitPrice?.toLocaleString('en-IN')}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-3 text-right text-sm">
                                                <span style={{ color: 'hsl(215,20%,50%)' }}>Total: </span>
                                                <span className="font-bold text-base" style={{ color: 'hsl(160,84%,55%)' }}>₹{total.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>

                                        {/* Documents */}
                                        <div>
                                            <div className="flex items-center justify-between mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                                <h4 className="text-sm font-semibold" style={{ color: 'hsl(214,32%,75%)' }}>Documents</h4>
                                                <label className="cursor-pointer text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all" style={{ background: 'hsla(173,80%,40%,0.12)', color: 'hsl(173,80%,65%)', border: '1px solid hsla(173,80%,40%,0.2)' }}>
                                                    <Upload className="w-3 h-3" />
                                                    {uploadingId === po.id ? 'Uploading...' : 'Upload'}
                                                    <input type="file" className="hidden" onChange={e => handleFileUpload(e, po.id)} disabled={uploadingId === po.id} />
                                                </label>
                                            </div>
                                            {documents[po.id]?.length > 0 ? (
                                                <div className="space-y-2">
                                                    {documents[po.id].map(doc => (
                                                        <div key={doc.id} className="flex items-center justify-between text-sm rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                            <div className="flex items-center gap-2 truncate pr-3">
                                                                <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: 'hsl(173,80%,55%)' }} />
                                                                <span className="truncate text-xs" style={{ color: 'hsl(214,32%,75%)' }}>{doc.fileName}</span>
                                                            </div>
                                                            <button onClick={() => handleDownload(doc.id, doc.fileName)} className="shrink-0 p-1 rounded transition-colors hover:text-white" style={{ color: 'hsl(215,20%,50%)' }}>
                                                                <Download className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs italic" style={{ color: 'hsl(215,20%,40%)' }}>No documents uploaded yet. Attach invoices or delivery notes here.</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </AnimatedPage>
        </div>
    );
};

export default VendorPortal;
