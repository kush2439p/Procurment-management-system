import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/components/AnimatedPage';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const PurchaseOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isManager, userId } = useAuth();
  const canApprove = isAdmin() || isManager();
  const [po, setPo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);

  useEffect(() => {
    API.get(`/procurement/purchase-order/${id}`).then(({ data }) => setPo(data)).catch(() => toast.error('Not found')).finally(() => setLoading(false));
  }, [id]);

  const approve = async () => {
    try {
      await API.post(`/procurement/approval/approve/${id}?approverId=${userId || 1}`);
      toast.success('Purchase order approved');
      setPo({ ...po, status: 'APPROVED' });
    } catch { toast.error('Failed'); }
  };

  const reject = async () => {
    try {
      await API.post(`/procurement/approval/reject/${id}?approverId=${userId || 1}&reason=${encodeURIComponent(rejectReason)}`);
      toast.success('Purchase order rejected');
      setPo({ ...po, status: 'REJECTED' });
      setShowReject(false);
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;
  if (!po) return <div className="text-center text-muted-foreground p-12">Not found</div>;

  const total = po.items?.reduce((s: number, i: any) => s + i.quantity * i.unitPrice, 0) || 0;

  return (
    <AnimatedPage>
      <button onClick={() => navigate('/purchase-orders')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="max-w-2xl space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="page-title">{po.poNumber}</h1>
            <StatusBadge status={po.status} />
          </div>
          <p className="text-sm text-muted-foreground">Vendor: <span className="text-foreground">{po.vendor?.name || 'N/A'}</span></p>
          <p className="text-sm text-muted-foreground mt-1">Total: <span className="text-foreground font-semibold">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></p>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">Items</h2>
          <table className="data-table">
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
            <tbody>
              {po.items?.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="font-medium text-foreground">{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>${item.unitPrice?.toFixed(2)}</td>
                  <td className="font-medium text-foreground">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {canApprove && po.status === 'PENDING' && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <motion.button whileTap={{ scale: 0.97 }} onClick={approve} className="btn-success flex-1">Approve</motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowReject(!showReject)} className="btn-danger flex-1">Reject</motion.button>
            </div>
            {showReject && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-4 space-y-3">
                <label className="form-label">Rejection Reason</label>
                <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="form-input min-h-[80px]" placeholder="Enter reason..." required />
                <button onClick={reject} className="btn-danger w-full">Confirm Rejection</button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default PurchaseOrderDetail;
