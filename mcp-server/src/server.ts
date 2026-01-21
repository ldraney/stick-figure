/**
 * MCP Server setup for stick figure choreography.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerActionTools } from './tools/actions.js';
import { registerFigureTools } from './tools/figures.js';
import { registerSequenceTools } from './tools/sequences.js';

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'stick-figure-choreography',
    version: '1.0.0',
  });

  // Register all tools
  registerActionTools(server);
  registerFigureTools(server);
  registerSequenceTools(server);

  return server;
}
