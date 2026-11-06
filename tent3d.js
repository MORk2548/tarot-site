// ฉาก 3D เต็นท์แม่หมอ (Three.js r128) — ถ้าเปิด WebGL ไม่ได้ เว็บจะใช้ฉาก 2D เดิมต่อ
(function () {
    try {
        const T = window.THREE; if (!T) return;
        const LO = innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 4;
        const cv = document.getElementById('gl'), r = new T.WebGLRenderer({ canvas: cv, antialias: true });
        r.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1.5 : 2));
        r.shadowMap.enabled = !LO; r.shadowMap.type = T.PCFSoftShadowMap;
        const sc = new T.Scene(); sc.background = new T.Color(0x120820); sc.fog = new T.Fog(0x120820, 11, 26);
        const cam = new T.PerspectiveCamera(48, 1, .1, 60);
        const M = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: .8 }, o));
        const B = c => new T.MeshBasicMaterial({ color: c });
        const add = (g, m, x, y, z, p) => { const o = new T.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; (p || sc).add(o); return o };
        const tex = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; f(c.getContext('2d'), w, h); return new T.CanvasTexture(c) };
        const GOLD = 0xf2c66d, gold = M(GOLD, { metalness: .8, roughness: .3 });
        // เต็นท์
        const st = tex(512, 8, g => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#c9a24a' : '#7a1226'; g.fillRect(i * 32, 0, 32, 8) } }); st.wrapS = T.RepeatWrapping;
        add(new T.CylinderGeometry(.3, 11, 10, 32, 1, true), new T.MeshStandardMaterial({ map: st, side: T.BackSide, roughness: 1, color: 0xb890b0 }), 0, 5, 0).castShadow = false;
        const fl = add(new T.CircleGeometry(11, 48), M(0x2a1349), 0, 0, 0); fl.rotation.x = -Math.PI / 2;
        const rug = add(new T.CircleGeometry(4.6, 48), M(0x5a1a3a), 0, .01, .6); rug.rotation.x = -Math.PI / 2;
        const rg = add(new T.RingGeometry(4.3, 4.6, 48), M(GOLD, { metalness: .5 }), 0, .02, .6); rg.rotation.x = -Math.PI / 2;
        // โต๊ะ
        add(new T.CylinderGeometry(3.2, 3.5, 1.1, 48), M(0x4b1f7a), 0, .55, 1.2);
        add(new T.CylinderGeometry(3.25, 3.25, .12, 48), M(0x6a2d9e), 0, 1.12, 1.2);
        const tr = add(new T.TorusGeometry(3.25, .05, 8, 64), gold, 0, 1.12, 1.2); tr.rotation.x = Math.PI / 2;

        // แม่หมอ: ผมม่วงลาเวนเดอร์ ฮู้ดคลุม หน้าแบบอนิเมะวาดลงผิวทรงกลม
        const tl = new T.Group(); tl.position.set(0, 0, -1.4); sc.add(tl);
        const robeTex = tex(512, 256, (g, w, h) => {
            const b = g.createLinearGradient(0, 0, 0, h); b.addColorStop(0, '#4a2490'); b.addColorStop(1, '#1c0b3a'); g.fillStyle = b; g.fillRect(0, 0, w, h);
            g.fillStyle = '#f2c66d'; for (let i = 0; i < 60; i++) { const x = Math.random() * w, y = Math.random() * h, s = 1 + Math.random() * 2.5; g.fillRect(x - s, y - .5, s * 2, 1); g.fillRect(x - .5, y - s, 1, s * 2) }
            g.fillRect(0, h - 14, w, 5)
        }); robeTex.wrapS = T.RepeatWrapping; robeTex.repeat.x = 3;
        const robe = M(0xffffff, { map: robeTex, roughness: .55, side: T.DoubleSide });
        const lathe = (pts, ps, pl) => new T.LatheGeometry(pts.map(([x, y]) => new T.Vector2(x, y)), 48, ps, pl);
        add(lathe([[1.4, 0], [1.25, .5], [1.02, 1.1], [.84, 1.7], [.72, 2.2], [.6, 2.5], [.38, 2.68], [.16, 2.78]]), robe, 0, 0, 0, tl);
        const sh = add(new T.SphereGeometry(.8, 32, 20), robe, 0, 2.5, 0, tl); sh.scale.set(1.25, .62, .85);
        add(new T.CylinderGeometry(.13, .15, .35, 16), M(0xffd9c8, { roughness: .6 }), 0, 2.78, 0, tl);
        const brooch = add(new T.OctahedronGeometry(.1), M(0x7fe6ff, { emissive: 0x2a9fd0, emissiveIntensity: 1, roughness: .1, metalness: .3 }), 0, 2.55, .62, tl);

        const head = new T.Group(); head.position.set(0, 3.24, .02); head.scale.setScalar(1.15); tl.add(head);
        // mood: 0 ดวงดี (ยิ้มตาปิด), 1 กลาง ๆ, 2 ต้องระวัง (กังวล มีเหงื่อตก)
        function face(blink, mood) {
            return tex(512, 256, g => {
                g.fillStyle = '#ffe2d4'; g.fillRect(0, 0, 512, 256);
                const cx = 128, ey = 130;
                g.fillStyle = `rgba(255,120,150,${[.6, .35, .15][mood]})`; [-1, 1].forEach(s => { g.beginPath(); g.ellipse(cx + s * 40, 154, 13, 7, 0, 0, 7); g.fill() });
                [-1, 1].forEach(s => {
                    const x = cx + s * 27;
                    if (mood == 0) { g.strokeStyle = '#2a1340'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.arc(x, ey + 6, 11, 1.15 * Math.PI, 1.85 * Math.PI); g.stroke(); return }
                    if (mood == 2) { g.strokeStyle = '#2a1340'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - s * 9, ey - 24); g.lineTo(x + s * 9, ey - 19); g.stroke() }
                    if (blink) { g.strokeStyle = '#2a1340'; g.lineWidth = 3.5; g.beginPath(); g.arc(x, ey - 4, 11, .2 * Math.PI, .8 * Math.PI); g.stroke(); return }
                    g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x, ey, 11, 14, 0, 0, 7); g.fill();
                    const ir = g.createLinearGradient(0, ey - 13, 0, ey + 13); ir.addColorStop(0, '#3a1a80'); ir.addColorStop(.6, '#8a5ae0'); ir.addColorStop(1, '#ffd77a');
                    g.fillStyle = ir; g.beginPath(); g.ellipse(x + s * 1, ey + 1, 9, 12.5, 0, 0, 7); g.fill();
                    g.fillStyle = '#1a0a30'; g.beginPath(); g.ellipse(x + s * 1, ey + 1, mood == 2 ? 2.5 : 4, mood == 2 ? 4 : 6, 0, 0, 7); g.fill();
                    g.fillStyle = '#fff'; g.beginPath(); g.arc(x - 3, ey - 5, 3.4, 0, 7); g.fill(); g.beginPath(); g.arc(x + 3, ey + 5, 1.6, 0, 7); g.fill();
                    g.strokeStyle = '#2a1340'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.ellipse(x, ey + 1, 12, 15, 0, 1.12 * Math.PI, 1.9 * Math.PI); g.stroke();
                    g.lineWidth = 2.5; g.beginPath(); g.moveTo(x + s * 11, ey - 9); g.lineTo(x + s * 16, ey - 13); g.stroke()
                });
                g.strokeStyle = '#b8506a'; g.lineWidth = 2.5; g.lineCap = 'round'; g.beginPath();
                if (mood == 0) { g.moveTo(cx - 9, 152); g.quadraticCurveTo(cx, 168, cx + 9, 152); g.closePath(); g.fillStyle = '#c0485e'; g.fill(); g.fillStyle = '#ff8fa3'; g.beginPath(); g.ellipse(cx, 160, 4, 2.5, 0, 0, 7); g.fill() }
                else if (mood == 2) { g.moveTo(cx - 8, 159); for (let i = 1; i <= 4; i++) g.lineTo(cx - 8 + i * 4, 159 + (i % 2 ? -2.5 : 0)); g.stroke(); g.fillStyle = '#5ab8ff'; g.strokeStyle = '#1f5f9e'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx + 52, 132); g.quadraticCurveTo(cx + 62, 152, cx + 52, 158); g.quadraticCurveTo(cx + 42, 152, cx + 52, 132); g.fill(); g.stroke() }
                else { g.arc(cx, 156, 6, .15 * Math.PI, .85 * Math.PI); g.stroke() }
                g.fillStyle = '#e8b8a8'; g.fillRect(cx - .8, 143, 1.6, 3)
            })
        }
        const F = [0, 1, 2].map(m => [face(0, m), face(1, m)]); let mood = 1;
        const fm = new T.MeshStandardMaterial({ map: F[1][0], emissive: 0xffffff, emissiveMap: F[1][0], emissiveIntensity: .08, roughness: .75 });
        const fc = add(new T.SphereGeometry(.5, 48, 32), fm, 0, 0, 0, head); fc.scale.set(.95, 1, .92);
        // ผม: ปอยผมแต่ละปอยเป็นท่อเรียวตามเส้นโค้ง ลงเงาแบบการ์ตูน (toon) ให้ดูเป็นอนิเมะ
        const tg = new T.DataTexture(new Uint8Array([45, 105, 170]), 3, 1, T.LuminanceFormat); tg.minFilter = tg.magFilter = T.NearestFilter; tg.needsUpdate = true;
        const hair = new T.MeshToonMaterial({ color: 0xa88cf0, gradientMap: tg }), sway = [];
        add(new T.SphereGeometry(.53, 32, 20), hair, 0, .04, -.14, head).scale.set(1.02, 1.04, 1);
        function lock(pts, r0, sw) {
            const p = pts.map(a => new T.Vector3(...a)), o = p[0].clone(); p.forEach(v => v.sub(o));
            const c = new T.CatmullRomCurve3(p), S = 20, R = 8, g = new T.TubeGeometry(c, S, 1, R, false), P = g.attributes.position, v = new T.Vector3();
            for (let i = 0; i <= S; i++) { const q = c.getPointAt(i / S), k = r0 * Math.pow(1 - i / S, .8) + .003; for (let j = 0; j <= R; j++) { const n = i * (R + 1) + j; v.fromBufferAttribute(P, n).sub(q).multiplyScalar(k).add(q); P.setXYZ(n, v.x, v.y, v.z) } }
            g.computeVertexNormals(); const m = add(g, hair, o.x, o.y, o.z, head); if (sw) sway.push([m, sw]); return m
        }
        const zf = (x, y) => Math.sqrt(Math.max(.01, .28 - x * x - y * y)) * .95;
        [-.38, -.26, -.13, 0, .13, .26, .38].forEach((x, i) => {
            const ty = .14 - Math.abs(x) * .45 + (i % 2) * .04;
            lock([[x * .5, .5, zf(x * .5, .5) - .06], [x * .9, .38, zf(x * .9, .38) + .03], [x, .26, zf(x, .26) + .05], [x * 1.04, ty, zf(x, ty) + .04]], .075)
        });
        [-1, 1].forEach(s => {
            lock([[s * .4, .28, .1], [s * .5, -.1, .18], [s * .5, -.5, .2], [s * .43, -.92, .24]], .085, s * .04);
            lock([[s * .36, .12, -.08], [s * .56, -.45, .25], [s * .56, -.85, .7], [s * .48, -1.32, .82]], .11, s * .03);
            const pin = add(new T.OctahedronGeometry(.045), gold, s * .52, .1, .22, head); pin.scale.set(1, 1.4, .6)
        });
        for (let i = 0; i < 11; i++) {
            const a = Math.PI * (.55 + .9 * i / 10), sx = Math.sin(a), cz = Math.cos(a);
            lock([[sx * .38, .38, cz * .38 - .1], [sx * .6, -.25, cz * .58 - .1], [sx * .68, -.9, cz * .62 - .1], [sx * .62, -1.5, cz * .6 - .1]], .15, .02)
        }
        const hood = M(0x3b1d72, { roughness: .6, side: T.DoubleSide });
        add(lathe([[0, 1.08], [.22, .95], [.48, .68], [.64, .3], [.68, -.08], [.7, -.42], [.9, -.72]], .9, Math.PI * 2 - 1.8), hood, 0, 0, -.06, head);
        add(lathe([[.66, .3], [.7, -.08], [.72, -.42], [.92, -.72]], .9, .12), gold, 0, 0, -.04, head);
        add(lathe([[.66, .3], [.7, -.08], [.72, -.42], [.92, -.72]], Math.PI * 2 - 1.02, .12), gold, 0, 0, -.04, head);
        const cir = add(new T.TorusGeometry(.5, .022, 8, 48, Math.PI), gold, 0, .14, 0, head); cir.rotation.set(-Math.PI / 2 + .25, 0, 0);
        const gem = add(new T.OctahedronGeometry(.06), M(0x7fe6ff, { emissive: 0x2a9fd0, emissiveIntensity: 1, roughness: .1 }), 0, .24, .48, head); gem.scale.y = 1.5;
        [-1, 1].forEach(s => add(new T.SphereGeometry(.035, 12, 8), gold, s * .46, -.2, .08, head));

        // แขนเสื้อทรงระฆัง ยื่นไปลอยเหนือลูกแก้ว
        const skin = M(0xffd9c8, { roughness: .6 }), up = new T.Vector3(0, 1, 0);
        const hands = [-1, 1].map(s => {
            const a = new T.Vector3(s * .85, 2.42, 0), b = new T.Vector3(s * .48, 1.85, 1.45), d = b.clone().sub(a), L = d.length();
            const sl = add(new T.CylinderGeometry(.18, .27, L, 24, 1, true), robe, 0, 0, 0, tl); sl.position.copy(a).add(b).multiplyScalar(.5); sl.quaternion.setFromUnitVectors(up, d.normalize().negate());
            const cuff = add(new T.TorusGeometry(.26, .03, 8, 32), gold, 0, 0, 0, tl); cuff.position.copy(b).addScaledVector(d, .02); cuff.quaternion.setFromUnitVectors(new T.Vector3(0, 0, 1), d);
            const h = add(new T.SphereGeometry(.14, 20, 14), skin, b.x - s * .02, b.y - .05, b.z + .12, tl); h.scale.set(1, .7, 1.25); return [h, h.position.clone()]
        });
        // ลูกแก้ว
        add(new T.CylinderGeometry(.3, .42, .22, 32), gold, 0, 1.28, .2);
        const ball = add(new T.SphereGeometry(.46, 48, 32), new T.MeshPhysicalMaterial({ color: 0xb8a4ff, transparent: true, opacity: .55, emissive: 0x5a3ad0, emissiveIntensity: .8, roughness: .02, clearcoat: 1 }), 0, 1.78, .2);
        ball.castShadow = false;
        const core = add(new T.IcosahedronGeometry(.16, 1), new T.MeshBasicMaterial({ color: 0xe8dcff, wireframe: true, transparent: true, opacity: .7 }), 0, 1.78, .2);
        const bl = new T.PointLight(0xa58bff, 1.6, 7); bl.position.set(0, 1.9, .4); sc.add(bl);
        // เทียน
        const fls = [-2.3, 2.3].map(x => {
            add(new T.CylinderGeometry(.12, .12, .7, 16), M(0xf5e8c8), x, 1.5, .6);
            const f = add(new T.SphereGeometry(.08, 12, 8), B(0xffc060), x, 1.95, .6); f.scale.y = 1.7; f.castShadow = false;
            const l = new T.PointLight(0xff9a40, 1.2, 8); l.position.set(x, 2.1, .8); sc.add(l); return [f, l]
        });
        sc.add(new T.AmbientLight(0x7a5aa8, .45));
        const key = new T.SpotLight(0xffe6d0, .55, 30, .32, .7, 1); key.position.set(1.5, 9, 6); key.target.position.set(0, 3, -1.4); sc.add(key, key.target);
        key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0005;
        const rim = new T.DirectionalLight(0x7fd4ff, 1.1); rim.position.set(-2, 5, -8); sc.add(rim);
        const rim2 = new T.DirectionalLight(0xff7ad0, .6); rim2.position.set(3, 3, -6); sc.add(rim2);
        // ฝุ่นประกาย
        const N = 140, pa = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const a = Math.random() * 6.28, d = Math.random() * 6; pa.set([Math.cos(a) * d, .6 + Math.random() * 7, Math.sin(a) * d], i * 3) }
        const pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pa, 3));
        const pts = new T.Points(pg, new T.PointsMaterial({ color: GOLD, size: .07, transparent: true, opacity: .8 })); sc.add(pts);
        // กล้อง ตอบสนองเมาส์/การเอียงมือถือ และบินเข้าหาโต๊ะตอนเปิดม่าน
        const base = { z: 8.5, ly: 2.3 }; let mx = 0, cx = 0, boost = 0, intro = -1;
        window.tentFx = () => { boost = 1 };
        window.tentMood = m => { mood = m };
        window.tentIntro = () => { intro = performance.now() };
        // รูปแม่หมอวงกลมเล็กในหน้าคำทำนาย เรนเดอร์จากฉากเดียวกันด้วยกล้องที่จ่อหน้า
        const ptc = document.getElementById('pt'), pr = ptc && new T.WebGLRenderer({ canvas: ptc, antialias: true }), pcam = new T.PerspectiveCamera(26, 1, .1, 20);
        if (pr) { pr.toneMapping = T.LinearToneMapping; pr.toneMappingExposure = .72; pr.shadowMap.enabled = r.shadowMap.enabled; pr.shadowMap.type = r.shadowMap.type; pr.setPixelRatio(Math.min(devicePixelRatio, 2)); pr.setSize(64, 64, false); pcam.position.set(0, 3.35, 2.4); pcam.lookAt(0, 3.1, -1.38) }
        addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5 });
        addEventListener('deviceorientation', e => { if (e.gamma != null) mx = Math.max(-.5, Math.min(.5, e.gamma / 60)) });
        function fit() { const w = innerWidth, h = innerHeight, a = w / h, p = Math.max(0, 1 - a); r.setSize(w, h, false); cam.aspect = a; cam.fov = 48 + p * 30; base.z = 8.5 + p * 3; base.ly = 3.1 + p * 1.1; cam.updateProjectionMatrix() }
        addEventListener('resize', fit); fit();
        const t0 = performance.now(), io = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        (function loop() {
            requestAnimationFrame(loop);
            const now = performance.now(), t = (now - t0) / 1000; cx += (mx - cx) * .04; boost *= .985;
            const k = 1 - (intro < 0 ? 0 : io(Math.min(1, (now - intro) / 3200)));
            cam.position.set(cx * 1.6 + k * 1.2, 3.4 + k * 2.2, base.z + k * 5); cam.lookAt(0, base.ly + k * .6, .5);
            tl.position.y = Math.sin(t * 1.2) * .03; head.rotation.y = cx * .7; head.rotation.z = Math.sin(t * .8) * .04 + (mood == 2 ? Math.sin(t * 9) * .015 : 0);
            if (mood == 0) tl.position.y += Math.abs(Math.sin(t * 4)) * .04;
            sway.forEach(([m, a], i) => { m.rotation.z = Math.sin(t * 1.3 + i * .7) * a; m.rotation.x = Math.sin(t * .9 + i) * Math.abs(a) * .6 });
            const fx = F[mood][t % 4.2 < .13 ? 1 : 0]; if (fm.map !== fx) { fm.map = fm.emissiveMap = fx; fm.needsUpdate = true }
            hands.forEach(([h, p], i) => h.position.set(p.x + Math.sin(t * 1.6 + i * 3) * .03, p.y + Math.sin(t * 2 + i) * .05, p.z));
            ball.material.emissiveIntensity = .8 + Math.sin(t * 2) * .2 + boost * 1.6; bl.intensity = 1.6 + Math.sin(t * 2) * .3 + boost * 2.5;
            core.rotation.set(t * .7, t * 1.1, 0); core.material.opacity = .5 + .3 * Math.sin(t * 3) + boost * .3;
            gem.material.emissiveIntensity = brooch.material.emissiveIntensity = 1 + Math.sin(t * 2.5) * .4 + boost * 2;
            fls.forEach(([f, l]) => { const q = .85 + Math.random() * .3; f.scale.set(q, 1.7 * q, q); l.intensity = 1.2 * q });
            pts.rotation.y = t * .03; pts.position.y = Math.sin(t * .5) * .1;
            if (!document.body.classList.contains('ovopen')) r.render(sc, cam);
            else if (pr && ptc.offsetParent) pr.render(sc, pcam)
        })();
        document.body.classList.add('g3');
    } catch (e) { console.warn('3D ใช้ไม่ได้ ใช้ฉาก 2D แทน', e) }
})();
