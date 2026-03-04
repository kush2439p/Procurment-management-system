import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/components/AnimatedPage';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Item { itemName: string; quantity: string; unitPrice: string; }

const PurchaseOrderForm = () => {
  const navigate = useNavigate();
  const { roles } = useAuth();
  const isManagerOrAdmin = roles.includes('ROLE_PROCUREMENT_MANAGER') || roles.includes('ROLE_ADMIN');
  const [poNumber, setPoNumber] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [vendors, setVendors] = useState<any[]>([]);
  const [items, setItems] = useState<Item[]>([{ itemName: '', quantity: '1', unitPrice: '' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isManagerOrAdmin) {
      API.get('/vendor/all').then(({ data }) => setVendors(data || [])).catch(() => { });
    }
  }, [isManagerOrAdmin]);

  const addItem = () => setItems([...items, { itemName: '', quantity: '1', unitPrice: '' }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof Item, value: string) => {
    const updated = [...items]; updated[i] = { ...updated[i], [field]: value }; setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) { toast.error('Please select a vendor'); return; }
    for (const item of items) {
      if (!item.itemName.trim()) { toast.error('Item name is required'); return; }
      if (!item.quantity || parseInt(item.quantity) < 1) { toast.error('Quantity must be at least 1'); return; }
      if (!item.unitPrice || parseFloat(item.unitPrice) <= 0) { toast.error('Unit price must be greater than 0'); return; }
    }
    setLoading(true);
    try {
      await API.post('/procurement/purchase-order/create', {
        poNumber: poNumber.trim() || `PO-${Date.now()}`,
        status: 'PENDING',
        vendor: { id: +vendorId },
        items: items.map(it => ({
          itemName: it.itemName,
          quantity: parseInt(it.quantity) || 1,
          unitPrice: parseFloat(it.unitPrice) || 0,
        })),
      });
      toast.success('Purchase order created!');
      navigate('/purchase-orders');
    } catch (err: any) {
      toast.error(err.response?.data || 'Failed to create purchase order');
    } finally { setLoading(false); }
  };

  // Block employees from creating POs — they should create Requisitions instead
  if (!isManagerOrAdmin) return (
    <AnimatedPage>
      <div className="glass-card p-14 text-center max-w-lg mx-auto mt-12">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'hsla(0,84%,60%,0.1)' }}>
          <Lock className="w-8 h-8" style={{ color: 'hsl(0,84%,65%)' }} />
        </div>
        <p className="font-semibold text-lg mb-2" style={{ color: 'hsl(214,32%,88%)' }}>Access Restricted</p>
        <p className="text-sm mb-6" style={{ color: 'hsl(215,20%,50%)' }}>
          <strong>Purchase Orders</strong> are created by <strong>Procurement Managers</strong> only.<br /><br />
          As an employee, you submit <strong>Requisitions</strong>. Your manager reviews
          them and issues the Purchase Order to the chosen vendor.
        </p>
        <button onClick={() => navigate('/requisitions/new')} className="btn-primary px-6 py-2.5 text-sm">
          Create a Requisition instead →
        </button>
      </div>
    </AnimatedPage>
  );

  return (
    <AnimatedPage>
      <button onClick={() => navigate('/purchase-orders')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="page-title mb-6">New Purchase Order</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="glass-card p-6 space-y-4">
          <div>
            <label className="form-label">PO Number <span className="text-muted-foreground text-xs">(leave blank to auto-generate)</span></label>
            <input value={poNumber} onChange={e => setPoNumber(e.target.value)} className="form-input" placeholder="PO-2024-1001" />
          </div>
          <div>
            <label className="form-label">Vendor *</label>
            <select value={vendorId} onChange={e => setVendorId(e.target.value)} className="form-input" required>
              <option value="">Select vendor</option>
              {vendors.filter(v => v.status === 'APPROVED' || v.status === 'ACTIVE').map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            {vendors.length === 0 && (
              <p className="text-xs mt-1" style={{ color: 'hsl(38,92%,60%)' }}>
                ⚠ No approved vendors yet. Go to Vendors → Add Vendor first.
              </p>
            )}
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
                  <div><label className="form-label">Name *</label><input value={item.itemName} onChange={e => updateItem(i, 'itemName', e.target.value)} className="form-input" required placeholder="e.g. Monitor" /></div>
                  <div>
                    <label className="form-label">Qty *</label>
                    <input inputMode="numeric" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value.replace(/[^0-9]/g, ''))} className="form-input" required placeholder="e.g. 5" />
                  </div>
                  <div>
                    <label className="form-label">Unit Price ₹ *</label>
                    <input inputMode="decimal" value={item.unitPrice} onChange={e => updateItem(i, 'unitPrice', e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))} className="form-input" required placeholder="e.g. 1200.00" />
                  </div>
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
