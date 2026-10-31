import React, { useState, useEffect } from 'react';
import {
  X,
  Layers,
  Palette,
  FileText,
  Upload,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import {
  DEFAULT_HERO_CROP,
  EVIDENCE_INVENTORY,
  HeroCropConfig,
  clampHeroCropConfig,
} from '../data/barbershopData';

interface DesignSystemPreviewModalProps {
  isOpen: boolean;
  initialTab: 'layers' | 'tokens' | 'docs';
  onClose: () => void;
  cropConfig: HeroCropConfig;
  onChangeCropConfig: (next: HeroCropConfig) => void;
  customCutoutUrl: string | null;
  onChangeCustomCutoutUrl: (url: string | null) => void;
}

const COLOR_TOKENS = [
  { name: '--color-canvas', hex: '#0C0907', usage: 'Main page canvas & deep shadow fade' },
  { name: '--color-panel', hex: '#181311', usage: 'Elevated cards & feature panels' },
  { name: '--color-brick-base', hex: '#27150F', usage: 'Textured exposed brick wall surface' },
  { name: '--color-primary-orange', hex: '#F58A16', usage: 'Primary CTAs, section bands, card borders' },
  { name: '--color-warm-gold', hex: '#D9A34B', usage: 'Eyebrow labels & subtle hardware details' },
  { name: '--color-main-text', hex: '#F7F1E8', usage: 'Display headings & primary body copy' },
  { name: '--color-muted-text', hex: '#C3B6A8', usage: 'Supporting descriptions & notes' },
];

const PHASE_SUMMARIES = [
  {
    phase: 'Phase 1',
    file: 'phase-1-content-plan.md',
    title: 'Content & Website Structure Blueprint',
    highlights: [
      'Separates supplied Toronto facts (1054 Eglinton Ave W, +1 647-222-3540, Linktree, Instagram) from customer-reported observations (Amir, fades, beard work, kids’ cuts).',
      'Defines 8-section single-page reading order and faithful verbatim review excerpts without inferred per-review stars.',
      'Keeps unconfirmed prices ($30–40 anecdote), opening hours, and direct WhatsApp URL in pending-confirmation rules.',
    ],
  },
  {
    phase: 'Phase 2',
    file: 'phase-2-design-system.md',
    title: 'Visual Design System & Component Preview',
    highlights: [
      'Centralizes semantic CSS custom properties in src/index.css (--color-canvas through --color-muted-text).',
      'Pairs Anton condensed uppercase display typography with DM Sans body prose and JetBrains Mono tabular numerals.',
      'Establishes shared Header, Orange Section Band, angled Service Card (.service-card-angled), and 6-layer Hero diagram.',
    ],
  },
  {
    phase: 'Phase 3',
    file: 'phase-3-hero-notes.md',
    title: 'Reference-Style Layered Hero',
    highlights: [
      'Implements 6 explicit layers: Brick Backdrop (z-1), Warm Edge Lighting (z-10), Oversized White NEW RELOOK H1 (z-20), Transparent Barber Model Cutout (z-30), Lower Black Fade (z-40), and Foreground Copy/CTAs (z-50).',
      'Supports both transparent cutout modes and a deliberate missing-image typographic brick fallback.',
    ],
  },
  {
    phase: 'Phase 4',
    file: 'phase-4-page-notes.md',
    title: 'Complete Page Sections',
    highlights: [
      'Implements Services (#services), Meet Your Barber (#about), Transformation Gallery (#gallery), Customer Reviews (#reviews), Visit & Book (#contact), and Footer.',
      'Replaces the reference product/blog areas with an evidence-backed Meet Your Barber section for Amir.',
    ],
  },
  {
    phase: 'Phase 5',
    file: 'phase-5-assets.md',
    title: 'Images & Alpha Cutout Engineering',
    highlights: [
      'Provides both a Canvas silhouette alpha cutout extracted from the supplied reference and a native alpha SVG studio barber cutout (/assets/hero-barber-cutout.svg).',
      'Treats the hero model strictly as decorative (alt="") and keeps fake AI/stock haircuts out of the Transformation Gallery.',
    ],
  },
  {
    phase: 'Phase 6 & 7',
    file: 'phase-6-validation.md / phase-7-handoff.md',
    title: 'Validation, Basic SEO & Release Handoff',
    highlights: [
      'Includes Schema.org HairSalon JSON-LD with verified Toronto address and telephone, plus noindex protection for demo preview.',
      'Backed by automated node:test unit tests verifying service filtering, crop bounds, and public copy compliance.',
    ],
  },
];

export const DesignSystemPreviewModal: React.FC<DesignSystemPreviewModalProps> = ({
  isOpen,
  initialTab,
  onClose,
  cropConfig,
  onChangeCropConfig,
  customCutoutUrl,
  onChangeCustomCutoutUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'layers' | 'tokens' | 'docs'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUploadCustomCutout = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChangeCustomCutoutUrl(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspector-modal-title"
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-[12px] bg-[#181311] border-2 border-[#F58A16] text-[#F7F1E8] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 bg-[#0C0907] border-b border-[#F58A16]/30">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D9A34B]">
              Internal Preview &amp; Phase 1–7 Deliverables
            </span>
            <h2
              id="inspector-modal-title"
              className="font-display-condensed text-2xl sm:text-3xl text-[#F58A16] tracking-wide"
            >
              DESIGN SYSTEM, HERO LAYER TUNER &amp; PHASE BLUEPRINTS
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close design system and blueprint inspector"
            className="w-10 h-10 rounded-[4px] border border-[#F58A16]/50 flex items-center justify-center text-[#F7F1E8] hover:bg-[#F58A16] hover:text-[#0C0907] transition-colors focus-ring"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex flex-wrap items-center gap-2 px-5 py-3 bg-[#120D0B] border-b border-[#F7F1E8]/10">
          <button
            type="button"
            onClick={() => setActiveTab('layers')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] rounded-[4px] transition-colors whitespace-nowrap focus-ring ${
              activeTab === 'layers'
                ? 'bg-[#F58A16] text-[#0C0907]'
                : 'bg-[#181311] text-[#C3B6A8] hover:text-[#F7F1E8]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hero Layers &amp; Cutout Tuner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tokens')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] rounded-[4px] transition-colors whitespace-nowrap focus-ring ${
              activeTab === 'tokens'
                ? 'bg-[#F58A16] text-[#0C0907]'
                : 'bg-[#181311] text-[#C3B6A8] hover:text-[#F7F1E8]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Phase 2 Tokens &amp; Components</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('docs')}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] rounded-[4px] transition-colors whitespace-nowrap focus-ring ${
              activeTab === 'docs'
                ? 'bg-[#F58A16] text-[#0C0907]'
                : 'bg-[#181311] text-[#C3B6A8] hover:text-[#F7F1E8]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Phase 1–7 Blueprints &amp; Evidence</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {activeTab === 'layers' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 cols: Cutout Mode & Responsive Crop Controls */}
              <div className="lg:col-span-7 space-y-5">
                <div className="rounded-[8px] bg-[#0C0907] border border-[#F58A16]/35 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display-condensed text-xl text-[#F58A16] tracking-wide">
                      1. SELECT HERO CUTOUT / FALLBACK MODE
                    </h3>
                    <span className="text-xs font-mono text-[#D9A34B]">Phase 3 &amp; 5 Spec</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        onChangeCustomCutoutUrl(null);
                        onChangeCropConfig({ ...cropConfig, cutoutMode: 'hybrid_photo_cutout' });
                      }}
                      className={`p-3 rounded-[6px] border text-left transition-colors focus-ring ${
                        cropConfig.cutoutMode === 'hybrid_photo_cutout' && !customCutoutUrl
                          ? 'bg-[#27150F] border-[#F58A16] text-[#F7F1E8]'
                          : 'bg-[#181311] border-[#F7F1E8]/15 text-[#C3B6A8]'
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#F58A16]">
                        Reference Photo Cutout
                      </span>
                      <span className="mt-1 block text-[11px] leading-snug">
                        Canvas alpha silhouette from supplied reference overlapping NEW RELOOK.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onChangeCustomCutoutUrl(null);
                        onChangeCropConfig({ ...cropConfig, cutoutMode: 'vector_studio_cutout' });
                      }}
                      className={`p-3 rounded-[6px] border text-left transition-colors focus-ring ${
                        cropConfig.cutoutMode === 'vector_studio_cutout' && !customCutoutUrl
                          ? 'bg-[#27150F] border-[#F58A16] text-[#F7F1E8]'
                          : 'bg-[#181311] border-[#F7F1E8]/15 text-[#C3B6A8]'
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#F58A16]">
                        Studio Vector Cutout
                      </span>
                      <span className="mt-1 block text-[11px] leading-snug">
                        High-DPI rim-lit SVG barber cutout (/assets/hero-barber-cutout.svg).
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onChangeCustomCutoutUrl(null);
                        onChangeCropConfig({ ...cropConfig, cutoutMode: 'typographic_fallback' });
                      }}
                      className={`p-3 rounded-[6px] border text-left transition-colors focus-ring ${
                        cropConfig.cutoutMode === 'typographic_fallback' && !customCutoutUrl
                          ? 'bg-[#27150F] border-[#F58A16] text-[#F7F1E8]'
                          : 'bg-[#181311] border-[#F7F1E8]/15 text-[#C3B6A8]'
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#F58A16]">
                        Phase 3 Fallback
                      </span>
                      <span className="mt-1 block text-[11px] leading-snug">
                        Deliberate missing-image typographic brick hero composition.
                      </span>
                    </button>
                  </div>

                  {/* Custom Transparent PNG/WebP Upload */}
                  <div className="pt-3 border-t border-[#F7F1E8]/10 flex flex-wrap items-center justify-between gap-3">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[4px] bg-[#F58A16] text-[#0C0907] text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#FFA033] transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Custom Transparent PNG / WebP</span>
                      <input
                        type="file"
                        accept="image/png,image/webp,image/svg+xml"
                        onChange={handleUploadCustomCutout}
                        className="sr-only"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        onChangeCustomCutoutUrl(null);
                        onChangeCropConfig(DEFAULT_HERO_CROP);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[4px] border border-[#D9A34B]/50 text-xs font-semibold text-[#F7F1E8] hover:border-[#F58A16] transition-colors focus-ring"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Default Crop</span>
                    </button>
                  </div>
                </div>

                {/* Sliders for Scale, Offset, and Title Overlap */}
                <div className="rounded-[8px] bg-[#0C0907] border border-[#F58A16]/35 p-4 space-y-4">
                  <h3 className="font-display-condensed text-xl text-[#F58A16] tracking-wide">
                    2. TUNE HERO SCALE &amp; TITLE OVERLAP
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="block space-y-1">
                      <span className="text-xs font-mono text-[#D9A34B]">
                        Model Scale: {cropConfig.desktopScale.toFixed(2)}x
                      </span>
                      <input
                        type="range"
                        min="0.75"
                        max="1.25"
                        step="0.02"
                        value={cropConfig.desktopScale}
                        onChange={(e) =>
                          onChangeCropConfig(
                            clampHeroCropConfig({
                              ...cropConfig,
                              desktopScale: parseFloat(e.target.value),
                            })
                          )
                        }
                        className="w-full accent-[#F58A16]"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="text-xs font-mono text-[#D9A34B]">
                        Vertical Offset: {cropConfig.desktopOffsetY}px
                      </span>
                      <input
                        type="range"
                        min="-40"
                        max="40"
                        step="2"
                        value={cropConfig.desktopOffsetY}
                        onChange={(e) =>
                          onChangeCropConfig(
                            clampHeroCropConfig({
                              ...cropConfig,
                              desktopOffsetY: parseInt(e.target.value, 10),
                            })
                          )
                        }
                        className="w-full accent-[#F58A16]"
                      />
                    </label>

                    <label className="block space-y-1">
                      <span className="text-xs font-mono text-[#D9A34B]">
                        Title Overlap: {cropConfig.titleOverlapPercent}%
                      </span>
                      <input
                        type="range"
                        min="15"
                        max="60"
                        step="1"
                        value={cropConfig.titleOverlapPercent}
                        onChange={(e) =>
                          onChangeCropConfig(
                            clampHeroCropConfig({
                              ...cropConfig,
                              titleOverlapPercent: parseInt(e.target.value, 10),
                            })
                          )
                        }
                        className="w-full accent-[#F58A16]"
                      />
                    </label>
                  </div>
                </div>

                {/* Diagrammatic 6-Layer Hero Stack Specification */}
                <div className="rounded-[8px] bg-[#0C0907] border border-[#D9A34B]/35 p-4 space-y-2.5">
                  <h3 className="font-display-condensed text-xl text-[#D9A34B] tracking-wide">
                    3. DIAGRAMMATIC 6-LAYER HERO STACK (PHASE 2 &amp; 3)
                  </h3>
                  <ol className="space-y-1.5 text-xs font-mono text-[#C3B6A8]">
                    <li>
                      <strong className="text-[#F58A16]">Layer 6 (z-50):</strong> Foreground Toronto copy &amp; Book Now / Call CTAs
                    </li>
                    <li>
                      <strong className="text-[#F58A16]">Layer 5 (z-40):</strong> Lower black vertical gradient fade into #0C0907 canvas
                    </li>
                    <li>
                      <strong className="text-[#F58A16]">Layer 4 (z-30):</strong> Central transparent barber cutout (alt=&quot;&quot; decorative)
                    </li>
                    <li>
                      <strong className="text-[#F58A16]">Layer 3 (z-20):</strong> Oversized condensed white NEW RELOOK H1 heading
                    </li>
                    <li>
                      <strong className="text-[#F58A16]">Layer 2 (z-10):</strong> Warm amber/orange radial edge glows &amp; center vignette
                    </li>
                    <li>
                      <strong className="text-[#F58A16]">Layer 1 (z-1):</strong> Dark exposed brick wall texture (#27150F over #0C0907)
                    </li>
                  </ol>
                </div>
              </div>

              {/* Right 5 cols: Supplied Desktop/Mobile Reference Image */}
              <div className="lg:col-span-5 rounded-[8px] bg-[#0C0907] border border-[#F58A16]/35 p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D9A34B]">
                    Supplied Visual Target Reference
                  </span>
                  <h3 className="font-display-condensed text-xl text-[#F7F1E8] tracking-wide mt-0.5">
                    DESKTOP &amp; MOBILE REFERENCE SHEET
                  </h3>
                  <p className="mt-1 text-xs text-[#C3B6A8]">
                    Used for palette, condensed typography, orange section bands, and person-over-title hero composition.
                  </p>
                </div>

                <div className="mt-3 max-h-[380px] overflow-y-auto rounded-[6px] border border-[#F7F1E8]/15 bg-[#181311]">
                  <img
                    src="/assets/aistudio/image_c6e6f2ed.webp"
                    alt="Supplied desktop and mobile barbershop reference layout"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tokens' && (
            <div className="space-y-6">
              {/* Palette Swatches */}
              <div>
                <h3 className="font-display-condensed text-2xl text-[#F58A16] tracking-wide mb-3">
                  SEMANTIC PALETTE TOKENS (src/index.css)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {COLOR_TOKENS.map((token) => (
                    <div
                      key={token.name}
                      className="rounded-[8px] bg-[#0C0907] border border-[#F7F1E8]/15 p-3 flex items-center gap-3"
                    >
                      <div
                        className="w-11 h-11 rounded-[6px] border border-white/20 shrink-0"
                        style={{ backgroundColor: token.hex }}
                      />
                      <div className="min-w-0">
                        <span className="block font-mono text-xs font-bold text-[#F7F1E8] truncate">
                          {token.hex}
                        </span>
                        <span className="block font-mono text-[10px] text-[#D9A34B] truncate">
                          {token.name}
                        </span>
                        <span className="block text-[11px] text-[#C3B6A8] leading-tight mt-0.5">
                          {token.usage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography & Component Specimens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-[8px] bg-[#0C0907] border border-[#F58A16]/30 p-5 space-y-3">
                  <span className="text-xs font-mono text-[#D9A34B]">
                    Typography Hierarchy (2+1 Rule)
                  </span>
                  <p className="font-display-condensed text-4xl text-[#F7F1E8]">
                    ANTON DISPLAY HEADING
                  </p>
                  <p className="text-sm text-[#C3B6A8] leading-relaxed">
                    Body copy uses <strong className="text-[#F7F1E8]">DM Sans</strong> at 15px–16px with 1.6 line-height for effortless readability against dark brick and panel surfaces.
                  </p>
                  <p className="font-mono text-xs text-[#D9A34B] tabular-nums">
                    JetBrains Mono Tabular: +1 647-222-3540 · 5.0 / 5 (333 Reviews)
                  </p>
                </div>

                <div className="rounded-[8px] bg-[#0C0907] border border-[#F58A16]/30 p-5 space-y-3">
                  <span className="text-xs font-mono text-[#D9A34B]">
                    Shared Interactive Button &amp; Band Specimens
                  </span>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <span className="px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] bg-[#F58A16] text-[#0C0907] rounded-[4px]">
                      Primary Orange Action
                    </span>
                    <span className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] border border-[#D9A34B]/60 text-[#F7F1E8] rounded-[4px]">
                      Secondary Framed Action
                    </span>
                  </div>
                  <div className="mt-3 bg-[#F58A16] text-[#0C0907] py-2.5 px-4 rounded-[4px] text-center">
                    <span className="font-display-condensed text-xl tracking-wide">
                      FULL-WIDTH ORANGE SECTION BAND SPECIMEN
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-6">
              {/* Phase 1–7 Markdown Summaries */}
              <div>
                <h3 className="font-display-condensed text-2xl text-[#F58A16] tracking-wide mb-3">
                  PHASE 1–7 BLUEPRINT FILES IN WORKSPACE ROOT
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PHASE_SUMMARIES.map((p) => (
                    <div
                      key={p.phase}
                      className="rounded-[8px] bg-[#0C0907] border border-[#F58A16]/30 p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-[#F58A16]">
                          {p.phase}
                        </span>
                        <span className="font-mono text-[11px] text-[#D9A34B]">{p.file}</span>
                      </div>
                      <h4 className="font-display-condensed text-xl text-[#F7F1E8] tracking-wide">
                        {p.title}
                      </h4>
                      <ul className="space-y-1.5 text-xs text-[#C3B6A8]">
                        {p.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#F58A16] shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Inventory Table */}
              <div>
                <h3 className="font-display-condensed text-2xl text-[#D9A34B] tracking-wide mb-3">
                  EVIDENCE &amp; PENDING CONFIRMATION INVENTORY
                </h3>
                <div className="overflow-x-auto rounded-[8px] border border-[#F7F1E8]/15">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0C0907] text-[#D9A34B] font-mono uppercase border-b border-[#F7F1E8]/15">
                        <th className="py-2.5 px-3">Item</th>
                        <th className="py-2.5 px-3">Supplied / Observed Value</th>
                        <th className="py-2.5 px-3">Classification</th>
                        <th className="py-2.5 px-3">Safe Website Behavior</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F7F1E8]/10 bg-[#120D0B]">
                      {EVIDENCE_INVENTORY.map((ev) => (
                        <tr key={ev.id}>
                          <td className="py-2.5 px-3 font-semibold text-[#F7F1E8]">{ev.item}</td>
                          <td className="py-2.5 px-3 text-[#C3B6A8]">{ev.value}</td>
                          <td className="py-2.5 px-3 font-mono text-[#F58A16]">
                            {ev.category.replace('_', ' ')}
                          </td>
                          <td className="py-2.5 px-3 text-[#C3B6A8]">{ev.draftBehavior}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
