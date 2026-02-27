import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/AnimatedPage';
import { StatusBadge } from '@/components/StatusBadge';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { Plus, Eye, FileText } from 'lucide-react';

const Requisitions = () => {
  const [reqs, setReqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/procurement/requisition/all').then(({ data }) => setReqs(data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? reqs : reqs.filter(r => r.status === filter);

  return (
    <AnimatedPage>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Requisitions</h1>
          <p className="page-subtitle">Track and manage purchase requisitions</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/requisitions/new')} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Requisition
        </motion.button>
      </div>

      <div className="flex gap-2 mb-4">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === s ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground hover:text-foreground'}`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <TableSkeleton cols={5} /> : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No requisitions found</p>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <motion.table variants={staggerContainer} initial="initial" animate="animate" className="data-table">
            <thead><tr><th>Req #</th><th>Requested By</th><th>Items</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(r => (
                <motion.tr key={r.id} variants={staggerItem}>
                  <td className="font-medium text-foreground">{r.requisitionNumber}</td>
                  <td>{r.requestedBy?.username || `User #${r.requestedBy?.id}`}</td>
                  <td>{r.items?.length || 0} items</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <button onClick={() => navigate(`/requisitions/${r.id}`)} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
                      <Eye className="w-4 h-4 text-primary" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      )}
    </AnimatedPage>
  );
};

export default Requisitions;
