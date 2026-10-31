/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  DEFAULT_HERO_CROP,
  HeroCropConfig,
  ThemeMode,
  getNextThemeMode,
} from './data/barbershopData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { ProductsSection } from './components/ProductsSection';
import { MeetYourBarberSection } from './components/MeetYourBarberSection';
import { OurBarbersSection } from './components/OurBarbersSection';
import { TransformationGallerySection } from './components/TransformationGallerySection';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { VisitAndBookSection } from './components/VisitAndBookSection';
import { Footer } from './components/Footer';
import { DesignSystemPreviewModal } from './components/DesignSystemPreviewModal';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('relook-theme');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    }
    return 'light';
  });
  const [cropConfig, setCropConfig] = useState<HeroCropConfig>(DEFAULT_HERO_CROP);
  const [customCutoutUrl, setCustomCutoutUrl] = useState<string | null>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<'layers' | 'tokens' | 'docs'>('layers');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem('relook-theme', theme);
    } catch {
      // Ignore storage quota errors in restricted iframes
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => getNextThemeMode(prev));
  };

  const handleOpenInspector = (tab: 'layers' | 'tokens' | 'docs' = 'layers') => {
    setInspectorTab(tab);
    setInspectorOpen(true);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        theme === 'light'
          ? 'bg-[#FAF6EE] text-[#1A130E]'
          : 'bg-[#0C0907] text-[#F7F1E8]'
      }`}
    >
      {/* Skip-to-content accessibility link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300] focus:px-4 focus:py-2 focus:bg-[#F58A16] focus:text-[#0C0907] focus:font-bold focus:rounded-[4px]"
      >
        Skip to main content
      </a>

      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenBlueprintInspector={() => handleOpenInspector('docs')}
      />

      <main id="main-content" className="flex-1">
        <HeroSection
          cropConfig={cropConfig}
          customCutoutUrl={customCutoutUrl}
          onOpenInspector={handleOpenInspector}
        />

        <ServicesSection />

        <ProductsSection />

        <MeetYourBarberSection />

        <OurBarbersSection />

        <TransformationGallerySection />

        <CustomerReviewsSection />

        <VisitAndBookSection />
      </main>

      <Footer theme={theme} onOpenInspector={handleOpenInspector} />

      <DesignSystemPreviewModal
        isOpen={inspectorOpen}
        initialTab={inspectorTab}
        onClose={() => setInspectorOpen(false)}
        cropConfig={cropConfig}
        onChangeCropConfig={setCropConfig}
        customCutoutUrl={customCutoutUrl}
        onChangeCustomCutoutUrl={setCustomCutoutUrl}
      />
    </div>
  );
}
