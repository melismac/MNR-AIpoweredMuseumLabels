/* global React */
function Footer() {
  return (
    <footer style={{padding: "2rem 1rem"}}>
      <div style={{
        maxWidth: 1140, margin: "0 auto",
        display:"flex", flexDirection:"row", justifyContent:"space-between",
        color: "var(--emu-fg-muted)", fontSize: ".875rem",
        flexWrap: "wrap", gap: 8,
      }}>
        <span>© Esplora il Museo</span>
        <span>UI modulare con Bootstrap 5.3</span>
      </div>
    </footer>
  );
}

function LanguagePicker({ onPick }) {
  return (
    <div style={{
      minHeight: "80vh",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding: "2rem", gap: "1.25rem", textAlign:"center",
    }}>
      <h1 style={{margin:0, fontSize: "1.75rem", fontWeight:700}}>Select your language!</h1>
      <p style={{margin:0, maxWidth: 480, color: "var(--emu-fg-muted)"}}>
        Select your language to explore the National Museum of the Italian Unification.
      </p>
      <div style={{display:"flex", gap: 10, marginTop: 8}}>
        <Button variant="primary" onClick={()=>onPick("it")}>Italiano</Button>
        <Button variant="outline" onClick={()=>onPick("en")}>English</Button>
      </div>
      <div style={{marginTop: 24}}>
        <Button variant="pill">🔊 Ascolta il testo</Button>
      </div>
    </div>
  );
}

window.Footer = Footer;
window.LanguagePicker = LanguagePicker;
