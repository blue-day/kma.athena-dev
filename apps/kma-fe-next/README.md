# kma-fe-next

## Run (UI only / mock)
1. Copy `.env.example` to `.env.local`
2. Set `NEXT_PUBLIC_API_MODE=mock`
3. Run from repository root:

```bash
pnpm install
pnpm --filter kma-fe-next dev
```

## Run (real backend)
1. Set `NEXT_PUBLIC_API_MODE=real`
2. Start `kma-api` on `http://localhost:4000`
3. Run the same dev command
