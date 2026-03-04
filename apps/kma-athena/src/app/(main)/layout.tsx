import { MainLayout } from '@/widgets/layout/MainLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
