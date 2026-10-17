import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  clearProcessingResult,
  uploadInvoice,
} from '../../redux/slices/invoiceSlice'

// Convert backend and Redux errors into readable messages.
const getReadableUploadError = (error) => {
  if (typeof error === 'string' && error.trim()) {
    return error
  }

  if (!error || typeof error !== 'object') {
    return 'Something went wrong while processing the invoice. Please try again.'
  }

  const data = error.response?.data ?? error

  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (typeof data === 'object' && data !== null) {
    const message =
      data.message ??
      data.error ??
      data.detail ??
      data.details ??
      data.title

    if (typeof message === 'string' && message.trim()) {
      return message
    }

    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors
        .map((item) =>
          typeof item === 'string'
            ? item
            : item?.message ?? JSON.stringify(item),
        )
        .join('; ')
    }
  }

  return 'Invoice processing failed. Please try again.'
}

function InvoiceUpload({ onUploadSuccess }) {
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)

  const {
    uploadLoading,
    uploadError,
    processingResult,
  } = useSelector((state) => state.invoices)

  const [selectedFile, setSelectedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState('')

  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
  ]

  const MAX_FILE_SIZE = 10 * 1024 * 1024

  const handleFile = (file) => {
    if (!file) {
      return
    }

    setFileError('')
    dispatch(clearProcessingResult())

    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setFileError(
        'Invalid file type. Please upload a PDF, JPG, or PNG file.',
      )

      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setFileError(
        'File is too large. Please upload an invoice smaller than 10 MB.',
      )

      return
    }

    setSelectedFile(file)
  }

  const handleInputChange = (event) => {
    const file = event.target.files?.[0]
    handleFile(file)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)

    if (uploadLoading) {
      return
    }

    const file = event.dataTransfer.files?.[0]
    handleFile(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()

    if (!uploadLoading) {
      setDragActive(true)
    }
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setDragActive(false)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setFileError('Please select an invoice first.')
      return
    }

    setFileError('')

    const result = await dispatch(
      uploadInvoice(selectedFile),
    )

    if (uploadInvoice.fulfilled.match(result)) {
      setSelectedFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      onUploadSuccess?.(result.payload)
    }
  }

  const handleRemoveFile = (event) => {
    event.stopPropagation()

    if (uploadLoading) {
      return
    }

    setSelectedFile(null)
    setFileError('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getFileTypeLabel = () => {
    if (!selectedFile) {
      return ''
    }

    if (selectedFile.type === 'application/pdf') {
      return 'PDF Document'
    }

    return 'Image Invoice'
  }

  const getFileIcon = () => {
    if (!selectedFile) {
      return '📄'
    }

    if (selectedFile.type === 'application/pdf') {
      return '📄'
    }

    return '🖼️'
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">
                Upload Invoice
              </h2>

              <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-[11px] font-semibold text-yellow-700">
                AI Powered
              </span>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Upload an invoice and let InvoiceIQ automatically
              extract, validate, categorize, and analyze the
              information.
            </p>
          </div>

          <div className="hidden rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 sm:block">
            <p className="text-xs font-semibold text-slate-700">
              Supported formats
            </p>

            <p className="mt-1 text-xs text-slate-500">
              PDF, JPG, PNG
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Maximum 10 MB
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="p-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (!uploadLoading) {
              fileInputRef.current?.click()
            }
          }}
          className={`group rounded-2xl border-2 border-dashed p-8 text-center transition sm:p-10 ${
            uploadLoading
              ? 'cursor-not-allowed border-slate-200 bg-slate-50'
              : dragActive
                ? 'cursor-pointer border-yellow-400 bg-yellow-50'
                : 'cursor-pointer border-slate-300 bg-slate-50/50 hover:border-yellow-400 hover:bg-yellow-50/40'
          }`}
        >
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-2xl shadow-sm transition ${
              uploadLoading
                ? 'bg-slate-100'
                : dragActive
                  ? 'bg-yellow-200'
                  : 'bg-white group-hover:bg-yellow-100'
            }`}
          >
            {uploadLoading ? '⏳' : dragActive ? '📥' : '📄'}
          </div>

          <h3 className="mt-5 text-sm font-semibold text-slate-900">
            {uploadLoading
              ? 'Processing your invoice...'
              : dragActive
                ? 'Drop your invoice here'
                : 'Drag & drop your invoice here'}
          </h3>

          {!uploadLoading && (
            <>
              <p className="mt-1 text-sm text-slate-500">
                or click anywhere here to browse files
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                {['PDF', 'JPG', 'PNG'].map((format) => (
                  <span
                    key={format}
                    className="rounded-md bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200"
                  >
                    {format}
                  </span>
                ))}

                <span className="text-xs text-slate-400">
                  Up to 10 MB
                </span>
              </div>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleInputChange}
            disabled={uploadLoading}
            className="hidden"
          />
        </div>

        {/* Selected File */}
        {selectedFile && !uploadLoading && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                  {getFileIcon()}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {selectedFile.name}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>

                    <span>•</span>

                    <span>{getFileTypeLabel()}</span>

                    <span className="font-medium text-green-600">
                      • Ready
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:self-auto"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* File Error */}
        {fileError && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm">
                ⚠️
              </div>

              <div>
                <p className="text-sm font-semibold text-red-700">
                  Unable to use this file
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {fileError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Backend Error */}
        {uploadError && !uploadLoading && (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm">
                ⚠️
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-red-700">
                  Invoice processing failed
                </p>

                <p className="mt-1 break-words text-xs leading-5 text-red-600">
                  {getReadableUploadError(uploadError)}
                </p>

                <p className="mt-2 text-xs text-red-500">
                  Your upload may not have been saved. Check the
                  invoice list before retrying to avoid creating
                  a duplicate.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Processing */}
        {uploadLoading && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-yellow-200 bg-yellow-50">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-yellow-100">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      AI is analyzing your invoice
                    </p>

                    <span className="rounded-full bg-yellow-200 px-2 py-0.5 text-[10px] font-semibold text-yellow-800">
                      IN PROGRESS
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    InvoiceIQ is extracting information and checking
                    the invoice before saving it.
                  </p>
                </div>
              </div>
            </div>

            {/* Processing Pipeline */}
            <div className="border-t border-yellow-200 bg-white/50 p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Processing pipeline
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                {/* Upload */}
                <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                      ✓
                    </span>

                    <div>
                      <p className="text-xs font-semibold text-green-700">
                        Upload
                      </p>

                      <p className="mt-0.5 text-[10px] text-green-600">
                        Completed
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Extraction */}
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-700">
                      ⟳
                    </span>

                    <div>
                      <p className="text-xs font-semibold text-yellow-700">
                        AI Extraction
                      </p>

                      <p className="mt-0.5 text-[10px] text-yellow-600">
                        In progress
                      </p>
                    </div>
                  </div>
                </div>

                {/* Validation */}
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-400">
                      3
                    </span>

                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Validation
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Next
                      </p>
                    </div>
                  </div>
                </div>

                {/* Duplicate Check */}
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-400">
                      4
                    </span>

                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Duplicate Check
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Next
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        {!uploadLoading && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-yellow-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-yellow-400 disabled:hover:shadow-sm"
          >
            <span className="text-base">✨</span>
            Upload & Analyze Invoice
          </button>
        )}

        {/* Success */}
        {processingResult && !uploadLoading && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-green-200 bg-green-50">
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-base font-bold text-green-700">
                  ✓
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-green-800">
                    Invoice processed successfully
                  </p>

                  <p className="mt-1 text-xs leading-5 text-green-700">
                    InvoiceIQ extracted the invoice information,
                    validated it, checked for duplicates, and added
                    the processed invoice to your account.
                  </p>
                </div>
              </div>

              {/* Processing Results */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {processingResult.validation && (
                  <div className="rounded-xl border border-green-200 bg-white/70 p-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                        ✓
                      </span>

                      <div>
                        <p className="text-xs font-semibold text-green-800">
                          Validation
                        </p>

                        <p className="mt-0.5 text-[11px] text-green-600">
                          {processingResult.validation.valid === false
                            ? 'Requires review'
                            : 'Completed successfully'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {processingResult.duplicate && (
                  <div className="rounded-xl border border-green-200 bg-white/70 p-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                        ✓
                      </span>

                      <div>
                        <p className="text-xs font-semibold text-green-800">
                          Duplicate Check
                        </p>

                        <p className="mt-0.5 text-[11px] text-green-600">
                          {processingResult.duplicate.potentialDuplicate
                            ? 'Possible duplicate found'
                            : 'No duplicate detected'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Duplicate Warning */}
              {processingResult.duplicate?.potentialDuplicate === true && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-base">⚠️</span>

                    <div>
                      <p className="text-xs font-semibold text-red-700">
                        Possible duplicate detected
                      </p>

                      <p className="mt-1 text-xs leading-5 text-red-600">
                        A similar invoice may already exist.
                        Review the invoice details before confirming it.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Validation Warning */}
              {processingResult.validation?.valid === false && (
                <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-base">⚠️</span>

                    <div>
                      <p className="text-xs font-semibold text-orange-700">
                        Validation requires review
                      </p>

                      {processingResult.validation.missingFields?.length > 0 && (
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-orange-600">
                          {processingResult.validation.missingFields.map(
                            (issue, index) => (
                              <li key={`${issue}-${index}`}>
                                {issue}
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Success Footer */}
            <div className="border-t border-green-200 bg-white/50 px-5 py-3">
              <p className="text-xs text-green-700">
                You can review the extracted invoice details before
                confirming the invoice.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InvoiceUpload