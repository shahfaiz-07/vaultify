import useAdminUsers from "../../hooks/admin/useAdminUsers"
import Spinner from "../common/Spinner";
import { useNavigate } from "react-router";
import { RoleType } from "../../types/enums/RoleType";
import { formatDate } from "../../utils/formatDate";
import { getRoleBadgeColor } from "../../utils/getRoleBadgeColor";

const Users = () => {
    const { users, isPending } = useAdminUsers();
    const navigate = useNavigate();

    if (isPending) return <Spinner />

    

    const handleUserClick = (userId: string) => {
        navigate(`/dashboard/admin/users/${userId}`);
    };

    const totalUsers = users?.length || 0;
    const adminUsers = users?.filter((user: any) => user.role === RoleType.ADMIN).length || 0;
    const regularUsers = users?.filter((user: any) => user.role === RoleType.USER).length || 0;


    return (
        <div className="flex-1 p-6 bg-gradient-to-br from-base-100 to-base-200 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-bold text-base-content">User Management</h1>
                            <p className="text-base-content/60 text-lg">Manage all registered users</p>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="stat bg-base-100 rounded-lg shadow-lg">
                            <div className="stat-figure text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="stat-title">Total Users</div>
                            <div className="stat-value text-primary">{totalUsers}</div>
                        </div>

                        <div className="stat bg-base-100 rounded-lg shadow-lg">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className="stat-title">Administrators</div>
                            <div className="stat-value text-secondary">{adminUsers}</div>
                        </div>

                        <div className="stat bg-base-100 rounded-lg shadow-lg">
                            <div className="stat-figure text-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="stat-title">Regular Users</div>
                            <div className="stat-value text-accent">{regularUsers}</div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                {!users || users.length === 0 ? (
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body text-center py-16">
                            <div className="mx-auto w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-base-content mb-2">No users found</h3>
                            <p className="text-base-content/60">No registered users in the system</p>
                        </div>
                    </div>
                ) : (
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body p-0">
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr className="border-b border-base-300">
                                            <th className="bg-base-200 text-base-content font-semibold">User</th>
                                            <th className="bg-base-200 text-base-content font-semibold hidden sm:table-cell">Email</th>
                                            <th className="bg-base-200 text-base-content font-semibold hidden md:table-cell">Role</th>
                                            <th className="bg-base-200 text-base-content font-semibold hidden lg:table-cell">Joined</th>
                                            <th className="bg-base-200 text-base-content font-semibold hidden lg:table-cell">Last Updated</th>
                                            <th className="bg-base-200 text-base-content font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user: any) => (
                                            <tr 
                                                key={user._id} 
                                                className="hover:bg-base-200/50 cursor-pointer transition-colors"
                                            >
                                                <td className="min-w-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-semibold text-base-content truncate" title={user.name}>
                                                                {user.name}
                                                            </div>
                                                            <div className="text-xs text-base-content/60 block sm:hidden truncate" title={user.email}>
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden sm:table-cell">
                                                    <div className="font-medium text-base-content truncate max-w-xs" title={user.email}>
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="hidden md:table-cell">
                                                    <span className={`badge ${getRoleBadgeColor(user.role)} badge-lg`}>
                                                        {user.role === RoleType.ADMIN ? 'Administrator' : 'User'}
                                                    </span>
                                                </td>
                                                <td className="text-sm text-base-content/70 hidden lg:table-cell">
                                                    {formatDate(user.createdAt)}
                                                </td>
                                                <td className="text-sm text-base-content/70 hidden lg:table-cell">
                                                    {formatDate(user.updatedAt)}
                                                </td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            className="btn btn-xs lg:btn-sm btn-primary btn-outline"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUserClick(user._id);
                                                            }}
                                                            title="View Details"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            <span className="hidden lg:inline ml-1">View</span>
                                                        </button>
                                                        
                                                        <div className="dropdown dropdown-end lg:hidden">
                                                            <div 
                                                                tabIndex={0} 
                                                                role="button" 
                                                                className="btn btn-xs btn-ghost"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                                                                </svg>
                                                            </div>
                                                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow-xl border border-base-300">
                                                                <li className="border-b border-base-300 pb-2 mb-2">
                                                                    <div className="text-xs text-base-content/60 px-2 py-1 flex flex-col items-start">
                                                                        <div className="flex gap-x-2 mb-1">
                                                                            <span>Role: </span>
                                                                            <span className={`${user.role === RoleType.ADMIN ? 'text-primary' : 'text-secondary'} font-bold`}>
                                                                                {user.role === RoleType.ADMIN ? ' Admin' : ' User'}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-xs text-base-content/50">
                                                                            Joined: {formatDate(user.createdAt)}
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <a onClick={() => handleUserClick(user._id)}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </svg>
                                                                        View Details
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Users