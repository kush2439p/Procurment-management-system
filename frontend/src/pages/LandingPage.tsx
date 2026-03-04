import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  ShoppingCart, Shield, BarChart3, Zap, CheckCircle, ArrowRight, Building2,
  FileText, Users, Star, Lock, TrendingUp, Globe, Clock, Eye,
  ChevronRight, Play, Layers, Target
} from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

const FloatingOrb = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { demoLogin } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDemo = () => {
    demoLogin();
    toast.success('Welcome! Exploring as Demo Admin');
    navigate('/dashboard');
  };

  const features = [
    { icon: Building2, title: 'Vendor Management', desc: 'Complete vendor lifecycle — register, track, activate/deactivate vendors with full contact and performance data.', color: 'from-primary/20 to-primary/5 border-primary/20' },
    { icon: FileText, title: 'Purchase Requisitions', desc: 'Submit multi-item requisitions with auto-numbering, quantity tracking, and real-time status updates.', color: 'from-success/20 to-success/5 border-success/20' },
    { icon: ShoppingCart, title: 'Purchase Orders', desc: 'Convert approved requisitions to POs, assign vendors, track line items, and manage order lifecycle.', color: 'from-warning/20 to-warning/5 border-warning/20' },
    { icon: Shield, title: 'Approval Workflows', desc: 'Multi-level approval chains with role-based access, rejection reasons, and complete audit history.', color: 'from-destructive/20 to-destructive/5 border-destructive/20' },
    { icon: BarChart3, title: 'Reports & Analytics', desc: 'Generate PDF/Excel reports, visualize procurement data with charts, and track KPIs in real-time.', color: 'from-primary/20 to-primary/5 border-primary/20' },
    { icon: Lock, title: 'Role-Based Security', desc: 'JWT authentication with four distinct roles — Admin, Manager, Procurement Manager, and Employee.', color: 'from-success/20 to-success/5 border-success/20' },
  ];

  const roles = [
    { role: 'Admin', icon: Star, permissions: ['Full system access', 'Manage all users & vendors', 'Approve vendors & orders', 'Generate all reports'], color: 'primary' },
    { role: 'Procurement Manager', icon: Target, permissions: ['Approve/Reject requisitions', 'Approve/Reject purchase orders', 'View audit trails', 'Download reports'], color: 'warning' },
    { role: 'Employee', icon: Users, permissions: ['Create requisitions', 'Track own requests', 'Confirm goods received', 'Download GRN receipts'], color: 'destructive' },
    { role: 'Vendor', icon: Building2, permissions: ['Self-register & apply', 'Login after admin approval', 'View assigned purchase orders', 'Manage vendor profile'], color: 'success' },
  ];

  const specs = [
    { label: 'Authentication', value: 'JWT Bearer Tokens', icon: Lock },
    { label: 'API Endpoints', value: '15+ REST APIs', icon: Globe },
    { label: 'Status Workflow', value: 'Pending → Approved / Rejected', icon: TrendingUp },
    { label: 'Report Formats', value: 'PDF & Excel Export', icon: FileText },
    { label: 'Real-time UI', value: 'Framer Motion Animations', icon: Zap },
    { label: 'Architecture', value: 'Spring Boot + React 18', icon: Layers },
  ];

  const workflow = [
    { step: '01', title: 'Submit Requisition', desc: 'Employee creates a purchase requisition with item details, quantities, and unit prices. The system auto-assigns a requisition number.', icon: FileText },
    { step: '02', title: 'Manager Review', desc: 'Managers and Admins review pending requisitions. They can approve to proceed or reject with a reason for transparency.', icon: Eye },
    { step: '03', title: 'Create Purchase Order', desc: 'Procurement Managers convert approved requisitions into purchase orders, assigning a vendor from the registry.', icon: ShoppingCart },
    { step: '04', title: 'PO Approval & Tracking', desc: 'Purchase orders go through approval workflow. Full audit trail is maintained with approver details and timestamps.', icon: Shield },
    { step: '05', title: 'Report & Analyze', desc: 'Generate vendor performance reports in PDF or Excel. Dashboard provides real-time analytics and procurement insights.', icon: BarChart3 },
  ];

  const apiEndpoints = [
    { method: 'POST', path: '/api/auth/login', desc: 'Authenticate & get JWT token' },
    { method: 'GET', path: '/vendor/all', desc: 'List all vendors' },
    { method: 'POST', path: '/vendor/create', desc: 'Register new vendor' },
    { method: 'GET', path: '/procurement/requisition/all', desc: 'List all requisitions' },
    { method: 'POST', path: '/procurement/requisition/create', desc: 'Submit new requisition' },
    { method: 'PATCH', path: '/procurement/requisition/update-status/{id}', desc: 'Approve/Reject requisition' },
    { method: 'GET', path: '/procurement/purchase-order/all', desc: 'List all purchase orders' },
    { method: 'POST', path: '/procurement/purchase-order/create', desc: 'Create purchase order' },
    { method: 'POST', path: '/procurement/approval/approve/{poId}', desc: 'Approve a purchase order' },
    { method: 'POST', path: '/reports/vendor?format=pdf', desc: 'Download vendor report' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">
      <FloatingOrb className="w-96 h-96 bg-primary/15 top-20 -left-48" />
      <FloatingOrb className="w-80 h-80 bg-success/10 top-60 right-0" delay={2} />
      <FloatingOrb className="w-72 h-72 bg-warning/10 bottom-40 left-1/3" delay={4} />

      {/* ───── Navbar ───── */}
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/25">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-lg font-bold text-foreground tracking-tight">Smart Procurement</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#roles" className="hover:text-foreground transition-colors">Roles</a>
            <a href="#workflow" className="hover:text-foreground transition-colors">Workflow</a>
            <a href="#api" className="hover:text-foreground transition-colors">API</a>
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/login')} className="px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/register')} className="btn-primary flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ───── Hero ───── */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left text */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
                <Zap className="w-3.5 h-3.5" /> Enterprise Procurement Management System
              </motion.span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight tracking-tight mb-6">
                <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="block">Revolutionize Your</motion.span>
                <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="block bg-gradient-to-r from-primary via-primary/80 to-success bg-clip-text text-transparent">Procurement In</motion.span>
                <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="block">Less Than 2 Minutes</motion.span>
              </h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                End-to-end vendor management, purchase requisitions, order approvals, and analytics — all in one powerful, role-based platform built with Spring Boot & React.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="flex flex-col sm:flex-row gap-4">
                <motion.button whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -15px hsl(243 76% 59% / 0.4)' }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/register')} className="btn-primary px-8 py-3.5 text-base flex items-center justify-center gap-2 shadow-xl shadow-primary/20">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={handleDemo} className="px-8 py-3.5 text-base rounded-lg bg-gradient-to-r from-success/15 to-primary/15 border border-success/30 text-foreground font-medium flex items-center justify-center gap-2 hover:from-success/25 hover:to-primary/25 transition-all">
                  <Play className="w-5 h-5 text-success" /> Live Demo
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right - Dashboard preview mockup */}
            <motion.div initial={{ opacity: 0, y: 40, rotateY: -5 }} animate={{ opacity: 1, y: 0, rotateY: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
              <div className="floating-card p-1.5 rounded-2xl">
                <div className="bg-secondary rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-warning/60" />
                    <div className="w-3 h-3 rounded-full bg-success/60" />
                    <div className="flex-1 h-5 rounded bg-muted/30 mx-6" />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { l: 'Vendors', v: '24', c: 'border-primary/30 from-primary/10' },
                      { l: 'Requisitions', v: '156', c: 'border-warning/30 from-warning/10' },
                      { l: 'Orders', v: '89', c: 'border-success/30 from-success/10' },
                      { l: 'Approvals', v: '45', c: 'border-destructive/30 from-destructive/10' },
                    ].map((item, i) => (
                      <motion.div key={item.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.1 }} className={`rounded-lg border bg-gradient-to-br ${item.c} to-transparent p-3 text-center`}>
                        <div className="text-[10px] text-muted-foreground">{item.l}</div>
                        <div className="text-lg font-bold text-foreground">{item.v}</div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 h-28 rounded-lg bg-muted/15 flex items-end px-2 pb-2 gap-1">
                      {[40, 65, 45, 80, 55, 90, 70, 60].map((h, i) => (
                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 1.3 + i * 0.05, duration: 0.5 }} className="flex-1 rounded-t bg-gradient-to-t from-primary/50 to-primary/15" />
                      ))}
                    </div>
                    <div className="w-28 h-28 rounded-lg bg-muted/15 flex items-center justify-center">
                      <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 1.5, type: 'spring' }} className="w-20 h-20 rounded-full border-[5px] border-primary/30 border-t-success border-r-warning" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {['REQ-2024-001 — Pending', 'PO-2024-103 — Approved', 'REQ-2024-005 — Rejected'].map((t, i) => (
                      <motion.div key={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 + i * 0.1 }} className="flex items-center justify-between px-3 py-2 rounded bg-muted/15 text-xs">
                        <span className="text-foreground/80">{t.split(' — ')[0]}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.includes('Pending') ? 'bg-warning/15 text-warning' : t.includes('Approved') ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'}`}>
                          {t.split(' — ')[1]}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── Today's Procurement Challenges ───── */}
      <section className="py-20 px-6 border-y border-border/20">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Today's Procurement Challenges</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Organizations lose time and money with manual, fragmented procurement processes.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Manual Approval Delays', desc: 'Paper-based approvals take days. Requisitions sit in email inboxes waiting for action.', stat: '72%', statLabel: 'of companies face delays' },
              { title: 'No Visibility', desc: 'Teams lack real-time status of orders, leading to duplicate purchases and budget overruns.', stat: '45%', statLabel: 'budget waste from poor tracking' },
              { title: 'Compliance Risks', desc: 'Without audit trails, organizations face regulatory and financial compliance issues.', stat: '3x', statLabel: 'more compliance violations' },
            ].map((item, i) => (
              <motion.div key={item.title} {...fadeUp} transition={{ delay: i * 0.1 }} className="floating-card p-6 text-center">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-destructive to-warning bg-clip-text text-transparent mb-1">{item.stat}</div>
                <div className="text-xs text-muted-foreground mb-4">{item.statLabel}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Features ───── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <Layers className="w-3.5 h-3.5" /> Key Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Complete Procurement{' '}
              <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">Transformation</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything you need to digitize and streamline your procurement operations end-to-end.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fadeUp} transition={{ delay: i * 0.08 }} whileHover={{ y: -8, transition: { duration: 0.2 } }} className={`floating-card p-6 group bg-gradient-to-br ${f.color}`}>
                <div className="w-14 h-14 rounded-2xl bg-background/50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Roles & Permissions ───── */}
      <section id="roles" className="py-24 px-6 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-semibold mb-4">
              <Shield className="w-3.5 h-3.5" /> Role-Based Access Control
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Four Distinct Roles, Complete Control</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Every user gets exactly the permissions they need — nothing more, nothing less.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r, i) => (
              <motion.div key={r.role} {...fadeUp} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }} className="floating-card p-6 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-${r.color}`} />
                <div className={`w-12 h-12 rounded-xl bg-${r.color}/15 flex items-center justify-center mb-4`}>
                  <r.icon className={`w-6 h-6 text-${r.color}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{r.role}</h3>
                <ul className="space-y-2">
                  {r.permissions.map(p => (
                    <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className={`w-4 h-4 text-${r.color} shrink-0 mt-0.5`} />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── RBAC Permission Matrix ───── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Permission Matrix</h2>
            <p className="text-muted-foreground">Detailed breakdown of what each role can do</p>
          </motion.div>
          <motion.div {...fadeUp} className="floating-card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="text-center">Admin</th>
                  <th className="text-center">Proc. Mgr</th>
                  <th className="text-center">Employee</th>
                  <th className="text-center">Vendor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Create/Edit/Delete Vendor', true, false, false, false],
                  ['Approve/Reject Vendor', true, true, false, false],
                  ['Create Requisition', true, true, true, false],
                  ['Approve/Reject Requisition', true, true, false, false],
                  ['Create Purchase Order', true, true, false, false],
                  ['Approve/Reject PO', true, true, false, false],
                  ['Download Reports', true, true, false, false],
                  ['View Audit Trail', true, true, true, false],
                  ['Dashboard Analytics', true, true, true, true],
                ].map(([feature, ...perms], i) => (
                  <motion.tr key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                    <td className="font-medium text-foreground">{feature as string}</td>
                    {(perms as boolean[]).map((p, j) => (
                      <td key={j} className="text-center">
                        {p ? <CheckCircle className="w-5 h-5 text-success mx-auto" /> : <span className="text-muted-foreground/40">—</span>}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ───── Workflow Steps ───── */}
      <section id="workflow" className="py-24 px-6 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warning/10 border border-warning/20 text-warning text-xs font-semibold mb-4">
              <Clock className="w-3.5 h-3.5" /> How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Complete Procurement Workflow</h2>
            <p className="text-muted-foreground text-lg">From requisition to report in five streamlined steps</p>
          </motion.div>
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-success to-warning hidden md:block" />
            <div className="space-y-8">
              {workflow.map((item, i) => (
                <motion.div key={item.step} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-6">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shrink-0 text-primary-foreground font-bold text-lg shadow-xl shadow-primary/25 z-10">
                    {item.step}
                  </motion.div>
                  <div className="floating-card p-6 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <item.icon className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── Technical Specifications ───── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <Layers className="w-3.5 h-3.5" /> Technical Specs
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built with Modern Technology</h2>
            <p className="text-muted-foreground text-lg">Enterprise-grade stack for reliability and performance</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specs.map((spec, i) => (
              <motion.div key={spec.label} {...fadeUp} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }} className="floating-card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <spec.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">{spec.label}</div>
                  <div className="text-sm text-muted-foreground">{spec.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── API Endpoints Preview ───── */}
      <section id="api" className="py-24 px-6 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 border border-success/20 text-success text-xs font-semibold mb-4">
              <Globe className="w-3.5 h-3.5" /> REST API
            </span>
            <h2 className="text-3xl font-bold text-foreground mb-4">Powerful API Endpoints</h2>
            <p className="text-muted-foreground">15+ REST endpoints powered by Spring Boot</p>
          </motion.div>
          <motion.div {...fadeUp} className="floating-card overflow-hidden">
            <table className="data-table">
              <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
              <tbody>
                {apiEndpoints.map((ep, i) => (
                  <motion.tr key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ep.method === 'GET' ? 'bg-success/15 text-success' : ep.method === 'POST' ? 'bg-primary/15 text-primary' : 'bg-warning/15 text-warning'}`}>
                        {ep.method}
                      </span>
                    </td>
                    <td className="font-mono text-xs text-foreground">{ep.path}</td>
                    <td className="text-sm text-muted-foreground">{ep.desc}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ───── Stats Bar ───── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Faster Processing', value: '10x' },
            { label: 'Cost Reduction', value: '35%' },
            { label: 'Approval Time', value: '<2h' },
            { label: 'Accuracy Rate', value: '99.9%' },
          ].map((stat, i) => (
            <motion.div key={stat.label} {...fadeUp} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-24 px-6">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center floating-card p-12 relative overflow-hidden">
          <FloatingOrb className="w-64 h-64 bg-primary/20 -top-32 -right-32" delay={1} />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Transform Your Procurement Today</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Experience the complete Smart Procurement & Vendor Management System with our live demo.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/register')} className="btn-primary px-8 py-3.5 text-base flex items-center gap-2 shadow-xl shadow-primary/20">
                Get Started Now <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={handleDemo} className="px-8 py-3.5 rounded-lg border border-success/30 bg-success/10 text-foreground font-medium flex items-center gap-2 hover:bg-success/20 transition-all">
                <Play className="w-5 h-5 text-success" /> Try Live Demo
              </motion.button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              {['No setup required', 'Full admin access', 'All features unlocked'].map(t => (
                <span key={t} className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-success" /> {t}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t border-border/30 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">ProcureFlow</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 Smart Procurement — Vendor Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
