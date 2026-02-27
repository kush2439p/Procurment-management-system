import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/AnimatedPage';
import { StatusBadge } from '@/components/StatusBadge';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

const Approvals = () => {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/procurement/approval/all').then(({ data }) => setApprovals(data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  return (
    <AnimatedPage>
      <div className="mb-6">
        <h1 className="page-title">Approval Audit Trail</h1>
        <p className="page-subtitle">Complete history of all approval decisions</p>
      </div>

      {loading ? <TableSkeleton cols={5} /> : approvals.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No approvals recorded yet</p>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <motion.table variants={staggerContainer} initial="initial" animate="animate" className="data-table">
            <thead><tr><th>PO</th><th>Approver</th><th>Status</th><th>Reason</th><th>Date</th></tr></thead>
            <tbody>
              {approvals.map((a, i) => (
                <motion.tr key={a.id || i} variants={staggerItem}>
                  <td className="font-medium text-foreground">{a.purchaseOrder?.poNumber || `PO #${a.purchaseOrder?.id}`}</td>
                  <td>{a.approver?.username || `User #${a.approverId}`}</td>
                  <td><StatusBadge status={a.status || (a.approved ? 'APPROVED' : 'REJECTED')} /></td>
                  <td className="text-sm">{a.reason || '—'}</td>
                  <td className="text-sm text-muted-foreground">{a.approvalDate ? new Date(a.approvalDate).toLocaleDateString() : '—'}</td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      )}
    </AnimatedPage>
  );
};

export default Approvals;
