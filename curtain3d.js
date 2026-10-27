// ม่านเวที 3D (Three.js) เปิดจากกลาง ผ้ารวบเป็นทรงตัววี แล้วถูกดึงขึ้นออกจากจอ
// ถ้า WebGL ใช้ไม่ได้ จะกลับไปใช้ม่าน CSS เดิมอัตโนมัติ
(function(){try{
const T=window.THREE,cv=document.getElementById('cc');if(!T||!cv)return;
const r=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
r.setClearColor(0,0);r.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.5:2));
const sc=new T.Scene(),cam=new T.PerspectiveCamera(40,1,.1,50);cam.position.z=10;
sc.add(new T.AmbientLight(0xffffff,.55));
const d1=new T.DirectionalLight(0xffffff,.6);d1.position.set(-2,3,6);sc.add(d1);
const mat=new T.MeshPhongMaterial({vertexColors:true,specular:0x442a26,shininess:20,side:T.DoubleSide,transparent:true});
const LO=innerWidth<760||(navigator.hardwareConcurrency||8)<=4,NU=LO?40:64,NV=LO?26:40,G=new T.Group();sc.add(G);
const sides=[-1,1].map(s=>{const g=new T.PlaneGeometry(1,1,NU,NV);
 g.setAttribute('color',new T.BufferAttribute(new Float32Array((NU+1)*(NV+1)*3),3));G.add(new T.Mesh(g,mat));return{g,s}});
const rod=new T.Mesh(new T.CylinderGeometry(.07,.07,1,16).rotateZ(Math.PI/2),new T.MeshBasicMaterial({color:0xd9b25a,transparent:true}));sc.add(rod);
const L=(a,b,t)=>a+(b-a)*t,cl=x=>Math.max(0,Math.min(1,x)),BASE=[.62,.08,.12];
let visH=7.28,start=-1,done=null,end=false;
function upd(o,time,tt){const P=o.g.attributes.position,C=o.g.attributes.color;let k=0;
 for(let iy=0;iy<=NV;iy++){const v=iy/NV;for(let ix=0;ix<=NU;ix++,k++){const u=ix/NU;
  const er=cl((tt-.3*(1-v)-.2*(1-u))/2.6),e=er*er*(3-2*er),sn=Math.sin(Math.PI*e);
  // ยกม่าน
  const xo=1-(1-v)*.61*(1-u);
  const x=L(u,xo,e)-sn*.07*v*(1-u)*(1-u);
  const y=L(1.03-2.06*v,1.03-1.73*v,e)+sn*.05*v;
  const ph=u*Math.PI*13+.6,A=L(.14,.55,e)*(.55+.45*u);
  const z=A*Math.sin(ph)+sn*.2*v*Math.sin(v*5+u*3-tt*6)+(tt<0?.05*v*Math.sin(time*1.3+u*4+v*2):0);
  P.setXYZ(k,o.s*x,y,z);
  const sh=(.28+.72*Math.pow(.5+.5*Math.cos(ph-1.2),1.5))*(1-.4*v);
  C.setXYZ(k,BASE[0]*sh,BASE[1]*sh,BASE[2]*sh)}}
 P.needsUpdate=C.needsUpdate=true;o.g.computeVertexNormals()}
function fit(){const w=innerWidth,h=innerHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();
 visH=2*10*Math.tan(20*Math.PI/180);const visW=visH*w/h;G.scale.set(visW/2,visH/2,1);rod.scale.x=visW;rod.position.y=visH/2-.12}
addEventListener('resize',fit);fit();
const t0=performance.now();
function finish(){if(end)return;end=true;setTimeout(()=>{try{r.dispose()}catch(e){}cv.remove();document.body.classList.remove('cur3d');done&&done()},0)}
(function loop(){if(end)return;requestAnimationFrame(loop);
 try{const time=(performance.now()-t0)/1000,tt=start<0?-1:(performance.now()-start)/1000;
 sides.forEach(o=>upd(o,time,tt));
 const q=cl((tt-3.3)/.9),lift=q*q;           // ม่านหาย
 G.position.y=lift*visH*.9;mat.opacity=1-cl((tt-3.5)/.7);
 rod.material.opacity=1-cl((tt-.1)/.6);rod.visible=rod.material.opacity>.01;
 if(tt>4.3)return finish();
 r.render(sc,cam)}catch(e){console.warn(e);finish()}})();
window.tentCurtain={open(cb){done=cb;if(matchMedia('(prefers-reduced-motion:reduce)').matches)return finish();
 start=performance.now();setTimeout(finish,5200)}};
document.body.classList.add('cur3d');
}catch(e){console.warn('ม่าน 3D ใช้ไม่ได้ ใช้ม่าน CSS แทน',e)}})();
