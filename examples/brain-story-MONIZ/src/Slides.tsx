import React from 'react';
import {AbsoluteFill, useCurrentFrame, Img, staticFile} from 'remotion';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/barlow/600.css';
// Carousel for Thu 2026-11-26 "Dye in the brain, 1927" (Brain Story #11): v4 standard = Gemini backgrounds (1-3) + paper card / real images (4-6)
const C={bg:'#1A1B20',card:'#2D2F37',red:'#E0263A',orange:'#F28C28',yellow:'#FFD23F',green:'#2DBE6C',text:'#F2F2F4',mute:'#9C9EA8'};
const H="'Barlow Condensed', sans-serif", B="'Barlow', sans-serif";
const depth='4px 4px 0 #0B0B0E, 8px 8px 0 #0B0B0E, 12px 16px 30px rgba(0,0,0,.7)';
const T: React.FC<{s?:number;c?:string;children:React.ReactNode}> = ({s=110,c=C.text,children}) => <div style={{fontFamily:H,fontWeight:900,fontSize:s,lineHeight:0.92,color:c,textTransform:'uppercase',textShadow:depth}}>{children}</div>;
const P: React.FC<{s?:number;c?:string;children:React.ReactNode}> = ({s=46,c=C.text,children}) => <div style={{fontFamily:B,fontWeight:600,fontSize:s,lineHeight:1.25,color:c}}>{children}</div>;
const Box: React.FC<{bg:string;children:React.ReactNode;w?:number}> = ({bg,children,w}) => <div style={{background:bg,borderRadius:26,padding:'24px 34px',width:w,boxShadow:'0 10px 0 #0B0B0E'}}>{children}</div>;
const Ph: React.FC<{src:string;w:number;h:number;cap:string;label?:string;pos?:string;fit?:'cover'|'contain'}> = ({src,w,h,cap,label,pos='center',fit='cover'}) => (
  <div style={{background:'#f4f1ea',padding:12,borderRadius:6,width:w,boxShadow:'0 24px 50px rgba(0,0,0,.6)'}}>
    <div style={{width:w-24,height:h,overflow:'hidden',background:fit==='contain'?'#fff':'#111'}}><Img src={staticFile(src)} style={{width:'100%',height:'100%',objectFit:fit,objectPosition:pos,display:'block'}}/></div>
    {label && <div style={{fontFamily:H,fontWeight:900,fontSize:40,color:'#1A1B20',textAlign:'center',paddingTop:6}}>{label}</div>}
    <div style={{fontFamily:B,fontWeight:600,fontSize:19,color:'#666',textAlign:'center',paddingTop:4}}>{cap}</div></div>);
const Frame: React.FC<{n:number;bg?:string;children:React.ReactNode}> = ({n,bg,children}) => (
  <AbsoluteFill style={{background:`radial-gradient(circle at 50% 70%, #25262E 0%, ${C.bg} 70%)`,color:C.text}}>
    {bg && <><Img src={staticFile(bg)} style={{position:'absolute',inset:0,width:1080,height:1350,objectFit:'cover'}}/>
      <AbsoluteFill style={{background:'linear-gradient(180deg, rgba(26,27,32,.85) 0%, rgba(26,27,32,.25) 40%, rgba(26,27,32,.1) 60%, rgba(26,27,32,.85) 100%)'}}/></>}
    <AbsoluteFill style={{padding:'60px 70px 90px',display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontFamily:H,fontWeight:800,fontSize:40}}>#NeuroMot</div>
        <div style={{display:'flex',gap:14}}>
          <div style={{border:`3px solid ${C.orange}`,color:C.orange,fontFamily:H,fontWeight:900,fontSize:34,padding:'2px 14px',borderRadius:10,background:'rgba(26,27,32,.6)'}}>BRAIN STORY #11</div>
          <div style={{background:C.red,color:'#fff',fontFamily:H,fontWeight:900,fontSize:34,padding:'4px 16px',borderRadius:10}}>TRUE CASE · 1927</div>
        </div>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:bg?'space-between':'center',gap:bg?18:34,paddingTop:bg?36:0,paddingBottom:bg?40:0}}>{children}</div>
    </AbsoluteFill>
    <div style={{position:'absolute',right:70,bottom:50,fontFamily:H,fontWeight:900,fontSize:44,color:C.mute}}>{n}/6</div>
  </AbsoluteFill>);
const Opt: React.FC<{t:string;c:string}> = ({t,c}) => <div style={{background:c,borderRadius:18,padding:'10px 30px',fontFamily:H,fontWeight:900,fontSize:70,color:'#fff',boxShadow:'0 8px 0 #0B0B0E'}}>{t}</div>;
const Row: React.FC<{c:string;children:React.ReactNode}> = ({c,children}) => <div style={{background:C.card,borderLeft:`14px solid ${c}`,borderRadius:16,padding:'12px 26px',fontFamily:H,fontWeight:900,fontSize:56,color:'#fff'}}>{children}</div>;

