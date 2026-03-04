import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Building2, Mail, Lock, CheckCircle, Store, FileText, Upload } from 'lucide-react';
import { AnimatedPage } from '@/components/AnimatedPage';

const VendorLogin = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const { vendorLogin, vendorRegister } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                await vendorLogin(email, password);
                toast.success("Welcome to Vendor Portal!");
                navigate('/vendor-portal');
            } else {
                await vendorRegister({ email, password, companyName, contactNumber });
                toast.success("Registration successful! Pending admin approval.");
                setIsLogin(true);
            }
        } catch (error: any) {
            toast.error(error.response?.data || (isLogin ? "Login failed" : "Registration failed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: 'linear-gradient(135deg, hsl(220,35%,7%) 0%, hsl(222,40%,5%) 100%)' }}>
            <AnimatedPage>

                {/* Dynamic Background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20" style={{ background: 'hsl(173,80%,40%)' }} />
                    <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-20" style={{ background: 'hsl(210,100%,45%)' }} />
                </div>

                <div className="w-full max-w-md z-10">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative" style={{ background: 'linear-gradient(135deg, hsl(173,80%,40%) 0%, hsl(210,100%,45%) 100%)' }}>
                            <div className="absolute inset-0 rounded-3xl opacity-50" style={{ boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.4)' }} />
                            <Store className="w-10 h-10 text-white drop-shadow-md" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Vendor Portal</h1>
                        <p className="text-sm font-medium" style={{ color: 'hsl(215,20%,65%)' }}>
                            {isLogin ? 'Welcome back! Log in to manage orders.' : 'Join our procurement network!'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/5 p-8 rounded-3xl shadow-2xl space-y-5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>

                        <div className="space-y-4">
                            {!isLogin && (
                                <>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                                            placeholder="Company Name"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <CheckCircle className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text" required value={contactNumber} onChange={e => setContactNumber(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                                            placeholder="Contact Number"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                                    placeholder="Business Email"
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password" required value={password} onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white transition-all transform hover:-translate-y-1 hover:shadow-cyan-500/25 flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0"
                            style={{ background: 'linear-gradient(135deg, hsl(173,80%,40%) 0%, hsl(210,100%,45%) 100%)' }}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (isLogin ? 'Sign in to Portal' : 'Submit Application')}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        {isLogin ? "Not a registered vendor? " : "Already approved? "}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-bold hover:underline"
                            style={{ color: 'hsl(173,80%,60%)' }}
                        >
                            {isLogin ? 'Apply now' : 'Sign in'}
                        </button>
                    </p>
                    <p className="mt-3 text-center text-sm">
                        <a href="/login" className="hover:underline" style={{ color: 'hsl(215,20%,50%)' }}>
                            ← Back to main login
                        </a>
                    </p>
                </div>
            </AnimatedPage>
        </div>
    );
};

export default VendorLogin;
