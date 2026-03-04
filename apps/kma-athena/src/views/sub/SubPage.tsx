import Link from 'next/link';
import { SubSection } from '@/features/sub/ui/SubSection';

export function SubPage() {
  return (
    <>
      <SubSection />
      <div style={{ marginTop: 14 }}>
        <Link
          href="/"
          className="athena-card"
          style={{
            display: 'inline-block',
            padding: '10px 14px',
            color: '#0b3c5d',
            fontWeight: 600,
          }}
        >
          메인 화면으로 돌아가기
        </Link>
      </div>
    </>
  );
}
