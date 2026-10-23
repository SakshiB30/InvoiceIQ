import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const { invoices } = useSelector(
    (state) => state.invoices,
  )

  const { aiInsights } = useSelector(
    (state) => state.invoices,
  )

  const notifications = []

  const reviewInvoices = invoices.filter(
    (invoice) =>
      invoice.validation?.valid === false ||
      invoice.processingStatus === 'PENDING',
  )

  const duplicateInvoices = invoices.filter(
    (invoice) =>
      invoice.duplicate?.isDuplicate === true,
  )

  if (reviewInvoices.length > 0) {
    notifications.push({
      id: 'review',
      icon: '⚠️',
      title: 'Invoices need review',
      message: `${reviewInvoices.length} invoice${
        reviewInvoices.length > 1 ? 's' : ''
      } require${reviewInvoices.length === 1 ? 's' : ''} your attention.`,
      type: 'warning',
      path: '/invoices',
    })
  }

  if (duplicateInvoices.length > 0) {
    notifications.push({
      id: 'duplicate',
      icon: '🔄',
      title: 'Duplicate invoices detected',
      message: `${duplicateInvoices.length} possible duplicate${
        duplicateInvoices.length > 1 ? 's' : ''
      } found.`,
      type: 'warning',
      path: '/invoices',
    })
  }

  if (aiInsights) {
    notifications.push({
      id: 'ai',
      icon: '✨',
      title: 'AI insights available',
      message: 'Your latest spending analysis is ready.',
      type: 'info',
      path: '/insights',
    })
  }

  const completedInvoices = invoices.filter(
    (invoice) =>
      invoice.processingStatus === 'COMPLETED',
  )

  if (completedInvoices.length > 0) {
    notifications.push({
      id: 'completed',
      icon: '✅',
      title: 'Invoice processing completed',
      message: `${completedInvoices.length} verified invoice${
        completedInvoices.length > 1 ? 's' : ''
      } in your account.`,
      type: 'success',
      path: '/invoices',
    })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  const handleNotificationClick = (path) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-lg transition hover:bg-slate-100"
        title="Notifications"
        aria-label="Notifications"
        aria-expanded={open}
      >
        🔔

        {notifications.length > 0 && (
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Notifications
              </h3>

              <p className="text-xs text-slate-400">
                InvoiceIQ activity
              </p>
            </div>

            {notifications.length > 0 && (
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
                {notifications.length}
              </span>
            )}
          </div>

          {/* Notifications */}
          {notifications.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <div className="text-3xl">🔔</div>

              <p className="mt-3 text-sm font-medium text-slate-900">
                You're all caught up
              </p>

              <p className="mt-1 text-xs text-slate-500">
                No new invoice activity.
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() =>
                    handleNotificationClick(
                      notification.path,
                    )
                  }
                  className="flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition last:border-0 hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-base">
                    {notification.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {notification.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {notification.message}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown

