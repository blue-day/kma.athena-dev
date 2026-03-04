import { Header } from '@/widgets/layout/Header';
import { Footer } from '@/widgets/layout/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="athena-shell">
      <Header />
      <main className="athena-main">{children}</main>
      <Footer />
    </div>
  );
}
