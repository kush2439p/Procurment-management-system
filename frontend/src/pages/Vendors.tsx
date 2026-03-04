import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/AnimatedPage';
import { StatusBadge } from '@/components/StatusBadge';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { Trash2, Building2, Mail, Phone, MapPin } from 'lucide-react';

const Vendors = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { isAdmin } = useAuth();

  const fetchVendors = async () => {
    try {
      const { data } = await API.get('/vendor/all');
      setVendors(data || []);
    } catch {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVendors(); }, []);

  const deleteVendor = async (id: number) => {
    if (!isAdmin()) return;
    if (!confirm('Delete this vendor? This cannot be undone.')) return;
    try {
      await API.delete(`/vendor/delete/${id}`);
      toast.success('Vendor deleted');
      fetchVendors();
    } catch {
      toast.error('Failed to delete vendor');
    }
  };

  const filtered = vendors.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="page-title">Vendors</h1>
          <p className="page-subtitle">View registered vendor relationships</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-input max-w-sm"
          placeholder="🔍  Search vendors..."
        />
      </div>

      {loading ? <TableSkeleton cols={4} /> : filtered.length === 0 ? (
        <div className="glass-card p-14 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'hsla(252,87%,67%,0.1)' }}>
            <Building2 className="w-8 h-8" style={{ color: 'hsl(252,87%,70%)' }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: 'hsl(214,32%,80%)' }}>{search ? 'No vendors match your search' : 'No vendors yet'}</p>
          <p className="text-sm" style={{ color: 'hsl(215,20%,45%)' }}>
            {search ? 'Try a different name or email' : 'Vendors register themselves via the Vendor Portal'}
          </p>
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(v => (
            <motion.div
              key={v.id}
              variants={staggerItem}
              whileHover={{ y: -3 }}
              className="glass-card p-5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm" style={{ background: 'linear-gradient(135deg, hsl(252,87%,67%), hsl(265,85%,58%))', color: 'white' }}>
                    {v.name?.charAt(0)?.toUpperCase() || 'V'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'hsl(214,32%,90%)' }}>{v.name}</p>
                    <StatusBadge status={v.status || 'ACTIVE'} />
                  </div>
                </div>
                {isAdmin() && (
                  <div className="flex gap-1.5">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteVendor(v.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: 'hsla(0,84%,60%,0.1)' }}
                      title="Delete vendor"
                    >
                      <Trash2 className="w-3.5 h-3.5" style={{ color: 'hsl(0,84%,65%)' }} />
                    </motion.button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {v.email && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'hsl(215,20%,55%)' }}>
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{v.email}</span>
                  </div>
                )}
                {v.contactNumber && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'hsl(215,20%,55%)' }}>
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{v.contactNumber}</span>
                  </div>
                )}
                {v.address && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'hsl(215,20%,55%)' }}>
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{v.address}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatedPage>
  );
};

export default Vendors;
