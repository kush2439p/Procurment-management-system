import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/components/AnimatedPage';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { ArrowLeft, FileText, Download, Truck, CheckCircle, Clock, Box, Package } from 'lucide-react';

const PurchaseOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isProcMgr } = useAuth();
  const canViewOnly = isAdmin() || isProcMgr();
  const [po, setPo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    API.get(`/procurement/purchase-order/${id}`)
      .then(({ data }) => setPo(data))
      .catch(() => toast.error('Not found'))
      .finally(() => setLoading(false));
    API.get(`/procurement/purchase-order/${id}/documents`)
      .then(({ data }) => setDocs(data || []))
      .catch(() => { }); // Documents may not exist yet
  }, [id]);


  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;
  if (!po) return <div className="text-center text-muted-foreground p-12">Purchase order not found</div>;

  const total = po.items?.reduce((s: number, i: any) => s + i.quantity * i.unitPrice, 0) || 0;

  const statusTimeline = [
    { label: 'Created', done: true, icon: Clock },
    { label: 'Approved', done: ['APPROVED', 'SHIPPED', 'DELIVERED', 'RECEIVED'].includes(po.status), icon: CheckCircle },
    { label: 'Shipped', done: ['SHIPPED', 'DELIVERED', 'RECEIVED'].includes(po.status), icon: Truck },
    { label: 'Delivered', done: ['DELIVERED', 'RECEIVED'].includes(po.status), icon: CheckCircle },
    { label: 'Received', done: po.status === 'RECEIVED', icon: Package },
  ];

  return (
    <AnimatedPage>
      <button onClick={() => navigate('/purchase-orders')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Purchase Orders
      </button>

      <div className="max-w-2xl space-y-5">
        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="page-title">{po.poNumber}</h1>
            <StatusBadge status={po.status} />
          </div>
          <p className="text-sm text-muted-foreground">Vendor: <span className="text-foreground font-medium">{po.vendor?.name || 'N/A'}</span></p>
          <p className="text-sm text-muted-foreground mt-1">Total: <span className="text-foreground font-semibold">₹{total.toLocaleString('en-IN')}</span></p>
          {po.createdAt && <p className="text-xs text-muted-foreground mt-1">Created: {new Date(po.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>}
        </div>

        {/* Status Timeline */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Order Progress</h2>
          <div className="flex items-center gap-0">
            {statusTimeline.map((step, i) => (
              <div key={step.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                    style={{ background: step.done ? 'hsl(160,84%,36%)' : 'hsla(218,27%,14%,0.8)', border: step.done ? '2px solid hsl(160,84%,45%)' : '2px solid rgba(255,255,255,0.1)' }}>
                    <step.icon className="w-4 h-4" style={{ color: step.done ? 'white' : 'hsl(215,20%,40%)' }} />
                  </div>
                  <span className="text-xs mt-1.5" style={{ color: step.done ? 'hsl(160,84%,55%)' : 'hsl(215,20%,40%)' }}>{step.label}</span>
                </div>
                {i < statusTimeline.length - 1 && (
                  <div className="flex-1 h-0.5 mx-1 mb-4 rounded" style={{ background: step.done ? 'hsl(160,84%,36%)' : 'rgba(255,255,255,0.07)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">Items</h2>
          <table className="data-table w-full">
            <thead><tr><th>Item</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead>
            <tbody>
              {po.items?.map((item: any, i: number) => (
                <tr key={i}>
                  <td className="font-medium text-foreground">{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.unitPrice?.toLocaleString('en-IN')}</td>
                  <td className="font-medium text-foreground">₹{(item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-sm text-muted-foreground mr-2">Total Amount:</span>
            <span className="font-bold text-lg" style={{ color: 'hsl(160,84%,55%)' }}>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Vendor Documents */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Vendor Documents
            <span className="ml-2 text-xs font-normal" style={{ color: 'hsl(215,20%,50%)' }}>(invoices, delivery notes uploaded by vendor)</span>
          </h2>
          {docs.length === 0 ? (
            <p className="text-sm italic" style={{ color: 'hsl(215,20%,40%)' }}>No documents uploaded yet. The vendor will attach invoices and delivery receipts here.</p>
          ) : (
            <div className="space-y-2">
              {docs.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm"
                  style={{ background: 'hsla(218,27%,14%,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 shrink-0" style={{ color: 'hsl(252,87%,72%)' }} />
                    <span style={{ color: 'hsl(214,32%,80%)' }}>{doc.fileName}</span>
                  </div>
                  <a href={`/api/vendor-portal/documents/${doc.id}/download`} download={doc.fileName}
                    className="p-1.5 rounded-lg transition-colors hover:opacity-70" style={{ color: 'hsl(215,20%,55%)' }}>
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vendor Approval Info */}
        {po.status === 'PENDING' && (canViewOnly) && (
          <div className="glass-card p-5" style={{ border: '1px solid hsla(252,87%,67%,0.2)', background: 'hsla(252,87%,67%,0.04)' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'hsl(252,87%,75%)' }}>Awaiting Vendor Decision</p>
                <p className="text-xs leading-relaxed" style={{ color: 'hsl(215,20%,55%)' }}>
                  This PO is <strong style={{ color: 'hsl(38,92%,60%)' }}>PENDING</strong> vendor review.
                  Since the vendor is the supplier, they decide whether they can fulfill this order based on their stock.
                  The vendor will <strong>Accept</strong> or <strong>Reject</strong> it from their Vendor Portal.
                  Once accepted, the vendor will mark it as Shipped and then Delivered.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Goods Receipt (Employee/Manager action after Vendor Delivery) */}
        {po.status === 'DELIVERED' && canViewOnly && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5" style={{ border: '1px solid hsla(210,100%,45%,0.25)', background: 'hsla(210,100%,45%,0.05)' }}>
            <div className="flex items-start gap-3 mb-4">
              <Box className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'hsl(210,100%,65%)' }} />
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: 'hsl(210,100%,75%)' }}>Acknowledge Goods Receipt</p>
                <p className="text-xs" style={{ color: 'hsl(215,20%,50%)' }}>
                  The vendor has marked this order as <strong style={{ color: 'hsl(160,84%,55%)' }}>DELIVERED</strong>.
                  Please open the physical shipment to verify the quantities and condition of the items.
                  Once verified, mark the order as Received to complete the workflow.
                </p>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={async () => {
                try {
                  await API.patch(`/procurement/purchase-order/update-status/${id}?status=RECEIVED`);
                  toast.success('Goods receipt confirmed. PO marked as RECEIVED.');
                  setPo({ ...po, status: 'RECEIVED', updatedAt: new Date().toISOString() });
                } catch { toast.error('Failed to confirm receipt'); }
              }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, hsl(210,100%,45%), hsl(210,80%,38%))' }}>
              <CheckCircle className="w-4 h-4" /> Confirm Goods Received
            </motion.button>
          </motion.div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default PurchaseOrderDetail;
