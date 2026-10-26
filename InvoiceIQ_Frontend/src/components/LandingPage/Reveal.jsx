import useInView from './useInView'

// Fades and lifts content in when it enters the viewport.
function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView()

  return (
    <Tag
      ref={ref}
      style={{ '--d': `${delay}ms`, ...style }}
      className={`iq-reveal ${inView ? 'is-visible' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export default Reveal