import { Injectable, BadGatewayException, Logger } from '@nestjs/common';
import { ServersService } from '../servers/servers.service';
import { LogsService } from '../logs/logs.service';

export interface CallToolDto {
  tool: string;
  input: Record<string, unknown>;
}

export interface McpToolCallResponse {
  content: unknown[];
  isError?: boolean;
}

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(
    private readonly servers: ServersService,
    private readonly logs: LogsService,
  ) {}

  async callTool(serverId: string, dto: CallToolDto): Promise<McpToolCallResponse> {
    const server = await this.servers.findOne(serverId);
    const start = Date.now();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (server.apiKey) headers['Authorization'] = `Bearer ${server.apiKey}`;

    const body = JSON.stringify({
      jsonrpc: '2.0', id: Date.now(),
      method: 'tools/call',
      params: { name: dto.tool, arguments: dto.input },
    });

    let result: McpToolCallResponse;
    let success = true;
    let error: string | undefined;

    try {
      const res = await fetch(server.url, { method: 'POST', headers, body, signal: AbortSignal.timeout(30_000) });
      if (!res.ok) throw new Error(`Upstream returned ${res.status}`);
      const json = await res.json() as { result?: McpToolCallResponse; error?: { message: string } };
      if (json.error) { success = false; error = json.error.message; result = { content: [], isError: true }; }
      else { result = json.result ?? { content: [] }; }
    } catch (err) {
      success = false;
      error = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Proxy error for ${server.name}: ${error}`);
      await this.servers.updateStatus(serverId, 'unhealthy', error);
      await this.logs.record({ serverId, serverName: server.name, tool: dto.tool, input: dto.input, output: null, durationMs: Date.now() - start, success: false, error });
      throw new BadGatewayException(`MCP server "${server.name}" error: ${error}`);
    }

    await this.logs.record({ serverId, serverName: server.name, tool: dto.tool, input: dto.input, output: result, durationMs: Date.now() - start, success, error });
    return result;
  }

  async listTools(serverId: string): Promise<unknown> {
    const server = await this.servers.findOne(serverId);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (server.apiKey) headers['Authorization'] = `Bearer ${server.apiKey}`;
    const res = await fetch(server.url, { method: 'POST', headers, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }), signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new BadGatewayException(`Server returned ${res.status}`);
    return res.json();
  }
}
