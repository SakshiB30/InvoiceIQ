// Card with a soft glow and border highlight that follows the cursor.
function SpotlightCard({ as: Tag = 'div', className = '', children, ...rest }) {
  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <Tag onMouseMove={handleMove} className={`iq-spot ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

export default SpotlightCard