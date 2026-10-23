import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import {
  clearSelectedInvoice,
  confirmInvoice,
  deleteInvoice,
  fetchInvoiceById,
  revalidateInvoice,
  updateInvoice,
} from '../../redux/slices/invoiceSlice'

const InvoiceDetails = ({ invoiceId: propInvoiceId, onClose }) => {
  const { id: routeInvoiceId } = useParams()
  const invoiceId = propInvoiceId || routeInvoiceId

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    selectedInvoice,
    invoiceDetailsLoading,
    invoiceDetailsError,
    updateLoading,
    updateError,
    revalidateLoading,
    revalidateError,
  } = useSelector((state) => state.invoices)

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const [editForm, setEditForm] = useState({
    invoiceNumber: '',
    vendorName: '',
    invoiceDate: '',
    dueDate: '',
    category: '',
    subtotal: '',
    tax: '',
    totalAmount: '',
    items: [],
  })

  useEffect(() => {
    if (!invoiceId) return

    dispatch(fetchInvoiceById(invoiceId))

    return () => {
      dispatch(clearSelectedInvoice())
    }
  }, [dispatch, invoiceId])

  useEffect(() => {
    if (!selectedInvoice) return

    setEditForm(createEditForm(selectedInvoice))
  }, [selectedInvoice])

  const handleEditChange = (event) => {
    const { name, value } = event.target

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleItemChange = (index, field, value) => {
    setEditForm((previous) => {
      const updatedItems = [...previous.items]

      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      }

      return {
        ...previous,
        items: updatedItems,
      }
    })
  }

  const handleAddItem = () => {
    setEditForm((previous) => ({
      ...previous,
      items: [
        ...previous.items,
        {
          description: '',
          quantity: '',
          unitPrice: '',
          amount: '',
        },
      ],
    }))
  }

  const handleRemoveItem = (index) => {
    setEditForm((previous) => ({
      ...previous,
      items: previous.items.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }))
  }

  const handleStartEdit = () => {
    setEditError('')
    setDeleteError('')
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    if (selectedInvoice) {
      setEditForm(createEditForm(selectedInvoice))
    }

    setEditError('')
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    setEditError('')

    if (!editForm.invoiceNumber.trim()) {
      setEditError('Invoice number is required.')
      return
    }

    if (!editForm.vendorName.trim()) {
      setEditError('Vendor name is required.')
      return
    }

    if (!editForm.invoiceDate) {
      setEditError('Invoice date is required.')
      return
    }

    if (editForm.totalAmount === '') {
      setEditError('Total amount is required.')
      return
    }

    const numericFields = [
      ['Subtotal', editForm.subtotal],
      ['Tax', editForm.tax],
      ['Total amount', editForm.totalAmount],
    ]

    for (const [label, value] of numericFields) {
      if (
        value !== '' &&
        (!Number.isFinite(Number(value)) || Number(value) < 0)
      ) {
        setEditError(`${label} must be a valid non-negative number.`)
        return
      }
    }

    for (const [index, item] of editForm.items.entries()) {
      const numericItemFields = [
        ['Quantity', item.quantity],
        ['Unit price', item.unitPrice],
        ['Item amount', item.amount],
      ]

      for (const [label, value] of numericItemFields) {
        if (
          value !== '' &&
          (!Number.isFinite(Number(value)) || Number(value) < 0)
        ) {
          setEditError(
            `${label} for item ${index + 1} must be a valid non-negative number.`,
          )
          return
        }
      }
    }

    const cleanedItems = editForm.items.map((item) => ({
      description: item.description,
      quantity: item.quantity === '' ? 0 : Number(item.quantity),
      unitPrice: item.unitPrice === '' ? 0 : Number(item.unitPrice),
      amount: item.amount === '' ? 0 : Number(item.amount),
    }))

    const invoiceData = {
      ...selectedInvoice,
      invoiceNumber: editForm.invoiceNumber.trim(),
      vendor: {
        ...(selectedInvoice?.vendor || {}),
        name: editForm.vendorName.trim(),
      },
      invoiceDate: editForm.invoiceDate,
      dueDate: editForm.dueDate || null,
      category: editForm.category || '',
      subtotal: editForm.subtotal === '' ? 0 : Number(editForm.subtotal),
      tax: editForm.tax === '' ? 0 : Number(editForm.tax),
      totalAmount: Number(editForm.totalAmount),
      items: cleanedItems,
    }

    setEditLoading(true)

    try {
      await dispatch(
        updateInvoice({
          id: invoiceId,
          invoiceData,
        }),
      ).unwrap()

      await dispatch(fetchInvoiceById(invoiceId)).unwrap()
      setIsEditing(false)
    } catch (error) {
      setEditError(
        typeof error === 'string'
          ? error
          : 'Failed to update invoice. Please try again.',
      )
    } finally {
      setEditLoading(false)
    }
  }

  const handleRevalidate = async () => {
    setDeleteError('')

    try {
      await dispatch(revalidateInvoice(invoiceId)).unwrap()
      await dispatch(fetchInvoiceById(invoiceId)).unwrap()
    } catch {
      // Redux stores the re-validation error.
    }
  }

  const handleOpenConfirm = () => {
    if (selectedInvoice?.validation?.valid !== true) return
    setShowConfirmDialog(true)
  }

  const handleConfirm = async () => {
    setConfirmLoading(true)

    try {
      await dispatch(confirmInvoice(invoiceId)).unwrap()
      await dispatch(fetchInvoiceById(invoiceId)).unwrap()
      setShowConfirmDialog(false)
    } catch {
      // Redux stores the confirmation error.
    } finally {
      setConfirmLoading(false)
    }
  }

  const handleDelete = async () => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this invoice? This action cannot be undone.',
    )

    if (!shouldDelete) return

    setDeleteError('')
    setDeleteLoading(true)

    try {
      await dispatch(deleteInvoice(invoiceId)).unwrap()
      handleClose()
    } catch (error) {
      setDeleteError(
        typeof error === 'string'
          ? error
          : 'Failed to delete invoice. Please try again.',
      )
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleClose = () => {
    dispatch(clearSelectedInvoice())

    if (onClose) {
      onClose()
      return
    }

    navigate(-1)
  }

  const isCompleted =
    selectedInvoice?.processingStatus === 'COMPLETED'

  const hasValidation = Boolean(selectedInvoice?.validation)

  const validationPassed =
    selectedInvoice?.validation?.valid === true

  const canConfirm = !isCompleted && validationPassed

  const sourceDocument = selectedInvoice?.sourceDocument
  const fileName = sourceDocument?.fileName || 'Original invoice'
  const fileType = sourceDocument?.fileType || ''
  const storageUrl = sourceDocument?.storageUrl || ''

  const normalizedFileType = fileType.toLowerCase()
  const normalizedFileName = fileName.toLowerCase()

  const isPdf =
    normalizedFileType.includes('pdf') ||
    normalizedFileName.endsWith('.pdf')

  const isImage =
    normalizedFileType.includes('image') ||
    normalizedFileType.includes('jpg') ||
    normalizedFileType.includes('jpeg') ||
    normalizedFileType.includes('png') ||
    normalizedFileType.includes('webp') ||
    /\.(jpg|jpeg|png|webp)$/i.test(fileName)

  const calculatedItemsTotal = useMemo(() => {
    if (!Array.isArray(selectedInvoice?.items)) return 0

    return selectedInvoice.items.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    )
  }, [selectedInvoice])

  const validationIssues =
    selectedInvoice?.validation?.missingFields || []

  if (!invoiceId) return null

  if (invoiceDetailsLoading && !selectedInvoice) {
    return (
      <FullScreenState
        icon={<Spinner />}
        title="Loading invoice..."
        description="Please wait while your invoice details load."
      />
    )
  }

  if (invoiceDetailsError) {
    return (
      <FullScreenState
        icon="!"
        title="Invoice could not be loaded"
        description={
          typeof invoiceDetailsError === 'string'
            ? invoiceDetailsError
            : 'The invoice could not be loaded.'
        }
        action={
          <button
            type="button"
            onClick={handleClose}
            className="iq-primary-button"
          >
            ← Back
          </button>
        }
        danger
      />
    )
  }

  if (!selectedInvoice) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#080B14]/90 backdrop-blur-md">
      <div className="min-h-full p-3 sm:p-5 lg:p-8">
        <div className="mx-auto max-w-[1500px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0F19] shadow-2xl shadow-black/30">
          {/* Header */}
          <header className="border-b border-white/[0.08] bg-[#0F172A]/90 px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  title="Back"
                  className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-white"
                >
                  ←
                </button>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
                        InvoiceIQ / Documents
                      </p>
                      <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
                        Invoice Details
                      </h1>
                    </div>

                    <StatusPill status={selectedInvoice.processingStatus} />
                  </div>

                  <p className="mt-2 break-all text-sm text-slate-400">
                    {selectedInvoice.invoiceNumber || 'Invoice'}
                    <span className="mx-2 text-slate-600">•</span>
                    {selectedInvoice.vendor?.name || 'Unknown vendor'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {!isEditing && !isCompleted && (
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="iq-secondary-button"
                  >
                    ✎ Edit Invoice
                  </button>
                )}

                {!isEditing && !isCompleted && (
                  <button
                    type="button"
                    onClick={handleRevalidate}
                    disabled={revalidateLoading}
                    className="iq-secondary-button border-indigo-400/20 text-indigo-300 hover:bg-indigo-500/10"
                  >
                    {revalidateLoading ? <Spinner /> : '✓'}{' '}
                    {revalidateLoading ? 'Validating...' : 'Re-validate'}
                  </button>
                )}

                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleOpenConfirm}
                    disabled={!canConfirm}
                    className="iq-primary-button"
                    title={
                      !validationPassed
                        ? 'Validate the invoice successfully before confirming.'
                        : ''
                    }
                  >
                    ✓ Confirm Invoice
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/[0.08] px-4 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/[0.16] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleteLoading ? <Spinner /> : '⌫'}{' '}
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="grid min-w-0 gap-5 p-3 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,440px)]">
            <main className="min-w-0 space-y-5">
              {isEditing && (
                <Notice
                  tone="warning"
                  title="Editing invoice"
                  description="Saving changes clears the existing validation result. Re-validate the invoice before confirming it."
                />
              )}

              {!isEditing && !isCompleted && !hasValidation && (
                <Notice
                  tone="warning"
                  title="Validation required"
                  description="This invoice must pass validation before it can be confirmed."
                />
              )}

              {updateError && (
                <ErrorMessage message={updateError} />
              )}

              {editError && <ErrorMessage message={editError} />}

              {revalidateError && (
                <ErrorMessage message={revalidateError} />
              )}

              {deleteError && (
                <ErrorMessage message={deleteError} />
              )}

              {/* Invoice information */}
              <section className="iq-card overflow-hidden">
                <SectionHeader
                  title="Invoice Information"
                  description="Basic invoice and vendor details"
                  icon="▤"
                />

                <div className="grid gap-5 p-5 sm:grid-cols-2">
                  <Field
                    label="Invoice Number"
                    value={editForm.invoiceNumber}
                    editing={isEditing}
                    name="invoiceNumber"
                    onChange={handleEditChange}
                  />

                  <Field
                    label="Vendor"
                    value={editForm.vendorName}
                    editing={isEditing}
                    name="vendorName"
                    onChange={handleEditChange}
                  />

                  <Field
                    label="Invoice Date"
                    value={editForm.invoiceDate}
                    editing={isEditing}
                    name="invoiceDate"
                    type="date"
                    onChange={handleEditChange}
                  />

                  <Field
                    label="Due Date"
                    value={editForm.dueDate}
                    editing={isEditing}
                    name="dueDate"
                    type="date"
                    onChange={handleEditChange}
                  />

                  <Field
                    label="Category"
                    value={editForm.category}
                    editing={isEditing}
                    name="category"
                    onChange={handleEditChange}
                  />

                  <div>
                    <p className="iq-label">GSTIN</p>
                    <p className="break-all text-sm font-medium text-slate-300">
                      {selectedInvoice.vendor?.gstin || 'Not available'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Items */}
              <section className="iq-card min-w-0 overflow-hidden">
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
                  <SectionHeader
                    title="Invoice Items"
                    description="Products or services included in this invoice"
                    icon="▦"
                    border={false}
                  />

                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="shrink-0 rounded-lg border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/20"
                    >
                      + Add Item
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left">
                    <thead className="bg-white/[0.025]">
                      <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                        <th className="px-5 py-3 font-semibold">Description</th>
                        <th className="px-5 py-3 font-semibold">Qty</th>
                        <th className="px-5 py-3 font-semibold">Unit Price</th>
                        <th className="px-5 py-3 font-semibold">Amount</th>
                        {isEditing && <th className="px-5 py-3" />}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/[0.06]">
                      {isEditing ? (
                        editForm.items.length > 0 ? (
                          editForm.items.map((item, index) => (
                            <tr key={index} className="align-top">
                              <td className="px-5 py-3">
                                <input
                                  value={item.description}
                                  onChange={(event) =>
                                    handleItemChange(
                                      index,
                                      'description',
                                      event.target.value,
                                    )
                                  }
                                  className="iq-input min-w-40"
                                  placeholder="Item description"
                                />
                              </td>

                              <td className="px-5 py-3">
                                <input
                                  type="number"
                                  min="0"
                                  value={item.quantity}
                                  onChange={(event) =>
                                    handleItemChange(
                                      index,
                                      'quantity',
                                      event.target.value,
                                    )
                                  }
                                  className="iq-input w-24"
                                />
                              </td>

                              <td className="px-5 py-3">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.unitPrice}
                                  onChange={(event) =>
                                    handleItemChange(
                                      index,
                                      'unitPrice',
                                      event.target.value,
                                    )
                                  }
                                  className="iq-input w-28"
                                />
                              </td>

                              <td className="px-5 py-3">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.amount}
                                  onChange={(event) =>
                                    handleItemChange(
                                      index,
                                      'amount',
                                      event.target.value,
                                    )
                                  }
                                  className="iq-input w-28"
                                />
                              </td>

                              <td className="px-5 py-3">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(index)}
                                  className="text-xs font-medium text-rose-300 transition hover:text-rose-200"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <EmptyTableRow
                            colSpan={5}
                            text="No items added yet."
                          />
                        )
                      ) : selectedInvoice.items?.length > 0 ? (
                        selectedInvoice.items.map((item, index) => (
                          <tr key={index} className="transition hover:bg-white/[0.02]">
                            <td className="px-5 py-4 text-sm text-slate-300">
                              {item.description || 'Unnamed item'}
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-400">
                              {item.quantity ?? '-'}
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-400">
                              {formatCurrency(item.unitPrice)}
                            </td>
                            <td className="px-5 py-4 text-sm font-semibold text-slate-200">
                              {formatCurrency(item.amount)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <EmptyTableRow
                          colSpan={4}
                          text="No invoice items available."
                        />
                      )}
                    </tbody>
                  </table>
                </div>

                {!isEditing && selectedInvoice.items?.length > 0 && (
                  <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3">
                    <span className="text-xs text-slate-500">
                      Items total
                    </span>
                    <span className="text-sm font-semibold text-slate-200">
                      {formatCurrency(calculatedItemsTotal)}
                    </span>
                  </div>
                )}
              </section>

              {/* Amount summary */}
              <section className="iq-card overflow-hidden">
                <SectionHeader
                  title="Amount Summary"
                  description="Invoice totals and tax breakdown"
                  icon="₹"
                />

                <div className="grid gap-3 p-5 sm:grid-cols-3">
                  <AmountField
                    label="Subtotal"
                    name="subtotal"
                    value={editForm.subtotal}
                    editing={isEditing}
                    onChange={handleEditChange}
                  />

                  <AmountField
                    label="Tax"
                    name="tax"
                    value={editForm.tax}
                    editing={isEditing}
                    onChange={handleEditChange}
                  />

                  <AmountField
                    label="Total Amount"
                    name="totalAmount"
                    value={editForm.totalAmount}
                    editing={isEditing}
                    onChange={handleEditChange}
                    highlighted
                  />
                </div>
              </section>

              {/* Validation */}
              <section
                className={`iq-card overflow-hidden ${
                  hasValidation
                    ? validationPassed
                      ? 'border-emerald-400/20'
                      : 'border-rose-400/20'
                    : ''
                }`}
              >
                <SectionHeader
                  title="Validation Result"
                  description="Invoice consistency and data-quality checks"
                  icon="✓"
                  action={
                    hasValidation && (
                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          validationPassed
                            ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                            : 'border-rose-400/20 bg-rose-400/10 text-rose-300'
                        }`}
                      >
                        {validationPassed ? '✓ Invoice Valid' : '✕ Issues Found'}
                      </span>
                    )
                  }
                />

                <div className="p-5">
                  {!hasValidation ? (
                    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-7 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-xl text-indigo-300">
                        ◉
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-200">
                        Invoice has not been validated
                      </p>
                      <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                        Check required fields, invoice totals, item calculations,
                        and date consistency before confirming.
                      </p>

                      {!isCompleted && (
                        <button
                          type="button"
                          onClick={handleRevalidate}
                          disabled={revalidateLoading}
                          className="iq-primary-button mt-4"
                        >
                          {revalidateLoading ? 'Validating...' : 'Run Validation'}
                        </button>
                      )}
                    </div>
                  ) : validationPassed ? (
                    <div className="space-y-4">
                      <Notice
                        tone="success"
                        title="Invoice passed validation"
                        description="The invoice has passed the validation checks reported by the server."
                      />

                      <div className="grid gap-3 sm:grid-cols-2">
                        <ValidationMetric
                          label="Expected Total"
                          value={formatCurrency(
                            selectedInvoice.validation.expectedTotal,
                          )}
                        />
                        <ValidationMetric
                          label="Extracted Total"
                          value={formatCurrency(
                            selectedInvoice.validation.extractedTotal,
                          )}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Notice
                        tone="danger"
                        title="Validation issues detected"
                        description="Review the reported issues, correct the invoice if necessary, and re-validate it before confirmation."
                      />

                      <div className="grid gap-3 sm:grid-cols-3">
                        <ValidationMetric
                          label="Expected Total"
                          value={formatCurrency(
                            selectedInvoice.validation.expectedTotal,
                          )}
                        />
                        <ValidationMetric
                          label="Extracted Total"
                          value={formatCurrency(
                            selectedInvoice.validation.extractedTotal,
                          )}
                        />
                        <ValidationMetric
                          label="Total Mismatch"
                          value={
                            selectedInvoice.validation.totalMismatch
                              ? 'Yes'
                              : 'No'
                          }
                          danger={selectedInvoice.validation.totalMismatch}
                        />
                      </div>

                      {validationIssues.length > 0 && (
                        <div>
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                              Validation Issues
                            </p>
                            <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-300">
                              {validationIssues.length}{' '}
                              {validationIssues.length === 1 ? 'issue' : 'issues'}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {validationIssues.map((issue, index) => (
                              <div
                                key={`${issue}-${index}`}
                                className="flex items-start gap-3 rounded-xl border border-rose-400/10 bg-rose-400/[0.04] p-3"
                              >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-rose-400/10 text-xs font-bold text-rose-300">
                                  {index + 1}
                                </span>
                                <p className="text-sm leading-5 text-rose-200">
                                  {issue}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="rounded-xl border border-indigo-400/15 bg-indigo-500/[0.06] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                          Recommended action
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          Select <strong className="text-slate-100">Edit Invoice</strong>{' '}
                          to correct the extracted information, save your changes,
                          and then select <strong className="text-slate-100">Re-validate</strong>.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Duplicate check */}
              {selectedInvoice.duplicate && (
                <section className="iq-card overflow-hidden">
                  <SectionHeader
                    title="Duplicate Check"
                    description="Duplicate detection results"
                    icon="⧉"
                  />

                  <div className="p-5">
                    <Notice
                      tone={
                        selectedInvoice.duplicate.isDuplicate
                          ? 'danger'
                          : 'success'
                      }
                      title={
                        selectedInvoice.duplicate.isDuplicate
                          ? 'Possible duplicate invoice'
                          : 'No duplicate detected'
                      }
                      description={
                        selectedInvoice.duplicate.message ||
                        (selectedInvoice.duplicate.isDuplicate
                          ? 'Review this invoice against existing records.'
                          : 'No matching duplicate was reported.')
                      }
                    />
                  </div>
                </section>
              )}

              {/* Edit actions */}
              {isEditing && (
                <div className="flex flex-col-reverse gap-3 rounded-2xl border border-white/[0.08] bg-[#151B2B] p-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={editLoading || updateLoading}
                    className="iq-secondary-button"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={editLoading || updateLoading}
                    className="iq-primary-button"
                  >
                    {editLoading || updateLoading ? (
                      <>
                        <Spinner /> Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
            </main>

            {/* Original document */}
            <aside className="min-w-0 lg:sticky lg:top-5 lg:self-start">
              <section className="iq-card overflow-hidden">
                <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
                  <div>
                    <h2 className="font-semibold text-slate-100">
                      Original Invoice
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Uploaded source document
                    </p>
                  </div>

                  {storageUrl && (
                    <a
                      href={storageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      Open ↗
                    </a>
                  )}
                </div>

                <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-500/10 text-lg">
                      {isPdf ? '▤' : isImage ? '▧' : '↗'}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="truncate text-sm font-medium text-slate-200"
                        title={fileName}
                      >
                        {fileName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {fileType || 'Unknown file type'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0B0F19] p-3">
                  {!storageUrl ? (
                    <EmptyPreview
                      icon="↗"
                      title="Original document unavailable"
                      description="No storage URL is available for this invoice."
                    />
                  ) : isPdf ? (
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#151B2B]">
                      <iframe
                        src={storageUrl}
                        title={fileName}
                        className="h-[650px] w-full"
                      />
                    </div>
                  ) : isImage ? (
                    <div className="flex min-h-[350px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#151B2B] p-3 sm:min-h-[500px]">
                      <img
                        src={storageUrl}
                        alt={fileName}
                        className="max-h-[700px] w-auto max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <EmptyPreview
                      icon="↗"
                      title="Preview not supported"
                      description="This file type cannot be previewed directly. Open the original document instead."
                    >
                      <a
                        href={storageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="iq-primary-button mt-4"
                      >
                        Open Document ↗
                      </a>
                    </EmptyPreview>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>

      {/* Confirmation dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-invoice-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151B2B] p-6 shadow-2xl shadow-black/40"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-xl text-indigo-300">
              ✓
            </div>

            <h2
              id="confirm-invoice-title"
              className="mt-4 text-lg font-bold text-slate-100"
            >
              Confirm Invoice?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              This will mark the invoice as completed. Confirm only after checking
              the extracted information and successful validation.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                disabled={confirmLoading}
                className="iq-secondary-button"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={confirmLoading || !canConfirm}
                className="iq-primary-button"
              >
                {confirmLoading ? (
                  <>
                    <Spinner /> Confirming...
                  </>
                ) : (
                  'Confirm Invoice'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function createEditForm(invoice) {
  return {
    invoiceNumber: invoice.invoiceNumber || '',
    vendorName: invoice.vendor?.name || '',
    invoiceDate: invoice.invoiceDate || '',
    dueDate: invoice.dueDate || '',
    category: invoice.category || '',
    subtotal: invoice.subtotal ?? '',
    tax: invoice.tax ?? '',
    totalAmount: invoice.totalAmount ?? '',
    items: Array.isArray(invoice.items)
      ? invoice.items.map((item) => ({
          description: item.description || '',
          quantity: item.quantity ?? '',
          unitPrice: item.unitPrice ?? '',
          amount: item.amount ?? '',
        }))
      : [],
  }
}

function SectionHeader({
  title,
  description,
  icon,
  action,
  border = true,
}) {
  return (
    <div
      className={`flex min-w-0 items-center justify-between gap-3 ${
        border ? 'border-b border-white/[0.07] px-5 py-4' : ''
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-400/15 bg-indigo-500/[0.08] text-sm font-semibold text-indigo-300">
            {icon}
          </span>
        )}

        <div className="min-w-0">
          <h2 className="font-semibold text-slate-100">{title}</h2>
          {description && (
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  )
}

function Field({
  label,
  value,
  editing,
  name,
  type = 'text',
  onChange,
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className="iq-label">
        {label}
      </label>

      {editing ? (
        <input
          id={name}
          type={type}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          className="iq-input"
        />
      ) : (
        <p className="break-words text-sm font-medium text-slate-300">
          {value || 'Not available'}
        </p>
      )}
    </div>
  )
}

function AmountField({
  label,
  name,
  value,
  editing,
  onChange,
  highlighted = false,
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlighted
          ? 'border-indigo-400/20 bg-indigo-500/[0.08]'
          : 'border-white/[0.06] bg-white/[0.025]'
      }`}
    >
      <label htmlFor={name} className="iq-label">
        {label}
      </label>

      {editing ? (
        <input
          id={name}
          type="number"
          min="0"
          step="0.01"
          name={name}
          value={value ?? ''}
          onChange={onChange}
          className="iq-input"
        />
      ) : (
        <p
          className={`text-lg font-bold ${
            highlighted ? 'text-indigo-300' : 'text-slate-100'
          }`}
        >
          {formatCurrency(value)}
        </p>
      )}
    </div>
  )
}

function ValidationMetric({ label, value, danger = false }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        className={`mt-2 break-words text-sm font-bold ${
          danger ? 'text-rose-300' : 'text-slate-200'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function Notice({ tone, title, description }) {
  const tones = {
    warning: 'border-amber-400/20 bg-amber-400/[0.06] text-amber-200',
    success: 'border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200',
    danger: 'border-rose-400/20 bg-rose-400/[0.06] text-rose-200',
  }

  const icon = {
    warning: '!',
    success: '✓',
    danger: '!',
  }

  return (
    <div className={`rounded-xl border p-4 ${tones[tone] || tones.warning}`}>
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/10 font-bold">
          {icon[tone] || '!'}
        </span>

        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-1 text-xs leading-5 opacity-80">{description}</p>
        </div>
      </div>
    </div>
  )
}

function ErrorMessage({ message }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-4 text-sm text-rose-200"
    >
      {message}
    </div>
  )
}

function EmptyPreview({ icon, title, description, children }) {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-8 text-center sm:min-h-[500px]">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/15 bg-indigo-500/[0.08] text-2xl text-indigo-300">
        {icon}
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-200">{title}</p>
      <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
        {description}
      </p>
      {children}
    </div>
  )
}

function FullScreenState({
  icon,
  title,
  description,
  action,
  danger = false,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0F19] p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#151B2B] p-8 text-center shadow-2xl">
        <div
          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${
            danger
              ? 'bg-rose-400/10 text-rose-300'
              : 'bg-indigo-500/10 text-indigo-300'
          }`}
        >
          {icon}
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-100">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  )
}

function EmptyTableRow({ colSpan, text }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-5 py-10 text-center text-sm text-slate-500"
      >
        {text}
      </td>
    </tr>
  )
}

function StatusPill({ status }) {
  const normalizedStatus = status || 'PENDING'

  const styles =
    normalizedStatus === 'COMPLETED'
      ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
      : normalizedStatus === 'REVIEW_REQUIRED'
        ? 'border-amber-400/20 bg-amber-400/10 text-amber-300'
        : normalizedStatus === 'PROCESSING'
          ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300'
          : 'border-white/10 bg-white/[0.04] text-slate-300'

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${styles}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {normalizedStatus.replace(/_/g, ' ')}
    </span>
  )
}

function Spinner() {
  return (
    <span
      aria-label="Loading"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  )
}

function formatCurrency(value) {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return '₹0.00'
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number)
}

export default InvoiceDetails