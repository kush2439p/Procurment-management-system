import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/components/AnimatedPage';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const RequisitionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isManager } = useAuth();
  const canApprove = isAdmin() || isManager();
  const [req, setReq] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/procurement/requisition/${id}`).then(({ data }) => setReq(data)).catch(() => toast.error('Not found')).finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    try {
      await API.patch(`/procurement/requisition/update-status/${id}?status=${status}`);
      toast.success(`Requisition ${status.toLowerCase()}`);
      setReq({ ...req, status });
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;
  if (!req) return <div className="text-center text-muted-foreground p-12">Requisition not found</div>;

  const total = req.items?.reduce((s: number, i: any) => s + i.quantity * i.unitPrice, 0) || 0;

  return (
    <AnimatedPage>
      <button onClick={() => navigate('/requisitions')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="max-w-2xl space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="page-title">{req.requisitionNumber}</h1>
            <StatusBadge status={req.status} />
          </div>
          <p className="text-sm text-muted-foreground">Requested by: {req.requestedBy?.username || `User #${req.requestedBy?.id}`}</p>
          <p className="text-sm text-muted-foreground mt-1">Total: <span className="text-foreground font-semibold">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></p>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">Items</h2>
          <table className="data-table">
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
            <tbody>
              {req.items?.map((item: any, i: number) => (
                <tr key={i}>
                  <td><div className="font-medium text-foreground">{item.itemName}</div><div className="text-xs text-muted-foreground">{item.description}</div></td>
                  <td>{item.quantity}</td>
                  <td>${item.unitPrice?.toFixed(2)}</td>
                  <td className="font-medium text-foreground">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {canApprove && req.status === 'PENDING' && (
          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => updateStatus('APPROVED')} className="btn-success flex-1">Approve</motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => updateStatus('REJECTED')} className="btn-danger flex-1">Reject</motion.button>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default RequisitionDetail;
