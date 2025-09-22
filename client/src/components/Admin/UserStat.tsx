import { useParams, Link } from "react-router";
import useAdminUser from "../../hooks/admin/useAdminUser";
import Spinner from "../common/Spinner";
import useAdminUserFiles from "../../hooks/admin/useAdminUserFiles";
import { RoleType } from "../../types/enums/RoleType";
import type { UserFile } from "../../types";
import { downloadFile } from "../../lib/api";
import { formatDate } from "../../utils/formatDate";
import { formatFileSize } from "../../utils/formatFileSize";
import { getFileTypeLabel } from "../../utils/getFileTypeLabel";
import useGetFileIcon from "../../hooks/useGetFileIcon";
import { useQueryClient } from "@tanstack/react-query";

const UserStat = () => {
    const { userId } = useParams();

    const { userStat, isLoading } = useAdminUser(userId || "");
    const { userFiles, isLoading: isLoadingFiles } = useAdminUserFiles(userId || "");

    if (isLoading || isLoadingFiles) return <Spinner />;

    if (!userStat || !userId) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="alert alert-error max-w-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>User not found</span>
                </div>
            </div>
        );
    }

    const queryClient = useQueryClient();

    const handleDownload = async (file: UserFile) => {
        await downloadFile(file._id, file.filename, file.mimetype);
        queryClient.invalidateQueries({queryKey: ['admin']});
    };

    const getRoleBadgeColor = (role: RoleType) => {
        return role === RoleType.ADMIN ? 'badge-primary' : 'badge-secondary'
    };

    return (
        <div className="flex-1 p-6 bg-gradient-to-br from-base-100 to-base-200 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-base-content">User Details</h1>
                                <p className="text-base-content/60 text-lg">{userStat.user.name} • {userStat.user.email}</p>
                            </div>
                        </div>
                        <Link to="/dashboard/admin/users" className="btn btn-outline">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Users
                        </Link>
                    </div>
                </div>

                {/* User Information Card */}
                <div className="card bg-base-100 shadow-xl mb-8">
                    <div className="card-body">
                        <h2 className="card-title mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            User Information
                        </h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="p-4 bg-base-200/50 rounded-lg border border-base-300/30">
                                    <h4 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-2">Full Name</h4>
                                    <p className="text-lg font-medium text-base-content">{userStat.user.name}</p>
                                </div>

                                <div className="p-4 bg-base-200/50 rounded-lg border border-base-300/30">
                                    <h4 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-2">Email Address</h4>
                                    <p className="text-lg font-medium text-base-content">{userStat.user.email}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-base-200/50 rounded-lg border border-base-300/30">
                                    <h4 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-2">Account Type</h4>
                                    <span className={`badge ${getRoleBadgeColor(userStat.user.role)} badge-lg px-4 py-3 text-sm font-medium`}>
                                        {userStat.user.role === RoleType.ADMIN ? 'Administrator' : 'Standard User'}
                                    </span>
                                </div>

                                <div className="p-4 bg-base-200/50 rounded-lg border border-base-300/30">
                                    <h4 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-2">Member Since</h4>
                                    <p className="text-lg font-medium text-base-content">{formatDate(userStat.user.createdAt!)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="stat bg-base-100 rounded-lg shadow-lg">
                        <div className="stat-figure text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="stat-title">Total Files</div>
                        <div className="stat-value text-primary">{userStat.totalFiles}</div>
                    </div>

                    <div className="stat bg-base-100 rounded-lg shadow-lg">
                        <div className="stat-figure text-secondary">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7c0 2.21-3.582 4-8 4s-8-1.79-8-4z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                            </svg>
                        </div>
                        <div className="stat-title">Storage Used</div>
                        <div className="stat-value text-secondary">{formatFileSize(userStat.totalStorageUsed)}</div>
                    </div>

                    <div className="stat bg-base-100 rounded-lg shadow-lg">
                        <div className="stat-figure text-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div className="stat-title">Public Files</div>
                        <div className="stat-value text-accent">{userStat.totalPublicFiles}</div>
                    </div>

                    <div className="stat bg-base-100 rounded-lg shadow-lg">
                        <div className="stat-figure text-info">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="stat-title">Total Downloads</div>
                        <div className="stat-value text-info">{userStat.totalDownloadCount}</div>
                    </div>
                </div>

                {/* User Files */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 002 2v0" />
                            </svg>
                            User Files ({userFiles?.length || 0})
                        </h2>

                        {!userFiles || userFiles.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="mx-auto w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-base-content mb-1">No files uploaded</h3>
                                <p className="text-base-content/60">This user hasn't uploaded any files yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table table-zebra w-full">
                                    <thead>
                                        <tr className="border-b border-base-300">
                                            <th className="bg-base-200 text-base-content font-semibold">File</th>
                                            <th className="bg-base-200 text-base-content font-semibold hidden sm:table-cell">Type</th>
                                            <th className="bg-base-200 text-base-content font-semibold hidden md:table-cell">Size</th>
                                            <th className="bg-base-200 text-base-content font-semibold hidden lg:table-cell">Visibility</th>
                                            <th className="bg-base-200 text-base-content font-semibold hidden lg:table-cell">Downloads</th>
                                            <th className="bg-base-200 text-base-content font-semibold hidden md:table-cell">Uploaded</th>
                                            <th className="bg-base-200 text-base-content font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userFiles.map((file: UserFile) => (
                                            <tr key={file._id} className="hover:bg-base-200/50">
                                                <td className="min-w-0">
                                                    <div className="flex items-center gap-3">
                                                        {useGetFileIcon(file.mimetype)}
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-semibold text-base-content truncate" title={file.filename}>
                                                                {file.filename}
                                                            </div>
                                                            <div className="text-sm text-base-content/60 block sm:hidden">
                                                                {getFileTypeLabel(file.mimetype)} • {formatFileSize(file.size)}
                                                            </div>
                                                            <div className="text-xs text-base-content/50 truncate md:hidden" title={file._id}>
                                                                {file._id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden sm:table-cell">
                                                    <span className="badge badge-outline">
                                                        {getFileTypeLabel(file.mimetype)}
                                                    </span>
                                                </td>
                                                <td className="font-medium hidden md:table-cell">{formatFileSize(file.size)}</td>
                                                <td className="hidden lg:table-cell">
                                                    <span className={`badge ${file.isPublic ? 'badge-success' : 'badge-warning'}`}>
                                                        {file.isPublic ? 'Public' : 'Private'}
                                                    </span>
                                                </td>
                                                <td className="font-medium hidden lg:table-cell">{file.downloadCount}</td>
                                                <td className="text-sm text-base-content/70 hidden md:table-cell">
                                                    {formatDate(file.createdAt)}
                                                </td>
                                                <td>
                                                    <div className="flex gap-1 lg:gap-2">
                                                        <button 
                                                            className="btn btn-xs lg:btn-sm btn-primary btn-outline"
                                                            onClick={() => handleDownload(file)}
                                                            title="Download"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span className="hidden lg:inline ml-1">Download</span>
                                                        </button>
                                                        
                                                        <div className="dropdown dropdown-end lg:hidden">
                                                            <div tabIndex={0} role="button" className="btn btn-xs btn-ghost">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                                                                </svg>
                                                            </div>
                                                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow-xl border border-base-300">
                                                                <li className="border-b border-base-300 pb-2 mb-2">
                                                                    <div className="text-xs text-base-content/60 px-2 py-1">
                                                                        <div className="flex justify-between">
                                                                            <span>Visibility:</span>
                                                                            <span className={file.isPublic ? 'text-success' : 'text-warning'}>
                                                                                {file.isPublic ? 'Public' : 'Private'}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex justify-between mt-1">
                                                                            <span>Downloads:</span>
                                                                            <span>{file.downloadCount}</span>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <a onClick={() => handleDownload(file)}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                        </svg>
                                                                        Download
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserStat