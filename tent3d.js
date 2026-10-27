// ฉาก 3D เต็นท์แม่หมอ (Three.js r128) — ถ้าเปิด WebGL ไม่ได้ เว็บจะใช้ฉาก 2D เดิมต่อ
(function(){try{
const T=window.THREE;if(!T)return;
const cv=document.getElementById('gl'),r=new T.WebGLRenderer({canvas:cv,antialias:true});
r.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.5:2));
const sc=new T.Scene();sc.background=new T.Color(0x120820);sc.fog=new T.Fog(0x120820,11,26);
const cam=new T.PerspectiveCamera(48,1,.1,60);
const M=(c,o)=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:.8},o));
const B=c=>new T.MeshBasicMaterial({color:c});
const add=(g,m,x,y,z,p)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);(p||sc).add(o);return o};
const GOLD=0xf2c66d;
// เต็นท์
const c2=document.createElement('canvas');c2.width=512;c2.height=8;const g=c2.getContext('2d');
for(let i=0;i<16;i++){g.fillStyle=i%2?'#c9a24a':'#7a1226';g.fillRect(i*32,0,32,8)}
const st=new T.CanvasTexture(c2);st.wrapS=T.RepeatWrapping;
add(new T.CylinderGeometry(.3,11,10,32,1,true),new T.MeshStandardMaterial({map:st,side:T.BackSide,roughness:1,color:0xb890b0}),0,5,0);
const fl=add(new T.CircleGeometry(11,48),M(0x2a1349),0,0,0);fl.rotation.x=-Math.PI/2;
const rug=add(new T.CircleGeometry(4.6,48),M(0x5a1a3a),0,.01,.6);rug.rotation.x=-Math.PI/2;
const rg=add(new T.RingGeometry(4.3,4.6,48),M(GOLD,{metalness:.5}),0,.02,.6);rg.rotation.x=-Math.PI/2;
// โต๊ะ
add(new T.CylinderGeometry(3.2,3.5,1.1,48),M(0x4b1f7a),0,.55,1.2);
add(new T.CylinderGeometry(3.25,3.25,.12,48),M(0x6a2d9e),0,1.12,1.2);
const tr=add(new T.TorusGeometry(3.25,.05,8,64),M(GOLD,{metalness:.6}),0,1.12,1.2);tr.rotation.x=Math.PI/2;
// แม่หมอ
const tl=new T.Group();tl.position.set(0,0,-1.4);sc.add(tl);
add(new T.ConeGeometry(1.25,2.8,32),M(0x2f1560),0,1.5,0,tl);
const sh=add(new T.SphereGeometry(.8,24,16),M(0x3a1c70),0,2.55,0,tl);sh.scale.set(1.3,.7,.9);
const head=new T.Group();tl.add(head);
add(new T.SphereGeometry(.62,32,24),M(0x4a2680),0,3.15,0,head);
const tip=add(new T.ConeGeometry(.5,.8,24),M(0x4a2680),0,3.75,-.1,head);tip.rotation.x=-.3;
add(new T.SphereGeometry(.46,24,16),B(0x05020a),0,3.12,.22,head);
const vm=new T.MeshStandardMaterial({color:0x7a4ac0,side:T.DoubleSide,roughness:.6});
add(new T.CylinderGeometry(.47,.42,.3,20,1,true,-Math.PI/2,Math.PI),vm,0,2.98,.22,head);
add(new T.SphereGeometry(.05,12,8),B(GOLD),0,3.5,.55,head);
const eyes=[-.17,.17].map(x=>add(new T.SphereGeometry(.06,12,8),B(0xffd77a),x,3.2,.65,head));
// แขน มือ ลูกแก้ว
[-1,1].forEach(s=>{const sl=add(new T.CylinderGeometry(.2,.3,1.4,16),M(0x3a1c70),s*.75,1.85,-.6);sl.rotation.x=-.6;sl.rotation.z=s*.12;
 add(new T.SphereGeometry(.14,16,12),M(0xd9b48f),s*.62,1.3,.2)});
add(new T.CylinderGeometry(.3,.4,.2,24),M(GOLD,{metalness:.6}),0,1.28,.2);
const ball=add(new T.SphereGeometry(.45,32,24),new T.MeshPhysicalMaterial({color:0x9a7bff,transparent:true,opacity:.6,emissive:0x5a3ad0,emissiveIntensity:.8,roughness:.05}),0,1.75,.2);
const bl=new T.PointLight(0xa58bff,1.6,7);bl.position.set(0,1.9,.4);sc.add(bl);
// เทียน
const fls=[-2.3,2.3].map(x=>{add(new T.CylinderGeometry(.12,.12,.7,16),M(0xf5e8c8),x,1.5,.6);
 const f=add(new T.SphereGeometry(.08,12,8),B(0xffc060),x,1.95,.6);f.scale.y=1.7;
 const l=new T.PointLight(0xff9a40,1.2,8);l.position.set(x,2.1,.8);sc.add(l);return [f,l]});
sc.add(new T.AmbientLight(0x7a5aa8,.55));
// ฝุ่นประกาย
const N=140,pa=new Float32Array(N*3);for(let i=0;i<N;i++){const a=Math.random()*6.28,d=Math.random()*6;pa.set([Math.cos(a)*d,.6+Math.random()*7,Math.sin(a)*d],i*3)}
const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pa,3));
const pts=new T.Points(pg,new T.PointsMaterial({color:GOLD,size:.07,transparent:true,opacity:.8}));sc.add(pts);
// กล้อง ตอบสนองเมาส์/การเอียงมือถือ
const base={z:8.5,ly:2.3};let mx=0,cx=0,boost=0;
window.tentFx=()=>{boost=1};
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5});
addEventListener('deviceorientation',e=>{if(e.gamma!=null)mx=Math.max(-.5,Math.min(.5,e.gamma/60))});
function fit(){const w=innerWidth,h=innerHeight,a=w/h,p=Math.max(0,1-a);r.setSize(w,h,false);cam.aspect=a;cam.fov=48+p*30;base.z=8.5+p*3;base.ly=2.3+p*1.1;cam.updateProjectionMatrix()}
addEventListener('resize',fit);fit();
const t0=performance.now();
(function loop(){requestAnimationFrame(loop);
 if(document.body.classList.contains('ovopen'))return;
 const t=(performance.now()-t0)/1000;cx+=(mx-cx)*.04;boost*=.985;
 cam.position.set(cx*1.6,3.4,base.z);cam.lookAt(0,base.ly,.5);
 tl.position.y=Math.sin(t*1.2)*.03;head.rotation.y=cx*.7;
 const bk=(t%4<.12)?.1:1+boost*.6;eyes.forEach(e=>e.scale.set(1+boost*.6,bk,1));
 ball.material.emissiveIntensity=.8+Math.sin(t*2)*.2+boost*1.6;bl.intensity=1.6+Math.sin(t*2)*.3+boost*2.5;
 fls.forEach(([f,l],i)=>{const k=.85+Math.random()*.3;f.scale.set(k,1.7*k,k);l.intensity=1.2*k});
 pts.rotation.y=t*.03;pts.position.y=Math.sin(t*.5)*.1;
 r.render(sc,cam)})();
document.body.classList.add('g3');
}catch(e){console.warn('3D ใช้ไม่ได้ ใช้ฉาก 2D แทน',e)}})();
