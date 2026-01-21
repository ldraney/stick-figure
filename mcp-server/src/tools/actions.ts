/**
 * Action and pose query tools.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  actions,
  getAction,
  getActionNames,
  getActionsByCategory,
  getCategories,
} from '../data/actions.js';
import { poses, getPose, getPoseNames } from '../data/poses.js';

export function registerActionTools(server: McpServer) {
  // List all available actions
  server.tool(
    'list_actions',
    'List all available fight actions (jab, hook, block, etc.) with their categories and durations',
    {
      category: z
        .string()
        .optional()
        .describe('Filter by category: attack, defense, reaction, transition'),
    },
    async ({ category }) => {
      let result = category ? getActionsByCategory(category) : actions;

      const formatted = result.map((a) => ({
        name: a.name,
        category: a.category,
        duration: a.duration,
        keyframeCount: a.keyframes.length,
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                actions: formatted,
                count: formatted.length,
                categories: getCategories(),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // List all available poses
  server.tool(
    'list_poses',
    'List all available poses that can be used in actions',
    {},
    async () => {
      const poseNames = getPoseNames();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                poses: poseNames,
                count: poseNames.length,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Preview action details
  server.tool(
    'preview_action',
    'Get detailed information about a specific action including its keyframes and poses',
    {
      action: z.string().describe('The action name to preview'),
    },
    async ({ action: actionName }) => {
      const action = getAction(actionName);

      if (!action) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: `Action "${actionName}" not found`,
                availableActions: getActionNames(),
              }),
            },
          ],
          isError: true,
        };
      }

      // Get the poses used by this action
      const usedPoses = action.keyframes.map((kf) => ({
        time: kf.time,
        pose: kf.pose,
        easing: kf.easing,
        poseData: getPose(kf.pose),
      }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                name: action.name,
                category: action.category,
                duration: action.duration,
                keyframes: usedPoses,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Preview pose details
  server.tool(
    'preview_pose',
    'Get detailed information about a specific pose including bone transforms',
    {
      pose: z.string().describe('The pose name to preview'),
    },
    async ({ pose: poseName }) => {
      const pose = getPose(poseName);

      if (!pose) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: `Pose "${poseName}" not found`,
                availablePoses: getPoseNames(),
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
            text: JSON.stringify(pose, null, 2),
          },
        ],
      };
    }
  );
}
