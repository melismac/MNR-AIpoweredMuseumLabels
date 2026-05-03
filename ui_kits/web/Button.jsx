/* global React */
const { useState } = React;

function Button({ variant = "primary", children, onClick, full, style }) {
  const base = {
    fontFamily: "inherit",
    fontWeight: 600,
    letterSpacing: ".2px",
    fontSize: "1rem",
    minHeight: 44,
    padding: ".75rem 1rem",
    borderRadius: 10,
    border: "1px solid transparent",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color .2s ease, border-color .2s ease, transform .1s ease",
    width: full ? "100%" : "auto",
    ...style,
  };
  const variants = {
    primary: { background: "var(--emu-red-500)", color: "#fff", borderColor: "var(--emu-red-500)" },
    outline: { background: "#fff", color: "var(--emu-charcoal-700)", borderColor: "var(--emu-border-strong)" },
    pill:    { background: "#fff", color: "var(--emu-charcoal-700)", borderColor: "var(--emu-border-strong)", borderRadius: 999 },
  };
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const hoverStyles = {
    primary: { background: "var(--emu-red-600)", borderColor: "var(--emu-red-600)" },
    outline: { background: "var(--emu-gray-100)", color: "var(--emu-charcoal-900)" },
    pill:    { background: "var(--emu-gray-100)", color: "var(--emu-charcoal-900)" },
  };
  const activeStyles = {
    primary: { background: "var(--emu-red-700)", borderColor: "var(--emu-red-700)", transform: "scale(.98)" },
    outline: { transform: "scale(.98)" },
    pill:    { transform: "scale(.98)" },
  };
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        ...base,
        ...variants[variant],
        ...(hover ? hoverStyles[variant] : {}),
        ...(active ? activeStyles[variant] : {}),
      }}
    >
      {children}
    </button>
  );
}

window.Button = Button;
