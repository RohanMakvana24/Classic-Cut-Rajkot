import React, { useEffect, useRef, useState } from 'react';

export type ShaderFlameTheme = 'violet' | 'gold' | 'emerald';

export interface ShaderCardFeature {
  icon: React.ReactNode;
  label: string;
}

export interface ShaderCardProps {
  effectOnly?: boolean;
  badge?: string;
  isSignature?: boolean;
  title: string;
  description: string;
  features: ShaderCardFeature[];
  ctaLabel?: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  flameTheme?: ShaderFlameTheme;
  phaseOffset?: number;
  className?: string;
}

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Silky-smooth quintic-interpolated FBM rising luminous flame shader
const FRAGMENT_SHADER_SOURCE = `
  precision highp float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform float u_phase;
  uniform vec2 u_mouse;
  uniform int u_theme;

  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // Quintic C2-continuous smooth noise for ultra-silky fluid motion
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.54;
    mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
    for (int i = 0; i < 5; i++) {
      value += amp * noise(p);
      p = rot * p * 1.92 + vec2(0.24, -0.18);
      amp *= 0.48;
    }
    return value;
  }

  void main() {
    vec2 uv = v_uv;
    // Smooth, unhurried 60fps flow speed
    float t = u_time * 0.36 + u_phase;

    // Damped pointer shift
    vec2 pointerShift = (u_mouse - 0.5) * 0.12;

    // Lower frequency domain coordinates for broader, silkier flame plumes
    vec2 p = uv * vec2(1.85, 2.15);
    p.x -= 0.12 + pointerShift.x;

    // Multi-stage upward fluid advection
    vec2 q = vec2(
      fbm(p + vec2(0.0, -t * 0.95)),
      fbm(p + vec2(3.7, -t * 1.10))
    );

    vec2 r = vec2(
      fbm(p + 1.85 * q + vec2(1.7, -t * 1.25)),
      fbm(p + 1.70 * q + vec2(6.4, -t * 1.15))
    );

    float f = fbm(p + 1.55 * r - vec2(0.0, t * 1.05));

    // Silky vertical envelope rising higher on the left-center and softly billowing right
    float leftBillow = exp(-pow((uv.x - 0.30 - pointerShift.x * 0.45) * 1.95, 2.0)) * 0.28;
    float rightWave = exp(-pow((uv.x - 0.78) * 2.35, 2.0)) * 0.16;
    float heightLimit = 0.46 + leftBillow + rightWave;

    float verticalMask = smoothstep(heightLimit + 0.34, -0.04, uv.y);
    float bottomBoost = smoothstep(0.58, 0.0, uv.y) * 0.50;

    float flame = clamp((f * 1.32 + bottomBoost) * verticalMask, 0.0, 1.0);
    flame = smoothstep(0.02, 0.98, pow(flame, 1.14));

    // Smooth volumetric gradient bands
    float core = smoothstep(0.50, 0.95, flame);
    float mid  = smoothstep(0.14, 0.72, flame);
    float aura = smoothstep(0.01, 0.44, flame);

    vec3 bg = vec3(0.043, 0.035, 0.028); // Deep warm obsidian
    vec3 auraCol;
    vec3 midCol;
    vec3 coreCol;

    if (u_theme == 1) {
      // Default: Royal Brushed Champagne Gold / Warm Amber Flame
      auraCol = vec3(0.36, 0.20, 0.05);
      midCol  = vec3(0.90, 0.64, 0.22);
      coreCol = vec3(1.00, 0.95, 0.80);
    } else if (u_theme == 2) {
      // Emerald Flame
      auraCol = vec3(0.04, 0.24, 0.18);
      midCol  = vec3(0.16, 0.78, 0.55);
      coreCol = vec3(0.86, 1.00, 0.94);
    } else {
      // Electric Violet / Purple Luminous Flame
      bg      = vec3(0.043, 0.039, 0.055);
      auraCol = vec3(0.22, 0.08, 0.42);
      midCol  = vec3(0.62, 0.26, 0.98);
      coreCol = vec3(0.95, 0.84, 1.00);
    }

    vec3 col = bg;
    col = mix(col, auraCol, aura * 0.88);
    col = mix(col, midCol, mid * 0.92);
    col = mix(col, coreCol, core * 0.90);

    // Ultra-subtle micro-dither to prevent 8-bit color banding while staying silky smooth
    float dither = (hash(uv * 520.0 + fract(t)) - 0.5) * 0.016;
    col += dither;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;

export const ShaderCard: React.FC<ShaderCardProps> = ({
  effectOnly = false,
  badge,
  isSignature = false,
  title,
  description,
  features,
  ctaLabel = 'Explore & Book',
  ctaHref,
  secondaryLabel,
  secondaryHref,
  flameTheme = 'gold',
  phaseOffset = 0,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseTargetRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const mouseSmoothRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId = 0;
    let isVisible = false;
    let lastDrawTime = 0;
    const minFrameMs = window.matchMedia('(max-width: 767px)').matches ? 66 : 42;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting && !document.hidden; },
      { rootMargin: '160px 0px' }
    );
    visibilityObserver.observe(canvas);
    const handleVisibilityChange = () => {
      isVisible = !document.hidden && canvas.getBoundingClientRect().bottom >= -160 && canvas.getBoundingClientRect().top <= window.innerHeight + 160;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    const gl =
      canvas.getContext('webgl', { antialias: true, depth: false, stencil: false }) ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (gl) {
      const compileShader = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
      const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

      if (vs && fs) {
        const program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.linkProgram(program);

          if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);

            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
              gl.STATIC_DRAW
            );

            const posLoc = gl.getAttribLocation(program, 'a_position');
            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

            const timeLoc = gl.getUniformLocation(program, 'u_time');
            const phaseLoc = gl.getUniformLocation(program, 'u_phase');
            const mouseLoc = gl.getUniformLocation(program, 'u_mouse');
            const themeLoc = gl.getUniformLocation(program, 'u_theme');

            const startTime = performance.now();

            const renderWebGL = (now: number) => {
              animationFrameId = requestAnimationFrame(renderWebGL);
              if (!isVisible || (lastDrawTime && now - lastDrawTime < minFrameMs)) return;
              lastDrawTime = now;
              const elapsed = (now - startTime) * 0.001;
              // Smooth exponential damping for mouse coordinates
              mouseSmoothRef.current.x +=
                (mouseTargetRef.current.x - mouseSmoothRef.current.x) * 0.075;
              mouseSmoothRef.current.y +=
                (mouseTargetRef.current.y - mouseSmoothRef.current.y) * 0.075;

              gl.viewport(0, 0, canvas.width, canvas.height);
              gl.uniform1f(timeLoc, elapsed);
              gl.uniform1f(phaseLoc, phaseOffset);
              gl.uniform2f(mouseLoc, mouseSmoothRef.current.x, mouseSmoothRef.current.y);
              gl.uniform1i(
                themeLoc,
                flameTheme === 'gold' ? 1 : flameTheme === 'emerald' ? 2 : 0
              );
              gl.drawArrays(gl.TRIANGLES, 0, 6);
            };

            if (!prefersReducedMotion) animationFrameId = requestAnimationFrame(renderWebGL);

            return () => {
              cancelAnimationFrame(animationFrameId);
              visibilityObserver.disconnect();
              document.removeEventListener('visibilitychange', handleVisibilityChange);
              gl.deleteBuffer(buffer);
              gl.deleteProgram(program);
              gl.deleteShader(vs);
              gl.deleteShader(fs);
            };
          }
        }
      }
    }

    // Smooth 60fps 2D Canvas volumetric flame fallback if WebGL is unavailable
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startTime = performance.now();
    const render2DFallback = (now: number) => {
      animationFrameId = requestAnimationFrame(render2DFallback);
      if (!isVisible || (lastDrawTime && now - lastDrawTime < minFrameMs)) return;
      lastDrawTime = now;
      const t = (now - startTime) * 0.0011 + phaseOffset;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#0B0907';
      ctx.fillRect(0, 0, w, h);

      const blobs = [
        {
          x: w * (0.34 + Math.sin(t * 0.8) * 0.07),
          y: h * (0.72 + Math.cos(t * 0.95) * 0.05),
          r: w * 0.65,
        },
        {
          x: w * (0.68 + Math.cos(t * 0.75) * 0.08),
          y: h * (0.86 + Math.sin(t * 1.05) * 0.05),
          r: w * 0.58,
        },
        {
          x: w * (0.28 + Math.sin(t * 1.1 + 1.2) * 0.06),
          y: h * (0.56 + Math.cos(t * 0.85) * 0.05),
          r: w * 0.46,
        },
      ];

      blobs.forEach((b, idx) => {
        const grad = ctx.createRadialGradient(b.x, b.y, 2, b.x, b.y, b.r);
        if (flameTheme === 'gold') {
          grad.addColorStop(0, idx === 0 ? 'rgba(255, 243, 204, 0.92)' : 'rgba(229, 185, 111, 0.86)');
          grad.addColorStop(0.45, 'rgba(217, 142, 43, 0.55)');
          grad.addColorStop(1, 'rgba(11, 9, 7, 0)');
        } else {
          grad.addColorStop(0, idx === 0 ? 'rgba(243, 224, 255, 0.95)' : 'rgba(192, 132, 252, 0.88)');
          grad.addColorStop(0.45, 'rgba(147, 51, 234, 0.58)');
          grad.addColorStop(1, 'rgba(11, 10, 14, 0)');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      });

    };

    if (!prefersReducedMotion) animationFrameId = requestAnimationFrame(render2DFallback);
    return () => {
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [flameTheme, phaseOffset]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = 1.0 - (e.clientY - rect.top) / rect.height;
    mouseTargetRef.current = { x: nx, y: ny };

    const ry = (nx - 0.5) * 4;
    const rx = (0.5 - (e.clientY - rect.top) / rect.height) * 4;
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    mouseTargetRef.current = { x: 0.5, y: 0.5 };
    setTilt({ rx: 0, ry: 0 });
  };

  if (effectOnly) {
    return <canvas ref={canvasRef} width={280} height={180} aria-hidden="true" className={className} />;
  }

  return (
    <article
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg)`,
        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      className={`group luxury-card-shadow relative flex flex-col justify-between rounded-[28px] bg-[#0B0907] border p-6 sm:p-8 overflow-hidden select-none ${
        isSignature
          ? flameTheme === 'gold'
            ? 'border-[#E5B96F]/55'
            : 'border-[#C084FC]/50'
          : 'border-white/[0.12] hover:border-[#E5B96F]/45'
      } ${className}`}
    >
      {/* LAYER 1: Real-Time Silky 60fps Luminous Rising Flame Shader Canvas */}
      <canvas
        ref={canvasRef}
        width={280}
        height={360}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Subtle Top Vignette so Title & Subtitle have crisp contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#0B0907]/90 via-[#0B0907]/20 to-transparent"
      />

      {/* Fine Specular Inner Rim Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] rounded-[28px] ring-1 ring-inset ring-white/[0.08]"
      />

      {/* LAYER 2: Foreground Content matching the Shader Card Reference */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {/* Top Service Index / Signature Pill */}
          {badge && (
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
                {badge}
              </span>
              {isSignature && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.12em] border ${
                    flameTheme === 'gold'
                      ? 'bg-[#E5B96F]/20 text-[#FCE3A6] border-[#E5B96F]/45'
                      : 'bg-[#A855F7]/25 text-[#F3E8FF] border-[#C084FC]/50'
                  }`}
                >
                  Most Popular
                </span>
              )}
            </div>
          )}

          {/* Bold White Card Title */}
          <h3 className="text-2xl sm:text-[26px] font-bold text-white tracking-[-0.02em] leading-snug">
            {title}
          </h3>

          {/* Two-Line Muted Subtitle */}
          <p className="mt-2 text-sm sm:text-[15px] text-white/60 leading-relaxed">
            {description}
          </p>

          {/* 4 Icon + Feature Rows */}
          <ul className="mt-6 mb-7 space-y-3">
            {features.map((feat, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 text-[13.5px] sm:text-sm font-medium text-white/85"
              >
                <span className="text-white/75 shrink-0 flex items-center justify-center">
                  {feat.icon}
                </span>
                <span>{feat.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Floating Light Pill CTA Button */}
        <div className="pt-2 space-y-2.5">
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[48px] py-3 px-6 rounded-2xl bg-[#F5F2EB]/95 hover:bg-white text-[#14110E] font-semibold text-sm sm:text-[15px] tracking-[-0.01em] shadow-[0_10px_28px_rgba(0,0,0,0.32)] flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] focus-ring"
          >
            <span>{ctaLabel}</span>
          </a>

          {secondaryLabel && secondaryHref && (
            <div className="text-center">
              <a
                href={secondaryHref}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-white/80 hover:text-white transition-colors py-1 px-2"
              >
                <span>{secondaryLabel}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
