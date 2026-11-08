'use client';

import React, { useState } from 'react';
import { EmbeddedResellerRegisterForm } from '@/components/reseller-program/EmbeddedResellerRegisterForm';

export default function ResellerRegisterPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('1-year');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0033] via-[#2d0052] to-[#0f001f] text-slate-100 py-12 sm:py-16 px-4 relative overflow-hidden">
      {/* Subtle Ambient Background Glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <EmbeddedResellerRegisterForm
          selectedPlanId={selectedPlanId}
          onSelectPlanId={setSelectedPlanId}
        />
      </div>
    </div>
  );
}
