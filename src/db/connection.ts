import { Pool } from 'pg';
import { config } from '../config/config';
export const pool = new Pool(config.postgres);
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  console.log('Executed query', { text, duration: Date.now() - start, rows: res.rowCount });
  return res;
}