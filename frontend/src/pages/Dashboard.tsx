import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/AnimatedPage';
import { StatusBadge } from '@/components/StatusBadge';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axiosInstance';
import { Building2, FileText, ShoppingCart, CheckCircle, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const COLORS = ['hsl(252,87%,67%)', 'hsl(160,84%,45%)', 'hsl(38,92%,55%)', 'hsl(0,84%,63%)'];

const StatCard = ({ title, value, icon: Icon, gradient, glow, delay }: any) => (
  <motion.div
    variants={staggerItem}
    whileHover={{ y: -4, scale: 1.02 }}
    className="rounded-2xl p-5 relative overflow-hidden cursor-default transition-all duration-300"
    style={{ background: gradient, border: '1px solid rgba(255,255,255,0.07)', boxShadow: `0 4px 24px ${glow}` }}
  >
    <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 translate-x-8 -translate-y-8" style={{ background: 'white' }} />
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>{title}</p>
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay }}
          className="text-4xl font-bold text-white"
        >
          {value}
        </motion.p>
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ vendors: 0, requisitions: 0, pos: 0, approvals: 0 });
  const [recentPOs, setRecentPOs] = useState<any[]>([]);
  const [recentReqs, setRecentReqs] = useState<any[]>([]);
  const [poStatusData, setPoStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { username, roles } = useAuth();
  const navigate = useNavigate();
  const isManagerOrAdmin = roles.includes('ROLE_PROCUREMENT_MANAGER') || roles.includes('ROLE_ADMIN');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isManagerOrAdmin) {
          // Managers/Admins see everything
          const [vendors, reqs, pos, approvals] = await Promise.allSettled([
            API.get('/vendor/all'),
            API.get('/procurement/requisition/all'),
            API.get('/procurement/purchase-order/all'),
            API.get('/procurement/approval/all'),
          ]);
          const vData = vendors.status === 'fulfilled' ? vendors.value.data : [];
          const rData = reqs.status === 'fulfilled' ? reqs.value.data : [];
          const pData = pos.status === 'fulfilled' ? pos.value.data : [];
          const aData = approvals.status === 'fulfilled' ? approvals.value.data : [];
          setStats({ vendors: vData?.length || 0, requisitions: rData?.length || 0, pos: pData?.length || 0, approvals: aData?.length || 0 });
          const poList = pData || [];
          setRecentPOs(poList.slice(-5).reverse());
          const reqList = rData || [];
          setRecentReqs(reqList.slice(-5).reverse());
          const statusCounts = poList.reduce((acc: any, po: any) => { acc[po.status] = (acc[po.status] || 0) + 1; return acc; }, {});
          setPoStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));
        } else {
          // Employees: only their own requisitions
          const reqs = await API.get('/procurement/requisition/my').catch(() => ({ data: [] }));
          const reqList = reqs.data || [];
          setStats({ vendors: 0, requisitions: reqList.length, pos: 0, approvals: 0 });
          setRecentReqs(reqList.slice(-5).reverse());
        }
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, [isManagerOrAdmin]);

  const statCards = isManagerOrAdmin ? [
    { title: 'Total Vendors', value: stats.vendors, icon: Building2, gradient: 'linear-gradient(135deg, hsl(252,87%,55%) 0%, hsl(265,80%,48%) 100%)', glow: 'hsla(252,87%,60%,0.3)', delay: 0.1 },
    { title: 'Requisitions', value: stats.requisitions, icon: FileText, gradient: 'linear-gradient(135deg, hsl(38,92%,48%) 0%, hsl(25,85%,42%) 100%)', glow: 'hsla(38,92%,50%,0.25)', delay: 0.15 },
    { title: 'Purchase Orders', value: stats.pos, icon: ShoppingCart, gradient: 'linear-gradient(135deg, hsl(160,84%,36%) 0%, hsl(173,80%,30%) 100%)', glow: 'hsla(160,84%,39%,0.25)', delay: 0.2 },
    { title: 'Approvals', value: stats.approvals, icon: CheckCircle, gradient: 'linear-gradient(135deg, hsl(339,85%,52%) 0%, hsl(355,80%,46%) 100%)', glow: 'hsla(339,85%,52%,0.25)', delay: 0.25 },
  ] : [
    { title: 'My Requisitions', value: stats.requisitions, icon: FileText, gradient: 'linear-gradient(135deg, hsl(38,92%,48%) 0%, hsl(25,85%,42%) 100%)', glow: 'hsla(38,92%,50%,0.25)', delay: 0.15 },
  ];

  return (
    <AnimatedPage>
      {/* Greeting */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold"
          style={{ background: 'linear-gradient(135deg, #fff 30%, hsl(252,87%,78%) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {username} 👋
        </motion.h1>
        <p className="page-subtitle">Here's what's happening in your procurement operations</p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(card => <StatCard key={card.title} {...card} />)}
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* PO Status Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: 'hsl(214,32%,88%)' }}>PO Status Distribution</h2>
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'hsla(252,87%,67%,0.12)', color: 'hsl(252,87%,75%)', border: '1px solid hsla(252,87%,67%,0.2)' }}>Live</span>
          </div>
          {poStatusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={poStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                    {poStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'hsl(217,33%,11%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: 'hsl(214,32%,91%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                    cursor={false}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-center mt-2 flex-wrap">
                {poStatusData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs" style={{ color: 'hsl(215,20%,55%)' }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[220px] flex flex-col items-center justify-center" style={{ color: 'hsl(215,20%,45%)' }}>
              <ShoppingCart className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No orders yet</p>
            </div>
          )}
        </motion.div>

        {/* Recent POs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold" style={{ color: 'hsl(214,32%,88%)' }}>Recent Purchase Orders</h2>
            <button onClick={() => navigate('/purchase-orders')} className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70" style={{ color: 'hsl(252,87%,72%)' }}>
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          {recentPOs.length > 0 ? (
            <div className="space-y-2.5">
              {recentPOs.map((po, i) => (
                <motion.div
                  key={po.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                  onClick={() => navigate(`/purchase-orders/${po.id}`)}
                  className="flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all duration-200"
                  style={{ background: 'hsla(218,27%,14%,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}
                  whileHover={{ scale: 1.01, background: 'hsla(252,87%,67%,0.06)' } as any}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'hsl(214,32%,90%)' }}>{po.poNumber}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'hsl(215,20%,50%)' }}>{po.vendor?.name || 'No vendor'}</p>
                  </div>
                  <StatusBadge status={po.status} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center" style={{ color: 'hsl(215,20%,45%)' }}>
              <ShoppingCart className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No purchase orders yet</p>
              <button onClick={() => navigate('/purchase-orders/new')} className="mt-3 text-xs btn-primary px-3 py-1.5">Create First PO</button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Requisitions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold" style={{ color: 'hsl(214,32%,88%)' }}>Recent Requisitions</h2>
          <button onClick={() => navigate('/requisitions')} className="flex items-center gap-1 text-xs transition-opacity hover:opacity-70" style={{ color: 'hsl(252,87%,72%)' }}>
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        {recentReqs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentReqs.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.06 }}
                onClick={() => navigate(`/requisitions/${req.id}`)}
                className="p-4 rounded-xl cursor-pointer transition-all duration-200"
                style={{ background: 'hsla(218,27%,14%,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}
                whileHover={{ scale: 1.02 } as any}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold" style={{ color: 'hsl(214,32%,85%)' }}>{req.requisitionNumber}</span>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-xs" style={{ color: 'hsl(215,20%,50%)' }}>{req.items?.length || 0} items</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center" style={{ color: 'hsl(215,20%,45%)' }}>
            <FileText className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No requisitions yet</p>
            <button onClick={() => navigate('/requisitions/new')} className="mt-3 text-xs btn-primary px-3 py-1.5">Create First Requisition</button>
          </div>
        )}
      </motion.div>
    </AnimatedPage>
  );
};

export default Dashboard;
