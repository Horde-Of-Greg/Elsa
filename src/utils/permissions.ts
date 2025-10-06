import { GuildMember } from 'discord.js';
import { config } from '../config/config';
import { query } from '../database/connection';

export async function getRank(member: GuildMember): Promise<number> {
  if (member.id === config.superUser) return 5;
  const res = await query('SELECT rank FROM ranks WHERE user_id=$1', [member.id]);
  return res.rows.length ? res.rows[0].rank : 0;
}

export async function hasRank(member: GuildMember, min: number): Promise<boolean> {
  return (await getRank(member)) >= min;
}