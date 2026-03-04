// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  // 주소창에 /main을 붙이면 안 됩니다. (main)은 그룹이므로 생략하고 /members로 보내야 합니다.
  redirect('/members');
}
