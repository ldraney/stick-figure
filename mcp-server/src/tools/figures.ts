/**
 * Figure management tools.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { state } from '../state.js';

export function registerFigureTools(server: McpServer) {
  // Create a new figure
  server.tool(
    'create_figure',
    'Create a new stick figure fighter with a name, position, facing direction, and color',
    {
      name: z.string().describe('Unique name for the figure (e.g., "hero", "villain")'),
      x: z.number().optional().describe('X position in scene (default: 0)'),
      y: z.number().optional().describe('Y position in scene (default: 0)'),
      facing: z
        .enum(['left', 'right'])
        .optional()
        .describe('Direction the figure faces (default: right)'),
      color: z
        .string()
        .optional()
        .describe('Color for the figure (default: #00d9ff). Use hex colors like #ff6b6b'),
    },
    async ({ name, x, y, facing, color }) => {
      try {
        const figure = state.createFigure(name, { x, y, facing, color });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  message: `Created figure "${name}"`,
                  figure,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error instanceof Error ? error.message : 'Unknown error',
              }),
            },
          ],
          isError: true,
        };
      }
    }
  );

  // List all figures
  server.tool(
    'list_figures',
    'List all created stick figure fighters',
    {},
    async () => {
      const figures = state.listFigures();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                figures,
                count: figures.length,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Get a specific figure
  server.tool(
    'get_figure',
    'Get details about a specific figure',
    {
      name: z.string().describe('The figure name'),
    },
    async ({ name }) => {
      const figure = state.getFigure(name);

      if (!figure) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: `Figure "${name}" not found`,
                availableFigures: state.listFigures().map((f) => f.name),
              }),
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(figure, null, 2),
          },
        ],
      };
    }
  );

  // Delete a figure
  server.tool(
    'delete_figure',
    'Delete a figure by name',
    {
      name: z.string().describe('The figure name to delete'),
    },
    async ({ name }) => {
      const deleted = state.deleteFigure(name);

      if (!deleted) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: `Figure "${name}" not found`,
              }),
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Deleted figure "${name}"`,
            }),
          },
        ],
      };
    }
  );
}
