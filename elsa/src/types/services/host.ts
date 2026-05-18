import type { HostTable } from "../../db/entities/Host";

export interface HostServiceResolver {
    findOrCreateHost(hostDId: string, hostName: string): Promise<HostTable>;
}
