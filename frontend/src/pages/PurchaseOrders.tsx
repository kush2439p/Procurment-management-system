import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/AnimatedPage';
import { StatusBadge } from '@/components/StatusBadge';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { Plus, Eye, ShoppingCart, Building2, Package } from 'lucide-react';

const PurchaseOrders = () => {
  const [pos, setPos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const { isAdmin, isProcMgr } = useAuth();
  const canCreate = isAdmin() || isProcMgr();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/procurement/purchase-order/all')
      .then(({ data }) => setPos(data || []))
      .catch(() => toast.error('Failed to load purchase orders'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? pos : pos.filter(p => p.status === filter);

  const filterCounts = ['ALL', 'PENDING', 'APPROVED', 'SHIPPED', 'DELIVERED', 'RECEIVED', 'REJECTED'].map(s => ({
    label: s,
    count: s === 'ALL' ? pos.length : pos.filter(p => p.status === s).length,
  }));

  return (
    <AnimatedPage>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="page-title">Purchase Orders</h1>
          <p className="page-subtitle">Manage purchase orders and approvals</p>
        </div>
        {canCreate && (
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/purchase-orders/new')}
            className="btn-primary flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> New PO
          </motion.button>
        )}
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
              background: 'linear-gradient(135deg, hsl(160,84%,39%),hsl(173,80%,33%))',
              color: 'white',
              boxShadow: '0 4px 15px hsla(160,84%,39%,0.3)',
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
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'hsla(160,84%,39%,0.1)' }}>
            <ShoppingCart className="w-8 h-8" style={{ color: 'hsl(160,84%,55%)' }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: 'hsl(214,32%,80%)' }}>No purchase orders found</p>
          <p className="text-sm" style={{ color: 'hsl(215,20%,45%)' }}>
            {filter !== 'ALL' ? `No ${filter.toLowerCase()} orders` : 'Create your first purchase order'}
          </p>
          {filter === 'ALL' && canCreate && (
            <button onClick={() => navigate('/purchase-orders/new')} className="mt-5 btn-success text-sm px-5 py-2.5">Create Purchase Order</button>
          )}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <motion.table variants={staggerContainer} initial="initial" animate="animate" className="data-table w-full">
            <thead>
              <tr>
                <th>PO #</th>
                <th>Vendor</th>
                <th>Items</th>
                <th>Total</th>
                <th>Created</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(po => {
                const total = po.items?.reduce((s: number, i: any) => s + (i.quantity * i.unitPrice), 0) || 0;
                return (
                  <motion.tr key={po.id} variants={staggerItem}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'hsla(160,84%,39%,0.12)' }}>
                          <ShoppingCart className="w-3.5 h-3.5" style={{ color: 'hsl(160,84%,55%)' }} />
                        </div>
                        <span className="font-semibold text-sm" style={{ color: 'hsl(214,32%,88%)' }}>{po.poNumber}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Building2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'hsl(215,20%,50%)' }} />
                        {po.vendor?.name || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Package className="w-3.5 h-3.5" style={{ color: 'hsl(215,20%,50%)' }} />
                        {po.items?.length || 0}
                      </div>
                    </td>
                    <td className="text-sm font-semibold" style={{ color: 'hsl(160,84%,55%)' }}>
                      ₹{total.toLocaleString('en-IN')}
                    </td>
                    <td className="text-xs" style={{ color: 'hsl(215,20%,50%)' }}>
                      {po.createdAt ? new Date(po.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td><StatusBadge status={po.status} /></td>
                    <td>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/purchase-orders/${po.id}`)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: 'hsla(160,84%,39%,0.1)' }}
                      >
                        <Eye className="w-3.5 h-3.5" style={{ color: 'hsl(160,84%,55%)' }} />
                      </motion.button>
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

export default PurchaseOrders;
