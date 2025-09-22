import { useUser } from '../../hooks/useUser'
import Spinner from '../common/Spinner'
import { RoleType } from '../../types/enums/RoleType'
import { getRoleBadgeColor } from '../../utils/getRoleBadgeColor'
import { formatDate } from '../../utils/formatDate'

const Profile = () => {
    const { user, isPending } = useUser()

    if (isPending) {
        return (
            <Spinner />
        )
    }

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="alert alert-error max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Failed to load user information</span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 p-6 bg-gradient-to-br from-base-100 to-base-200 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-base-content">Profile</h1>
                            <p className="text-base-content/60 text-lg">Your account information</p>
                        </div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="card bg-base-100 shadow-2xl border border-base-300/50">
                    <div className="card-body p-8">
                        {/* Profile Header */}
                        <div className="text-center mb-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mb-4 shadow-lg">
                                <span className="text-3xl font-bold text-white">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-base-content mb-2">{user.name}</h2>
                            <p className="text-xl text-base-content/70 mb-4">{user.email}</p>
                            <div className="inline-flex">
                                <span className={`badge ${getRoleBadgeColor(user.role)} badge-lg px-3 py-3 text-sm font-medium w-fit`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {user.role === RoleType.ADMIN ? 'Administrator' : 'Standard User'}
                                </span>
                            </div>
                        </div>

                        {/* User Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-info/10 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-base-content">Personal Information</h3>
                                </div>

                                <div className="space-y-5">
                                    <div className="p-4 bg-base-200/50 rounded-lg border border-base-300/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <h4 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide">Full Name</h4>
                                        </div>
                                        <p className="text-lg font-medium text-base-content">{user.name}</p>
                                    </div>

                                    <div className="p-4 bg-base-200/50 rounded-lg border border-base-300/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <h4 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide">Email Address</h4>
                                        </div>
                                        <p className="text-lg font-medium text-base-content">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-success/10 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-base-content">Account Details</h3>
                                </div>

                                <div className="space-y-5">
                                    <div className="p-4 bg-base-200/50 rounded-lg border border-base-300/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <h4 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide">Account Type</h4>
                                        </div>
                                        <p className="text-lg font-medium text-base-content">{user.role === RoleType.ADMIN ? 'Administrator' : 'Standard User'}</p>
                                    </div>

                                    <div className="p-4 bg-base-200/50 rounded-lg border border-base-300/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-8 0h8" />
                                            </svg>
                                            <h4 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide">Member Since</h4>
                                        </div>
                                        <p className="text-lg font-medium text-base-content">{formatDate(user.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile