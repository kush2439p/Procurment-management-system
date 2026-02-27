import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/AnimatedPage';
import { StatusBadge } from '@/components/StatusBadge';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { Plus, Eye, ShoppingCart } from 'lucide-react';

const PurchaseOrders = () => {
  const [pos, setPos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const { isAdmin, isProcMgr } = useAuth();
  const canCreate = isAdmin() || isProcMgr();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/procurement/purchase-order/all').then(({ data }) => setPos(data || [])).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? pos : pos.filter(p => p.status === filter);

  return (
    <AnimatedPage>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Purchase Orders</h1>
          <p className="page-subtitle">Manage purchase orders and approvals</p>
        </div>
        {canCreate && (
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/purchase-orders/new')} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New PO
          </motion.button>
        )}
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
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No purchase orders found</p>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <motion.table variants={staggerContainer} initial="initial" animate="animate" className="data-table">
            <thead><tr><th>PO #</th><th>Vendor</th><th>Items</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(po => (
                <motion.tr key={po.id} variants={staggerItem}>
                  <td className="font-medium text-foreground">{po.poNumber}</td>
                  <td>{po.vendor?.name || 'N/A'}</td>
                  <td>{po.items?.length || 0} items</td>
                  <td><StatusBadge status={po.status} /></td>
                  <td>
                    <button onClick={() => navigate(`/purchase-orders/${po.id}`)} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
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

export default PurchaseOrders;
