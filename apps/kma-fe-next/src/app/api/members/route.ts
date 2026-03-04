import { NextResponse } from 'next/server';

type Member = { id: string; name: string; role: string };

const MOCK: Member[] = [
  { id: '1001', name: '김현도', role: 'ADMIN' },
  { id: '1002', name: '홍길동', role: 'USER' },
  { id: '1003', name: '이순신', role: 'USER' },
];

export async function GET() {
  // 실제로는 NestJS GraphQL/API를 호출하거나 DB를 조회합니다.
  return NextResponse.json({ items: MOCK });
}