export const Slides: React.FC = () => {
  const f=useCurrentFrame();
  if(f===0) return (<Frame n={1} bg="car1.jpg">
    <div><P s={46}>1927: he lit up the brain’s arteries. 1949: he won a Nobel… for the <b style={{color:C.orange}}>lobotomy</b>.</P><T s={130}>Should a Nobel ever be<br/><span style={{color:C.orange}}>taken back?</span></T></div>
    <div style={{display:'flex',flexDirection:'column',gap:22}}><div style={{display:'flex',gap:22,flexWrap:'wrap'}}><Opt t="1 = YES" c={C.green}/><Opt t="2 = NO" c={C.red}/></div>
    <T s={54} c={C.yellow}>swipe: the full story →</T></div>
  </Frame>);
  if(f===1) return (<Frame n={2} bg="car2.jpg">
    <div><T s={190} c={C.text}>1927.</T><T s={100} c={C.orange}>Dye in the arteries</T></div>
    <Box bg="rgba(45,47,55,.92)"><P s={40}>On an X-ray, brain vessels are invisible. <b>Egas Moniz</b> (Lisbon) injected dye into the big artery in the neck, the <b style={{color:C.yellow}}>carotid</b>. First tries failed and one patient died. With <b style={{color:C.orange}}>sodium iodide</b>, the arteries showed up white.</P></Box>
  </Frame>);
  if(f===2) return (<Frame n={3} bg="car3.jpg">
    <div><P s={44}>Nominated for a Nobel for it… passed over. Then:</P><T s={190} c={C.orange}>1949</T></div>
    <Box bg="rgba(45,47,55,.92)"><P s={40}>He won the Nobel Prize (shared with W.R. Hess) <b style={{color:C.red}}>“for his discovery of the therapeutic value of leucotomy in certain psychoses”</b>. Leucotomy = the <b style={{color:C.yellow}}>lobotomy</b>.</P></Box>
  </Frame>);
  if(f===3) return (<Frame n={4}>
    <T s={100} c={C.orange}>The paper</T>
    <div style={{background:'#f4f1ea',borderRadius:8,padding:'26px 36px',transform:'rotate(-1.2deg)',boxShadow:'0 24px 50px rgba(0,0,0,.6)'}}>
      <div style={{fontFamily:B,fontWeight:600,fontSize:24,color:'#8a1c25',letterSpacing:2}}>REVUE NEUROLOGIQUE · PARIS · JULY 1927</div>
      <div style={{fontFamily:H,fontWeight:900,fontSize:62,lineHeight:0.98,color:'#1A1B20',marginTop:8}}>L’encéphalographie artérielle, son importance dans la localisation des tumeurs cérébrales</div>
      <div style={{fontFamily:B,fontWeight:600,fontSize:30,color:'#333',marginTop:10}}>Moniz E</div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      <Row c={C.yellow}>1927 · shown in Paris</Row>
      <Row c={C.orange}>Dye into the carotid artery</Row>
      <Row c={C.green}>A tumour pushes vessels aside</Row>
    </div>
  </Frame>);
  if(f===4) return (<Frame n={5}>
    <T s={96} c={C.orange}>Save this for your exam</T>
    <div style={{display:'flex',gap:24,justifyContent:'center',alignItems:'flex-start'}}>
      <Ph src="angio_crop.jpg" w={460} h={420} label="an angiogram" cap="U2em · CC BY-SA 3.0"/>
      <Ph src="gray519_arteries_base.png" w={420} h={420} label="the arteries" cap="Gray’s Anatomy (1918) fig. 519 · public domain" fit="contain"/>
    </div>
    <Box bg={C.card}><P s={40}><b style={{color:C.yellow}}>Angiography:</b> contrast dye in the arteries makes them show up on X-ray. A tumour shows itself by <b style={{color:C.red}}>pushing the vessels out of their normal path</b>.</P></Box>
  </Frame>);
  return (<Frame n={6}>
    <T s={100}>So… <span style={{color:C.orange}}>1 or 2?</span></T>
    <div style={{display:'flex',gap:22,justifyContent:'center'}}>
      <Ph src="moniz_portrait.jpg" w={380} h={440} label="Egas Moniz" cap="public domain (Wikimedia Commons)" pos="50% 25%"/>
    </div>
    <Box bg={C.card}><P s={40}>Should a Nobel ever be taken back? <b style={{color:C.green}}>1 = yes</b>, <b style={{color:C.red}}>2 = no</b>. Send this to the friend who loves a plot twist.</P></Box>
    <P s={21} c={C.mute}>Sources: Moniz E. L’encéphalographie artérielle, son importance dans la localisation des tumeurs cérébrales. Rev Neurol (Paris) 1927 · Artico M et al. Egas Moniz: 90 years (1927–2017) from cerebral angiography. Front Neuroanat 2017;11:81. doi:10.3389/fnana.2017.00081 · Ligon BL. Neurosurgery 1998;43(3):602–11 · nobelprize.org. Images: slides 1–3 made with Google Gemini; Wikimedia Commons (Moniz portrait and Gray’s fig. 519, public domain; angiogram U2em, CC BY-SA 3.0). For education, not medical advice.</P>
  </Frame>);
};
