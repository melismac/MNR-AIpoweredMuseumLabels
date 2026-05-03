/* global React */
function Hero({ image, title }) {
  return (
    <div style={{
      position: "relative",
      backgroundImage: `url('${image}')`,
      backgroundSize: "cover", backgroundPosition: "center",
      height: "clamp(180px, 40vh, 320px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem 1.5rem",
    }}>
      <div style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.45)"}}/>
      <h2 style={{
        position:"relative", zIndex:2,
        color:"#fff",
        fontSize:"clamp(1.25rem, 4vw, 2rem)",
        fontWeight: 700, letterSpacing: ".2px",
        margin: 0, textAlign:"center",
        textShadow: "0 1px 3px rgba(0,0,0,.4)",
        lineHeight: 1.3,
      }}>{title}</h2>
    </div>
  );
}

window.Hero = Hero;
