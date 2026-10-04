import { useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  clearSelectedInvoice,
  confirmInvoice,
  deleteInvoice,
  fetchInvoiceById,
  revalidateInvoice,
  updateInvoice,
} from '../../redux/slices/invoiceSlice'

const InvoiceDetails = ({
  invoiceId: propInvoiceId,
  onClose,
}) => {
  const { id: routeInvoiceId } = useParams()

  const invoiceId =
    propInvoiceId || routeInvoiceId

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

  const [showConfirmDialog, setShowConfirmDialog] =
    useState(false)

  const [confirmLoading, setConfirmLoading] =
    useState(false)

  const [isEditing, setIsEditing] =
    useState(false)

  const [editLoading, setEditLoading] =
    useState(false)

  const [editError, setEditError] =
    useState('')

  const [deleteLoading, setDeleteLoading] =
    useState(false)

  const [deleteError, setDeleteError] =
    useState('')

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

  /* =========================
     LOAD INVOICE
  ========================== */

  useEffect(() => {
    if (!invoiceId) {
      return
    }

    dispatch(fetchInvoiceById(invoiceId))

    return () => {
      dispatch(clearSelectedInvoice())
    }
  }, [dispatch, invoiceId])

  /* =========================
     INITIALIZE EDIT FORM
  ========================== */

  useEffect(() => {
    if (!selectedInvoice) {
      return
    }

    setEditForm({
      invoiceNumber:
        selectedInvoice.invoiceNumber || '',

      vendorName:
        selectedInvoice.vendor?.name || '',

      invoiceDate:
        selectedInvoice.invoiceDate || '',

      dueDate:
        selectedInvoice.dueDate || '',

      category:
        selectedInvoice.category || '',

      subtotal:
        selectedInvoice.subtotal ?? '',

      tax:
        selectedInvoice.tax ?? '',

      totalAmount:
        selectedInvoice.totalAmount ?? '',

      items: Array.isArray(
        selectedInvoice.items,
      )
        ? selectedInvoice.items.map((item) => ({
            description:
              item.description || '',

            quantity:
              item.quantity ?? '',

            unitPrice:
              item.unitPrice ?? '',

            amount:
              item.amount ?? '',
          }))
        : [],
    })
  }, [selectedInvoice])

  /* =========================
     EDIT HANDLERS
  ========================== */

  const handleEditChange = (event) => {
    const { name, value } = event.target

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleItemChange = (
    index,
    field,
    value,
  ) => {
    setEditForm((previous) => {
      const updatedItems = [
        ...previous.items,
      ]

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
        (_, itemIndex) =>
          itemIndex !== index,
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
      setEditForm({
        invoiceNumber:
          selectedInvoice.invoiceNumber || '',

        vendorName:
          selectedInvoice.vendor?.name || '',

        invoiceDate:
          selectedInvoice.invoiceDate || '',

        dueDate:
          selectedInvoice.dueDate || '',

        category:
          selectedInvoice.category || '',

        subtotal:
          selectedInvoice.subtotal ?? '',

        tax:
          selectedInvoice.tax ?? '',

        totalAmount:
          selectedInvoice.totalAmount ?? '',

        items: Array.isArray(
          selectedInvoice.items,
        )
          ? selectedInvoice.items.map(
              (item) => ({
                description:
                  item.description || '',

                quantity:
                  item.quantity ?? '',

                unitPrice:
                  item.unitPrice ?? '',

                amount:
                  item.amount ?? '',
              }),
            )
          : [],
      })
    }

    setEditError('')
    setIsEditing(false)
  }

  const handleSaveEdit = async () => {
    setEditError('')

    if (!editForm.invoiceNumber.trim()) {
      setEditError(
        'Invoice number is required.',
      )
      return
    }

    if (!editForm.vendorName.trim()) {
      setEditError(
        'Vendor name is required.',
      )
      return
    }

    if (!editForm.invoiceDate) {
      setEditError(
        'Invoice date is required.',
      )
      return
    }

    if (editForm.totalAmount === '') {
      setEditError(
        'Total amount is required.',
      )
      return
    }

    const cleanedItems =
      editForm.items.map((item) => ({
        description: item.description,

        quantity:
          item.quantity === ''
            ? 0
            : Number(item.quantity),

        unitPrice:
          item.unitPrice === ''
            ? 0
            : Number(item.unitPrice),

        amount:
          item.amount === ''
            ? 0
            : Number(item.amount),
      }))

    const invoiceData = {
      ...selectedInvoice,

      invoiceNumber:
        editForm.invoiceNumber.trim(),

      vendor: {
        ...(selectedInvoice?.vendor || {}),
        name: editForm.vendorName.trim(),
      },

      invoiceDate:
        editForm.invoiceDate,

      dueDate:
        editForm.dueDate || null,

      category:
        editForm.category || '',

      subtotal:
        editForm.subtotal === ''
          ? 0
          : Number(editForm.subtotal),

      tax:
        editForm.tax === ''
          ? 0
          : Number(editForm.tax),

      totalAmount:
        Number(editForm.totalAmount),

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

      await dispatch(
        fetchInvoiceById(invoiceId),
      )

      setIsEditing(false)
    } catch (error) {
      setEditError(
        typeof error === 'string'
          ? error
          : 'Failed to update invoice.',
      )
    } finally {
      setEditLoading(false)
    }
  }

  /* =========================
     REVALIDATION
  ========================== */

  const handleRevalidate = async () => {
    setDeleteError('')

    try {
      await dispatch(
        revalidateInvoice(invoiceId),
      ).unwrap()

      await dispatch(
        fetchInvoiceById(invoiceId),
      )
    } catch {
      // Redux handles the error.
    }
  }

  /* =========================
     CONFIRM
  ========================== */

  const handleOpenConfirm = () => {
    if (!selectedInvoice?.validation) {
      return
    }

    setShowConfirmDialog(true)
  }

  const handleConfirm = async () => {
    setConfirmLoading(true)

    try {
      await dispatch(
        confirmInvoice(invoiceId),
      ).unwrap()

      await dispatch(
        fetchInvoiceById(invoiceId),
      )

      setShowConfirmDialog(false)
    } catch {
      // Redux handles the error.
    } finally {
      setConfirmLoading(false)
    }
  }

  /* =========================
     DELETE
  ========================== */

  const handleDelete = async () => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this invoice? This action cannot be undone.',
    )

    if (!shouldDelete) {
      return
    }

    setDeleteError('')
    setDeleteLoading(true)

    try {
      await dispatch(
        deleteInvoice(invoiceId),
      ).unwrap()

      handleClose()
    } catch (error) {
      setDeleteError(
        typeof error === 'string'
          ? error
          : 'Failed to delete invoice.',
      )
    } finally {
      setDeleteLoading(false)
    }
  }

  /* =========================
     CLOSE / BACK
  ========================== */

  const handleClose = () => {
    dispatch(clearSelectedInvoice())

    /*
     * If this component is being used as a
     * modal from another component, preserve
     * the existing onClose behavior.
     */
    if (onClose) {
      onClose()
      return
    }

    /*
     * Route-based InvoiceDetails:
     *
     * /invoices
     *     ↓
     * /invoices/:id
     *     ↓
     * Back
     *     ↓
     * /invoices
     *
     * This also works if the invoice was opened
     * from Dashboard, Analytics, etc.
     */
    navigate(-1)
  }

  /* =========================
     DERIVED VALUES
  ========================== */

  const isCompleted =
    selectedInvoice?.processingStatus ===
    'COMPLETED'

  const hasValidation =
    !!selectedInvoice?.validation

  const validationPassed =
    selectedInvoice?.validation?.valid === true

  const canConfirm =
    !isCompleted && hasValidation

  /* =========================
     SOURCE DOCUMENT
  ========================== */

  const sourceDocument =
    selectedInvoice?.sourceDocument

  const fileName =
    sourceDocument?.fileName ||
    'Original invoice'

  const fileType =
    sourceDocument?.fileType || ''

  const storageUrl =
    sourceDocument?.storageUrl || ''

  const normalizedFileType =
    fileType.toLowerCase()

  const isPdf =
    normalizedFileType.includes('pdf') ||
    fileName
      .toLowerCase()
      .endsWith('.pdf')

  const isImage =
    normalizedFileType.includes('image') ||
    normalizedFileType.includes('jpg') ||
    normalizedFileType.includes('jpeg') ||
    normalizedFileType.includes('png') ||
    normalizedFileType.includes('webp') ||
    /\.(jpg|jpeg|png|webp)$/i.test(
      fileName,
    )

  /* =========================
     ITEM TOTAL
  ========================== */

  const calculatedItemsTotal =
    useMemo(() => {
      if (
        !Array.isArray(
          selectedInvoice?.items,
        )
      ) {
        return 0
      }

      return selectedInvoice.items.reduce(
        (sum, item) =>
          sum + Number(item.amount || 0),
        0,
      )
    }, [selectedInvoice])

  /* =========================
     VALIDATION ISSUES
  ========================== */

  const validationIssues =
    selectedInvoice?.validation
      ?.missingFields || []

  /* =========================
     MISSING INVOICE ID
  ========================== */

  if (!invoiceId) {
    return null
  }

  /* =========================
     LOADING
  ========================== */

  if (
    invoiceDetailsLoading &&
    !selectedInvoice
  ) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-yellow-500 border-t-transparent" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            Loading invoice...
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Please wait while the invoice
            details are being loaded.
          </p>
        </div>
      </div>
    )
  }

  /* =========================
     API ERROR
  ========================== */

  if (invoiceDetailsError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
            ⚠️
          </div>

          <h3 className="text-lg font-semibold text-slate-900">
            Invoice could not be loaded
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {typeof invoiceDetailsError ===
            'string'
              ? invoiceDetailsError
              : 'The invoice could not be loaded.'}
          </p>

          <button
            type="button"
            onClick={handleClose}
            className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  /* =========================
     NO DATA AFTER LOADING
  ========================== */

  if (!selectedInvoice) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 backdrop-blur-sm">
      <div className="min-h-full p-3 sm:p-5 lg:p-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-slate-50 shadow-2xl">

          {/* =========================
              HEADER
          ========================== */}

          <div className="border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                  title="Back"
                >
                  ←
                </button>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                      Invoice Details
                    </h2>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {selectedInvoice.processingStatus ||
                        'PENDING'}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedInvoice.invoiceNumber ||
                      'Invoice'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {!isEditing &&
                  !isCompleted && (
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      ✏️ Edit Invoice
                    </button>
                  )}

                {!isEditing &&
                  !isCompleted && (
                    <button
                      type="button"
                      onClick={handleRevalidate}
                      disabled={revalidateLoading}
                      className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {revalidateLoading
                        ? 'Validating...'
                        : '✓ Re-validate'}
                    </button>
                  )}

                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleOpenConfirm}
                    disabled={!canConfirm}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    ✓ Confirm Invoice
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleteLoading
                    ? 'Deleting...'
                    : '🗑 Delete'}
                </button>
              </div>
            </div>
          </div>

          {/* =========================
              BODY
          ========================== */}

          <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,460px)]">

            {/* LEFT */}

            <div className="space-y-5">

              {isEditing && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex gap-3">
                    <span className="text-lg">
                      ⚠️
                    </span>

                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Editing invoice
                      </p>

                      <p className="mt-1 text-sm text-amber-800">
                        After saving changes,
                        the invoice validation
                        will be cleared.
                        Re-validate the invoice
                        before confirming it.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!isEditing &&
                !isCompleted &&
                !hasValidation && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex gap-3">
                      <span className="text-lg">
                        ⚠️
                      </span>

                      <div>
                        <p className="text-sm font-semibold text-amber-900">
                          Validation required
                        </p>

                        <p className="mt-1 text-sm text-amber-800">
                          This invoice must
                          be validated before
                          it can be confirmed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {updateError && (
                <ErrorMessage
                  message={updateError}
                />
              )}

              {editError && (
                <ErrorMessage
                  message={editError}
                />
              )}

              {revalidateError && (
                <ErrorMessage
                  message={revalidateError}
                />
              )}

              {deleteError && (
                <ErrorMessage
                  message={deleteError}
                />
              )}

              {/* INVOICE INFORMATION */}

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <SectionHeader
                  title="Invoice Information"
                  description="Basic invoice and vendor details"
                />

                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <Field
                    label="Invoice Number"
                    value={
                      editForm.invoiceNumber
                    }
                    editing={isEditing}
                    name="invoiceNumber"
                    onChange={
                      handleEditChange
                    }
                  />

                  <Field
                    label="Vendor"
                    value={
                      editForm.vendorName
                    }
                    editing={isEditing}
                    name="vendorName"
                    onChange={
                      handleEditChange
                    }
                  />

                  <Field
                    label="Invoice Date"
                    value={
                      editForm.invoiceDate
                    }
                    editing={isEditing}
                    name="invoiceDate"
                    type="date"
                    onChange={
                      handleEditChange
                    }
                  />

                  <Field
                    label="Due Date"
                    value={
                      editForm.dueDate
                    }
                    editing={isEditing}
                    name="dueDate"
                    type="date"
                    onChange={
                      handleEditChange
                    }
                  />

                  <Field
                    label="Category"
                    value={
                      editForm.category
                    }
                    editing={isEditing}
                    name="category"
                    onChange={
                      handleEditChange
                    }
                  />

                  <div>
                    <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                      GSTIN
                    </p>

                    <p className="break-all text-sm font-medium text-slate-800">
                      {selectedInvoice.vendor
                        ?.gstin ||
                        'Not available'}
                    </p>
                  </div>
                </div>
              </section>

              {/* ITEMS */}

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Invoice Items
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Products or services
                      included in this
                      invoice
                    </p>
                  </div>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={
                        handleAddItem
                      }
                      className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                    >
                      + Add Item
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left">
                    <thead className="bg-slate-50">
                      <tr className="text-xs uppercase tracking-wide text-slate-400">
                        <th className="px-5 py-3 font-semibold">
                          Description
                        </th>

                        <th className="px-5 py-3 font-semibold">
                          Qty
                        </th>

                        <th className="px-5 py-3 font-semibold">
                          Unit Price
                        </th>

                        <th className="px-5 py-3 font-semibold">
                          Amount
                        </th>

                        {isEditing && (
                          <th className="px-5 py-3" />
                        )}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {isEditing ? (
                        editForm.items.length >
                        0 ? (
                          editForm.items.map(
                            (
                              item,
                              index,
                            ) => (
                              <tr
                                key={index}
                              >
                                <td className="px-5 py-3">
                                  <input
                                    value={
                                      item.description
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      handleItemChange(
                                        index,
                                        'description',
                                        event
                                          .target
                                          .value,
                                      )
                                    }
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    placeholder="Item description"
                                  />
                                </td>

                                <td className="px-5 py-3">
                                  <input
                                    type="number"
                                    min="0"
                                    value={
                                      item.quantity
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      handleItemChange(
                                        index,
                                        'quantity',
                                        event
                                          .target
                                          .value,
                                      )
                                    }
                                    className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                  />
                                </td>

                                <td className="px-5 py-3">
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                      item.unitPrice
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      handleItemChange(
                                        index,
                                        'unitPrice',
                                        event
                                          .target
                                          .value,
                                      )
                                    }
                                    className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                  />
                                </td>

                                <td className="px-5 py-3">
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                      item.amount
                                    }
                                    onChange={(
                                      event,
                                    ) =>
                                      handleItemChange(
                                        index,
                                        'amount',
                                        event
                                          .target
                                          .value,
                                      )
                                    }
                                    className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                  />
                                </td>

                                <td className="px-5 py-3">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveItem(
                                        index,
                                      )
                                    }
                                    className="text-xs font-medium text-red-500 hover:text-red-700"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ),
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan="5"
                              className="px-5 py-8 text-center text-sm text-slate-500"
                            >
                              No items
                              added yet.
                            </td>
                          </tr>
                        )
                      ) : selectedInvoice.items
                          ?.length > 0 ? (
                        selectedInvoice.items.map(
                          (
                            item,
                            index,
                          ) => (
                            <tr
                              key={index}
                            >
                              <td className="px-5 py-3 text-sm text-slate-700">
                                {item.description ||
                                  'Unnamed item'}
                              </td>

                              <td className="px-5 py-3 text-sm text-slate-600">
                                {item.quantity ??
                                  '-'}
                              </td>

                              <td className="px-5 py-3 text-sm text-slate-600">
                                {formatCurrency(
                                  item.unitPrice,
                                )}
                              </td>

                              <td className="px-5 py-3 text-sm font-medium text-slate-800">
                                {formatCurrency(
                                  item.amount,
                                )}
                              </td>
                            </tr>
                          ),
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-5 py-8 text-center text-sm text-slate-500"
                          >
                            No invoice
                            items
                            available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {!isEditing &&
                  selectedInvoice.items
                    ?.length > 0 && (
                    <div className="border-t border-slate-100 px-5 py-3 text-right text-xs text-slate-500">
                      Items total:{' '}
                      <span className="font-semibold text-slate-700">
                        {formatCurrency(
                          calculatedItemsTotal,
                        )}
                      </span>
                    </div>
                  )}
              </section>

              {/* AMOUNT SUMMARY */}

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <SectionHeader title="Amount Summary" />

                <div className="grid gap-4 p-5 sm:grid-cols-3">
                  <AmountField
                    label="Subtotal"
                    name="subtotal"
                    value={
                      editForm.subtotal
                    }
                    editing={isEditing}
                    onChange={
                      handleEditChange
                    }
                  />

                  <AmountField
                    label="Tax"
                    name="tax"
                    value={editForm.tax}
                    editing={isEditing}
                    onChange={
                      handleEditChange
                    }
                  />

                  <AmountField
                    label="Total Amount"
                    name="totalAmount"
                    value={
                      editForm.totalAmount
                    }
                    editing={isEditing}
                    onChange={
                      handleEditChange
                    }
                    highlighted
                  />
                </div>
              </section>

              {/* VALIDATION */}

              <section
                className={`rounded-2xl border bg-white shadow-sm ${
                  hasValidation
                    ? validationPassed
                      ? 'border-emerald-200'
                      : 'border-red-200'
                    : 'border-slate-200'
                }`}
              >
                <div className="border-b border-slate-100 px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Validation Result
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Invoice consistency
                        and data-quality
                        checks
                      </p>
                    </div>

                    {hasValidation && (
                      <span
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          validationPassed
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {validationPassed
                          ? '✓ Invoice Valid'
                          : '✕ Issues Found'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  {!hasValidation ? (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-xl">
                        🔍
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        Invoice has not
                        been validated
                      </p>

                      <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                        Run validation to
                        check required
                        fields, invoice
                        totals, item
                        calculations and
                        date consistency.
                      </p>

                      {!isCompleted && (
                        <button
                          type="button"
                          onClick={
                            handleRevalidate
                          }
                          disabled={
                            revalidateLoading
                          }
                          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                          {revalidateLoading
                            ? 'Validating...'
                            : 'Run Validation'}
                        </button>
                      )}
                    </div>
                  ) : validationPassed ? (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            ✓
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-emerald-800">
                              Invoice passed
                              validation
                            </p>

                            <p className="mt-1 text-xs leading-5 text-emerald-700">
                              Required fields
                              are present and
                              the invoice
                              calculations are
                              consistent.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <ValidationMetric
                          label="Expected Total"
                          value={formatCurrency(
                            selectedInvoice
                              .validation
                              .expectedTotal,
                          )}
                        />

                        <ValidationMetric
                          label="Extracted Total"
                          value={formatCurrency(
                            selectedInvoice
                              .validation
                              .extractedTotal,
                          )}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
                            !
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-red-800">
                              Validation issues
                              detected
                            </p>

                            <p className="mt-1 text-xs leading-5 text-red-700">
                              Review the issues
                              below, edit the
                              invoice if
                              necessary, and
                              re-validate it
                              before
                              confirmation.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <ValidationMetric
                          label="Expected Total"
                          value={formatCurrency(
                            selectedInvoice
                              .validation
                              .expectedTotal,
                          )}
                        />

                        <ValidationMetric
                          label="Extracted Total"
                          value={formatCurrency(
                            selectedInvoice
                              .validation
                              .extractedTotal,
                          )}
                        />

                        <ValidationMetric
                          label="Total Mismatch"
                          value={
                            selectedInvoice
                              .validation
                              .totalMismatch
                              ? 'Yes'
                              : 'No'
                          }
                          danger={
                            selectedInvoice
                              .validation
                              .totalMismatch
                          }
                        />
                      </div>

                      {validationIssues.length >
                        0 && (
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                              Validation Issues
                            </p>

                            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                              {
                                validationIssues.length
                              }{' '}
                              {validationIssues.length ===
                              1
                                ? 'issue'
                                : 'issues'}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {validationIssues.map(
                              (
                                issue,
                                index,
                              ) => (
                                <div
                                  key={`${issue}-${index}`}
                                  className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/60 p-3"
                                >
                                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                                    {index +
                                      1}
                                  </span>

                                  <p className="text-sm leading-5 text-red-800">
                                    {issue}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                          Recommended
                          Action
                        </p>

                        <p className="mt-1 text-sm leading-5 text-indigo-900">
                          Click{' '}
                          <strong>
                            Edit Invoice
                          </strong>{' '}
                          to correct the
                          extracted
                          information, save
                          your changes, and
                          then click{' '}
                          <strong>
                            Re-validate
                          </strong>
                          .
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* DUPLICATE */}

              {selectedInvoice.duplicate && (
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <SectionHeader title="Duplicate Check" />

                  <div className="p-5">
                    <div
                      className={`rounded-xl p-4 ${
                        selectedInvoice
                          .duplicate
                          .isDuplicate
                          ? 'bg-red-50'
                          : 'bg-emerald-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {selectedInvoice
                            .duplicate
                            .isDuplicate
                            ? '⚠️'
                            : '✓'}
                        </span>

                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              selectedInvoice
                                .duplicate
                                .isDuplicate
                                ? 'text-red-800'
                                : 'text-emerald-800'
                            }`}
                          >
                            {selectedInvoice
                              .duplicate
                              .isDuplicate
                              ? 'Possible duplicate invoice'
                              : 'No duplicate detected'}
                          </p>

                          {selectedInvoice
                            .duplicate
                            .message && (
                            <p className="mt-1 text-xs text-slate-600">
                              {
                                selectedInvoice
                                  .duplicate
                                  .message
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* EDIT ACTIONS */}

              {isEditing && (
                <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={
                      handleCancelEdit
                    }
                    disabled={
                      editLoading ||
                      updateLoading
                    }
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleSaveEdit
                    }
                    disabled={
                      editLoading ||
                      updateLoading
                    }
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {editLoading ||
                    updateLoading
                      ? 'Saving...'
                      : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT — ORIGINAL DOCUMENT */}

            <div className="lg:sticky lg:top-5 lg:self-start">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Original Invoice
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        Source document uploaded
                        for this invoice
                      </p>
                    </div>

                    {storageUrl && (
                      <a
                        href={storageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Open ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* FILE METADATA */}

                <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-lg">
                      {isPdf
                        ? '📄'
                        : isImage
                          ? '🖼️'
                          : '📎'}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="truncate text-sm font-medium text-slate-800"
                        title={fileName}
                      >
                        {fileName}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {fileType ||
                          'Unknown file type'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PREVIEW */}

                <div className="bg-slate-100 p-3">
                  {!storageUrl ? (
                    <EmptyPreview
                      icon="📎"
                      title="Original document unavailable"
                      description="No storage URL is available for this invoice."
                    />
                  ) : isPdf ? (
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <iframe
                        src={storageUrl}
                        title={fileName}
                        className="h-[650px] w-full"
                      />
                    </div>
                  ) : isImage ? (
                    <div className="flex min-h-[500px] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-3">
                      <img
                        src={storageUrl}
                        alt={fileName}
                        className="max-h-[700px] w-auto max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <EmptyPreview
                      icon="📎"
                      title="Preview not supported"
                      description="This file type cannot be previewed directly. Use the Open button to view the original document."
                    >
                      <a
                        href={storageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                      >
                        Open Document ↗
                      </a>
                    </EmptyPreview>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          CONFIRM DIALOG
      ========================== */}

      {showConfirmDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-xl">
              ✓
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Confirm Invoice?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This will mark the invoice as
              completed and confirmed. Make sure
              the extracted information and
              validation result are correct.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setShowConfirmDialog(false)
                }
                disabled={confirmLoading}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={confirmLoading}
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {confirmLoading
                  ? 'Confirming...'
                  : 'Confirm Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* =========================
   SECTION HEADER
========================== */

const SectionHeader = ({
  title,
  description,
}) => {
  return (
    <div className="border-b border-slate-100 px-5 py-4">
      <h3 className="font-semibold text-slate-900">
        {title}
      </h3>

      {description && (
        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      )}
    </div>
  )
}

/* =========================
   FIELD
========================== */

const Field = ({
  label,
  value,
  editing,
  name,
  type = 'text',
  onChange,
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </label>

      {editing ? (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      ) : (
        <p className="break-words text-sm font-medium text-slate-800">
          {value || 'Not available'}
        </p>
      )}
    </div>
  )
}

/* =========================
   AMOUNT FIELD
========================== */

const AmountField = ({
  label,
  name,
  value,
  editing,
  onChange,
  highlighted = false,
}) => {
  return (
    <div
      className={`rounded-xl p-4 ${
        highlighted
          ? 'bg-indigo-50'
          : 'bg-slate-50'
      }`}
    >
      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </label>

      {editing ? (
        <input
          type="number"
          min="0"
          step="0.01"
          name={name}
          value={value ?? ''}
          onChange={onChange}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      ) : (
        <p
          className={`text-lg font-bold ${
            highlighted
              ? 'text-indigo-700'
              : 'text-slate-900'
          }`}
        >
          {formatCurrency(value)}
        </p>
      )}
    </div>
  )
}

/* =========================
   VALIDATION METRIC
========================== */

const ValidationMetric = ({
  label,
  value,
  danger = false,
}) => {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-sm font-bold ${
          danger
            ? 'text-red-600'
            : 'text-slate-800'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

/* =========================
   ERROR MESSAGE
========================== */

const ErrorMessage = ({ message }) => {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {message}
    </div>
  )
}

/* =========================
   EMPTY PREVIEW
========================== */

const EmptyPreview = ({
  icon,
  title,
  description,
  children,
}) => {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 text-center">
      <div className="text-4xl">
        {icon}
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-700">
        {title}
      </p>

      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
        {description}
      </p>

      {children}
    </div>
  )
}

/* =========================
   CURRENCY
========================== */

const formatCurrency = (value) => {
  const number = Number(value)

  if (Number.isNaN(number)) {
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