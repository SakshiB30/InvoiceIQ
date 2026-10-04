import axiosClient from '../api/axiosClient'

const uploadInvoice = async (file) => {
  const formData = new FormData()

  formData.append('file', file)

  const response = await axiosClient.post(
    '/api/invoices/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )

  return response.data
}

const getInvoices = async (filters = {}) => {
  const response = await axiosClient.get('/api/invoices', {
    params: {
      search: filters.search || undefined,
      category: filters.category || undefined,
      fromDate: filters.fromDate || undefined,
      toDate: filters.toDate || undefined,
    },
  })

  return response.data
}

const getInvoiceById = async (id) => {
  const response = await axiosClient.get(
    `/api/invoices/${id}`,
  )

  return response.data
}

const updateInvoice = async (id, invoiceData) => {
  const response = await axiosClient.put(
    `/api/invoices/${id}`,
    invoiceData,
  )

  return response.data
}

const revalidateInvoice = async (id) => {
  const response = await axiosClient.put(
    `/api/invoices/${id}/validate`,
  )

  return response.data
}

const deleteInvoice = async (id) => {
  const response = await axiosClient.delete(
    `/api/invoices/${id}`,
  )

  return response.data
}

const confirmInvoice = async (id) => {
  const response = await axiosClient.put(
    `/api/invoices/${id}/confirm`,
  )

  return response.data
}

const getAIInsights = async () => {
  const response = await axiosClient.get(
    '/api/invoices/ai-insights',
  )

  return response.data
}

const invoiceService = {
  uploadInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  revalidateInvoice,
  deleteInvoice,
  confirmInvoice,
  getAIInsights,
}

export default invoiceService
