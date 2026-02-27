import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/components/AnimatedPage';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const VendorForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', contactNumber: '', address: '', status: 'ACTIVE' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      API.get(`/vendor/${id}`).then(({ data }) => setForm({
        name: data.name || '', email: data.email || '', contactNumber: data.contactNumber || '',
        address: data.address || '', status: data.status || 'ACTIVE',
      })).catch(() => toast.error('Failed to load vendor'));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/vendor/update/${id}`, form);
        toast.success('Vendor updated');
      } else {
        await API.post('/vendor/create', form);
        toast.success('Vendor created');
      }
      navigate('/vendors');
    } catch {
      toast.error('Failed to save vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <button onClick={() => navigate('/vendors')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Vendors
      </button>
      <div className="max-w-lg">
        <h1 className="page-title mb-6">{isEdit ? 'Edit Vendor' : 'New Vendor'}</h1>
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          {(['name', 'email', 'contactNumber', 'address'] as const).map(field => (
            <div key={field}>
              <label className="form-label">{field === 'contactNumber' ? 'Contact Number' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                className="form-input"
                required={field !== 'address'}
              />
            </div>
          ))}
          {isEdit && (
            <div>
              <label className="form-label">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="form-input">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          )}
          <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
            {loading ? 'Saving...' : isEdit ? 'Update Vendor' : 'Create Vendor'}
          </motion.button>
        </form>
      </div>
    </AnimatedPage>
  );
};

export default VendorForm;
