export interface ParsedCommand {
  command: string;
  args: string[];
}

export function parseCommand(content: string, prefix: string): ParsedCommand | null {
  if (!content.startsWith(prefix)) return null;
  const args = content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();
  return command ? { command, args } : null;
}

export function parseAddTagArgs(args: string[]): { tag: string; subtag: string; messageLink: string } {
  const joined = args.join(' ');
  const m = joined.match(/"([^"]+)"\s*"([^"]+)"\s*"([^"]+)"/);
  if (!m) throw new Error('Invalid format. Use: !px addtag "tag" "subtag" "message_link"');
  return { tag: m[1].trim(), subtag: m[2].trim(), messageLink: m[3].trim() };
}