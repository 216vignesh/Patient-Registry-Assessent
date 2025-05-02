import { PGliteWorker } from '@electric-sql/pglite/worker';

export const db = new PGliteWorker(
  new Worker(new URL('../pg-worker.ts', import.meta.url), { type: 'module' }),
  {
    dataDir: 'idb://patients-db',
  },
);
