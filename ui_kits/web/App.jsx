/* global React, Navbar, Drawer, Hero, ProfileCard, RoomAccordion, Carousel, Footer, LanguagePicker, Button */
const { useState: useS, useEffect } = React;

const PROFILES = [
  { id: "piccolo",    label: "Il piccolo visitatore",
    img: "../../assets/profiles/piccolo_visitatore.jpeg",
    hero: "../../assets/hero/ragazzo_altamura.jpg",
    desc: "Scopri il Museo come un grande viaggio pieno di curiosità e meraviglia, dove anche i più piccoli possono divertirsi! Tra oggetti, personaggi e storie sorprendenti, passo dopo passo scopri come è nata l'Italia.",
    cta:  "Inizia l'avventura" },
  { id: "curioso",    label: "Il curioso",
    img: "../../assets/profiles/curioso.jpg",
    hero: "../../assets/hero/cospiratore_romantico.jpg",
    desc: "Ti piace scoprire e farti domande? Anche se non conosci ancora bene il Risorgimento, il Museo è il luogo ideale per lasciarti guidare da racconti, oggetti e personaggi che ti accompagneranno nella storia d'Italia.",
    cta:  "Scopri il Risorgimento" },
  { id: "visionario", label: "Il visionario",
    img: "../../assets/profiles/visionario.jpeg",
    hero: "../../assets/hero/garibaldi_marsala.jpg",
    desc: "Credi nel potere delle idee capaci di cambiare il mondo e unire le persone? Il Museo celebra chi ha saputo mettersi al servizio di un ideale comune.",
    cta:  "Tuffati nel passato" },
  { id: "esperto",    label: "L'esperto",
    img: "../../assets/profiles/esperto.jpeg",
    hero: "../../assets/hero/cavour_ritratto2.jpg",
    desc: "Cerchi di comprendere davvero il perché delle cose? Il Museo è la tua biblioteca vivente: un luogo dove ogni oggetto diventa chiave per interpretare il passato.",
    cta:  "Riscopri la storia" },
];

