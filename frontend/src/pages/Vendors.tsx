import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage, staggerContainer, staggerItem } from '@/components/AnimatedPage';
import { StatusBadge } from '@/components/StatusBadge';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';

const Vendors = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin, isProcMgr } = useAuth();
  const canManage = isAdmin() || isProcMgr();
  const navigate = useNavigate();

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
    if (!confirm('Delete this vendor?')) return;
    try {
      await API.delete(`/vendor/delete/${id}`);
      toast.success('Vendor deleted');
      fetchVendors();
    } catch {
      toast.error('Failed to delete vendor');
    }
  };

  return (
    <AnimatedPage>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Vendors</h1>
          <p className="page-subtitle">Manage your vendor relationships</p>
        </div>
        {canManage && (
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/vendors/new')} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Vendor
          </motion.button>
        )}
      </div>

      {loading ? <TableSkeleton cols={5} /> : vendors.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No vendors found</p>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <motion.table variants={staggerContainer} initial="initial" animate="animate" className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Contact</th><th>Status</th>{canManage && <th>Actions</th>}</tr>
            </thead>
            <tbody>
              {vendors.map(v => (
                <motion.tr key={v.id} variants={staggerItem}>
                  <td className="font-medium text-foreground">{v.name}</td>
                  <td>{v.email}</td>
                  <td>{v.contactNumber}</td>
                  <td><StatusBadge status={v.status || 'ACTIVE'} /></td>
                  {canManage && (
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/vendors/${v.id}/edit`)} className="p-1.5 rounded-lg hover:bg-accent transition-colors"><Pencil className="w-4 h-4 text-primary" /></button>
                        <button onClick={() => deleteVendor(v.id)} className="p-1.5 rounded-lg hover:bg-accent transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      )}
    </AnimatedPage>
  );
};

export default Vendors;
