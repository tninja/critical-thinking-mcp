# Critical Thinking MCP Server

A dual-perspective thinking analysis server based on Model Context Protocol (MCP), providing comprehensive performance evaluation through Actor-Critic methodology integrated with [Critical Thinking](https://en.wikipedia.org/wiki/Critical_thinking) best practices.

## How to use

- build firstly with `npm install && npm run build`

- config this mcp in your mcp client such as Claude Code

```json
{
  "mcpServers": {
    "critical-thinking": {
      "command": "node",
      "args": [
        "<path>/critical-thinking-mcp/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

## Critical Thinking Framework

This server implements a dialectical process using two core components of critical thinking:

### 1. Elements of Thought (The 'Actor's Guide')
The **Actor** (performer/creator) uses these elements to articulate their position:
- **Purpose**: What is the goal of this action or decision?
- **Question at Issue**: What specific problem is being addressed?
- **Information/Evidence**: What data or facts are being used?
- **Assumptions**: What is being taken for granted?
- **Concepts**: What theories or definitions govern this thinking?
- **Inferences**: What interpretations are being made?
- **Implications**: What happens if this line of thought is followed?
- **Points of View**: From what perspective are we looking at this?

### 2. Universal Intellectual Standards (The 'Critic's Checklist')
The **Critic** (evaluator/analyst) evaluates the Actor's input against these standards:
- **Clarity**: Is the point stated clearly?
- **Accuracy**: Is the claim true and verifiable?
- **Precision**: Are enough specific details provided?
- **Relevance**: How does this relate to the core problem?
- **Depth**: Does it address the complexities?
- **Breadth**: Are other perspectives considered?
- **Logic**: Does the conclusion follow from the premises?
- **Significance**: Is this the most important factor?
- **Fairness**: Is the assessment unbiased and empathetic?

## Parameters

### Required Parameters

- `content` (string): Current analysis content from the specified role perspective.
- `role` (string): Perspective role: `"actor"` (creative/empathetic) or `"critic"` (analytical/evaluative).
- `nextRoundNeeded` (boolean): Whether another round of actor-critic dialogue is needed.
- `thoughtNumber` (integer): Current thought number in the sequence (starts at 1).
- `totalThoughts` (integer): Total planned thoughts (must be **odd** and **>= 3**).

### Optional Parameters (Critical Thinking Metadata)

- `assumptions` (string[]): Key assumptions being made in this thought.
- `evidence` (string[]): Data, facts, or observations supporting this thought.
- `standardsApplied` (string[]): Intellectual standards (e.g., Clarity, Logic) applied (primarily for Critics).

## Best Practices

1. **Dialectical Iteration**: Always alternate between Actor and Critic roles to foster a self-correcting dialogue.
2. **Explicit Evidence**: Use the `evidence` and `assumptions` parameters to make the underlying logic transparent.
3. **Apply Standards**: Critics should explicitly state which Intellectual Standards they are using to evaluate the Actor's work.
4. **Depth over Speed**: Don't rush to set `nextRoundNeeded` to false. Ensure the analysis has reached a robust, multi-dimensional consensus.
5. **Odd Thought Totals**: Always plan for an odd number of total thoughts to ensure a balanced sequence (e.g., Actor -> Critic -> Actor/Final Synthesis).
