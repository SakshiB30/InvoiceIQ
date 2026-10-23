import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  clearProcessingResult,
  uploadInvoice,
} from '../../redux/slices/invoiceSlice'

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

const MAX_FILE_SIZE = 10 * 1024 * 1024

const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
]

function Notice({ type = 'error', title, children }) {
  const styles = {
    error: {
      container: 'border-rose-400/20 bg-rose-400/5',
      icon: 'bg-rose-400/10 text-rose-300',
      title: 'text-rose-300',
      text: 'text-rose-200/80',
      symbol: '!',
    },
    warning: {
      container: 'border-amber-400/20 bg-amber-400/5',
      icon: 'bg-amber-400/10 text-amber-300',
      title: 'text-amber-200',
      text: 'text-amber-100/80',
      symbol: '!',
    },
    success: {
      container: 'border-emerald-400/20 bg-emerald-400/5',
      icon: 'bg-emerald-400/10 text-emerald-300',
      title: 'text-emerald-200',
      text: 'text-emerald-100/80',
      symbol: '✓',
    },
  }

  const style = styles[type] || styles.error

  return (
    <div
      role={type === 'success' ? 'status' : 'alert'}
      className={`rounded-xl border p-4 ${style.container}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${style.icon}`}
          aria-hidden="true"
        >
          {style.symbol}
        </span>

        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold ${style.title}`}>
            {title}
          </p>

          <div className={`mt-1 text-xs leading-5 ${style.text}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function PipelineStep({ number, title, description, state }) {
  const styles = {
    completed: {
      card: 'border-emerald-400/20 bg-emerald-400/5',
      icon: 'bg-emerald-400/10 text-emerald-300',
      title: 'text-emerald-200',
      description: 'text-emerald-300/70',
      symbol: '✓',
    },
    active: {
      card: 'border-indigo-400/30 bg-indigo-400/10',
      icon: 'bg-indigo-400/15 text-indigo-300',
      title: 'text-indigo-200',
      description: 'text-indigo-300/70',
      symbol: '↻',
    },
    pending: {
      card: 'border-[#263148] bg-[#0B0F19]/50',
      icon: 'bg-[#202A40] text-slate-500',
      title: 'text-slate-400',
      description: 'text-slate-500',
      symbol: number,
    },
  }

  const style = styles[state] || styles.pending

  return (
    <div className={`rounded-xl border p-3 ${style.card}`}>
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${style.icon}`}
          aria-hidden="true"
        >
          {style.symbol}
        </span>

        <div className="min-w-0">
          <p className={`text-xs font-semibold ${style.title}`}>
            {title}
          </p>

          <p className={`mt-0.5 text-[10px] ${style.description}`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  )
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

  const handleFile = (file) => {
    if (!file) {
      return
    }

    setFileError('')
    dispatch(clearProcessingResult())

    if (!ALLOWED_TYPES.includes(file.type)) {
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
    handleFile(event.target.files?.[0])
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)

    if (uploadLoading) {
      return
    }

    handleFile(event.dataTransfer.files?.[0])
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

    const result = await dispatch(uploadInvoice(selectedFile))

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

    return selectedFile.type === 'application/pdf'
      ? 'PDF document'
      : 'Image invoice'
  }

  const getFileIcon = () => {
    if (!selectedFile) {
      return '▤'
    }

    return selectedFile.type === 'application/pdf' ? 'PDF' : 'IMG'
  }

  return (
    <section
      id="upload"
      className="overflow-hidden rounded-2xl border border-[#263148] bg-[#151B2B] shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
    >
      {/* Section header */}
      <div className="border-b border-[#263148] px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-lg text-indigo-300">
                ↥
              </div>

              <h2 className="text-lg font-semibold tracking-tight text-slate-100">
                Upload invoice
              </h2>

              <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                AI powered
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Upload an invoice and let InvoiceIQ extract, validate,
              categorize, and analyze its information.
            </p>
          </div>

          <div className="rounded-xl border border-[#263148] bg-[#0F172A]/70 px-4 py-3 sm:min-w-36">
            <p className="text-xs font-semibold text-slate-300">
              Supported formats
            </p>

            <div className="mt-2 flex items-center gap-1.5">
              {['PDF', 'JPG', 'PNG'].map((format) => (
                <span
                  key={format}
                  className="rounded-md border border-[#334155] bg-[#151B2B] px-2 py-1 text-[10px] font-semibold text-slate-300"
                >
                  {format}
                </span>
              ))}
            </div>

            <p className="mt-2 text-[11px] text-slate-500">
              Maximum file size: 10 MB
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            if (!uploadLoading) {
              fileInputRef.current?.click()
            }
          }}
          className={`group relative overflow-hidden rounded-2xl border-2 border-dashed p-7 text-center transition duration-200 sm:p-10 ${
            uploadLoading
              ? 'cursor-not-allowed border-[#263148] bg-[#0F172A]/50 opacity-80'
              : dragActive
                ? 'cursor-copy border-indigo-400 bg-indigo-500/10'
                : 'cursor-pointer border-[#394765] bg-[#0F172A]/40 hover:border-indigo-400/60 hover:bg-indigo-500/[0.04]'
          }`}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-indigo-500/[0.025] to-transparent" />

          <div className="relative">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl transition duration-200 ${
                uploadLoading
                  ? 'border-[#334155] bg-[#1B2336] text-slate-400'
                  : dragActive
                    ? 'scale-105 border-indigo-400/40 bg-indigo-500/15 text-indigo-200'
                    : 'border-[#334155] bg-[#1B2336] text-indigo-300 group-hover:border-indigo-400/30 group-hover:bg-indigo-500/10'
              }`}
              aria-hidden="true"
            >
              {uploadLoading ? (
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-400/20 border-t-indigo-400" />
              ) : dragActive ? (
                '↓'
              ) : (
                '↥'
              )}
            </div>

            <h3 className="mt-5 text-sm font-semibold text-slate-100 sm:text-base">
              {uploadLoading
                ? 'Processing your invoice...'
                : dragActive
                  ? 'Drop your invoice here'
                  : 'Drag and drop your invoice here'}
            </h3>

            {!uploadLoading && (
              <>
                <p className="mt-2 text-sm text-slate-400">
                  Or{' '}
                  <span className="font-semibold text-indigo-300 underline decoration-indigo-400/40 underline-offset-4">
                    browse files
                  </span>{' '}
                  from your device.
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  PDF, JPG, or PNG · Up to 10 MB
                </p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleInputChange}
            disabled={uploadLoading}
            className="hidden"
            aria-label="Choose an invoice file"
          />
        </div>

        {/* Selected file */}
        {selectedFile && !uploadLoading && (
          <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/[0.04] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-xs font-bold text-indigo-300">
                  {getFileIcon()}
                </div>

                <div className="min-w-0">
                  <p
                    title={selectedFile.name}
                    className="truncate text-sm font-semibold text-slate-200"
                  >
                    {selectedFile.name}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>

                    <span aria-hidden="true">·</span>

                    <span>{getFileTypeLabel()}</span>

                    <span className="inline-flex items-center gap-1 font-medium text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Ready
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="self-start rounded-lg border border-[#394765] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-300 sm:self-auto"
              >
                Remove file
              </button>
            </div>
          </div>
        )}

        {/* File validation error */}
        {fileError && (
          <Notice type="error" title="Unable to use this file">
            {fileError}
          </Notice>
        )}

        {/* Backend upload error */}
        {uploadError && !uploadLoading && (
          <Notice type="error" title="Invoice processing failed">
            <p className="break-words">
              {getReadableUploadError(uploadError)}
            </p>

            <p className="mt-2 text-rose-300/70">
              Your upload may not have been saved. Check the invoice list
              before retrying to avoid creating a duplicate.
            </p>
          </Notice>
        )}

        {/* Processing state */}
        {uploadLoading && (
          <div className="overflow-hidden rounded-2xl border border-indigo-400/20 bg-indigo-500/[0.04]">
            <div className="flex items-start gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400/20 border-t-indigo-400" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-100">
                    AI is analyzing your invoice
                  </p>

                  <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                    In progress
                  </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Extracting information and checking the invoice before
                  saving it. Processing time depends on the document.
                </p>
              </div>
            </div>

            <div className="border-t border-[#263148] p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Processing pipeline
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <PipelineStep
                  number={1}
                  title="Upload"
                  description="Completed"
                  state="completed"
                />

                <PipelineStep
                  number={2}
                  title="AI extraction"
                  description="In progress"
                  state="active"
                />

                <PipelineStep
                  number={3}
                  title="Validation"
                  description="Next"
                  state="pending"
                />

                <PipelineStep
                  number={4}
                  title="Duplicate check"
                  description="Next"
                  state="pending"
                />
              </div>
            </div>
          </div>
        )}

        {/* Upload action */}
        {!uploadLoading && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile}
            className="iq-primary-button flex w-full justify-center rounded-xl py-3.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            <span aria-hidden="true">✧</span>
            Upload and analyze invoice
            <span aria-hidden="true">→</span>
          </button>
        )}

        {/* Processing result */}
        {processingResult && !uploadLoading && (
          <div className="space-y-4">
            <Notice type="success" title="Invoice processed successfully">
              InvoiceIQ has processed your invoice. Review the extracted
              information and validation results before confirming it.
            </Notice>

            {/* Result summaries */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {processingResult.validation && (
                <div className="rounded-xl border border-[#263148] bg-[#0F172A]/60 p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        processingResult.validation.valid === false
                          ? 'bg-amber-400/10 text-amber-300'
                          : 'bg-emerald-400/10 text-emerald-300'
                      }`}
                    >
                      {processingResult.validation.valid === false ? '!' : '✓'}
                    </span>

                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        Validation
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {processingResult.validation.valid === false
                          ? 'Requires review'
                          : 'Completed successfully'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {processingResult.duplicate && (
                <div className="rounded-xl border border-[#263148] bg-[#0F172A]/60 p-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        processingResult.duplicate.potentialDuplicate
                          ? 'bg-amber-400/10 text-amber-300'
                          : 'bg-emerald-400/10 text-emerald-300'
                      }`}
                    >
                      {processingResult.duplicate.potentialDuplicate ? '!' : '✓'}
                    </span>

                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        Duplicate check
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {processingResult.duplicate.potentialDuplicate
                          ? 'Possible duplicate found'
                          : 'No duplicate detected'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Duplicate warning */}
            {processingResult.duplicate?.potentialDuplicate === true && (
              <Notice type="warning" title="Possible duplicate detected">
                A similar invoice may already exist. Review the invoice
                details before confirming it.
              </Notice>
            )}

            {/* Validation warning */}
            {processingResult.validation?.valid === false && (
              <Notice type="warning" title="Validation requires review">
                {processingResult.validation.missingFields?.length > 0 ? (
                  <ul className="list-disc space-y-1 pl-5">
                    {processingResult.validation.missingFields.map(
                      (issue, index) => (
                        <li key={`${issue}-${index}`}>{issue}</li>
                      ),
                    )}
                  </ul>
                ) : (
                  <p>
                    Please review the invoice details and resolve any
                    validation issues before confirming the invoice.
                  </p>
                )}
              </Notice>
            )}

            <p className="text-xs leading-5 text-slate-500">
              You can review the extracted invoice details before confirming
              the invoice.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default InvoiceUpload
