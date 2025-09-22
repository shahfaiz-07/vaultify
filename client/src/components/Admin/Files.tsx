import { useState, useMemo } from "react";
import useAllFiles from "../../hooks/admin/useAllFiles";
import Spinner from "../common/Spinner";
import type { UserFile, User } from "../../types";
import { downloadFile } from "../../lib/api";
import { formatFileSize } from "../../utils/formatFileSize";
import { formatDate } from "../../utils/formatDate";
import { getFileTypeLabel } from "../../utils/getFileTypeLabel";
import { getRoleBadgeColor } from "../../utils/getRoleBadgeColor";
import { RoleType } from "../../types/enums/RoleType";
import useGetFileIcon from "../../hooks/useGetFileIcon";

type FilterType = 'all' | 'public' | 'private';
type SortField = 'filename' | 'size' | 'createdAt' | 'downloadCount' | 'userName';
type SortOrder = 'asc' | 'desc';

const Files = () => {
  const { allFiles, isLoading } = useAllFiles();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [userFilter, setUserFilter] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleDownload = async (file: UserFile) => {
    await downloadFile(file._id, file.filename, file.mimetype);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const filteredAndSortedFiles = useMemo(() => {
    if (!allFiles) return [];

    let filtered = allFiles.filter((file) => {
      const user = file.uploadedBy as User;
      const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user?.email?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesVisibility = filterType === 'all' ||
        (filterType === 'public' && file.isPublic) ||
        (filterType === 'private' && !file.isPublic);

      const matchesUser = !userFilter ||
        (user?.name?.toLowerCase().includes(userFilter.toLowerCase())) ||
        (user?.email?.toLowerCase().includes(userFilter.toLowerCase()));

      const matchesFileType = !fileTypeFilter ||
        file.mimetype.toLowerCase().includes(fileTypeFilter.toLowerCase()) ||
        getFileTypeLabel(file.mimetype).toLowerCase().includes(fileTypeFilter.toLowerCase());

      return matchesSearch && matchesVisibility && matchesUser && matchesFileType;
    });

    // Sort the filtered files
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'filename':
          aValue = a.filename.toLowerCase();
          bValue = b.filename.toLowerCase();
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'downloadCount':
          aValue = a.downloadCount;
          bValue = b.downloadCount;
          break;
        case 'userName':
          const userA = a.uploadedBy as User;
          const userB = b.uploadedBy as User;
          aValue = userA?.name?.toLowerCase() || '';
          bValue = userB?.name?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allFiles, searchTerm, filterType, userFilter, fileTypeFilter, sortField, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    if (!allFiles) return { total: 0, public: 0, private: 0, totalSize: 0, totalDownloads: 0, uniqueUsers: 0 };

    const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
    const totalDownloads = allFiles.reduce((sum, file) => sum + file.downloadCount, 0);
    const publicFiles = allFiles.filter(file => file.isPublic).length;
    const privateFiles = allFiles.length - publicFiles;
    const uniqueUsers = new Set(allFiles.map(file => (file.uploadedBy as User)?._id)).size;

    return {
      total: allFiles.length,
      public: publicFiles,
      private: privateFiles,
      totalSize,
      totalDownloads,
      uniqueUsers
    };
  }, [allFiles]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType('all');
    setUserFilter("");
    setFileTypeFilter("");
    setSortField('createdAt');
    setSortOrder('desc');
  };

  if (isLoading) return <Spinner />;

  if (!allFiles) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Failed to load files</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gradient-to-br from-base-100 to-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 002 2v0" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-base-content">All Files</h1>
              <p className="text-base-content/60 text-lg">Manage all uploaded files across the platform</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="stat-title text-xs">Total Files</div>
            <div className="stat-value text-lg text-primary">{stats.total}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="stat-title text-xs">Public</div>
            <div className="stat-value text-lg text-success">{stats.public}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="stat-title text-xs">Private</div>
            <div className="stat-value text-lg text-warning">{stats.private}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7c0 2.21-3.582 4-8 4s-8-1.79-8-4z" />
              </svg>
            </div>
            <div className="stat-title text-xs">Total Size</div>
            <div className="stat-value text-lg text-secondary">{formatFileSize(stats.totalSize)}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="stat-title text-xs">Downloads</div>
            <div className="stat-value text-lg text-info">{stats.totalDownloads}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="stat-title text-xs">Active Users</div>
            <div className="stat-value text-lg text-accent">{stats.uniqueUsers}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Filters & Search
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Search Files</span>
                </label>
                <input
                  type="text"
                  placeholder="Search by filename, user name, or email..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Visibility</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                >
                  <option value="all">All Files</option>
                  <option value="public">Public Only</option>
                  <option value="private">Private Only</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Filter by User</span>
                </label>
                <input
                  type="text"
                  placeholder="User name or email..."
                  className="input input-bordered w-full"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">File Type</span>
                </label>
                <input
                  type="text"
                  placeholder="Image, PDF, Video, etc..."
                  className="input input-bordered w-full"
                  value={fileTypeFilter}
                  onChange={(e) => setFileTypeFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-base-content/60">
                Showing {filteredAndSortedFiles.length} of {stats.total} files
              </div>
              <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Files Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 002 2v0" />
              </svg>
              Files ({filteredAndSortedFiles.length})
            </h2>

            {filteredAndSortedFiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-base-content mb-1">No files found</h3>
                <p className="text-base-content/60">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr className="border-b border-base-300">
                      <th className="bg-base-200 text-base-content font-semibold">
                        <button
                          className="flex items-center gap-2 hover:text-primary"
                          onClick={() => handleSort('filename')}
                        >
                          File
                          {getSortIcon('filename')}
                        </button>
                      </th>
                      <th className="bg-base-200 text-base-content font-semibold hidden md:table-cell">
                        <button
                          className="flex items-center gap-2 hover:text-primary"
                          onClick={() => handleSort('userName')}
                        >
                          Uploaded By
                          {getSortIcon('userName')}
                        </button>
                      </th>
                      <th className="bg-base-200 text-base-content font-semibold hidden sm:table-cell">Type</th>
                      <th className="bg-base-200 text-base-content font-semibold hidden lg:table-cell">
                        <button
                          className="flex items-center gap-2 hover:text-primary"
                          onClick={() => handleSort('size')}
                        >
                          Size
                          {getSortIcon('size')}
                        </button>
                      </th>
                      <th className="bg-base-200 text-base-content font-semibold hidden xl:table-cell">Visibility</th>
                      <th className="bg-base-200 text-base-content font-semibold hidden lg:table-cell">
                        <button
                          className="flex items-center gap-2 hover:text-primary"
                          onClick={() => handleSort('downloadCount')}
                        >
                          Downloads
                          {getSortIcon('downloadCount')}
                        </button>
                      </th>
                      <th className="bg-base-200 text-base-content font-semibold hidden md:table-cell">
                        <button
                          className="flex items-center gap-2 hover:text-primary"
                          onClick={() => handleSort('createdAt')}
                        >
                          Uploaded
                          {getSortIcon('createdAt')}
                        </button>
                      </th>
                      <th className="bg-base-200 text-base-content font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedFiles.map((file: UserFile) => {
                      const user = file.uploadedBy as User;
                      return (
                        <tr key={file._id} className="hover:bg-base-200/50">
                          <td className="min-w-0">
                            <div className="flex items-center gap-3">
                              {useGetFileIcon(file.mimetype)}
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold text-base-content truncate" title={file.filename}>
                                  {file.filename}
                                </div>
                                <div className="text-sm text-base-content/60 block md:hidden">
                                  {user ? `${user.name}` : 'Unknown User'}
                                </div>
                                <div className="text-sm text-base-content/60 block sm:hidden">
                                  {getFileTypeLabel(file.mimetype)} • {formatFileSize(file.size)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="hidden md:table-cell">
                            {user ? (
                              <div className="flex flex-col">
                                <div className="font-medium text-base-content">{user.name}</div>
                                <div className="text-xs text-base-content/60 text-ellipsis text-wrap">{user.email}</div>
                                <span className={`badge ${getRoleBadgeColor(user.role)} badge-sm mt-1`}>
                                  {user.role === RoleType.ADMIN ? 'Admin' : 'User'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-base-content/60">Unknown User</span>
                            )}
                          </td>
                          <td className="hidden sm:table-cell">
                            <span className="badge badge-outline">
                              {getFileTypeLabel(file.mimetype)}
                            </span>
                          </td>
                          <td className="font-medium hidden lg:table-cell">{formatFileSize(file.size)}</td>
                          <td className="hidden xl:table-cell">
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
                                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-48 p-2 shadow-xl border border-base-300">
                                  <li className="border-b border-base-300 pb-2 mb-2">
                                    <div className="text-xs text-base-content/60 px-2 py-1">
                                      <div className="flex justify-between">
                                        <span>Size:</span>
                                        <span>{formatFileSize(file.size)}</span>
                                      </div>
                                      <div className="flex justify-between mt-1">
                                        <span>Visibility:</span>
                                        <span className={file.isPublic ? 'text-success' : 'text-warning'}>
                                          {file.isPublic ? 'Public' : 'Private'}
                                        </span>
                                      </div>
                                      <div className="flex justify-between mt-1">
                                        <span>Downloads:</span>
                                        <span>{file.downloadCount}</span>
                                      </div>
                                      <div className="flex justify-between mt-1">
                                        <span>Uploaded:</span>
                                        <span>{formatDate(file.createdAt)}</span>
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Files;