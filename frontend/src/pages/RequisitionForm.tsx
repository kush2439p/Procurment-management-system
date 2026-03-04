import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/components/AnimatedPage';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X } from 'lucide-react';

// ✅ Store as strings during editing so user can clear and retype freely
interface Item { itemName: string; description: string; quantity: string; unitPrice: string; }

const RequisitionForm = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [reqNumber, setReqNumber] = useState('');
  const [items, setItems] = useState<Item[]>([{ itemName: '', description: '', quantity: '1', unitPrice: '' }]);
  const [loading, setLoading] = useState(false);

  const addItem = () => setItems([...items, { itemName: '', description: '', quantity: '1', unitPrice: '' }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof Item, value: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate before sending
    for (const item of items) {
      if (!item.itemName.trim()) { toast.error('Item name is required'); return; }
      if (!item.quantity || parseInt(item.quantity) < 1) { toast.error('Quantity must be at least 1'); return; }
      if (!item.unitPrice || parseFloat(item.unitPrice) <= 0) { toast.error('Unit price must be greater than 0'); return; }
    }
    setLoading(true);
    try {
      // ✅ Convert strings → numbers only at submit time
      const payload = {
        requisitionNumber: reqNumber.trim() || `REQ-${Date.now()}`,
        status: 'PENDING',
        requestedBy: { id: userId },
        items: items.map(item => ({
          itemName: item.itemName,
          description: item.description,
          quantity: parseInt(item.quantity) || 1,
          unitPrice: parseFloat(item.unitPrice) || 0,
        })),
      };
      await API.post('/procurement/requisition/create', payload);
      toast.success('Requisition created successfully!');
      navigate('/requisitions');
    } catch (err: any) {
      const msg = err.response?.data || 'Failed to create requisition';
      toast.error(typeof msg === 'string' ? msg : 'Failed to create');
    } finally { setLoading(false); }
  };

  return (
    <AnimatedPage>
      <button onClick={() => navigate('/requisitions')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="page-title mb-6">New Requisition</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="glass-card p-6">
          <label className="form-label">Requisition Number <span className="text-muted-foreground text-xs">(leave blank to auto-generate)</span></label>
          <input value={reqNumber} onChange={e => setReqNumber(e.target.value)} className="form-input" placeholder="REQ-2024-001" />
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Items</h2>
            <button type="button" onClick={addItem} className="btn-outline text-xs flex items-center gap-1"><Plus className="w-3 h-3" /> Add Item</button>
          </div>
          <div className="space-y-4">
            {items.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg bg-accent/30 border border-border/30 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Item {i + 1}</span>
                  {items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="text-destructive hover:text-destructive/80"><X className="w-4 h-4" /></button>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Name *</label>
                    <input value={item.itemName} onChange={e => updateItem(i, 'itemName', e.target.value)} className="form-input" required placeholder="e.g. Laptop" />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <input value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} className="form-input" placeholder="Optional details" />
                  </div>
                  <div>
                    <label className="form-label">Quantity *</label>
                    <input
                      inputMode="numeric"
                      value={item.quantity}
                      onChange={e => {
                        // Allow only digits — store as raw string so user can clear and retype
                        const v = e.target.value.replace(/[^0-9]/g, '');
                        updateItem(i, 'quantity', v);
                      }}
                      className="form-input"
                      placeholder="e.g. 10"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Unit Price * <span className="text-muted-foreground text-xs">(₹ per item)</span></label>
                    <input
                      inputMode="decimal"
                      value={item.unitPrice}
                      onChange={e => {
                        // Allow digits and one decimal point
                        const v = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                        updateItem(i, 'unitPrice', v);
                      }}
                      className="form-input"
                      placeholder="e.g. 45000.00"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Requisition'}
        </motion.button>
      </form>
    </AnimatedPage>
  );
};

export default RequisitionForm;
