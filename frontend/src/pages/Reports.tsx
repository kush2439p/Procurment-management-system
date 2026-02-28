import { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/components/AnimatedPage';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { Download, FileText, BarChart3, Calendar, Hash, Building2, SlidersHorizontal } from 'lucide-react';

const Reports = () => {
  const [form, setForm] = useState({ vendorId: '', poId: '', startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const [activeFormat, setActiveFormat] = useState<'pdf' | 'excel' | null>(null);

  const download = async (format: 'pdf' | 'excel') => {
    setLoading(true);
    setActiveFormat(format);
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
      a.download = `procurement_report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`✅ ${format.toUpperCase()} report downloaded`);
    } catch {
      toast.error('Failed to generate report. Check if backend is connected.');
    } finally {
      setLoading(false);
      setActiveFormat(null);
    }
  };

  const fields = [
    { key: 'vendorId', label: 'Vendor ID', placeholder: 'e.g. 1 (optional)', type: 'number', icon: Building2 },
    { key: 'poId', label: 'Purchase Order ID', placeholder: 'e.g. 5 (optional)', type: 'number', icon: Hash },
    { key: 'startDate', label: 'Start Date', placeholder: '', type: 'date', icon: Calendar },
    { key: 'endDate', label: 'End Date', placeholder: '', type: 'date', icon: Calendar },
  ] as const;

  return (
    <AnimatedPage>
      <div className="mb-6">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Generate and download vendor activity reports</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: 'hsla(252,87%,67%,0.08)', border: '1px solid hsla(252,87%,67%,0.2)' }}
        >
          <SlidersHorizontal className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'hsl(252,87%,70%)' }} />
          <p className="text-sm" style={{ color: 'hsl(215,20%,60%)' }}>
            All filters are optional. Leave them empty to generate a complete vendor report. Reports are generated as PDF or Excel.
          </p>
        </motion.div>

        {/* Form Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsla(252,87%,67%,0.12)' }}>
              <BarChart3 className="w-4 h-4" style={{ color: 'hsl(252,87%,70%)' }} />
            </div>
            <h2 className="text-sm font-semibold" style={{ color: 'hsl(214,32%,88%)' }}>Report Filters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {fields.map(({ key, label, placeholder, type, icon: Icon }) => (
              <div key={key}>
                <label className="form-label">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(215,20%,40%)' }} />
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="form-input pl-10"
                    placeholder={placeholder}
                    min={type === 'number' ? 1 : undefined}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Download buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => download('pdf')}
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, hsl(252,87%,67%), hsl(265,85%,58%))',
                color: 'white',
                boxShadow: '0 4px 15px hsla(252,87%,67%,0.35)',
              }}
            >
              {activeFormat === 'pdf'
                ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full" />
                : <FileText className="w-4 h-4" />
              }
              Download PDF
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => download('excel')}
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, hsl(160,84%,39%), hsl(173,80%,33%))',
                color: 'white',
                boxShadow: '0 4px 15px hsla(160,84%,39%,0.3)',
              }}
            >
              {activeFormat === 'excel'
                ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full" />
                : <Download className="w-4 h-4" />
              }
              Download Excel
            </motion.button>
          </div>
        </div>

        {/* What's in the report */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'hsl(214,32%,80%)' }}>What's included in the report</h3>
          <div className="space-y-2">
            {['Vendor list with status and contact details', 'Purchase order history per vendor', 'Totals and item-level breakdown', 'Approval audit trail'].map(item => (
              <div key={item} className="flex items-center gap-2.5 text-sm" style={{ color: 'hsl(215,20%,55%)' }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'hsl(252,87%,67%)' }} />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

export default Reports;
