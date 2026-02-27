import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/AnimatedPage';
import { StatsCard } from '@/components/StatsCard';
import { StatusBadge } from '@/components/StatusBadge';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import API from '@/api/axiosInstance';
import { Building2, FileText, ShoppingCart, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const COLORS = ['hsl(243,76%,59%)', 'hsl(160,84%,39%)', 'hsl(38,92%,50%)', 'hsl(0,84%,60%)'];

const Dashboard = () => {
  const [stats, setStats] = useState({ vendors: 0, requisitions: 0, pos: 0, approvals: 0 });
  const [recentPOs, setRecentPOs] = useState<any[]>([]);
  const [poStatusData, setPoStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vendors, reqs, pos, approvals] = await Promise.all([
          API.get('/vendor/all'),
          API.get('/procurement/requisition/all'),
          API.get('/procurement/purchase-order/all'),
          API.get('/procurement/approval/all'),
        ]);

        setStats({
          vendors: vendors.data?.length || 0,
          requisitions: reqs.data?.length || 0,
          pos: pos.data?.length || 0,
          approvals: approvals.data?.length || 0,
        });

        const poList = pos.data || [];
        setRecentPOs(poList.slice(-5).reverse());

        const statusCounts = poList.reduce((acc: any, po: any) => {
          acc[po.status] = (acc[po.status] || 0) + 1;
          return acc;
        }, {});
        setPoStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));
      } catch {
        // API not available, show zeros
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AnimatedPage>
      <div className="mb-8">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your procurement operations</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div variants={staggerItem}><StatsCard title="Total Vendors" value={stats.vendors} icon={Building2} color="primary" /></motion.div>
          <motion.div variants={staggerItem}><StatsCard title="Requisitions" value={stats.requisitions} icon={FileText} color="warning" /></motion.div>
          <motion.div variants={staggerItem}><StatsCard title="Purchase Orders" value={stats.pos} icon={ShoppingCart} color="success" /></motion.div>
          <motion.div variants={staggerItem}><StatsCard title="Approvals" value={stats.approvals} icon={CheckCircle} color="destructive" /></motion.div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PO Status Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">PO Status Distribution</h2>
          {poStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={poStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {poStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(215,25%,27%)', border: 'none', borderRadius: 8, color: 'hsl(214,32%,91%)' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">No data available</div>
          )}
          <div className="flex gap-4 justify-center mt-2">
            {poStatusData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent POs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Purchase Orders</h2>
          {recentPOs.length > 0 ? (
            <div className="space-y-3">
              {recentPOs.map((po, i) => (
                <motion.div
                  key={po.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/30"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{po.poNumber}</p>
                    <p className="text-xs text-muted-foreground">{po.vendor?.name || 'N/A'}</p>
                  </div>
                  <StatusBadge status={po.status} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">No purchase orders yet</div>
          )}
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Dashboard;
