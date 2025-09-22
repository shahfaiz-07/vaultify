import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import useGetPublicFiles from '../../hooks/useGetPublicFiles';
import Spinner from '../common/Spinner';
import type { GetPublicFilesResponse } from "../../types";
import { downloadFile } from "../../lib/api";
import { formatFileSize } from "../../utils/formatFileSize";
import { formatDate } from "../../utils/formatDate";
import { getFileTypeLabel } from "../../utils/getFileTypeLabel";
import { MimeType } from "../../types/enums/MimeType";
import { getFileCategory } from "../../utils/getFileCategory";

export type FilterType = 'all' | 'image' | 'video' | 'document' | 'other';
type SortField = 'filename' | 'size' | 'createdAt' | 'downloadCount' | 'userName';
type SortOrder = 'asc' | 'desc';

type PublicFile = GetPublicFilesResponse['files'][0];

const PublicFiles = () => {
  const { files, isLoading } = useGetPublicFiles();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [userFilter, setUserFilter] = useState("");
  const [fileIdFilter, setFileIdFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const getFileIcon = (mimetype: MimeType) => {
    if (mimetype.startsWith('image/')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (mimetype.startsWith('video/')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    } else if (mimetype === MimeType.APPLICATION_PDF) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  const handleDownload = async (file: PublicFile) => {
    await downloadFile(file._id, file.filename, file.mimetype);
  };

  const handleFileClick = (fileId: string) => {
    navigate(`/dashboard/file/${fileId}`);
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
    if (!files) return [];

    let filtered = files.filter((file: PublicFile) => {
      const matchesSearch = file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          file.uploadedBy.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterType === 'all' || getFileCategory(file.mimetype) === filterType;
      
      const matchesUser = !userFilter || 
                         file.uploadedBy.name.toLowerCase().includes(userFilter.toLowerCase());
                         
      const matchesFileId = !fileIdFilter || 
                           file._id.toLowerCase().includes(fileIdFilter.toLowerCase());

      return matchesSearch && matchesCategory && matchesUser && matchesFileId;
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
          aValue = a.uploadedBy.name.toLowerCase();
          bValue = b.uploadedBy.name.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [files, searchTerm, filterType, userFilter, fileIdFilter, sortField, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    if (!files) return { total: 0, images: 0, videos: 0, documents: 0, others: 0, totalSize: 0, totalDownloads: 0, uniqueUsers: 0 };

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const totalDownloads = files.reduce((sum, file) => sum + file.downloadCount, 0);
    const images = files.filter(file => getFileCategory(file.mimetype) === 'image').length;
    const videos = files.filter(file => getFileCategory(file.mimetype) === 'video').length;
    const documents = files.filter(file => getFileCategory(file.mimetype) === 'document').length;
    const others = files.length - images - videos - documents;
    const uniqueUsers = new Set(files.map(file => file.uploadedBy._id)).size;

    return {
      total: files.length,
      images,
      videos,
      documents,
      others,
      totalSize,
      totalDownloads,
      uniqueUsers
    };
  }, [files]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterType('all');
    setUserFilter("");
    setFileIdFilter("");
    setSortField('createdAt');
    setSortOrder('desc');
  };

  if (isLoading) return <Spinner />;

  if (!files) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Failed to load public files</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-2 md:p-6 bg-gradient-to-br from-base-100 to-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-base-content">Public Files</h1>
              <p className="text-base text-base-content/60 md:text-lg">Discover and access publicly shared files from the community</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4 mb-8">
          <div className="stat bg-base-100 rounded-lg shadow-lg p-3 md:p-4">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="stat-title text-xs">Total Files</div>
            <div className="stat-value text-sm md:text-lg text-primary">{stats.total}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg p-3 md:p-4">
            <div className="stat-figure text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-title text-xs">Images</div>
            <div className="stat-value text-sm md:text-lg text-green-500">{stats.images}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg p-3 md:p-4">
            <div className="stat-figure text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="stat-title text-xs">Videos</div>
            <div className="stat-value text-sm md:text-lg text-purple-500">{stats.videos}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg p-3 md:p-4">
            <div className="stat-figure text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="stat-title text-xs">Documents</div>
            <div className="stat-value text-sm md:text-lg text-red-500">{stats.documents}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg p-3 md:p-4">
            <div className="stat-figure text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="stat-title text-xs">Others</div>
            <div className="stat-value text-sm md:text-lg text-blue-500">{stats.others}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg p-3 md:p-4">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7c0 2.21-3.582 4-8 4s-8-1.79-8-4z" />
              </svg>
            </div>
            <div className="stat-title text-xs">Total Size</div>
            <div className="stat-value text-sm md:text-lg text-secondary">{formatFileSize(stats.totalSize)}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg p-3 md:p-4">
            <div className="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="stat-title text-xs">Downloads</div>
            <div className="stat-value text-sm md:text-lg text-info">{stats.totalDownloads}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg p-3 md:p-4">
            <div className="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="stat-title text-xs">Contributors</div>
            <div className="stat-value text-sm md:text-lg text-accent">{stats.uniqueUsers}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body p-4 md:p-6">
            <h3 className="card-title mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Search & Filter Public Files
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Search Files</span>
                </label>
                <input
                  type="text"
                  placeholder="Search by filename or uploader name..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">File Category</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as FilterType)}
                >
                  <option value="all">All Categories</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="document">Documents</option>
                  <option value="other">Others</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Filter by User</span>
                </label>
                <input
                  type="text"
                  placeholder="User name..."
                  className="input input-bordered w-full"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">File ID</span>
                </label>
                <input
                  type="text"
                  placeholder="Search by file ID..."
                  className="input input-bordered w-full"
                  value={fileIdFilter}
                  onChange={(e) => setFileIdFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-base-content/60">
                Showing {filteredAndSortedFiles.length} of {stats.total} public files
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Public Files ({filteredAndSortedFiles.length})
            </h2>

            {filteredAndSortedFiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-base-content mb-1">No public files found</h3>
                <p className="text-base-content/60">Try adjusting your search criteria or check back later</p>
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
                      <th className="bg-base-200 text-base-content font-semibold hidden sm:table-cell">Category</th>
                      <th className="bg-base-200 text-base-content font-semibold hidden lg:table-cell">
                        <button 
                          className="flex items-center gap-2 hover:text-primary"
                          onClick={() => handleSort('size')}
                        >
                          Size
                          {getSortIcon('size')}
                        </button>
                      </th>
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
                    {filteredAndSortedFiles.map((file: PublicFile) => (
                      <tr key={file._id} className="hover:bg-base-200/50 cursor-pointer" onClick={() => handleFileClick(file._id)}>
                        <td className="min-w-0">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.mimetype)}
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-base-content truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px] lg:max-w-[300px]" title={file.filename}>
                                {file.filename}
                              </div>
                              <div className="text-sm text-base-content/60 block md:hidden">
                                {file.uploadedBy.name}
                              </div>
                              <div className="text-sm text-base-content/60 block sm:hidden">
                                {getFileTypeLabel(file.mimetype)} • {formatFileSize(file.size)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell">
                          <div className="flex flex-col">
                            <div className="font-medium text-base-content">{file.uploadedBy.name}</div>
                            <div className="text-sm text-base-content/60">Community member</div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell">
                          <span className="badge badge-outline">
                            {getFileTypeLabel(file.mimetype)}
                          </span>
                        </td>
                        <td className="font-medium hidden lg:table-cell">{formatFileSize(file.size)}</td>
                        <td className="font-medium hidden lg:table-cell">{file.downloadCount}</td>
                        <td className="text-sm text-base-content/70 hidden md:table-cell">
                          {formatDate(new Date(file.createdAt))}
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1 lg:gap-2">
                            <button 
                              className="btn btn-xs lg:btn-sm btn-primary btn-outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFileClick(file._id);
                              }}
                              title="Preview"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span className="hidden lg:inline ml-1">Preview</span>
                            </button>
                            
                            <button 
                              className="btn btn-xs lg:btn-sm btn-secondary btn-outline hidden lg:flex"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(file);
                              }}
                              title="Download"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="hidden lg:inline ml-1">Download</span>
                            </button>
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
  );
};

export default PublicFiles;