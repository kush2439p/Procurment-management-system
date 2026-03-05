import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/AnimatedPage';
import { StatusBadge } from '@/components/StatusBadge';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { Plus, Eye, FileText, Package, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Requisitions = () => {
  const [reqs, setReqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();
  const { roles, username } = useAuth();
  const isManagerOrAdmin = roles.includes('ROLE_PROCUREMENT_MANAGER') || roles.includes('ROLE_ADMIN');

  const loadReqs = () => {
    const endpoint = isManagerOrAdmin
      ? '/procurement/requisition/all'
      : '/procurement/requisition/my';
    API.get(endpoint)
      .then(({ data }) => setReqs(data || []))
      .catch(() => toast.error('Failed to load requisitions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadReqs(); }, [isManagerOrAdmin]);

  const deleteReq = async (id: number, status: string, ownerUsername: string) => {
    if (!isManagerOrAdmin && (status !== 'PENDING' || ownerUsername !== username)) return;
    if (!confirm('Delete this requisition? This cannot be undone.')) return;
    try {
      await API.delete(`/procurement/requisition/delete/${id}`);
      toast.success('Requisition deleted');
      loadReqs();
    } catch (err: any) {
      toast.error(err.response?.data || 'Failed to delete');
    }
  };

  const filtered = filter === 'ALL' ? reqs : reqs.filter(r => r.status === filter);

  const filterCounts = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => ({
    label: s,
    count: s === 'ALL' ? reqs.length : reqs.filter(r => r.status === s).length,
  }));

  return (
    <AnimatedPage>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="page-title">Requisitions</h1>
          <p className="page-subtitle">Track and manage purchase requisitions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/requisitions/new')}
          className="btn-primary flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> New Requisition
        </motion.button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {filterCounts.map(({ label, count }) => (
          <motion.button
            key={label}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(label)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200"
            style={filter === label ? {
              background: 'linear-gradient(135deg, hsl(252,87%,67%),hsl(265,85%,58%))',
              color: 'white',
              boxShadow: '0 4px 15px hsla(252,87%,67%,0.3)',
            } : {
              background: 'hsla(218,27%,14%,0.7)',
              color: 'hsl(215,20%,55%)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {label}
            <span className="rounded-full px-1.5 py-0.5 text-[10px]" style={{ background: 'rgba(255,255,255,0.15)' }}>{count}</span>
          </motion.button>
        ))}
      </div>

      {loading ? <TableSkeleton cols={5} /> : filtered.length === 0 ? (
        <div className="glass-card p-14 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'hsla(38,92%,50%,0.1)' }}>
            <FileText className="w-8 h-8" style={{ color: 'hsl(38,92%,60%)' }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: 'hsl(214,32%,80%)' }}>No requisitions found</p>
          <p className="text-sm" style={{ color: 'hsl(215,20%,45%)' }}>
            {filter !== 'ALL' ? `No ${filter.toLowerCase()} requisitions` : 'Create your first requisition to get started'}
          </p>
          {filter === 'ALL' && <button onClick={() => navigate('/requisitions/new')} className="mt-5 btn-primary text-sm px-5 py-2.5">Create Requisition</button>}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <motion.table variants={staggerContainer} initial="initial" animate="animate" className="data-table w-full">
            <thead>
              <tr>
                <th>Req #</th>
                <th>Requested By</th>
                <th>Items</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const total = r.items?.reduce((s: number, i: any) => s + (i.quantity * i.unitPrice), 0) || 0;
                return (
                  <motion.tr key={r.id} variants={staggerItem}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'hsla(38,92%,50%,0.12)' }}>
                          <FileText className="w-3.5 h-3.5" style={{ color: 'hsl(38,92%,60%)' }} />
                        </div>
                        <span className="font-semibold text-sm" style={{ color: 'hsl(214,32%,88%)' }}>{r.requisitionNumber}</span>
                      </div>
                    </td>
                    <td className="text-sm">{r.requestedBy?.username || `User #${r.requestedBy?.id}`}</td>
                    <td>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Package className="w-3.5 h-3.5" style={{ color: 'hsl(215,20%,50%)' }} />
                        {r.items?.length || 0}
                      </div>
                    </td>
                    <td className="text-sm font-semibold" style={{ color: 'hsl(160,84%,55%)' }}>
                      ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/requisitions/${r.id}`)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ background: 'hsla(252,87%,67%,0.1)' }}
                        >
                          <Eye className="w-3.5 h-3.5" style={{ color: 'hsl(252,87%,72%)' }} />
                        </motion.button>
                        {(isManagerOrAdmin || (r.status === 'PENDING' && r.requestedBy?.username === username)) && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteReq(r.id, r.status, r.requestedBy?.username)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                            style={{ background: 'hsla(0,84%,60%,0.1)' }}
                          >
                            <Trash2 className="w-3.5 h-3.5" style={{ color: 'hsl(0,84%,65%)' }} />
                          </motion.button>
                        )}
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

export default Requisitions;
