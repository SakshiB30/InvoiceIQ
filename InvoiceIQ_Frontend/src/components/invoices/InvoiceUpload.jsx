import { useRef, useState } from 'react'

function InvoiceUpload() {
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0]

    if (file) {
      setSelectedFile(file)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()

    const file = event.dataTransfer.files[0]

    if (file) {
      setSelectedFile(file)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleChooseFile = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div
  id="upload"
  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Upload Invoice
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Upload an invoice and let InvoiceIQ extract and analyze the data.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleChooseFile}
          className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-yellow-400 hover:bg-yellow-50"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-2xl">
            📄
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            Drop your invoice here
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            or click to browse from your computer
          </p>

          <p className="mt-3 text-xs text-slate-400">
            Supported formats: PDF, JPG, JPEG, PNG
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-yellow-100 text-xl">
                📄
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              className="shrink-0 text-sm font-medium text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-lg bg-yellow-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500"
          >
            Upload & Process Invoice
          </button>
        </div>
      )}
    </div>
  )
}

export default InvoiceUpload