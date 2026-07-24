import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from monorepo root if running from apps/api
config({ path: resolve(__dirname, '../../../../.env') });

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://artplatform:artplatform_secret@localhost:5432/artplatform',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/shared/database/migrations/*{.ts,.js}'],
});
