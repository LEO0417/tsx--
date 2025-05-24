import React, { useEffect, useRef } from 'react';

const EvolvingTessellationPatterns = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = 550;
    const height = canvas.height = 550;
    let time = 0;
    const SCALE = 60;
    let animationFrameId = null;

    // Evolution cycle: 0 = simple -> 1 = complex -> 2 = dissolution -> 3 = rebirth
    function getEvolutionStage(t) {
      const cycle = (t * 0.1) % (Math.PI * 4);
      return {
        stage: Math.floor(cycle / Math.PI) % 4,
        progress: (cycle % Math.PI) / Math.PI
      };
    }

    function drawEvolvingTile(cx, cy, size, rotation, phase, morph, evolution) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      const { stage, progress } = evolution;
      let points = 6;
      let complexity = 1;
      let opacity = 0.4;
      let innerConnections = true;

      // Evolution stages affect the tile's form
      switch(stage) {
        case 0: // Birth - simple forms emerging
          points = Math.floor(3 + progress * 3);
          complexity = 0.5 + progress * 0.5;
          opacity = 0.2 + progress * 0.2;
          break;
        case 1: // Growth - increasing complexity
          points = 6 + Math.floor(progress * 6);
          complexity = 1 + progress * 2;
          opacity = 0.4 + progress * 0.3;
          break;
        case 2: // Dissolution - forms breaking apart
          points = 12 - Math.floor(progress * 6);
          complexity = 3 - progress * 2;
          opacity = 0.7 - progress * 0.5;
          innerConnections = progress < 0.5;
          break;
        case 3: // Rebirth - returning to simplicity
          points = 6 - Math.floor(progress * 3);
          complexity = 1 - progress * 0.5;
          opacity = 0.2 + progress * 0.2;
          break;
      }

      // Main shape with evolutionary morphing
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const waveOffset = Math.sin(phase + i * complexity) * 0.1;
        const r = size * (1 + waveOffset + Math.sin(time * 0.5 + i) * 0.05);
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      // Color evolution through stages
      let hue = (stage * 60 + progress * 60) % 360;
      ctx.strokeStyle = `hsla(${hue}, 30%, 30%, ${opacity})`;
      ctx.lineWidth = 1 + Math.sin(progress * Math.PI) * 0.5;
      ctx.stroke();

      // Inner connections evolve and disappear
      if (innerConnections) {
        const connectionOpacity = opacity * (stage === 2 ? 1 - progress : 1);
        ctx.strokeStyle = `hsla(${hue}, 40%, 40%, ${connectionOpacity})`;
        
        for (let i = 0; i < points; i += Math.max(1, Math.floor(3 - complexity))) {
          const angle1 = (i / points) * Math.PI * 2;
          const angle2 = ((i + 2) / points) * Math.PI * 2;
          const r1 = size * (1 + Math.sin(phase + i) * 0.1);
          const r2 = size * (1 + Math.sin(phase + i + 2) * 0.1);
          const x1 = Math.cos(angle1) * r1;
          const y1 = Math.sin(angle1) * r1;
          const x2 = Math.cos(angle2) * r2;
          const y2 = Math.sin(angle2) * r2;

          const midAngle = (angle1 + angle2) / 2;
          const innerR = size * 0.5 * (1 + morph * 0.5) * complexity * 0.3;
          const xi = Math.cos(midAngle) * innerR;
          const yi = Math.sin(midAngle) * innerR;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(xi, yi);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x2, y2);
          ctx.lineTo(xi, yi);
          ctx.stroke();
        }
      }

      // Evolutionary particles - energy flowing between forms
      if (stage === 2 || stage === 3) {
        const particleCount = Math.floor(progress * 8);
        ctx.strokeStyle = `hsla(${hue + 180}, 60%, 60%, ${progress * 0.3})`;
        for (let p = 0; p < particleCount; p++) {
          const pAngle = (p / particleCount) * Math.PI * 2 + time * 2;
          const pRadius = size * (0.8 + Math.sin(time * 3 + p) * 0.3);
          const px = Math.cos(pAngle) * pRadius;
          const py = Math.sin(pAngle) * pRadius;
          
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    function createEvolvingTessellationField(offsetX, offsetY, fieldScale, timeOffset) {
      const gridSize = 4;
      const spacing = SCALE * fieldScale * 0.8;
      const evolution = getEvolutionStage(time + timeOffset);

      for (let row = -gridSize; row <= gridSize; row++) {
        const rowOffset = (row % 2) * spacing * 0.5;
        for (let col = -gridSize; col <= gridSize; col++) {
          const x = (col * spacing * 0.866) + rowOffset + offsetX;
          const y = row * spacing * 0.75 + offsetY;
          const dist = Math.sqrt(x * x + y * y);

          if (dist > SCALE * fieldScale * 2.5) continue;

          const angle = Math.atan2(y - offsetY, x - offsetX);
          const phase = (time + timeOffset) + dist * 0.01;
          const morph = Math.sin(phase + angle) * 0.5 + 0.5;

          // Each tile has slightly different evolution timing
          const localEvolution = getEvolutionStage(time + timeOffset + dist * 0.02);

          drawEvolvingTile(
            width/2 + x,
            height/2 + y,
            SCALE * fieldScale * 0.4 * (1 - dist/(SCALE * fieldScale * 3) * 0.3),
            angle + (time + timeOffset) * 0.2,
            phase,
            morph,
            localEvolution
          );
        }
      }
    }

    function animate() {
      time += 0.02;

      // Background evolves with the patterns
      const bgEvolution = getEvolutionStage(time);
      const bgHue = (bgEvolution.stage * 30 + bgEvolution.progress * 30) % 60;
      ctx.fillStyle = `hsl(${bgHue}, 15%, 92%)`;
      ctx.fillRect(0, 0, width, height);

      // Central field - primary evolution
      createEvolvingTessellationField(0, 0, 1.5, 0);

      // Secondary fields with offset evolution cycles
      ctx.save();
      ctx.translate(width/2, height/2);
      ctx.rotate(Math.PI/6);
      ctx.translate(-width/2, -height/2);
      createEvolvingTessellationField(0, -100, 0.8, time * 0.3 + Math.PI);
      ctx.restore();

      ctx.save();
      ctx.translate(width/2, height/2);
      ctx.rotate(-Math.PI/6);
      ctx.translate(-width/2, -height/2);
      createEvolvingTessellationField(0, 100, 0.8, time * 0.3 - Math.PI);
      ctx.restore();

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
    };
  }, []);

  return (
    <div style={{
      width: '550px',
      height: '550px',
      margin: 'auto',
      backgroundColor: '#F0EEE6',
      overflow: 'hidden',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '550px',
          height: '550px',
          borderRadius: '8px'
        }}
      />
    </div>
  );
};

export default EvolvingTessellationPatterns;