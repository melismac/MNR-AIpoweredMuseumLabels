/* global React */
const { useState: useStateRA } = React;

function RoomAccordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useStateRA(defaultOpen);
  return (
    <div style={{
      background: "#fff",
      border: "1px solid var(--emu-gray-200)",
      borderRadius: 14,
      overflow: "hidden",
      marginBottom: 16,
    }}>
      <button
        onClick={()=>setOpen(!open)}
        style={{
          width:"100%", textAlign:"left",
          minHeight: 44,
          padding: "1rem 1.25rem",
          background: open ? "var(--emu-gray-100)" : "#fff",
          border: 0, cursor: "pointer",
          font: "inherit", fontSize: ".95rem", fontWeight: 500,
          color: "var(--emu-charcoal-900)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "background-color .15s ease",
        }}
      >
        <span>{title}</span>
        <span style={{color:"var(--emu-fg-muted)", fontSize: 12, transition:"transform .2s ease", transform: open?"rotate(90deg)":"rotate(0)"}}>▸</span>
      </button>
      {open && (
        <div style={{padding:"1.25rem", borderTop:"1px solid var(--emu-border)"}}>
          {children}
        </div>
      )}
    </div>
  );
}

function Carousel({ images }) {
  const [idx, setIdx] = useStateRA(0);
  return (
    <div style={{position:"relative", borderRadius: 14, overflow:"hidden"}}>
      <img src={images[idx]} alt=""
           style={{width:"100%", aspectRatio:"16/9", objectFit:"cover", display:"block"}}/>
      <button onClick={()=>setIdx((idx-1+images.length)%images.length)}
              aria-label="Precedente"
              style={{
                position:"absolute", left:8, top:"50%", transform:"translateY(-50%)",
                width:36, height:36, borderRadius:"50%",
                background:"rgba(0,0,0,.45)", color:"#fff",
                border:0, cursor:"pointer", fontSize:16,
              }}>‹</button>
      <button onClick={()=>setIdx((idx+1)%images.length)}
              aria-label="Successivo"
              style={{
                position:"absolute", right:8, top:"50%", transform:"translateY(-50%)",
                width:36, height:36, borderRadius:"50%",
                background:"rgba(0,0,0,.45)", color:"#fff",
                border:0, cursor:"pointer", fontSize:16,
              }}>›</button>
      <div style={{
        position:"absolute", bottom:8, left:"50%", transform:"translateX(-50%)",
        display:"flex", gap:6,
      }}>
        {images.map((_,i)=>(
          <span key={i} style={{
            width:8, height:8, borderRadius:"50%",
            background: i===idx?"#fff":"rgba(255,255,255,.5)",
          }}/>
        ))}
      </div>
    </div>
  );
}

window.RoomAccordion = RoomAccordion;
window.Carousel = Carousel;
