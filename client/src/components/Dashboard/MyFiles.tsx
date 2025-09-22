import useUserFiles from "../../hooks/useUserFiles"
import Spinner from "../common/Spinner";
import { useState } from "react";
import type { UpdateFileMetadataDTO, UserFile } from "../../types";
import useFileStats from "../../hooks/useFileStats";
import { Link, useNavigate } from "react-router";
import { formatFileSize } from "../../utils/formatFileSize";
import { getFileTypeLabel } from "../../utils/getFileTypeLabel";
import { formatDate } from "../../utils/formatDate";
import useFileDelete from "../../hooks/useFileDetete";
import useFileUpdate from "../../hooks/useFileUpdate";
import useGetFileIcon from "../../hooks/useGetFileIcon";

const MyFiles = () => {
  const { files, isPending } = useUserFiles();
  const navigate = useNavigate();

  const { stats, isLoading: statsLoading } = useFileStats(!!files && files.length > 0);

  const { fileDeleteMutate, isPending: deletePending } = useFileDelete();

  const { fileUpdateMutate, isPending: updatePending } = useFileUpdate();

  const [editFileModalData, setEditFileModalData] = useState<UpdateFileMetadataDTO>({
    filename: '',
    isPublic: false,
  });

  if (isPending || statsLoading) return <Spinner />;

  const handleFilePreview = (fileId: string) => {
    navigate(`/dashboard/file/${fileId}`);
  };

  const handleEdit = (fileId: string) => {
    console.log({ fileId, formData: editFileModalData });
    fileUpdateMutate({ fileId, formData: editFileModalData });
    setEditFileModalData({ filename: '', isPublic: false });
    (document?.getElementById('edit-file-modal') as HTMLDialogElement)?.close();
  };

  const handleDelete = (file: UserFile) => {
    // TODO: Implement delete functionality
    fileDeleteMutate(file._id);
  };

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
              <h1 className="text-4xl font-bold text-base-content">My Files</h1>
              <p className="text-base-content/60 text-lg">Manage your uploaded files</p>
            </div>
          </div>

          {/* Statistics */}
          {
            (stats && files && files.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="stat bg-base-100 rounded-lg shadow-lg">
                  <div className="stat-figure text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="stat-title">Total Files</div>
                  <div className="stat-value text-primary">{stats?.totalFiles || 0}</div>
                </div>

                <div className="stat bg-base-100 rounded-lg shadow-lg">
                  <div className="stat-figure text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7c0 2.21-3.582 4-8 4s-8-1.79-8-4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <div className="stat-title">Storage Used</div>
                  <div className="stat-value text-secondary">{formatFileSize(stats?.totalStorageUsed || 0)}</div>
                </div>

                <div className="stat bg-base-100 rounded-lg shadow-lg">
                  <div className="stat-figure text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="stat-title">Public Files</div>
                  <div className="stat-value text-accent">{stats?.totalPublicFiles || 0}</div>
                </div>

                <div className="stat bg-base-100 rounded-lg shadow-lg">
                  <div className="stat-figure text-info">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="stat-title">Total Downloads</div>
                  <div className="stat-value text-info">{stats?.totalDownloadCount || 0}</div>
                </div>
              </div>
            )
          }
        </div>

        {/* Files Section */}
        {!files || files.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center py-16">
              <div className="mx-auto w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-base-content mb-2">No files uploaded yet</h3>
              <p className="text-base-content/60 mb-6">Upload your first file to get started</p>
              <Link to="/dashboard/upload-file" className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload File
              </Link>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
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
                    {files.map((file: UserFile) => (
                      <tr key={file._id} className="hover:bg-base-200/50">
                        <td className="min-w-0">
                          <div className="flex items-center gap-3">
                            {useGetFileIcon(file.mimetype)}
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-xs md:text-base text-base-content truncate max-w-[150px] sm:max-w-[200px] md:max-w-[250px] lg:max-w-[300px]" title={file.filename}>
                                {file.filename}
                              </div>
                              <div className="text-sm text-base-content/60 block sm:hidden">
                                {getFileTypeLabel(file.mimetype)} • {formatFileSize(file.size)}
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
                              onClick={() => handleFilePreview(file._id)}
                              title="Preview"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 lg:h-4 lg:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span className="hidden lg:inline ml-1">Preview</span>
                            </button>
                            <div className="dropdown dropdown-end lg:hidden">
                              <div tabIndex={0} role="button" className="btn btn-xs btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                                </svg>
                              </div>
                              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow-xl border border-base-300">
                                <li>
                                  <button onClick={() => {
                                    setEditFileModalData({ filename: file.filename, isPublic: file.isPublic });
                                    (document?.getElementById('edit-file-modal') as HTMLDialogElement)?.showModal()
                                  }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Edit
                                  </button>
                                </li>
                                <li>
                                  <button onClick={() => (document?.getElementById('delete-file-modal') as HTMLDialogElement)?.showModal()} className="text-error">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                  </button>
                                </li>
                                <li className="border-t border-base-300 mt-2 pt-2">
                                  <div className="text-xs text-base-content/60 px-2 py-1 flex flex-col items-start">
                                    <div className="">
                                      <span>Visibility: </span>
                                      <span className={file.isPublic ? 'text-success' : 'text-warning'}>
                                        {file.isPublic ? 'Public' : 'Private'}
                                      </span>
                                    </div>
                                    <div className="mt-1">
                                      <span>Downloads: </span>
                                      <span>{file.downloadCount}</span>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                            <button
                              className="btn btn-xs lg:btn-sm btn-secondary btn-outline hidden lg:inline-flex"
                              onClick={() => {
                                setEditFileModalData({ filename: file.filename, isPublic: file.isPublic });
                                (document?.getElementById('edit-file-modal') as HTMLDialogElement)?.showModal()
                              }}
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <dialog id="edit-file-modal" className="modal">
                              <div className="modal-box">
                                <h3 className="font-bold text-lg">Edit File</h3>
                                <p className="py-2">Edit the metadata. Public files can be accessed and downloaded by anyone.</p>
                                <form className="flex flex-col mb-4">
                                  <fieldset className="fieldset">
                                    <legend className="fieldset-legend">File Name:</legend>
                                    <label className="input validator">
                                      <input type="text" placeholder="File Name" required value={editFileModalData.filename}
                                        onChange={(e) => setEditFileModalData((prev) => ({ ...prev, filename: e.target.value }))} />
                                    </label>
                                    <p className="validator-hint hidden">
                                      File name is required
                                    </p>
                                  </fieldset>
                                  <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
                                    <legend className="fieldset-legend">Privacy Settings</legend>
                                    <label className="label">
                                      <input type="checkbox" className="toggle toggle-primary" checked={editFileModalData.isPublic} onChange={(e) => setEditFileModalData({ ...editFileModalData, isPublic: e.target.checked })} />
                                      Public
                                    </label>
                                  </fieldset>
                                </form>
                                <div className="modal-action">
                                  <form method="dialog">
                                    <button className="btn" disabled={updatePending}>Close</button>
                                  </form>
                                  <button className="btn btn-info" onClick={() => handleEdit(file._id)} disabled={updatePending}>Save</button>
                                </div>
                              </div>
                            </dialog>
                            <button
                              className="btn btn-xs lg:btn-sm btn-error btn-outline hidden lg:inline-flex"
                              onClick={() => (document?.getElementById('delete-file-modal') as HTMLDialogElement)?.showModal()}
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <dialog id="delete-file-modal" className="modal">
                              <div className="modal-box">
                                <h3 className="font-bold text-lg">Delete File?</h3>
                                <p className="py-4">Are you sure you want to delete this file? This action cannot be undone.</p>
                                <div className="modal-action">
                                  <form method="dialog">
                                    {/* if there is a button in form, it will close the modal */}
                                    <button className="btn" disabled={deletePending}>Close</button>
                                  </form>
                                  <button className="btn btn-error" onClick={() => handleDelete(file)} disabled={deletePending}>Delete</button>
                                </div>
                              </div>
                            </dialog>
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
  );
}

export default MyFiles