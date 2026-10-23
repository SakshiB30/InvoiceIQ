function ExpenseCategoryBadge({ category }) {
const categoryStyles = {
Inventory:
'border border-blue-400/20 bg-blue-500/10 text-blue-300',
Office:
'border border-purple-400/20 bg-purple-500/10 text-purple-300',
Travel:
'border border-orange-400/20 bg-orange-500/10 text-orange-300',
Utilities:
'border border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
Marketing:
'border border-pink-400/20 bg-pink-500/10 text-pink-300',
Other:
'border border-slate-400/20 bg-slate-500/10 text-slate-300',
}

const badgeStyle =
categoryStyles[category] ||
categoryStyles.Other

return (
<span
className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeStyle}`}
>
{category || 'Other'} </span>
)
}

export default ExpenseCategoryBadge
