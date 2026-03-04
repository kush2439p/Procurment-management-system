import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/AnimatedPage';
import { StatusBadge } from '@/components/StatusBadge';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, CalendarDays, User, ShoppingCart } from 'lucide-react';

const Approvals = () => {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    API.get('/procurement/approval/all')
      .then(({ data }) => setApprovals(data || []))
      .catch((err) => {
        if (err.response?.status === 403) { setAccessDenied(true); }
        else { toast.error('Failed to load approvals'); }
      })
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: approvals.length,
    approved: approvals.filter(a => (a.status || (a.approved ? 'APPROVED' : 'REJECTED')) === 'APPROVED').length,
    rejected: approvals.filter(a => (a.status || (a.approved ? 'APPROVED' : 'REJECTED')) === 'REJECTED').length,
  };

  if (accessDenied) return (
    <AnimatedPage>
      <div className="glass-card p-14 text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'hsla(0,84%,60%,0.1)' }}>
          <XCircle className="w-8 h-8" style={{ color: 'hsl(0,84%,65%)' }} />
        </div>
        <p className="font-semibold mb-1" style={{ color: 'hsl(214,32%,80%)' }}>Access Restricted</p>
        <p className="text-sm" style={{ color: 'hsl(215,20%,45%)' }}>Approval management is available to Procurement Managers and Admins only.</p>
      </div>
    </AnimatedPage>
  );

  return (
    <AnimatedPage>
      <div className="mb-6">
        <h1 className="page-title">Approval Audit Trail</h1>
        <p className="page-subtitle">Complete history of all approval decisions</p>
      </div>

      {/* Summary cards */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {[
            { label: 'Total', value: counts.total, icon: Clock, color: 'hsla(252,87%,67%,0.12)', textColor: 'hsl(252,87%,72%)', borderColor: 'hsla(252,87%,67%,0.2)' },
            { label: 'Approved', value: counts.approved, icon: CheckCircle, color: 'hsla(160,84%,39%,0.12)', textColor: 'hsl(160,84%,55%)', borderColor: 'hsla(160,84%,39%,0.2)' },
            { label: 'Rejected', value: counts.rejected, icon: XCircle, color: 'hsla(0,84%,60%,0.12)', textColor: 'hsl(0,84%,65%)', borderColor: 'hsla(0,84%,60%,0.2)' },
          ].map(({ label, value, icon: Icon, color, textColor, borderColor }) => (
            <div key={label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: color, border: `1px solid ${borderColor}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: color }}>
                <Icon className="w-5 h-5" style={{ color: textColor }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: textColor }}>{value}</p>
                <p className="text-xs" style={{ color: 'hsl(215,20%,50%)' }}>{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {loading ? <TableSkeleton cols={5} /> : approvals.length === 0 ? (
        <div className="glass-card p-14 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'hsla(252,87%,67%,0.1)' }}>
            <CheckCircle className="w-8 h-8" style={{ color: 'hsl(252,87%,70%)' }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: 'hsl(214,32%,80%)' }}>No approvals recorded yet</p>
          <p className="text-sm" style={{ color: 'hsl(215,20%,45%)' }}>Approve or reject a purchase order to see it here</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <motion.table variants={staggerContainer} initial="initial" animate="animate" className="data-table w-full">
            <thead>
              <tr>
                <th>Purchase Order</th>
                <th>Approver</th>
                <th>Decision</th>
                <th>Reason</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((a, i) => {
                const status = a.status || (a.approved ? 'APPROVED' : 'REJECTED');
                return (
                  <motion.tr
                    key={a.id || i}
                    variants={staggerItem}
                    style={status === 'APPROVED'
                      ? { background: 'hsla(160,84%,39%,0.025)' }
                      : status === 'REJECTED'
                        ? { background: 'hsla(0,84%,60%,0.025)' }
                        : {}
                    }
                  >
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'hsla(160,84%,39%,0.12)' }}>
                          <ShoppingCart className="w-3.5 h-3.5" style={{ color: 'hsl(160,84%,55%)' }} />
                        </div>
                        <span className="font-semibold text-sm" style={{ color: 'hsl(214,32%,88%)' }}>
                          {a.purchaseOrder?.poNumber || `PO #${a.purchaseOrder?.id}`}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-sm">
                        <User className="w-3.5 h-3.5 shrink-0" style={{ color: 'hsl(215,20%,50%)' }} />
                        {a.approver?.username || `User #${a.approverId}`}
                      </div>
                    </td>
                    <td><StatusBadge status={status} /></td>
                    <td>
                      <span className="text-sm" style={{ color: a.reason || a.comments ? 'hsl(214,32%,75%)' : 'hsl(215,20%,40%)' }}>
                        {a.reason || a.comments || '—'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: 'hsl(215,20%,50%)' }}>
                        <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                        {a.approvedAt || a.approvalDate
                          ? new Date(a.approvedAt || a.approvalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : '—'}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </motion.table>
        </div>
      )}
    </AnimatedPage>
  );
};

export default Approvals;
