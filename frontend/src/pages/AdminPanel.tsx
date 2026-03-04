import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import API from '@/api/axiosInstance';
import { AnimatedPage } from '@/components/AnimatedPage';
import { toast } from 'sonner';
import { Check, X, Shield, ShieldAlert, Building2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPanel = () => {
    const { isAdmin } = useAuth();
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [pendingVendors, setPendingVendors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    if (!isAdmin()) {
        return <Navigate to="/dashboard" replace />;
    }

    const fetchData = async () => {
        try {
            setLoading(true);
            const [pUsers, aUsers, pVendors] = await Promise.all([
                API.get('/api/admin/pending-users'),
                API.get('/api/admin/all-users'),
                API.get('/api/admin/vendor-accounts/pending')
            ]);
            setPendingUsers(pUsers.data);
            setAllUsers(aUsers.data);
            setPendingVendors(pVendors.data);
        } catch (error) {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUserAction = async (id: number, action: 'approve' | 'reject' | 'suspend', reason?: string) => {
        try {
            if (action === 'reject') {
                await API.put(`/api/admin/users/${id}/reject`, { reason });
            } else {
                await API.put(`/api/admin/users/${id}/${action}`);
            }
            toast.success(`User ${action}ed successfully`);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data || `Failed to ${action} user`);
        }
    };

    const handleRoleChange = async (id: number, role: string) => {
        try {
            await API.put(`/api/admin/users/${id}/role`, { roleName: role });
            toast.success(`Role updated to ${role}`);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data || 'Failed to update role');
        }
    };

    const handleVendorAction = async (id: number, action: 'approve' | 'reject') => {
        try {
            await API.put(`/api/admin/vendor-accounts/${id}/${action}`);
            toast.success(`Vendor ${action}ed successfully`);
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data || `Failed to ${action} vendor`);
        }
    };

    return (
        <AnimatedPage>
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-white mb-2">Admin Control Panel</h1>
                <p className="page-subtitle">Manage users, roles, and vendor accounts</p>
            </div>

            <Tabs defaultValue="pending-users" className="w-full">
                <TabsList className="mb-6 bg-white/5 border border-white/10 rounded-xl p-1">
                    <TabsTrigger value="pending-users" className="data-[state=active]:bg-violet-500 data-[state=active]:text-white">Pending Users</TabsTrigger>
                    <TabsTrigger value="all-users" className="data-[state=active]:bg-violet-500 data-[state=active]:text-white">User Management</TabsTrigger>
                    <TabsTrigger value="pending-vendors" className="data-[state=active]:bg-violet-500 data-[state=active]:text-white">Pending Vendors</TabsTrigger>
                </TabsList>

                {/* PENDING USERS */}
                <TabsContent value="pending-users">
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-amber-400" /> Pending Employee Approvals</h2>
                        {loading ? <p>Loading...</p> : pendingUsers.length === 0 ? <p className="text-gray-400">No pending users.</p> : (
                            <div className="space-y-3">
                                {pendingUsers.map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div>
                                            <p className="font-semibold text-white">{user.username}</p>
                                            <p className="text-sm text-gray-400">{user.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleUserAction(user.id, 'approve')} className="btn-primary px-3 py-1.5 text-sm flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 font-medium rounded-lg">
                                                <Check className="w-4 h-4" /> Approve
                                            </button>
                                            <button onClick={() => {
                                                const reason = prompt('Reason for rejection:');
                                                if (reason) handleUserAction(user.id, 'reject', reason);
                                            }} className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-1 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-600/30 font-medium rounded-lg">
                                                <X className="w-4 h-4" /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* ALL USERS / ROLE MANAGEMENT */}
                <TabsContent value="all-users">
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-violet-400" /> User Role Management</h2>
                        {loading ? <p>Loading...</p> : (
                            <div className="space-y-3">
                                {allUsers.map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div>
                                            <p className="font-semibold text-white">{user.username} <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full ml-2">{user.accountStatus}</span></p>
                                            <p className="text-sm text-gray-400">{user.email}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <select
                                                className="bg-black/50 border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-violet-500"
                                                value={user.roles?.[0]?.name || 'ROLE_EMPLOYEE'}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                disabled={user.username === 'admin'}
                                            >
                                                <option value="ROLE_EMPLOYEE">Employee</option>
                                                <option value="ROLE_PROCUREMENT_MANAGER">Procurement Manager</option>
                                                <option value="ROLE_ADMIN">Admin</option>
                                            </select>
                                            {user.accountStatus === 'APPROVED' && user.username !== 'admin' && (
                                                <button onClick={() => handleUserAction(user.id, 'suspend')} className="text-xs text-rose-400 hover:text-rose-300">Suspend</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* PENDING VENDORS */}
                <TabsContent value="pending-vendors">
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-cyan-400" /> Pending Vendor Accounts</h2>
                        {loading ? <p>Loading...</p> : pendingVendors.length === 0 ? <p className="text-gray-400">No pending vendor applications.</p> : (
                            <div className="space-y-3">
                                {pendingVendors.map(vendor => (
                                    <div key={vendor.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div>
                                            <p className="font-semibold text-white">{vendor.vendor?.name || 'Unknown Company'}</p>
                                            <p className="text-sm text-gray-400">{vendor.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleVendorAction(vendor.id, 'approve')} className="btn-primary px-3 py-1.5 text-sm flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 font-medium rounded-lg">
                                                <Check className="w-4 h-4" /> Approve
                                            </button>
                                            <button onClick={() => handleVendorAction(vendor.id, 'reject')} className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-1 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-600/30 font-medium rounded-lg">
                                                <X className="w-4 h-4" /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>

            </Tabs>
        </AnimatedPage>
    );
};

export default AdminPanel;
