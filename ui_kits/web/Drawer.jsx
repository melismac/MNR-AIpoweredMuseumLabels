/* global React */
const { useState } = React;

const PROFILE_MENU = [
  { id: "piccolo", label: "Il Piccolo Visitatore" },
  { id: "curioso", label: "Il Curioso" },
  { id: "visionario", label: "Il Visionario" },
  { id: "esperto", label: "L'Esperto" },
];
const ROOMS = [
  { id: "sala_0", label: "Introduzione" },
  { id: "sala_1", label: "Sala 1" },
  { id: "sala_2", label: "Sala 2" },
  { id: "sala_3", label: "Sala 3" },
];

function Drawer({ open, onClose, activeProfile, activeRoom, onNavigate }) {
  const [expanded, setExpanded] = useState(activeProfile || null);

  return (
    <React.Fragment>
      {open && <div onClick={onClose} style={{
        position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex: 1050, transition:"opacity .2s",
      }}/>}
      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0,
        width: "min(360px, 88vw)",
        background: "#fff", zIndex: 1060,
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform .25s ease",
        display: "flex", flexDirection: "column",
        boxShadow: "var(--emu-shadow-dropdown)",
      }}>
        <div style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--emu-border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <a href="#home" onClick={(e)=>{e.preventDefault(); onNavigate({view:"home"}); onClose();}}
             style={{fontSize:"1.05rem", fontWeight:600, color:"var(--emu-charcoal-900)", textDecoration:"none"}}>
            Esplora il Museo
          </a>
          <button onClick={onClose} aria-label="Chiudi"
                  style={{background:"transparent", border:0, fontSize:20, cursor:"pointer", color:"var(--emu-charcoal-700)", padding:8}}>✕</button>
        </div>

        <div style={{padding: 16, overflowY: "auto", flex: 1}}>
          {/* profile bar */}
          <section style={{
            padding: 16, border: "1px solid var(--emu-border)", borderRadius: 18,
            marginBottom: 12, display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "var(--emu-gray-100)",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20,
              flexShrink:0,
            }}>👤</div>
            <div>
              <div style={{fontSize:".8rem", color:"var(--emu-fg-muted)"}}>Profilo attivo</div>
              <div style={{fontSize:".95rem", fontWeight:600, color:"var(--emu-charcoal-900)", marginTop:2}}>
                {activeProfile ? PROFILE_MENU.find(p=>p.id===activeProfile)?.label : "Nessun profilo selezionato"}
              </div>
              <div style={{fontSize:".8rem", color:"var(--emu-fg-muted)", marginTop:2}}>
                {activeProfile ? "Buona visita!" : "Scegli un profilo per iniziare."}
              </div>
            </div>
          </section>

          {/* main link */}
          <nav>
            <a href="#home" onClick={(e)=>{e.preventDefault(); onNavigate({view:"home"}); onClose();}}
               style={{
                 display:"flex", alignItems:"center", minHeight:44, padding:".6rem 0",
                 fontWeight:600, color:"var(--emu-blue-600)", textDecoration:"none",
               }}>Home page</a>
          </nav>

          <hr style={{border:0, borderTop:"1px solid var(--emu-border)", margin:"12px 0"}}/>

          {/* profile accordion */}
          <div>
            {PROFILE_MENU.map((p) => {
              const isOpen = expanded === p.id;
              return (
                <div key={p.id} style={{ borderBottom: "1px solid var(--emu-border)" }}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : p.id)}
                    style={{
                      width:"100%", textAlign:"left",
                      padding: "1rem 0", minHeight: 44,
                      background: "transparent", border: 0, cursor: "pointer",
                      font: "inherit", fontSize: ".95rem", color: "var(--emu-charcoal-900)",
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                    }}
                  >
                    <span style={{fontWeight: 500}}>{p.label}</span>
                    <span style={{color:"var(--emu-fg-muted)", fontSize:12}}>{isOpen ? "▾" : "▸"}</span>
                  </button>
                  {isOpen && (
                    <div style={{paddingBottom: 8}}>
                      {ROOMS.map(r => (
                        <a key={r.id}
                           href="#"
                           onClick={(e)=>{e.preventDefault(); onNavigate({view:"room", profile:p.id, room:r.id}); onClose();}}
                           style={{
                             display:"flex", alignItems:"center", minHeight:44,
                             padding:".5rem .75rem", fontSize:".9rem", borderRadius: 8,
                             textDecoration:"none",
                             color: (activeProfile===p.id && activeRoom===r.id) ? "var(--emu-blue-600)" : "var(--emu-charcoal-700)",
                             background: (activeProfile===p.id && activeRoom===r.id) ? "var(--emu-blue-100)" : "transparent",
                             fontWeight: (activeProfile===p.id && activeRoom===r.id) ? 600 : 400,
                           }}>
                          {r.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <hr style={{border:0, borderTop:"1px solid var(--emu-border)", margin:"16px 0"}}/>

          <a href="#lang" onClick={(e)=>{e.preventDefault(); onNavigate({view:"language"}); onClose();}}
             style={{
               display:"flex", alignItems:"center", minHeight:44, padding:".6rem 0",
               fontWeight:600, color:"var(--emu-charcoal-700)", textDecoration:"none", gap:8,
             }}>
             <span>🌐</span> Choose your language
          </a>
        </div>
      </aside>
    </React.Fragment>
  );
}

window.Drawer = Drawer;
