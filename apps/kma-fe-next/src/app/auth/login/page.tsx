import { LoginPage } from '@/views/LoginPage';

// SSG: 빌드 타임에 정적으로 생성
export const dynamic = 'force-static';

export default function Page() {
  return <LoginPage />;
}