function HomeView({ onPickProfile }) {
  return (
    <React.Fragment>
      <Hero image="../../assets/hero/facciata_home.jpg"
            title="Scopri il Museo Nazionale del Risorgimento Italiano" />
      <main style={{padding:"2rem 0 3rem"}}>
        <div style={{maxWidth: 1140, margin:"0 auto", padding:"0 16px"}}>
          <section style={{marginBottom: "2rem"}}>
            <div style={{marginBottom: "1.25rem", textAlign:"center"}}>
              <h2 style={{fontSize:"1.5rem", fontWeight:600, letterSpacing:".2px", margin:"0 0 .75rem"}}>
                Seleziona il tuo profilo
              </h2>
              <p style={{color:"var(--emu-fg-muted)", maxWidth: 780, margin:"0 auto", lineHeight: 1.7}}>
                Scegli il <b>profilo</b> che ti somiglia di più e lasciati guidare: nel momento in cui ti riconosci,
                inizia il tuo viaggio tra le storie del Museo. Ogni profilo ti condurrà ad una narrazione pensata per
                accompagnarti con la voce più vicina al tuo modo di esplorare la storia.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
              padding: "1rem 0",
            }}>
              {PROFILES.map(p=>(
                <ProfileCard key={p.id}
                  image={p.img} title={p.label} description={p.desc} cta={p.cta}
                  onClick={()=>onPickProfile(p.id)} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </React.Fragment>
  );
}

function RoomView({ profileId, roomId, onNext }) {
  const profile = PROFILES.find(p=>p.id===profileId) || PROFILES[0];
  return (
    <React.Fragment>
      <Hero image="../../assets/rooms/sala_1.jpg" title="Introduzione" />
      <main style={{padding:"2rem 0 3rem"}}>
        <div style={{maxWidth: 1140, margin:"0 auto", padding:"0 16px"}}>
          <section style={{marginBottom:"2.5rem"}}>
            <div style={{display:"flex", flexWrap:"wrap", gap:"1.5rem", alignItems:"center"}}>
              <div style={{flex:"1 1 380px"}}>
                <h3 style={{fontSize:"1.15rem", fontWeight:600, margin:"0 0 .75rem"}}>Introduzione</h3>
                <p style={{color:"var(--emu-fg-muted)", lineHeight: 1.7, margin: 0}}>
                  Il viaggio per scoprire il Museo Nazionale del Risorgimento Italiano continua!
                  Inizia con il profilo de <b>{profile.label}</b>, dove ogni tappa è pensata per
                  accompagnarti fra i protagonisti, gli oggetti e le storie che hanno costruito l'Italia.
                </p>
              </div>
              <div style={{flexShrink:0}}>
                <img src={profile.hero} alt=""
                     style={{maxWidth: 220, width:"100%", borderRadius: 14, display:"block"}}/>
              </div>
            </div>
          </section>

          <section style={{marginBottom:"2rem"}}>
            <RoomAccordion title="Introduzione alla Sala" defaultOpen>
              <div style={{display:"flex", flexWrap:"wrap", gap:"1.5rem", alignItems:"center"}}>
                <div style={{flex:"1 1 320px"}}>
                  <p style={{color:"var(--emu-fg-muted)", lineHeight:1.7, margin: 0}}>
                    La Sala 1 raccoglie i cimeli donati alla città di Torino fra il 1878 e il 1884,
                    oggetti che raccontano il lento cammino dell'Italia verso l'Unità.
                    Ritratti, busti, bandiere e reliquie personali dei protagonisti accompagnano
                    il visitatore nella sua prima tappa al Museo.
                  </p>
                </div>
                <div style={{flex:"1 1 320px"}}>
                  <Carousel images={[
                    "../../assets/rooms/sala_1.jpg",
                    "../../assets/rooms/busto_cavour.jpg",
                    "../../assets/rooms/scalone.jpg",
                  ]}/>
                </div>
              </div>
            </RoomAccordion>

            <RoomAccordion title="Media e Risorse">
              <p style={{color:"var(--emu-fg-muted)", lineHeight:1.7, marginTop:0}}>
                Guarda il video introduttivo sul Museo e immergiti nella storia del Risorgimento.
              </p>
              <div style={{
                background:"#000", borderRadius:14, aspectRatio:"16/9",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"rgba(255,255,255,.7)", fontSize:".875rem",
              }}>▶ sala1_intro.mp4</div>
            </RoomAccordion>

            <div style={{
              background:"#fff", border:"1px solid var(--emu-gray-200)", borderRadius:14,
              padding:"1.25rem", marginTop:16,
            }}>
              <h3 style={{margin:"0 0 .75rem", textAlign:"center", fontSize:"1.15rem"}}>Scorri la linea del Tempo!</h3>
              <div style={{
                background:"var(--emu-gray-100)", borderRadius:10,
                height: 180, display:"flex", alignItems:"center", justifyContent:"center",
                color:"var(--emu-fg-muted)", fontSize:".875rem",
              }}>KnightLab Timeline · embed</div>
            </div>
          </section>

          <section style={{textAlign:"right"}}>
            <Button variant="primary" onClick={onNext}>Sala 1</Button>
          </section>
        </div>
      </main>
    </React.Fragment>
  );
}

function App() {
  const [lang, setLang] = useS(() => localStorage.getItem("emu_lang"));
  const [drawer, setDrawer] = useS(false);
  const [view, setView] = useS(() => lang ? "home" : "language");
  const [profile, setProfile] = useS(() => localStorage.getItem("emu_profile"));
  const [room, setRoom] = useS("sala_0");

  useEffect(()=>{ if (lang) localStorage.setItem("emu_lang", lang); }, [lang]);
  useEffect(()=>{ if (profile) localStorage.setItem("emu_profile", profile); }, [profile]);

  const navigate = (target) => {
    if (target.view === "language") setView("language");
    if (target.view === "home") setView("home");
    if (target.view === "room") {
      setProfile(target.profile);
      setRoom(target.room);
      setView("room");
    }
  };

  return (
    <React.Fragment>
      {view !== "language" && <Navbar onMenuClick={()=>setDrawer(true)}/>}
      <Drawer open={drawer} onClose={()=>setDrawer(false)}
              activeProfile={profile} activeRoom={room}
              onNavigate={navigate}/>

      {view === "language" && <LanguagePicker onPick={(l)=>{ setLang(l); setView("home"); }}/>}
      {view === "home" && <HomeView onPickProfile={(id)=>{ setProfile(id); setRoom("sala_0"); setView("room"); }}/>}
      {view === "room" && <RoomView profileId={profile} roomId={room}
                                    onNext={()=>{ setRoom("sala_1"); }}/>}

      {view !== "language" && <Footer/>}
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
