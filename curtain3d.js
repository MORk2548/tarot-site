// ม่านเวทีกำมะหยี่ 3D (Three.js) รูดเปิดออกสองข้าง ผ้าจีบซ้อนเป็นกลีบ ชายผ้าตามมาช้ากว่าเล็กน้อยเหมือนผ้าจริง
// ถ้า WebGL ใช้ไม่ได้ จะกลับไปใช้ม่าน CSS เดิมอัตโนมัติ
(function () {
    try {
        const T = window.THREE, cv = document.getElementById('cc'); if (!T || !cv) return;
        const r = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
        r.setClearColor(0, 0); r.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1.5 : 2));
        const sc = new T.Scene(), cam = new T.PerspectiveCamera(40, 1, .1, 50); cam.position.z = 10;
        sc.add(new T.AmbientLight(0xffe6e6, .5));
        const d1 = new T.DirectionalLight(0xfff2d8, .75); d1.position.set(-3, 4, 6); sc.add(d1);
        const d2 = new T.DirectionalLight(0xff6a8a, .35); d2.position.set(4, -2, 5); sc.add(d2);
        const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); const t = new T.CanvasTexture(c); t.anisotropy = 4; return t };
        const star = (g, x, y, R) => { g.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, q = i % 2 ? R * .42 : R; g.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q) } g.fill() };
        const moon = (g, x, y, R) => { g.save(); g.beginPath(); g.arc(x, y, R, 0, 7); g.clip(); g.beginPath(); g.arc(x, y, R, 0, 7); g.arc(x + R * .45, y - R * .2, R * .85, 0, 7); g.fill('evenodd'); g.restore() };
        function velvet(g, w, h) {
            const b = g.createLinearGradient(0, 0, 0, h); b.addColorStop(0, '#6e0a1c'); b.addColorStop(.5, '#a3152e'); b.addColorStop(1, '#7a0c20'); g.fillStyle = b; g.fillRect(0, 0, w, h);
            for (let i = 0; i < w * h / 90; i++) { g.fillStyle = `rgba(255,${180 + Math.random() * 60 | 0},200,${Math.random() * .05})`; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 3) }
        }
        // ผ้าม่าน: ขอบด้านใน (u=0) มีแถบเปียทอง ชายล่างมีลายปักดาวกับจันทร์และพู่ทอง
        const panelTex = cvs(512, 1024, (g, w, h) => {
            const F = 64; velvet(g, w, h - F);
            g.fillStyle = '#d9a840'; g.fillRect(0, 0, 16, h - F); g.fillStyle = '#fff0b0'; for (let y = 8; y < h - F; y += 22) { g.beginPath(); g.moveTo(8, y - 7); g.lineTo(14, y); g.lineTo(8, y + 7); g.lineTo(2, y); g.fill() }
            const by = h - F - 150; g.fillStyle = '#e9c46a'; g.fillRect(0, by, w, 6); g.fillRect(0, by + 128, w, 10); g.fillRect(0, by + 16, w, 2);
            for (let x = 32; x < w; x += 96) { moon(g, x, by + 70, 26); g.fillStyle = '#e9c46a'; star(g, x + 48, by + 58, 14); star(g, x + 40, by + 100, 7); star(g, x + 64, by + 92, 5) }
            for (let x = 0; x < w; x += 6) { const L = F - 10 + Math.random() * 10, gr = g.createLinearGradient(0, h - F, 0, h - F + L); gr.addColorStop(0, '#fff0b0'); gr.addColorStop(1, '#a8741c'); g.fillStyle = gr; g.fillRect(x, h - F, 4, L) }
        });
        const valTex = cvs(1024, 256, (g, w, h) => {
            velvet(g, w, h - 40); g.fillStyle = '#e9c46a'; g.fillRect(0, 10, w, 8); g.fillRect(0, h - 76, w, 8); g.fillRect(0, h - 48, w, 8);
            for (let x = 40; x < w; x += 102) { g.fillStyle = '#e9c46a'; star(g, x, 72, 18); moon(g, x + 51, 80, 14) }
            for (let x = 0; x < w; x += 7) { const L = 30 + Math.random() * 8, gr = g.createLinearGradient(0, h - 40, 0, h - 40 + L); gr.addColorStop(0, '#fff0b0'); gr.addColorStop(1, '#a8741c'); g.fillStyle = gr; g.fillRect(x, h - 40, 4, L) }
        });
        const mk = map => new T.MeshPhongMaterial({ map, vertexColors: true, specular: 0x5a2a20, shininess: 28, side: T.DoubleSide, transparent: true, alphaTest: .4 });
        const mat = mk(panelTex), vmat = mk(valTex);
        const LO = innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4, NU = LO ? 48 : 80, NV = LO ? 28 : 44, G = new T.Group(); sc.add(G);
        const mesh = (m, nu, nv) => { const g = new T.PlaneGeometry(1, 1, nu, nv); g.setAttribute('color', new T.BufferAttribute(new Float32Array((nu + 1) * (nv + 1) * 3), 3)); G.add(new T.Mesh(g, m)); return g };
        const sides = [-1, 1].map(s => ({ g: mesh(mat, NU, NV), s })), val = mesh(vmat, NU * 2, 8);
        const rod = new T.Mesh(new T.CylinderGeometry(.08, .08, 1, 16).rotateZ(Math.PI / 2), new T.MeshPhongMaterial({ color: 0xe0b450, specular: 0xffffff, shininess: 80, transparent: true })); sc.add(rod);
        // ประกายดาวที่พุ่งออกตอนเปิดม่าน
        const NP = LO ? 90 : 180, pp = new Float32Array(NP * 3), pv = [];
        for (let i = 0; i < NP; i++) { const a = Math.random() * 6.28, sp = .6 + Math.random() * 2.6; pv.push([Math.cos(a) * sp, Math.sin(a) * sp * .8 + .6, (Math.random() - .5) * 2]) }
        const pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pp, 3));
        const spark = cvs(64, 64, (g) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, '#fff'); gr.addColorStop(.25, '#ffe6a0'); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); g.fillStyle = '#fff'; g.fillRect(30, 0, 4, 64); g.fillRect(0, 30, 64, 4) });
        const pm = new T.PointsMaterial({ map: spark, size: .35, transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: 0 }), pts = new T.Points(pg, pm); sc.add(pts);
        const L = (a, b, t) => a + (b - a) * t, cl = x => Math.max(0, Math.min(1, x)), io = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        const OPEN = 2.1;
        let visH = 7.28, start = -1, done = null, end = false;
        function upd(o, time, tt) {
            const P = o.g.attributes.position, C = o.g.attributes.color; let k = 0;
            const st = tt > OPEN ? Math.exp(-(tt - OPEN) * 2.2) * Math.sin((tt - OPEN) * 7) : 0;
            for (let iy = 0; iy <= NV; iy++) {
                const v = iy / NV; for (let ix = 0; ix <= NU; ix++, k++) {
                    const u = ix / NU;
                    const e = io(cl((tt - .4 * v * v - .08 * (1 - u)) / OPEN)), sw = Math.sin(Math.PI * e);
                    const idle = tt < 0 ? .015 * v * Math.sin(time * 1.1 + v * 2.5) : 0;
                    const x = L(u, .8 + .2 * u, e) - sw * .1 * v * v * (1 - u) + st * .03 * v * (1 - u) + idle;
                    const y = 1.03 - 2.08 * v + sw * .04 * v * v;
                    const ph = u * Math.PI * 15, A = L(.1, .36, e) * (.6 + .4 * u);
                    const z = A * Math.sin(ph) + sw * .18 * v * Math.sin(v * 6 + u * 5 - tt * 7) + (tt < 0 ? .05 * v * Math.sin(time * 1.3 + u * 5 + v * 2) : 0);
                    P.setXYZ(k, o.s * x, y, z);
                    const sh = .35 + .65 * Math.pow(.5 + .5 * Math.cos(ph - 1.2), 1.3) * (1 - .25 * v);
                    C.setXYZ(k, sh, sh, sh)
                }
            }
            P.needsUpdate = C.needsUpdate = true; o.g.computeVertexNormals()
        }
        function updVal(time) {
            const P = val.attributes.position, C = val.attributes.color, nu = NU * 2; let k = 0;
            for (let iy = 0; iy <= 8; iy++) {
                const v = iy / 8; for (let ix = 0; ix <= nu; ix++, k++) {
                    const u = ix / nu, sag = Math.pow(Math.sin(Math.PI * u * 5), 2), ph = u * Math.PI * 60;
                    P.setXYZ(k, u * 2 - 1, 1.04 - v * (.13 + .07 * sag), .25 + .12 * Math.sin(Math.PI * v) * sag + .02 * Math.sin(ph) * (1 - v));
                    const sh = .6 + .4 * Math.sin(Math.PI * v * .9 + .3) * (.8 + .2 * Math.cos(ph)); C.setXYZ(k, sh, sh, sh)
                }
            }
            P.needsUpdate = C.needsUpdate = true; val.computeVertexNormals()
        }
        function fit() {
            const w = innerWidth, h = innerHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
            visH = 2 * 10 * Math.tan(20 * Math.PI / 180); const visW = visH * w / h; G.scale.set(visW / 2, visH / 2, 1); rod.scale.x = visW; rod.position.y = visH / 2 - .06
        }
        addEventListener('resize', fit); fit(); updVal(0);
        const t0 = performance.now();
        function finish() { if (end) return; end = true; setTimeout(() => { try { r.dispose() } catch (e) { } cv.remove(); document.body.classList.remove('cur3d'); done && done() }, 0) }
        (function loop() {
            if (end) return; requestAnimationFrame(loop);
            try {
                const time = (performance.now() - t0) / 1000, tt = start < 0 ? -1 : (performance.now() - start) / 1000;
                sides.forEach(o => upd(o, time, tt));
                const q = io(cl((tt - 2.2) / 1)), f = 1 - cl((tt - 2.6) / .8);
                G.position.y = q * visH * .35;
                G.children.forEach((m, i) => { if (i < 2) m.position.x = (i ? 1 : -1) * q * .35 });
                mat.opacity = vmat.opacity = rod.material.opacity = f; rod.position.y = visH / 2 - .06 + q * visH * .35;
                if (tt >= 0) {
                    const a = Math.max(0, tt - .15), d = 1 - Math.exp(-a * 1.6);
                    pv.forEach((p, i) => pp.set([p[0] * d * 3, p[1] * d * 3 - a * a * .35, p[2]], i * 3)); pg.attributes.position.needsUpdate = true;
                    pm.opacity = cl(a * 4) * (1 - cl((tt - 1.6) / 1.4)); pts.rotation.z = a * .1
                }
                if (tt > 3.45) return finish();
                r.render(sc, cam)
            } catch (e) { console.warn(e); finish() }
        })();
        window.tentCurtain = {
            open(cb) {
                done = cb; if (matchMedia('(prefers-reduced-motion:reduce)').matches) return finish();
                start = performance.now(); setTimeout(finish, 4500)
            }
        };
        document.body.classList.add('cur3d');
    } catch (e) { console.warn('ม่าน 3D ใช้ไม่ได้ ใช้ม่าน CSS แทน', e) }
})();
