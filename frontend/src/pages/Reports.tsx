import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/components/AnimatedPage';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { Download, FileText } from 'lucide-react';

const Reports = () => {
  const [form, setForm] = useState({ vendorId: '', poId: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);

  const download = async (format: 'pdf' | 'excel') => {
    setLoading(true);
    try {
      const body: any = {};
      if (form.vendorId) body.vendorId = +form.vendorId;
      if (form.poId) body.poId = +form.poId;
      if (form.startDate) body.startDate = form.startDate;
      if (form.endDate) body.endDate = form.endDate;

      const { data } = await API.post(`/reports/vendor?format=${format}`, body, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} downloaded`);
    } catch {
      toast.error('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="mb-6">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Generate and download vendor reports</p>
      </div>

      <div className="max-w-lg glass-card p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="form-label">Vendor ID</label><input type="number" value={form.vendorId} onChange={e => setForm({ ...form, vendorId: e.target.value })} className="form-input" placeholder="Optional" /></div>
          <div><label className="form-label">PO ID</label><input type="number" value={form.poId} onChange={e => setForm({ ...form, poId: e.target.value })} className="form-input" placeholder="Optional" /></div>
          <div><label className="form-label">Start Date</label><input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="form-input" /></div>
          <div><label className="form-label">End Date</label><input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="form-input" /></div>
        </div>

        <div className="flex gap-3 pt-2">
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => download('pdf')} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
            <FileText className="w-4 h-4" /> PDF
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => download('excel')} disabled={loading} className="btn-success flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
            <Download className="w-4 h-4" /> Excel
          </motion.button>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Reports;
