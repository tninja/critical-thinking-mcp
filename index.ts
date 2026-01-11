#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
// Fixed chalk import for ESM
import chalk from 'chalk';

interface ActorCriticThoughtData {
  content: string;
  role: 'actor' | 'critic';
  nextRoundNeeded: boolean;
  thoughtNumber: number;
  totalThoughts: number;
  // Critical Thinking Elements
  assumptions?: string[];
  evidence?: string[];
  standardsApplied?: string[];
}

class ActorCriticThinkingServer {
  private thoughtHistory: ActorCriticThoughtData[] = [];
  private currentRound: number = 1;

  private validateThoughtData(input: unknown): ActorCriticThoughtData {
    const data = input as Record<string, unknown>;

    if (!data.content || typeof data.content !== 'string') {
      throw new Error('Invalid content: must be a string');
    }
    if (!data.role || (data.role !== 'actor' && data.role !== 'critic')) {
      throw new Error('Invalid role: must be either "actor" or "critic"');
    }
    if (typeof data.nextRoundNeeded !== 'boolean') {
      throw new Error('Invalid nextRoundNeeded: must be a boolean');
    }
    if (!data.thoughtNumber || typeof data.thoughtNumber !== 'number') {
      throw new Error('Invalid thoughtNumber: must be a number');
    }
    if (!data.totalThoughts || typeof data.totalThoughts !== 'number') {
      throw new Error('Invalid totalThoughts: must be a number');
    }
    if (data.totalThoughts < 3) {
      throw new Error('Invalid totalThoughts: must be >= 3');
    }
    if (data.totalThoughts % 2 === 0) {
      throw new Error('Invalid totalThoughts: must be odd');
    }

    return {
      content: data.content,
      role: data.role as 'actor' | 'critic',
      nextRoundNeeded: data.nextRoundNeeded,
      thoughtNumber: data.thoughtNumber,
      totalThoughts: data.totalThoughts,
      assumptions: Array.isArray(data.assumptions) ? data.assumptions as string[] : undefined,
      evidence: Array.isArray(data.evidence) ? data.evidence as string[] : undefined,
      standardsApplied: Array.isArray(data.standardsApplied) ? data.standardsApplied as string[] : undefined,
    };
  }

  private formatThought(thoughtData: ActorCriticThoughtData): string {
    const { thoughtNumber, content, role, assumptions, evidence, standardsApplied } = thoughtData;

    let prefix = '';
    let roleColor = chalk.blue;

    if (role === 'actor') {
      prefix = '🎭 Actor';
      roleColor = chalk.green;
    } else {
      prefix = '🔍 Critic';
      roleColor = chalk.yellow;
    }

    const header = roleColor(`${prefix} - Round ${Math.ceil(thoughtNumber / 2)} (Thought ${thoughtNumber})`);
    
    let extraInfo = '';
    if (assumptions && assumptions.length > 0) {
      extraInfo += `\n${chalk.dim('  ↳ Assumptions:')} ${chalk.italic(assumptions.join(', '))}`;
    }
    if (evidence && evidence.length > 0) {
      extraInfo += `\n${chalk.dim('  ↳ Evidence:')} ${chalk.cyan(evidence.join(', '))}`;
    }
    if (standardsApplied && standardsApplied.length > 0) {
      extraInfo += `\n${chalk.dim('  ↳ Standards Applied:')} ${chalk.magenta(standardsApplied.join(', '))}`;
    }

    const fullContent = content + extraInfo;
    const border = '─'.repeat(Math.min(100, Math.max(header.length, content.split('\n')[0].length) + 4));

    return `
┌${border}┐
│ ${header} │
├${border}┤
│ ${content} │${extraInfo ? '\n├' + border + '┤' + extraInfo : ''}
└${border}┘`;
  }

