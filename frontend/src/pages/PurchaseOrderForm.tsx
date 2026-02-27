import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/components/AnimatedPage';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X } from 'lucide-react';

interface Item { itemName: string; quantity: number; unitPrice: number; }

const PurchaseOrderForm = () => {
  const navigate = useNavigate();
  const [poNumber, setPoNumber] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [vendors, setVendors] = useState<any[]>([]);
  const [items, setItems] = useState<Item[]>([{ itemName: '', quantity: 1, unitPrice: 0 }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/vendor/all').then(({ data }) => setVendors(data || [])).catch(() => {});
  }, []);

  const addItem = () => setItems([...items, { itemName: '', quantity: 1, unitPrice: 0 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof Item, value: any) => {
    const updated = [...items]; (updated[i] as any)[field] = value; setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/procurement/purchase-order/create', {
        poNumber, status: 'PENDING', vendor: { id: +vendorId }, items,
      });
      toast.success('Purchase order created');
      navigate('/purchase-orders');
    } catch { toast.error('Failed to create'); }
    finally { setLoading(false); }
  };

  return (
    <AnimatedPage>
      <button onClick={() => navigate('/purchase-orders')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="page-title mb-6">New Purchase Order</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="glass-card p-6 space-y-4">
          <div><label className="form-label">PO Number</label><input value={poNumber} onChange={e => setPoNumber(e.target.value)} className="form-input" placeholder="PO-2024-1001" required /></div>
          <div>
            <label className="form-label">Vendor</label>
            <select value={vendorId} onChange={e => setVendorId(e.target.value)} className="form-input" required>
              <option value="">Select vendor</option>
              {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Items</h2>
            <button type="button" onClick={addItem} className="btn-outline text-xs flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
          </div>
          <div className="space-y-4">
            {items.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg bg-accent/30 border border-border/30 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-muted-foreground">Item {i + 1}</span>
                  {items.length > 1 && <button type="button" onClick={() => removeItem(i)} className="text-destructive"><X className="w-4 h-4" /></button>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div><label className="form-label">Name</label><input value={item.itemName} onChange={e => updateItem(i, 'itemName', e.target.value)} className="form-input" required /></div>
                  <div><label className="form-label">Qty</label><input type="number" min={1} value={item.quantity} onChange={e => updateItem(i, 'quantity', +e.target.value)} className="form-input" required /></div>
                  <div><label className="form-label">Unit Price</label><input type="number" min={0} step={0.01} value={item.unitPrice} onChange={e => updateItem(i, 'unitPrice', +e.target.value)} className="form-input" required /></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Purchase Order'}
        </motion.button>
      </form>
    </AnimatedPage>
  );
};

export default PurchaseOrderForm;
