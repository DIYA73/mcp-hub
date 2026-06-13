export type ServerId = string & { readonly __brand: 'ServerId' };

export function toServerId(id: string): ServerId {
  return id as ServerId;
}

export type McpTransport = 'sse' | 'http' | 'stdio';
export type ServerStatus = 'healthy' | 'unhealthy' | 'unknown';

export interface ToolCallLog {
  serverId: ServerId;
  tool: string;
  input: Record<string, unknown>;
  output: unknown;
  durationMs: number;
  success: boolean;
  timestamp: Date;
}
