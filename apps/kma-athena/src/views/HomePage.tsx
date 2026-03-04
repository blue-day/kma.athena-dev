'use client';

import { useState } from 'react';
import { sampleNotices, sampleStats } from '@/entities/sample/model/sampleStats';
import { HeroPanel } from '@/features/hero/ui/HeroPanel';
import { CommonPopup } from '@/shared/ui/CommonPopup';

export function HomePage() {
  const [isBannerPopupOpen, setIsBannerPopupOpen] = useState(false);

  return (
    <>
      <HeroPanel onClick={() => setIsBannerPopupOpen(true)} />
      <section className="athena-grid">
        {sampleStats.map((item) => (
          <article
            key={item.key}
            className="athena-card"
          >
            <p style={{ margin: 0, fontSize: 13, color: '#5f7286' }}>{item.key}</p>
            <h3 style={{ margin: '8px 0 0', fontSize: 28, color: '#0b3c5d' }}>{item.value}</h3>
          </article>
        ))}
      </section>

      <section
        className="athena-card"
        style={{ marginTop: 16 }}
      >
        <h2 style={{ marginTop: 0, fontSize: 20 }}>{'\uacf5\uc9c0'}</h2>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
          {sampleNotices.map((notice) => (
            <li key={notice}>{notice}</li>
          ))}
        </ul>
      </section>

      <CommonPopup
        open={isBannerPopupOpen}
        title={'\uba54\uc778 \ubc30\ub108'}
        message={'\uba54\uc778 \ubc30\ub108\uc785\ub2c8\ub2e4.'}
        onClose={() => setIsBannerPopupOpen(false)}
      />
    </>
  );
}
