import React, { useState, useRef } from 'react'
import { MimeType } from '../../types/enums/MimeType'
import useFileUpload from '../../hooks/useFileUpload'
import { useNavigate } from 'react-router'
import { formatFileSize } from '../../utils/formatFileSize'
import useGetFileIcon from '../../hooks/useGetFileIcon'

const UploadFile = () => {
  const navigate = useNavigate()
  const { fileUploadMutate, isPending } = useFileUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    filename: '',
    isPublic: false,
    file: null as File | null
  })
  const [isDragOver, setIsDragOver] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  // Allowed MIME types from the enum
  const allowedMimeTypes = Object.values(MimeType)
  
  const validateFile = (file: File): string[] => {
    const errors: string[] = []
    
    // Check MIME type
    if (!allowedMimeTypes.includes(file.type as MimeType)) {
      errors.push(`File type "${file.type}" is not supported. Allowed types: ${allowedMimeTypes.join(', ')}`)
    }
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      errors.push(`File size must be less than 5MB. Current file size: ${formatFileSize(file.size)}`)
    }
    
    return errors
  }

  const handleFileSelect = (file: File) => {
    const fileErrors = validateFile(file)
    
    if (fileErrors.length > 0) {
      setErrors(fileErrors)
      return
    }
    
    setErrors([])
    setFormData(prev => ({
      ...prev,
      file,
      filename: prev.filename || file.name.split('.').slice(0, -1).join('.') || file.name
    }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const submitErrors: string[] = []
    if (!formData.filename.trim()) {
      submitErrors.push('Filename is required')
    }
    if (!formData.file) {
      submitErrors.push('Please select a file to upload')
    }
    
    if (submitErrors.length > 0) {
      setErrors(submitErrors)
      return
    }
    
    // Create FormData for upload
    const uploadFormData = new FormData()
    uploadFormData.append('filename', formData.filename.trim())
    uploadFormData.append('isPublic', formData.isPublic.toString())
    if (formData.file) {
      uploadFormData.append('file', formData.file)
    }
    
    fileUploadMutate(uploadFormData, {
      onSuccess: () => {
        // Reset form
        setFormData({
          filename: '',
          isPublic: false,
          file: null
        })
        setErrors([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        navigate('/dashboard/my-files')
      }
    })
  }

  return (
    <div className="flex-1 p-6 bg-gradient-to-br from-base-100 to-base-200 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-base-content">Upload File</h1>
              <p className="text-base-content/60 text-lg">Share your files securely</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {errors.length > 0 && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-bold">Upload Error</h3>
                <ul className="list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* File Upload Area */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Select File
              </h2>
              
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragOver 
                    ? 'border-primary bg-primary/5' 
                    : 'border-base-300 hover:border-primary/50 hover:bg-base-200/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={allowedMimeTypes.join(',')}
                  onChange={handleFileInputChange}
                />
                
                {formData.file ? (
                  <div className="space-y-4">
                    {useGetFileIcon(formData.file.type)}
                    <div>
                      <p className="text-lg font-semibold text-base-content">{formData.file.name}</p>
                      <p className="text-sm text-base-content/60">
                        {formData.file.type} • {formatFileSize(formData.file.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFormData(prev => ({ ...prev, file: null }))
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div>
                      <p className="text-lg font-semibold text-base-content">
                        Drag and drop your file here
                      </p>
                      <p className="text-sm text-base-content/60">
                        or click to browse files
                      </p>
                    </div>
                    <div className="text-xs text-base-content/50">
                      <p>Supported formats: Images (JPEG, PNG, GIF, WebP), Videos (MP4, MOV, WebM), PDF, Text</p>
                      <p>Maximum file size: 5MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* File Metadata */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                File Details
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Filename</span>
                    <span className="label-text-alt text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="filename"
                    value={formData.filename}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Enter filename..."
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt text-base-content/60">
                      This will be the display name for your file
                    </span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Visibility</span>
                  </label>
                  <div className="space-y-2">
                    <label className="label cursor-pointer justify-start gap-3">
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleInputChange}
                        className="checkbox checkbox-primary"
                      />
                      <div>
                        <span className="label-text font-medium">Make this file public</span>
                        <p className="text-xs md:text-sm text-base-content/60 text-wrap">
                          Public files can be accessed by anyone with the link
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending || !formData.file || !formData.filename.trim()}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload File
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadFile