import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatedPage } from '@/components/AnimatedPage';
import API from '@/api/axiosInstance';
import { toast } from 'sonner';
import { Download, FileText, BarChart3, Calendar, Building2, SlidersHorizontal, Hash } from 'lucide-react';

const Reports = () => {
  const [vendorId, setVendorId] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFormat, setActiveFormat] = useState<'pdf' | 'excel' | null>(null);

  useEffect(() => {
    API.get('/vendor/all').then(({ data }) => setVendors(data || [])).catch(() => { });
  }, []);

  const download = async (format: 'pdf' | 'excel') => {
    setLoading(true);
    setActiveFormat(format);
    try {
      const body: any = {};
      if (vendorId) body.vendorId = +vendorId;
      if (poNumber.trim()) body.poNumber = poNumber.trim();
      if (startDate) body.startDate = startDate;
      if (endDate) body.endDate = endDate;

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

  return (
    <AnimatedPage>
      <div className="mb-6">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Generate and download vendor activity reports from live database</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Info banner */}
        <motion.div
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4 flex items-start gap-3"
          style={{ background: 'hsla(252,87%,67%,0.08)', border: '1px solid hsla(252,87%,67%,0.2)' }}
        >
          <SlidersHorizontal className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'hsl(252,87%,70%)' }} />
          <p className="text-sm" style={{ color: 'hsl(215,20%,60%)' }}>
            All filters are <strong>optional</strong>. Leave them empty to download a complete report of all vendors and purchase orders from the database.
          </p>
        </motion.div>

        {/* Filter Form */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'hsla(252,87%,67%,0.12)' }}>
              <BarChart3 className="w-4 h-4" style={{ color: 'hsl(252,87%,70%)' }} />
            </div>
            <h2 className="text-sm font-semibold" style={{ color: 'hsl(214,32%,88%)' }}>Report Filters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Vendor Dropdown */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" style={{ color: 'hsl(215,20%,50%)' }} /> Filter by Vendor
              </label>
              <select value={vendorId} onChange={e => setVendorId(e.target.value)} className="form-input">
                <option value="">All Vendors</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.name} (ID: {v.id})</option>
                ))}
              </select>
            </div>

            {/* PO Number Text Input */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" style={{ color: 'hsl(215,20%,50%)' }} /> Filter by PO Number
              </label>
              <input
                type="text"
                value={poNumber}
                onChange={e => setPoNumber(e.target.value)}
                className="form-input"
                placeholder="e.g. po-101 or pq-22"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" style={{ color: 'hsl(215,20%,50%)' }} /> Start Date
              </label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="form-input" />
            </div>

            {/* End Date */}
            <div>
              <label className="form-label flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" style={{ color: 'hsl(215,20%,50%)' }} /> End Date
              </label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="form-input" />
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
              onClick={() => download('pdf')} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, hsl(252,87%,67%), hsl(265,85%,58%))', color: 'white', boxShadow: '0 4px 15px hsla(252,87%,67%,0.35)' }}
            >
              {activeFormat === 'pdf'
                ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full" />
                : <FileText className="w-4 h-4" />
              }
              Download PDF
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
              onClick={() => download('excel')} disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, hsl(160,84%,39%), hsl(173,80%,33%))', color: 'white', boxShadow: '0 4px 15px hsla(160,84%,39%,0.3)' }}
            >
              {activeFormat === 'excel'
                ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full" />
                : <Download className="w-4 h-4" />
              }
              Download Excel
            </motion.button>
          </div>
        </div>

        {/* What's included */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'hsl(214,32%,80%)' }}>What's included in the report</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              'All vendors with name, email, contact, status',
              'All purchase orders with PO number & vendor',
              'PO amounts and item-level breakdown',
              'Created and last-updated timestamps',
              'Status per vendor and per PO',
              'Date range and vendor filters applied',
            ].map(item => (
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
