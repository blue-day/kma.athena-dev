# 1단계: 베이스 이미지 설정
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm add -g turbo

# 2단계: 프로젝트 구조 슬라이싱 (Prune)
# 모노레포에서 특정 앱(kma-fe-next)에 필요한 소스만 추출합니다.
FROM base AS pruner
WORKDIR /app
COPY . .
RUN turbo prune kma-fe-next --docker

# 3단계: 의존성 설치 및 빌드
FROM base AS builder
WORKDIR /app

# Prune된 결과물만 복사
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# 실제 소스 코드 복사 및 빌드
COPY --from=pruner /app/out/full/ .
RUN turbo run build --filter=kma-fe-next

# 4단계: 실행 전용 이미지 (Production)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 필요한 결과물만 빌드 단계에서 복사
# (Next.js standalone 빌드 설정을 쓰지 않는 일반적인 방식 기준)
COPY --from=builder /app/apps/kma-fe-next/next.config.mjs ./
COPY --from=builder /app/apps/kma-fe-next/package.json ./
COPY --from=builder /app/apps/kma-fe-next/public ./apps/kma-fe-next/public
COPY --from=builder /app/apps/kma-fe-next/.next ./apps/kma-fe-next/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

# 포트 설정 (package.json의 dev가 3001이므로 동일하게 맞춤)
EXPOSE 3001
ENV PORT=3001

# 실행 명령어
CMD ["npx", "next", "start", "apps/kma-fe-next", "-p", "3001"]