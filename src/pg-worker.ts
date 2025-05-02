import { PGlite } from '@electric-sql/pglite';
import { worker } from '@electric-sql/pglite/worker';

worker({
  async init() {
    const db = new PGlite('idb://patients-db');

    await db.exec(`
      create table if not exists patient_info (
        id          serial primary key,
        first_name  text,
        last_name   text,
        dob         date,
        gender      text,
        phone       text,
        created_at  timestamptz default (now()),
        email       text
      );
    `);

    return db;
  },
});