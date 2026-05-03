/* global React */
function Navbar({ onMenuClick }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 1000,
      background: "#fff",
      borderBottom: "1px solid var(--emu-border)",
      padding: ".6rem 0",
    }}>
      <div style={{
        maxWidth: 1140, margin: "0 auto",
        display: "flex", alignItems: "center", gap: ".5rem",
        padding: "0 16px",
      }}>
        <button
          aria-label="Apri menu"
          onClick={onMenuClick}
          style={{
            minWidth: 44, minHeight: 44, padding: 10,
            border: "1px solid var(--emu-border-strong)", borderRadius: 8,
            background: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background-color .15s ease",
          }}
          onMouseOver={(e)=>e.currentTarget.style.background="var(--emu-gray-100)"}
          onMouseOut={(e)=>e.currentTarget.style.background="#fff"}
        >
          <span>
            <span style={{display:"block",width:22,height:2,background:"var(--emu-charcoal-700)",margin:"2.5px 0"}}></span>
            <span style={{display:"block",width:22,height:2,background:"var(--emu-charcoal-700)",margin:"2.5px 0"}}></span>
            <span style={{display:"block",width:22,height:2,background:"var(--emu-charcoal-700)",margin:"2.5px 0"}}></span>
          </span>
        </button>
        <a href="#home" style={{display:"flex", alignItems:"center", gap:".5rem", textDecoration:"none"}}>
          <img src="../../assets/logo_orizzontale.jpg" alt="Museo Nazionale del Risorgimento Italiano"
               style={{ height: 40, width: "auto", display: "block", flexShrink: 0 }} />
          <span style={{
            fontSize: "1.1rem", fontWeight: 600, color: "var(--emu-charcoal-900)",
            letterSpacing: ".2px", lineHeight: 1.2,
          }}>Esplora il Museo</span>
        </a>
      </div>
    </nav>
  );
}

window.Navbar = Navbar;
