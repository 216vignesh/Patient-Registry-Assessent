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
        dob         text,
        gender      text,
        phone       text,
        created_at  timestamptz default (now()),
        email       text,
        address text,
        city text,
        state text,
        zip text,
        insurance_company text,
        insurance_number text,
        emergency_name text,
        emergency_phone text
      );
    `);

    return db;
  },
});