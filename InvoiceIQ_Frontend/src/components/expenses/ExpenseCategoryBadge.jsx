function ExpenseCategoryBadge({ category }) {
  const categoryStyles = {
    Inventory: 'bg-blue-100 text-blue-700',
    Office: 'bg-purple-100 text-purple-700',
    Travel: 'bg-orange-100 text-orange-700',
    Utilities: 'bg-green-100 text-green-700',
    Marketing: 'bg-pink-100 text-pink-700',
    Other: 'bg-slate-100 text-slate-600',
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        categoryStyles[category] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {category}
    </span>
  )
}

export default ExpenseCategoryBadge