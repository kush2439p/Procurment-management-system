import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/components/AnimatedPage';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, User, Package, CheckCircle, Clock, XCircle, Download, Inbox } from 'lucide-react';

const fmt = (d?: string) => d ? new Date(d).toLocaleDateString('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
}) : '—';

const RequisitionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isManager, isEmployee } = useAuth();
  const canApprove = isAdmin() || isManager();
  const employeeView = isEmployee();
  const [req, setReq] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);

  useEffect(() => {
    API.get(`/procurement/requisition/${id}`)
      .then(({ data }) => setReq(data))
      .catch(() => toast.error('Not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    try {
      await API.patch(`/procurement/requisition/update-status/${id}?status=${status}`);
      toast.success(`Requisition ${status.toLowerCase()}`);
      setReq({ ...req, status, updatedAt: new Date().toISOString() });
      setShowReject(false);
    } catch { toast.error('Failed to update'); }
  };

  const markReceived = async () => {
    try {
      await API.patch(`/procurement/requisition/mark-received/${id}`);
      toast.success('✅ Goods receipt confirmed! You can now download the GRN.');
      setReq({ ...req, status: 'RECEIVED', updatedAt: new Date().toISOString() });
    } catch (e: any) {
      toast.error(e.response?.data || 'Failed to confirm receipt');
    }
  };

  const downloadGRN = async () => {
    try {
      const res = await API.get(`/reports/grn/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `GRN-${req?.requisitionNumber || id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('GRN downloaded!');
    } catch { toast.error('Failed to download GRN'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;
  if (!req) return <div className="text-center text-muted-foreground p-12">Requisition not found</div>;

  const total = req.items?.reduce((s: number, i: any) => s + i.quantity * i.unitPrice, 0) || 0;

  const timelineSteps = [
    { label: 'Submitted', done: true, date: req.createdAt, icon: Clock, color: 'hsl(252,87%,67%)' },
    { label: req.status === 'REJECTED' ? 'Rejected' : 'Approved', done: req.status === 'APPROVED' || req.status === 'REJECTED', date: req.status !== 'PENDING' ? req.updatedAt : null, icon: req.status === 'REJECTED' ? XCircle : CheckCircle, color: req.status === 'REJECTED' ? 'hsl(0,84%,60%)' : 'hsl(160,84%,55%)' },
  ];

  return (
    <AnimatedPage>
      <button onClick={() => navigate('/requisitions')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Requisitions
      </button>

      <div className="max-w-2xl space-y-5">
        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="page-title">{req.requisitionNumber}</h1>
            <StatusBadge status={req.status} />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="flex items-center gap-2 text-sm" style={{ color: 'hsl(215,20%,55%)' }}>
              <User className="w-4 h-4 shrink-0" />
              <span>Requested by: <strong style={{ color: 'hsl(214,32%,80%)' }}>{req.requestedBy?.username || `User #${req.requestedBy?.id}`}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'hsl(215,20%,55%)' }}>
              <Package className="w-4 h-4 shrink-0" />
              <span>Total: <strong style={{ color: 'hsl(160,84%,55%)' }}>₹{total.toLocaleString('en-IN')}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'hsl(215,20%,55%)' }}>
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Created: <strong style={{ color: 'hsl(214,32%,80%)' }}>{fmt(req.createdAt)}</strong></span>
            </div>
            {req.updatedAt && req.updatedAt !== req.createdAt && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'hsl(215,20%,55%)' }}>
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{req.status === 'PENDING' ? 'Updated' : req.status}: <strong style={{ color: 'hsl(214,32%,80%)' }}>{fmt(req.updatedAt)}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'hsl(214,32%,80%)' }}>Status Timeline</h2>
          <div className="flex items-start gap-0">
            {timelineSteps.map((step, i) => (
              <div key={step.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center min-w-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center mb-2 shrink-0"
                    style={{ background: step.done ? (step.color + '20') : 'hsla(218,27%,14%,0.8)', border: step.done ? `2px solid ${step.color}` : '2px solid rgba(255,255,255,0.1)' }}>
                    <step.icon className="w-4 h-4" style={{ color: step.done ? step.color : 'hsl(215,20%,40%)' }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: step.done ? step.color : 'hsl(215,20%,40%)' }}>{step.label}</span>
                  {step.date && <span className="text-xs mt-0.5 text-center" style={{ color: 'hsl(215,20%,40%)' }}>{fmt(step.date)}</span>}
                </div>
                {i < timelineSteps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 mt-[-20px] rounded" style={{ background: timelineSteps[i].done ? timelineSteps[i].color : 'rgba(255,255,255,0.07)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">Items</h2>
          <table className="data-table w-full">
            <thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
            <tbody>
              {req.items?.map((item: any, i: number) => (
                <tr key={i}>
                  <td>
                    <div className="font-medium text-foreground">{item.itemName}</div>
                    {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                  </td>
                  <td>{item.quantity}</td>
                  <td>₹{item.unitPrice?.toLocaleString('en-IN')}</td>
                  <td className="font-medium text-foreground">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-sm text-muted-foreground mr-2">Total:</span>
            <span className="font-bold text-lg" style={{ color: 'hsl(160,84%,55%)' }}>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Approve / Reject (manager/admin) */}
        {canApprove && req.status === 'PENDING' && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => updateStatus('APPROVED')} className="btn-success flex-1">
                ✓ Approve Requisition
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowReject(!showReject)} className="btn-danger flex-1">
                ✗ Reject
              </motion.button>
            </div>
            {showReject && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-4 space-y-3">
                <label className="form-label">Rejection Reason *</label>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="form-input min-h-[80px]" placeholder="Enter reason..." />
                <button onClick={() => rejectReason.trim() ? updateStatus('REJECTED') : toast.error('Enter a reason')} className="btn-danger w-full">
                  Confirm Rejection
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Mark as Received (employee — when APPROVED and goods delivered) */}
        {employeeView && req.status === 'APPROVED' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5" style={{ border: '1px solid hsla(210,100%,45%,0.25)', background: 'hsla(210,100%,45%,0.05)' }}>
            <div className="flex items-start gap-3 mb-4">
              <Inbox className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'hsl(210,100%,65%)' }} />
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'hsl(210,100%,75%)' }}>Have the items arrived?</p>
                <p className="text-xs" style={{ color: 'hsl(215,20%,50%)' }}>
                  This requisition is <strong style={{ color: 'hsl(160,84%,55%)' }}>APPROVED</strong>. Once the physical goods are delivered to you, click below to confirm receipt.
                  You'll then be able to download a <strong>Goods Receipt Note (GRN)</strong> PDF for your records.
                </p>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={markReceived}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, hsl(210,100%,45%), hsl(210,80%,38%))' }}>
              <CheckCircle className="w-4 h-4" /> Confirm Goods Received
            </motion.button>
          </motion.div>
        )}

        {/* Download GRN (after RECEIVED) */}
        {req.status === 'RECEIVED' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5" style={{ border: '1px solid hsla(160,84%,39%,0.25)', background: 'hsla(160,84%,39%,0.05)' }}>
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'hsl(160,84%,55%)' }} />
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'hsl(160,84%,65%)' }}>Goods Receipt Confirmed ✅</p>
                <p className="text-xs" style={{ color: 'hsl(215,20%,50%)' }}>
                  You have confirmed receipt of these items. Download the <strong>Goods Receipt Note (GRN)</strong> below — it includes the item list, quantities, values, and signature lines for your records.
                </p>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={downloadGRN}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, hsl(160,84%,36%), hsl(160,70%,30%))', boxShadow: '0 4px 15px hsla(160,84%,36%,0.3)' }}>
              <Download className="w-4 h-4" /> Download GRN (Goods Receipt Note)
            </motion.button>
          </motion.div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default RequisitionDetail;
