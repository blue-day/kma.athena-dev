'use client';

type HeroPanelProps = {
  onClick?: () => void;
};

export function HeroPanel({ onClick }: HeroPanelProps) {
  return (
    <section
      className="athena-card"
      onClick={onClick}
      style={{
        marginBottom: 16,
        background: 'linear-gradient(120deg, #0b3c5d, #328cc1)',
        color: '#fff',
        cursor: 'pointer',
      }}
    >
      <p style={{ margin: 0, opacity: 0.9, fontSize: 13 }}>ATHENA DASHBOARD</p>
      <h1 style={{ margin: '8px 0 0', fontSize: 28 }}>{'\uba54\uc778 \ud654\uba74 \uc0d8\ud50c'}</h1>
      <p style={{ marginTop: 8, maxWidth: 700, lineHeight: 1.5 }}>
        {'kma-fe-next\uc640 \ub3d9\uc77c\ud55c Next App Router \uad6c\uc870\ub97c \ub530\ub974\ub294 \uc0d8\ud50c \ud398\uc774\uc9c0\uc785\ub2c8\ub2e4.'}
      </p>
    </section>
  );
}