  public processThought(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const validatedInput = this.validateThoughtData(input);

      this.thoughtHistory.push(validatedInput);

      // 更新当前轮次
      this.currentRound = Math.ceil(validatedInput.thoughtNumber / 2);

      const formattedThought = this.formatThought(validatedInput);
      console.error(formattedThought);

      // 检查是否需要切换角色
      const nextRole = validatedInput.role === 'actor' ? 'critic' : 'actor';
      const isRoundComplete = validatedInput.thoughtNumber % 2 === 0;

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            thoughtNumber: validatedInput.thoughtNumber,
            totalThoughts: validatedInput.totalThoughts,
            currentRound: this.currentRound,
            currentRole: validatedInput.role,
            nextRole: nextRole,
            isRoundComplete: isRoundComplete,
            nextRoundNeeded: validatedInput.nextRoundNeeded,
            thoughtHistoryLength: this.thoughtHistory.length,
            actorThoughts: this.thoughtHistory.filter(t => t.role === 'actor').length,
            criticThoughts: this.thoughtHistory.filter(t => t.role === 'critic').length
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : String(error),
            status: 'failed'
          }, null, 2)
        }],
        isError: true
      };
    }
  }
}

const ACTOR_CRITIC_THINKING_TOOL: Tool = {
  name: "actor-critic-thinking",
  description: `A sophisticated tool for dual-perspective analysis enhanced with Critical Thinking Best Practices.
This tool implements the Actor-Critic methodology integrated with Universal Intellectual Standards and Elements of Thought.
Each thought alternates between 'Actor' (performer/creator) and 'Critic' (evaluator/analyst), fostering a dialectical process that minimizes bias and maximizes logical depth.

### Critical Thinking Framework
#### 1. Universal Intellectual Standards (The 'Critic's Checklist')
The Critic must evaluate the Actor's input against these standards:
- Clarity: Is the point stated clearly? Is it free from ambiguity?
- Accuracy: Is the claim true? Can it be verified by evidence?
- Precision: Is it specific enough? Are details provided?
- Relevance: How does this relate to the core problem?
- Depth: Does it address the complexities and underlying issues?
- Breadth: Are there other perspectives or counter-arguments considered?
- Logic: Does the conclusion follow from the premises?
- Significance: Is this the most important factor to consider?
- Fairness: Is the assessment unbiased and empathetic to all stakeholders?

#### 2. Elements of Thought (The 'Actor's Guide')
The Actor should articulate their position by identifying:
- Purpose: What is the goal of this action or decision?
- Question at Issue: What specific problem is being addressed?
- Information: What data, facts, or experiences are being used?
- Inferences/Conclusions: What interpretations are being made?
- Concepts: What theories, definitions, or laws govern this thinking?
- Assumptions: What is being taken for granted?
- Implications/Consequences: What happens if this line of thought is followed?
- Points of View: From what perspective are we looking at this?

### Workflow
1. Start with either Actor or Critic.
2. Alternate perspectives to maintain a balanced, self-correcting dialogue.
3. Explicitly state assumptions and evidence in each step.
4. Set nextRoundNeeded to false ONLY when a robust, multi-dimensional consensus or final evaluation is reached.`,
  inputSchema: {
    type: "object",
    properties: {
      content: {
        type: "string",
        description: "Your current analysis content from the specified role perspective"
      },
      role: {
        type: "string",
        enum: ["actor", "critic"],
        description: "The perspective role: 'actor' for empathetic/creative viewpoint, 'critic' for analytical/evaluative viewpoint"
      },
      nextRoundNeeded: {
        type: "boolean",
        description: "Whether another round of actor-critic dialogue is needed"
      },
      thoughtNumber: {
        type: "integer",
        description: "Current thought number in the sequence",
        minimum: 1
      },
      totalThoughts: {
        type: "integer",
        description: "Total number of thoughts planned (must be odd and >= 3)",
        minimum: 3
      },
      assumptions: {
        type: "array",
        items: { type: "string" },
        description: "Key assumptions being made in this thought"
      },
      evidence: {
        type: "array",
        items: { type: "string" },
        description: "Data, facts, or observations supporting this thought"
      },
      standardsApplied: {
        type: "array",
        items: { type: "string" },
        description: "Intellectual standards (Clarity, Logic, etc.) applied in this thought (primarily for Critics)"
      }
    },
    required: ["content", "role", "nextRoundNeeded", "thoughtNumber", "totalThoughts"]
  }
};

const server = new Server(
  {
    name: "actor-critic-thinking-server",
    version: "0.2.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const thinkingServer = new ActorCriticThinkingServer();

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [ACTOR_CRITIC_THINKING_TOOL],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "actor-critic-thinking") {
    return thinkingServer.processThought(request.params.arguments);
  }

  return {
    content: [{
      type: "text",
      text: `Unknown tool: ${request.params.name}`
    }],
    isError: true
  };
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Actor-Critic Thinking MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
