#!/usr/bin/env node

/**
 * MCP Server entry point for stick figure choreography.
 *
 * This server provides tools for AI to compose fight sequences:
 * - list_actions: List available actions (jab, hook, block, etc.)
 * - list_poses: List available poses
 * - preview_action: Get action details (duration, keyframes)
 * - preview_pose: Get pose details (bone transforms)
 * - create_figure: Create a fighter with name, facing, color
 * - list_figures: List created figures
 * - get_figure: Get figure details
 * - delete_figure: Delete a figure
 * - validate_beat: Check if a beat is valid
 * - compose_sequence: Create a sequence from figures + beats
 * - get_sequence: Retrieve sequence data
 * - list_sequences: List all sequences
 * - export_sequence: Export JSON for browser import
 * - delete_sequence: Delete a sequence
 * - clear_all: Reset all state
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await server.close();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
