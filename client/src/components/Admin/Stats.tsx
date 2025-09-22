import useStorageStats from "../../hooks/admin/useStorageStats"
import Spinner from "../common/Spinner";
import { formatFileSize } from "../../utils/formatFileSize";

const Stats = () => {
  const { storageStats, isLoading } = useStorageStats();

  if (isLoading) return <Spinner />;

  if (!storageStats) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Failed to load storage statistics</span>
        </div>
      </div>
    );
  }

  const efficiencyPercentage = storageStats.totalLogicalSize > 0 
    ? ((storageStats.storageSaved / storageStats.totalLogicalSize) * 100).toFixed(1)
    : "0";

  const duplicateRatio = storageStats.uniqueFilesStored > 0 
    ? (storageStats.totalFilesUploaded / storageStats.uniqueFilesStored).toFixed(1)
    : "1";

  return (
    <div className="flex-1 p-6 bg-gradient-to-br from-base-100 to-base-200 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-base-content">Storage Statistics</h1>
              <p className="text-base-content/60 text-lg">Application-wide storage analytics and insights</p>
            </div>
          </div>
        </div>

        {/* Storage Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7c0 2.21-3.582 4-8 4s-8-1.79-8-4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <div className="stat-title">Total Logical Storage</div>
            <div className="stat-value text-primary text-2xl">{formatFileSize(storageStats.totalLogicalSize)}</div>
            <div className="stat-desc">All uploaded file sizes combined</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
              </svg>
            </div>
            <div className="stat-title">Actual Physical Storage</div>
            <div className="stat-value text-secondary text-2xl">{formatFileSize(storageStats.totalPhysicalSize)}</div>
            <div className="stat-desc">Deduplicated storage usage</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-title">Storage Saved</div>
            <div className="stat-value text-success text-2xl">{formatFileSize(storageStats.storageSaved)}</div>
            <div className="stat-desc">{efficiencyPercentage}% efficiency via deduplication</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-lg">
            <div className="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-info text-2xl">{storageStats.totalUsers}</div>
            <div className="stat-desc">Registered platform users</div>
          </div>
        </div>

        {/* File Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* File Upload Metrics */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                File Upload Metrics
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="stat">
                  <div className="stat-title text-sm">Total Uploads</div>
                  <div className="stat-value text-primary text-3xl">{storageStats.totalFilesUploaded.toLocaleString()}</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title text-sm">Unique Files</div>
                  <div className="stat-value text-secondary text-3xl">{storageStats.uniqueFilesStored.toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-base-200/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-base-content/70">Duplicate Ratio</span>
                  <span className="text-lg font-bold">{duplicateRatio}:1</span>
                </div>
                <progress 
                  className="progress progress-warning w-full mt-2" 
                  value={storageStats.totalFilesUploaded - storageStats.uniqueFilesStored} 
                  max={storageStats.totalFilesUploaded}
                ></progress>
                <p className="text-xs text-base-content/60 mt-1">
                  {((storageStats.totalFilesUploaded - storageStats.uniqueFilesStored) / storageStats.totalFilesUploaded * 100).toFixed(1)}% of uploads are duplicates
                </p>
              </div>
            </div>
          </div>

          {/* Storage Efficiency */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Storage Efficiency
              </h2>
              
              <div className="space-y-4">
                <div className="stat">
                  <div className="stat-title text-sm">Efficiency Rate</div>
                  <div className="stat-value text-success text-3xl">{efficiencyPercentage}%</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Logical Storage</span>
                    <span className="font-medium">{formatFileSize(storageStats.totalLogicalSize)}</span>
                  </div>
                  <progress 
                    className="progress progress-primary w-full" 
                    value={storageStats.totalLogicalSize} 
                    max={storageStats.totalLogicalSize}
                  ></progress>
                  
                  <div className="flex justify-between text-sm">
                    <span>Physical Storage</span>
                    <span className="font-medium">{formatFileSize(storageStats.totalPhysicalSize)}</span>
                  </div>
                  <progress 
                    className="progress progress-secondary w-full" 
                    value={storageStats.totalPhysicalSize} 
                    max={storageStats.totalLogicalSize}
                  ></progress>

                  <div className="flex justify-between text-sm font-medium text-success">
                    <span>Storage Saved</span>
                    <span>{formatFileSize(storageStats.storageSaved)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Duplicated File */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Most Duplicated File
              </h2>
              
              {storageStats.mostDuplicatedFile ? (
                <div className="space-y-4">
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-warning/20 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-base-content truncate" title={storageStats.mostDuplicatedFile.publicId}>
                          File ID: {storageStats.mostDuplicatedFile.publicId}
                        </p>
                        <p className="text-sm text-base-content/60">
                          Uploaded {storageStats.mostDuplicatedFile.count} times
                        </p>
                      </div>
                    </div>
                    
                    <div className="stats stats-horizontal bg-transparent">
                      <div className="stat">
                        <div className="stat-title text-xs">Duplicate Count</div>
                        <div className="stat-value text-warning text-2xl">{storageStats.mostDuplicatedFile.count}</div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-outline btn-sm w-full"
                    onClick={() => window.open(storageStats.mostDuplicatedFile!.url, '_blank')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View File
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-base-content mb-1">No duplicates found</h3>
                  <p className="text-base-content/60">All files are unique</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Uploader */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Top Uploader
              </h2>
              
              {storageStats.topUploader ? (
                <div className="space-y-4">
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-success/20 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-base-content truncate" title={storageStats.topUploader.userId}>
                          User ID: {storageStats.topUploader.userId}
                        </p>
                        <p className="text-sm text-base-content/60">
                          Most active uploader
                        </p>
                      </div>
                    </div>
                    
                    <div className="stats stats-horizontal bg-transparent">
                      <div className="stat">
                        <div className="stat-title text-xs">Total Uploads</div>
                        <div className="stat-value text-success text-2xl">{storageStats.topUploader.uploads}</div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-outline btn-sm w-full"
                    onClick={() => window.location.href = `/dashboard/admin/users/${storageStats.topUploader!.userId}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    View User Profile
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-base-content mb-1">No uploads yet</h3>
                  <p className="text-base-content/60">No files have been uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats