/* ============================================================
   ÓPTICA DO OLHO — script.js
   Canvas: hero animado + simulador interativo
   ============================================================ */

(function () {
    'use strict';

    /* ===========================================================
       HERO CANVAS — olho animado decorativo
    =========================================================== */
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas) {
        const hCtx = heroCanvas.getContext('2d');
        const HW = 520, HH = 400;
        heroCanvas.width = HW;
        heroCanvas.height = HH;

        let hFrame = 0;
        let heroPupilScale = 1.0;
        let heroPupilDir = -0.004;

        function drawHeroEye() {
            hCtx.clearRect(0, 0, HW, HH);
            hCtx.save();

            const cx = HW * 0.5, cy = HH * 0.5;
            const t = hFrame / 60;

            // Glow externo
            const glow = hCtx.createRadialGradient(cx, cy, 40, cx, cy, 240);
            glow.addColorStop(0, 'rgba(48, 100, 170, 0.18)');
            glow.addColorStop(1, 'transparent');
            hCtx.fillStyle = glow;
            hCtx.fillRect(0, 0, HW, HH);

            // Esclera
            hCtx.beginPath();
            hCtx.ellipse(cx, cy, 185, 138, 0, 0, Math.PI * 2);
            const sclGrad = hCtx.createRadialGradient(cx - 30, cy - 30, 10, cx, cy, 200);
            sclGrad.addColorStop(0, 'rgba(230, 242, 252, 0.18)');
            sclGrad.addColorStop(1, 'rgba(180, 210, 235, 0.08)');
            hCtx.fillStyle = sclGrad;
            hCtx.fill();
            hCtx.strokeStyle = 'rgba(100, 160, 210, 0.35)';
            hCtx.lineWidth = 1.5;
            hCtx.stroke();

            // Íris (gradiente animado)
            const irisGrad = hCtx.createRadialGradient(cx, cy, 5, cx, cy, 65);
            const hue = 210 + Math.sin(t * 0.3) * 12;
            irisGrad.addColorStop(0, `hsla(${hue}, 60%, 25%, 0.9)`);
            irisGrad.addColorStop(0.5, `hsla(${hue + 15}, 55%, 38%, 0.85)`);
            irisGrad.addColorStop(1, `hsla(${hue + 25}, 50%, 20%, 0.8)`);
            hCtx.beginPath();
            hCtx.arc(cx, cy, 65, 0, Math.PI * 2);
            hCtx.fillStyle = irisGrad;
            hCtx.fill();

            // Fibras da íris
            for (let i = 0; i < 36; i++) {
                const angle = (i / 36) * Math.PI * 2;
                const innerR = 23 * heroPupilScale;
                const outerR = 62;
                hCtx.beginPath();
                hCtx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
                hCtx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
                hCtx.strokeStyle = `rgba(80, 130, 190, 0.15)`;
                hCtx.lineWidth = 0.5;
                hCtx.stroke();
            }

            // Anel limbal
            hCtx.beginPath();
            hCtx.arc(cx, cy, 66, 0, Math.PI * 2);
            hCtx.strokeStyle = 'rgba(30, 60, 100, 0.6)';
            hCtx.lineWidth = 2;
            hCtx.stroke();

            // Pupila pulsante
            const pRadius = 22 * heroPupilScale;
            const pupilGrad = hCtx.createRadialGradient(cx - 4, cy - 4, 1, cx, cy, pRadius);
            pupilGrad.addColorStop(0, 'rgba(10, 20, 35, 0.95)');
            pupilGrad.addColorStop(1, 'rgba(2, 8, 18, 0.98)');
            hCtx.beginPath();
            hCtx.arc(cx, cy, pRadius, 0, Math.PI * 2);
            hCtx.fillStyle = pupilGrad;
            hCtx.fill();

            // Reflexo na pupila
            hCtx.beginPath();
            hCtx.arc(cx - 8, cy - 8, 5, 0, Math.PI * 2);
            hCtx.fillStyle = 'rgba(255, 255, 255, 0.22)';
            hCtx.fill();

            // Raios de luz animados
            const rayColors = [
                'rgba(224, 82, 82, 0.7)',
                'rgba(74, 125, 224, 0.7)',
                'rgba(69, 176, 105, 0.7)',
                'rgba(224, 160, 48, 0.6)'
            ];
            const rayOffsets = [-70, -30, 30, 70];

            hCtx.save();
            hCtx.globalCompositeOperation = 'screen';
            rayOffsets.forEach((oy, i) => {
                const wave = Math.sin(t * 1.2 + i * 0.8) * 8;
                const startX = cx - 220;
                const startY = cy + oy + wave;
                const lensX = cx - 35;
                const lensY = cy + oy * 0.35 + wave * 0.4;

                hCtx.beginPath();
                hCtx.moveTo(startX, startY);
                hCtx.quadraticCurveTo(cx - 130, cy + oy * 0.7 + wave * 0.6, lensX, lensY);
                hCtx.strokeStyle = rayColors[i];
                hCtx.lineWidth = 1.8;
                hCtx.stroke();

                // após cristalino → fóvea
                hCtx.beginPath();
                hCtx.moveTo(lensX, lensY);
                hCtx.lineTo(cx + 90, cy + wave * 0.2);
                hCtx.strokeStyle = rayColors[i];
                hCtx.lineWidth = 1.6;
                hCtx.stroke();
            });
            hCtx.restore();

            // Córnea brilho lateral
            hCtx.beginPath();
            hCtx.ellipse(cx + 20, cy, 78, 68, 0, 0, Math.PI * 2);
            hCtx.strokeStyle = 'rgba(180, 218, 246, 0.22)';
            hCtx.lineWidth = 2;
            hCtx.stroke();

            hCtx.restore();

            // Animar pupila
            heroPupilScale += heroPupilDir;
            if (heroPupilScale < 0.72 || heroPupilScale > 1.18) heroPupilDir *= -1;

            hFrame++;
            requestAnimationFrame(drawHeroEye);
        }

        drawHeroEye();
    }


    /* ===========================================================
       SIMULADOR INTERATIVO
    =========================================================== */
    const canvas = document.getElementById('eyeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const W = 600, H = 380;
    canvas.width = W;
    canvas.height = H;

    const curvatureSlider = document.getElementById('curvatureSlider');
    const axialSlider = document.getElementById('axialSlider');
    const distanceSlider = document.getElementById('distanceSlider');
    const curvatureValue = document.getElementById('curvatureValue');
    const axialValue = document.getElementById('axialValue');
    const distanceValue = document.getElementById('distanceValue');
    const resetBtn = document.getElementById('resetButton');
    const simStatus = document.getElementById('sim-status');
    const presetBtns = document.querySelectorAll('.preset-btn');

    let curvature = 1.0;    // curvatura do cristalino
    let axialLength = 1.0;  // comprimento axial do olho
    let objDist = 1.0;      // distância do objeto

    // Parâmetros base do olho
    const cx = W * 0.5 + 10;   // centro X do olho
    const cy = H * 0.5;        // centro Y
    const eyeW = 175;           // semi-eixo horizontal
    const eyeH = 130;           // semi-eixo vertical

    /* ---------- DESENHO PRINCIPAL ---------- */
    function drawSimulator() {
        ctx.clearRect(0, 0, W, H);
        ctx.save();

        // Fundo suave
        const bg = ctx.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, '#eef5fc');
        bg.addColorStop(1, '#ddeaf6');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Grade de guia
        ctx.save();
        ctx.strokeStyle = 'rgba(100, 160, 210, 0.1)';
        ctx.lineWidth = 1;
        for (let x = 0; x <= W; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y <= H; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
        ctx.restore();

        // Eixo óptico
        ctx.save();
        ctx.setLineDash([6, 8]);
        ctx.strokeStyle = 'rgba(100, 150, 200, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(W, cy);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Esclera
        ctx.save();
        ctx.beginPath();
        const eyeActualW = eyeW * (0.85 + 0.15 * axialLength);
        ctx.ellipse(cx, cy, eyeActualW, eyeH, 0, 0, Math.PI * 2);
        const sclGrad = ctx.createRadialGradient(cx - 30, cy - 20, 20, cx, cy, eyeActualW);
        sclGrad.addColorStop(0, '#f6fbff');
        sclGrad.addColorStop(1, '#deeefa');
        ctx.fillStyle = sclGrad;
        ctx.shadowColor = 'rgba(30, 80, 130, 0.12)';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#8db8d4';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Marcação da retina (parede posterior)
        const retinaX = cx + eyeActualW * 0.72;
        ctx.save();
        ctx.beginPath();
        ctx.arc(retinaX + 8, cy, 38, -Math.PI * 0.45, Math.PI * 0.45);
        ctx.strokeStyle = 'rgba(70, 140, 90, 0.6)';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 7]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Córnea
        const corneaX = cx - eyeActualW * 0.72;
        ctx.save();
        ctx.beginPath();
        ctx.arc(corneaX - 8, cy, 50, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.strokeStyle = 'rgba(100, 170, 215, 0.8)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();

        // Íris
        const irisX = cx - eyeActualW * 0.5;
        ctx.save();
        ctx.beginPath();
        ctx.arc(irisX, cy, 38, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(44, 78, 115, 0.85)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(25, 50, 80, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // Pupila
        ctx.save();
        ctx.beginPath();
        ctx.arc(irisX, cy, 18, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(8, 15, 28, 0.95)';
        ctx.fill();
        ctx.restore();

        // Cristalino — curvatura variável
        const lensX = cx - eyeActualW * 0.22;
        const lensRw = 26 * (0.7 + 0.65 * curvature);
        const lensRh = 46 * (0.6 + 0.55 * curvature);

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(lensX, cy, lensRw, lensRh, 0, 0, Math.PI * 2);
        const lensGrad = ctx.createRadialGradient(lensX - 5, cy - 10, 2, lensX, cy, lensRw + 10);
        lensGrad.addColorStop(0, 'rgba(190, 225, 248, 0.55)');
        lensGrad.addColorStop(1, 'rgba(145, 195, 230, 0.25)');
        ctx.fillStyle = lensGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(55, 115, 160, 0.75)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Cristalino: highlight
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(lensX - 4, cy - 8, lensRw * 0.5, lensRh * 0.4, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.fill();
        ctx.restore();

        // --- CÁLCULO DOS RAIOS ---
        // Foco é afetado por: curvatura (mais curva = foco mais próximo),
        // comprimento axial (maior = foco mais atrás) e distância do objeto
        const focalMod = 1.0 / curvature;   // cristalino mais curvado → foco mais curto
        const distMod  = (objDist > 0.7) ? 1.0 : 1.0 + (0.7 - objDist) * 0.6;

        // Posição do ponto focal em X
        const focusBaseX = lensX + 160 * focalMod * distMod;
        const focusX = focusBaseX;
        const focusY = cy;

        // Raios
        const rayData = [
            { oy: -55, color: '#e05252', alpha: 0.75 },
            { oy:   0, color: '#4a7de0', alpha: 0.75 },
            { oy:  55, color: '#45b069', alpha: 0.75 }
        ];

        // Posição do objeto à esquerda
        const objX = Math.max(30, corneaX - 80 - (objDist - 0.4) * 60);

        rayData.forEach(r => {
            const srcX = objX;
            const srcY = cy + r.oy;
            const lensTopX = lensX - lensRw * 0.5;
            const lensIntX = lensX;
            const lensIntY = cy + r.oy * (0.4 - 0.15 * curvature);

            ctx.save();
            ctx.globalAlpha = r.alpha;
            ctx.lineWidth = 2.2;
            ctx.strokeStyle = r.color;

            // antes do cristalino (linha reta)
            ctx.beginPath();
            ctx.moveTo(srcX, srcY);
            ctx.lineTo(lensIntX, lensIntY);
            ctx.stroke();

            // após cristalino → converge ao foco
            const endFarX = focusX + (focusX - lensIntX) * 0.55;
            const endFarY = focusY + (focusY - lensIntY) * 0.55;

            ctx.beginPath();
            ctx.moveTo(lensIntX, lensIntY);
            ctx.lineTo(focusX, focusY);
            ctx.stroke();

            // extensão após foco
            ctx.globalAlpha = r.alpha * 0.35;
            ctx.beginPath();
            ctx.moveTo(focusX, focusY);
            ctx.lineTo(endFarX, endFarY);
            ctx.stroke();

            ctx.restore();
        });

        // Ponto focal
        ctx.save();
        ctx.beginPath();
        ctx.arc(focusX, focusY, 11, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(240, 192, 64, 0.18)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(focusX, focusY, 6, 0, Math.PI * 2);
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#f0c040';
        const onRetina = Math.abs(focusX - retinaX) < 22;
        ctx.fillStyle = onRetina ? '#34c468' : (focusX < retinaX ? '#f0c040' : '#e04040');
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // Objeto (seta à esquerda)
        ctx.save();
        ctx.strokeStyle = 'rgba(100, 120, 160, 0.7)';
        ctx.fillStyle = 'rgba(100, 120, 160, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(objX, cy + 50);
        ctx.lineTo(objX, cy - 50);
        ctx.stroke();
        // Ponta da seta
        ctx.beginPath();
        ctx.moveTo(objX, cy - 50);
        ctx.lineTo(objX - 6, cy - 38);
        ctx.lineTo(objX + 6, cy - 38);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Labels
        ctx.save();
        ctx.font = '500 11px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(30, 80, 120, 0.7)';

        // Córnea
        ctx.fillText('Córnea', corneaX + 4, cy - eyeH + 22);
        // Cristalino
        ctx.fillText('Cristalino', lensX, cy - eyeH + 22);
        // Retina
        ctx.fillStyle = 'rgba(50, 130, 70, 0.8)';
        ctx.fillText('Retina', retinaX + 16, cy - eyeH + 22);
        // Ponto focal
        ctx.fillStyle = '#b07a10';
        ctx.fillText('Foco', focusX, focusY - 20);
        // Objeto
        ctx.fillStyle = 'rgba(60, 80, 130, 0.7)';
        ctx.fillText('Objeto', objX, cy + 66);

        ctx.restore();

        // Status
        updateStatus(focusX, retinaX);
    }

    function updateStatus(focusX, retinaX) {
        if (!simStatus) return;
        const diff = focusX - retinaX;
        if (Math.abs(diff) < 22) {
            simStatus.textContent = '✓ Visão nítida — foco exatamente sobre a retina';
            simStatus.className = 'sim-status';
        } else if (diff < 0) {
            simStatus.textContent = '⚠ Foco antes da retina — simula miopia (imagens distantes embaçadas)';
            simStatus.className = 'sim-status warn';
        } else {
            simStatus.textContent = '⚠ Foco atrás da retina — simula hipermetropia (imagens próximas embaçadas)';
            simStatus.className = 'sim-status error';
        }
    }

    function updateAll() {
        curvature  = parseFloat(curvatureSlider.value);
        axialLength = parseFloat(axialSlider.value);
        objDist    = parseFloat(distanceSlider.value);

        curvatureValue.textContent = curvature.toFixed(2);
        axialValue.textContent     = axialLength.toFixed(2);
        distanceValue.textContent  = objDist.toFixed(2);

        drawSimulator();
    }

    // Eventos de controle
    curvatureSlider.addEventListener('input', updateAll);
    axialSlider.addEventListener('input', updateAll);
    distanceSlider.addEventListener('input', updateAll);

    resetBtn.addEventListener('click', () => {
        curvatureSlider.value = '1.0';
        axialSlider.value     = '1.0';
        distanceSlider.value  = '1.0';
        updateAll();
    });

    // Presets de condições visuais
    const presets = {
        normal:        { curvature: 1.0,  axial: 1.0,  dist: 1.0 },
        miopia:        { curvature: 1.4,  axial: 1.35, dist: 1.1 },
        hipermetropia: { curvature: 0.55, axial: 0.65, dist: 1.0 },
        presbiopia:    { curvature: 0.4,  axial: 1.0,  dist: 0.5 },
    };

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.preset;
            const p = presets[key];
            if (!p) return;
            curvatureSlider.value = p.curvature;
            axialSlider.value     = p.axial;
            distanceSlider.value  = p.dist;
            updateAll();
        });
    });

    // Render inicial
    updateAll();

    // Redraw em resize
    window.addEventListener('resize', drawSimulator);

    // Previne scroll em touch
    canvas.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

})();
