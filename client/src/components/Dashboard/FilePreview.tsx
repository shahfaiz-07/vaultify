import { useParams, useNavigate } from 'react-router';
import { useEffect } from 'react';
import useGetFileById from '../../hooks/useGetFileById';
import Spinner from '../common/Spinner';
import { downloadFile } from '../../lib/api';
import { formatFileSize } from '../../utils/formatFileSize';
import { formatDate } from '../../utils/formatDate';
import { getFileTypeLabel } from '../../utils/getFileTypeLabel';
import { MimeType } from '../../types/enums/MimeType';
import type { ApiError, GetFileByIdResponse } from '../../types';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import useGetFileIcon from '../../hooks/useGetFileIcon';

type FileWithUrl = GetFileByIdResponse['file'] & {
  url: string;
};

const FilePreview = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { file, isLoading, isError, error } = useGetFileById(fileId || '');

  useEffect(() => {
    if (isError && error) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data.message || 'Failed to load file');
      navigate('/dashboard');
    }
  }, [isError, error, navigate]);

  const handleDownload = async () => {
    if (file) {
      await downloadFile(file._id, file.filename, file.mimetype);
      queryClient.invalidateQueries({ queryKey: ['file', file._id] });
    }
  };

  const renderFilePreview = () => {
    if (!file) return null;

    const typedFile = file as FileWithUrl;
    const { mimetype, url, filename } = typedFile;

    if (mimetype.startsWith('image/')) {
      return (
        <div className="flex justify-center">
          <img
            src={url}
            alt={filename}
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
          />
        </div>
      );
    } else if (mimetype.startsWith('video/')) {
      return (
        <div className="flex justify-center">
          <video
            controls
            className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
          >
            <source src={url} type={mimetype} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (mimetype === MimeType.APPLICATION_PDF) {
      return (
        <div className="w-full h-[70vh] border rounded-lg shadow-lg">
          <iframe
            src={url}
            className="w-full h-full rounded-lg"
            title={filename}
          />
        </div>
      );
    } else if (mimetype === MimeType.TEXT_PLAIN) {
      return (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-content/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-base-content mb-2">Text File</h3>
                <p className="text-base-content/60 mb-4">This text file cannot be previewed directly.</p>
                <button className="btn btn-primary" onClick={handleDownload}>
                  Download to View
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-content/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-base-content mb-2">File Preview Not Available</h3>
                <p className="text-base-content/60 mb-4">This file type cannot be previewed in the browser.</p>
                <button className="btn btn-primary" onClick={handleDownload}>
                  Download File
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  if (isLoading) return <Spinner />;

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>File not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-3 md:p-6 bg-gradient-to-br from-base-100 to-base-200 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-circle btn-ghost btn-sm md:btn-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              {useGetFileIcon(file.mimetype)}
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-base-content">{file.filename}</h1>
                <p className="text-sm md:text-base text-base-content/60">{getFileTypeLabel(file.mimetype)} • {formatFileSize(file.size)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* File Preview */}
          <div className="xl:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-4 md:p-6">
                <h2 className="card-title mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  File Preview
                </h2>
                {renderFilePreview()}
              </div>
            </div>
          </div>

          {/* File Information */}
          <div className="space-y-6">
            {/* File Details */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  File Details
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-base-300">
                    <span className="font-medium text-base-content/70">File ID:</span>
                    <span className="text-sm font-mono bg-base-200 px-2 py-1 rounded text-base-content">
                      {file._id}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-base-300">
                    <span className="font-medium text-base-content/70">Type:</span>
                    <span className="badge badge-outline">{getFileTypeLabel(file.mimetype)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-base-300">
                    <span className="font-medium text-base-content/70">Size:</span>
                    <span className="font-semibold text-base-content">{formatFileSize(file.size)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-base-300">
                    <span className="font-medium text-base-content/70">Downloads:</span>
                    <span className="font-semibold text-base-content">{file.downloadCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-base-300">
                    <span className="font-medium text-base-content/70">Visibility:</span>
                    <span className={`badge ${file.isPublic ? 'badge-success' : 'badge-warning'}`}>
                      {file.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-base-300">
                    <span className="font-medium text-base-content/70">Uploaded:</span>
                    <span className="text-base-content">{formatDate(new Date(file.createdAt))}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-base-content/70">Modified:</span>
                    <span className="text-base-content">{formatDate(new Date(file.updatedAt))}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploader Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Uploaded By
                </h3>
                
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-semibold text-base-content">{file.uploadedBy.name}</div>
                    <div className="text-sm text-base-content/60">File contributor</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  Actions
                </h3>
                
                <div className="space-y-3">
                  <button 
                    className="btn btn-primary btn-block"
                    onClick={handleDownload}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download File
                  </button>
                  
                  <button 
                    className="btn btn-secondary btn-outline btn-block"
                    onClick={() => navigator.share ? navigator.share({ url: window.location.href, title: file.filename }) : navigator.clipboard.writeText(window.location.href)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;