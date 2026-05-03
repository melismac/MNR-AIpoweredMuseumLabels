/* global React */
const { useState: useStatePC } = React;

function ProfileCard({ image, title, description, cta, onClick }) {
  const [hover, setHover] = useStatePC(false);
  return (
    <article
      onClick={onClick}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      style={{
        background: "#fff",
        border: "1px solid var(--emu-gray-200)",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: hover
          ? "0 8px 24px rgba(60,64,67,0.18)"
          : "0 2px 8px rgba(60,64,67,0.10)",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        transition: "box-shadow .2s ease, transform .2s ease",
        cursor: "pointer",
        display: "flex", flexDirection: "column",
        height: "100%",
      }}
    >
      <img src={image} alt={title}
           style={{width:"100%", aspectRatio:"4/3", objectFit:"cover", display:"block"}}/>
      <div style={{
        padding: "1.25rem",
        display: "flex", flexDirection: "column", gap: ".75rem",
        flexGrow: 1,
      }}>
        <h3 style={{
          margin: 0, fontSize: "1.15rem", fontWeight: 600,
          letterSpacing: ".2px", lineHeight: 1.3,
          color: "var(--emu-charcoal-900)",
        }}>{title}</h3>
        <p style={{
          margin: 0, fontSize: ".95rem", lineHeight: 1.7,
          color: "var(--emu-fg-muted)", flexGrow: 1,
        }}>{description}</p>
        <Button variant="primary" full>{cta}</Button>
      </div>
    </article>
  );
}

window.ProfileCard = ProfileCard;
