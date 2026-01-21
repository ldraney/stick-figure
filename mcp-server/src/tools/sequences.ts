/**
 * Sequence composition tools.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { state } from '../state.js';
import { hasAction, getActionNames } from '../data/actions.js';
import { BeatData, ExportedSequence } from '../types.js';
import * as fs from 'fs';
import * as path from 'path';

// Schema for beats
const beatSchema = z.object({
  time: z.number().describe('Start time in seconds'),
  actor: z.string().describe('Figure name performing the action'),
  action: z.string().describe('Action name to perform'),
  target: z.string().optional().describe('Optional target figure (for attacks)'),
});

export function registerSequenceTools(server: McpServer) {
  // Validate a beat before composing
  server.tool(
    'validate_beat',
    'Check if a beat is valid before adding it to a sequence',
    {
      time: z.number().describe('Start time in seconds'),
      actor: z.string().describe('Figure name performing the action'),
      action: z.string().describe('Action name to perform'),
      target: z.string().optional().describe('Optional target figure'),
    },
    async ({ time, actor, action, target }) => {
      const errors: string[] = [];

      // Validate time
      if (time < 0) {
        errors.push('Time must be non-negative');
      }

      // Validate actor exists
      if (!state.hasFigure(actor)) {
        errors.push(`Actor figure "${actor}" does not exist`);
      }

      // Validate action exists
      if (!hasAction(action)) {
        errors.push(`Action "${action}" does not exist. Available: ${getActionNames().join(', ')}`);
      }

      // Validate target exists (if provided)
      if (target && !state.hasFigure(target)) {
        errors.push(`Target figure "${target}" does not exist`);
      }

      if (errors.length > 0) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                valid: false,
                errors,
              }),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              valid: true,
              beat: { time, actor, action, target },
            }),
          },
        ],
      };
    }
  );

  // Compose a sequence
  server.tool(
    'compose_sequence',
    'Create a fight sequence from figures and beats. Figures must be created first using create_figure.',
    {
      name: z.string().describe('Unique name for the sequence'),
      figures: z.array(z.string()).describe('Array of figure names to include'),
      beats: z.array(beatSchema).describe('Array of beats (choreographed moments)'),
    },
    async ({ name, figures, beats }) => {
      try {
        // Validate all figures exist
        for (const figureName of figures) {
          if (!state.hasFigure(figureName)) {
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({
                    error: `Figure "${figureName}" does not exist. Create it first with create_figure.`,
                    availableFigures: state.listFigures().map((f) => f.name),
                  }),
                },
              ],
              isError: true,
            };
          }
        }

        // Validate all beats
        const beatErrors: string[] = [];
        for (let i = 0; i < beats.length; i++) {
          const beat = beats[i];

          if (!figures.includes(beat.actor)) {
            beatErrors.push(`Beat ${i}: Actor "${beat.actor}" not in sequence figures`);
          }

          if (!hasAction(beat.action)) {
            beatErrors.push(`Beat ${i}: Action "${beat.action}" does not exist`);
          }

          if (beat.target && !figures.includes(beat.target)) {
            beatErrors.push(`Beat ${i}: Target "${beat.target}" not in sequence figures`);
          }
        }

        if (beatErrors.length > 0) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: 'Invalid beats',
                  details: beatErrors,
                  availableActions: getActionNames(),
                }),
              },
            ],
            isError: true,
          };
        }

        // Create the sequence
        const sequence = state.createSequence(name, figures, beats as BeatData[]);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  success: true,
                  message: `Created sequence "${name}" with ${figures.length} figures and ${beats.length} beats`,
                  sequence,
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

  // Get a sequence
  server.tool(
    'get_sequence',
    'Retrieve sequence data by name',
    {
      name: z.string().describe('The sequence name'),
    },
    async ({ name }) => {
      const sequence = state.getSequence(name);

      if (!sequence) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: `Sequence "${name}" not found`,
                availableSequences: state.listSequences().map((s) => s.name),
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
            text: JSON.stringify(sequence, null, 2),
          },
        ],
      };
    }
  );

  // List all sequences
  server.tool(
    'list_sequences',
    'List all created sequences',
    {},
    async () => {
      const sequences = state.listSequences();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                sequences: sequences.map((s) => ({
                  name: s.name,
                  figureCount: s.figures.length,
                  beatCount: s.beats.length,
                })),
                count: sequences.length,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Export sequence for browser import
  server.tool(
    'export_sequence',
    'Export a sequence as JSON that can be imported into the browser app',
    {
      name: z.string().describe('The sequence name to export'),
      outputPath: z
        .string()
        .optional()
        .describe('Optional file path to write the JSON. If not provided, returns JSON in response.'),
    },
    async ({ name, outputPath }) => {
      const sequence = state.getSequence(name);

      if (!sequence) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: `Sequence "${name}" not found`,
                availableSequences: state.listSequences().map((s) => s.name),
              }),
            },
          ],
          isError: true,
        };
      }

      // Get figure data for all figures in the sequence
      const figureData = sequence.figures.map((figureName) => state.getFigure(figureName)!);

      const exportData: ExportedSequence = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        sequence,
        figures: figureData,
      };

      const jsonContent = JSON.stringify(exportData, null, 2);

      if (outputPath) {
        try {
          // Resolve the path (handle relative paths)
          const resolvedPath = path.resolve(outputPath);
          fs.writeFileSync(resolvedPath, jsonContent, 'utf-8');

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  message: `Exported sequence "${name}" to ${resolvedPath}`,
                  path: resolvedPath,
                }),
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: `Failed to write file: ${error instanceof Error ? error.message : 'Unknown error'}`,
                }),
              },
            ],
            isError: true,
          };
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                message: `Exported sequence "${name}"`,
                data: exportData,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Delete a sequence
  server.tool(
    'delete_sequence',
    'Delete a sequence by name',
    {
      name: z.string().describe('The sequence name to delete'),
    },
    async ({ name }) => {
      const deleted = state.deleteSequence(name);

      if (!deleted) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: `Sequence "${name}" not found`,
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
              message: `Deleted sequence "${name}"`,
            }),
          },
        ],
      };
    }
  );

  // Clear all state
  server.tool(
    'clear_all',
    'Clear all figures and sequences (reset state)',
    {},
    async () => {
      const stats = state.getStats();
      state.clear();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: `Cleared ${stats.figures} figures and ${stats.sequences} sequences`,
            }),
          },
        ],
      };
    }
  );
}
