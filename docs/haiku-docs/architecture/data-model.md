<!-- model: sonnet -->
# Data Model: The Navigable Node

## Core Concept

**Everything is a node.**

Nodes represent "a piece of content" that can be displayed in the 3-pane interface. Each node has two representations: summary (human) and detail (AI).

## Node Structure (TypeScript)

```typescript
// Reusable type alias for ISO8601 date strings
type ISO8601 = string;

// Base metadata shared across all model runs
interface ModelMetadataBase {
  prompt: string;
  tokens: number;
  timestamp?: ISO8601;
}

// Metadata for individual Haiku runs (supports parallelization)
interface HaikuRunMetadata extends ModelMetadataBase {
  parallelIndex?: number;        // If parallel calls
}

interface NavigableNode {
  // Identity
  id: string;                    // kebab-case: "auth-flow"
  title: string;                 // Sentence case: "Authentication Flow"
  
  // Dual Representation (THE CORE PATTERN)
  summary: {
    content: string;             // ~30 lines, human-optimized
    lineCount: number;           // For UI hints
    estimatedReadSeconds: number;// Always seconds for consistency
  };
  
  detail?: {
    content: string;             // ~100 lines, full context
    lineCount: number;
    estimatedReadSeconds: number;
  };
  
  // Model Attribution
  modelSource: 'opus' | 'haiku' | 'sonnet' | 'combined';
  modelMetadata?: {
    opus?: ModelMetadataBase;
    haikuRuns?: Array<HaikuRunMetadata>;
    sonnet?: ModelMetadataBase;
  };
  
  // Navigation Context
  breadcrumb: string[];          // ["home", "architecture", "data-model"]
  linkedTo: string[];            // Nodes this links to
  linkedDetailOnly?: string[];   // Links only visible in detail view
  
  // Content Classification
  category: 'concept' | 'guide' | 'reference' | 'use-case';
  tags?: string[];               // ["architecture", "data", "structure"]
  
  // Capabilities
  requiresValidation?: boolean;  // Does this need Sonnet review?
  canParallelize?: number;       // How many parallel Haiku calls? (0 = none)
  
  // Cost Tracking
  cost?: {
    opus?: number;               // Tokens or cost
    haiku?: number;
    sonnet?: number;
    total?: number;              // Aggregate
  };
  
  // Version & Metadata
  version: number;               // For updates
  createdAt: ISO8601;
  updatedAt: ISO8601;
  author?: string;               // Human editor or "opus"/"haiku"
}
```

Derived helpers such as linkedFrom or "has detail?" are computed by the build step: linkedFrom comes from the graph index, and the UI simply checks Boolean(node.detail) when deciding whether to show "See details." We no longer persist those values on every node.

## The Dual-Layer Contract

### Rule 1: Summary Always Exists
- Every node MUST have a summary.
- Summary is ALWAYS the entry point.
- User lands on summary first.

### Rule 2: Detail is Optional
- Not all nodes need detail.
- If detail exists: Show "See details" link
- If detail doesn't exist: No link shown

Examples:
- Create detail for: Complex topics, multi-step processes
- Skip detail for: Simple definitions, quick references

### Rule 3: Links are Directional
If Node A links to Node B:
```
linkedTo: ["node-b"]
```
The graph layer backfills Node B's inbound view, so UI code can ask:
```
getLinkedFrom("node-b") → ["node-a"]
```
Links only in detail view:
```
linkedDetailOnly: ["node-security-proofs"]
```

### Rule 4: Model Attribution is Visible
Every node shows one of:
```
<!-- model: opus -->
<!-- model: haiku -->
<!-- model: opus, haiku -->
```
Result: users learn optimal AI patterns.

## Practical Examples

### Example 1: Simple Node (No Detail)
```typescript
const homeNode = {
  id: "home",
  title: "Home",

  summary: {
    content: "<!-- model: opus -->\n# Welcome\n\n...",
    lineCount: 30,
    estimatedReadSeconds: 300  // ~5 minutes
  },

  // No detail layer - detail is optional
  canParallelize: 0,

  linkedTo: ["vision", "three-pillars"],
  category: "concept",

  modelSource: "opus",
  modelMetadata: {
    opus: {
      prompt: "Generate home summary",
      tokens: 200,
      timestamp: "2025-11-13T05:00:00Z"
    }
  }
} as NavigableNode;

homeNode.cost = calculateNodeCost(homeNode);
```

### Example 2: Complex Node (With Detail)
```typescript
const tokenEconomicsNode = {
  id: "token-economics",
  title: "Token Economics: The Math",

  summary: {
    content: "<!-- model: sonnet -->\n# Token Economics\n\n...",
    lineCount: 35,
    estimatedReadSeconds: 300
  },

  detail: {
    content: "<!-- model: sonnet -->\n# Token Economics (Full)\n\n...",
    lineCount: 187,
    estimatedReadSeconds: 900
  },

  canParallelize: 0,

  linkedTo: ["pillar-3", "implementation"],
  linkedDetailOnly: ["jwt-math-proofs"],

  category: "reference",
  tags: ["cost", "efficiency", "economics"],

  modelSource: "sonnet",
  modelMetadata: {
    sonnet: {
      prompt: "Explain full token economics",
      tokens: 687,  // 187 summary + 500 detail
      timestamp: "2025-11-13T05:10:00Z"
    }
  }
} as NavigableNode;

tokenEconomicsNode.cost = calculateNodeCost(tokenEconomicsNode);
```

### Example 3: Orchestrated Output (Multi-Model)
```typescript
const authImplementationNode = {
  id: "auth-implementation",
  title: "Authentication Implementation",

  summary: {
    content: "<!-- model: opus -->\n# Auth: Strategic Layer\n\n...",
    lineCount: 30,
    estimatedReadSeconds: 300
  },

  detail: {
    content: "<!-- model: opus, haiku, sonnet -->\n# Auth (Complete)\n\n...",
    lineCount: 250,
    estimatedReadSeconds: 1200
  },

  canParallelize: 3,            // 3 parallel Haiku calls for examples
  requiresValidation: true,     // Sonnet reviews examples

  modelMetadata: {
    opus: {
      prompt: "Design auth architecture",
      tokens: 200,
      timestamp: "2025-11-13T05:00:00Z"
    },
    haikuRuns: [
      { prompt: "Example for component 1", tokens: 1000, timestamp: "2025-11-13T05:01:00Z", parallelIndex: 0 },
      { prompt: "Example for component 2", tokens: 1000, timestamp: "2025-11-13T05:01:00Z", parallelIndex: 1 },
      { prompt: "Example for component 3", tokens: 1000, timestamp: "2025-11-13T05:01:00Z", parallelIndex: 2 }
    ],
    sonnet: {
      prompt: "Validate all examples",
      tokens: 500,
      timestamp: "2025-11-13T05:02:00Z"
    }
  },

  modelSource: "combined"
} as NavigableNode;

authImplementationNode.cost = calculateNodeCost(authImplementationNode);
```

## Link Integrity Rules

### Rule 1: Bidirectional Tracking
```typescript
// If node-a links to node-b:
nodeA.linkedTo = [..., "node-b"];

// The build pipeline scans all nodes' linkedTo arrays
// and stores the edges in a graph index. At runtime,
// the UI can query for inbound links:
const inbound = graph.getLinkedFrom("node-b"); // ["node-a"]

// linkedFrom is NOT persisted on nodes - it's derived from the graph.
```

### Rule 2: Circular Links are OK
```
Node A → Pillar 1 → Pillar 2 → Pillar 3 → Architecture → A
```
This is intentional: users can explore freely and prevents dead ends.

### Rule 3: Detail-Only Links
```typescript
// Some links only appear in detail view:
linkedDetailOnly: ["security-proofs", "math-derivations"]
```
Why? Summary is concise; detail is reference.

## Rendering in 3-Pane Viewport
```
┌──────────────┬──────────────────┬──────────────────┐
│ Navigation   │ Display          │ Related          │
│ (sidebar)    │ (center)         │ (right)          │
├──────────────┼──────────────────┼──────────────────┤
│ [Node Tree]  │ [Node.summary]   │ [Node.linkedTo]  │
│              │                  │ [Metadata]       │
│              │ [See details →]  │ [Breadcrumb]     │
│              │ (if detail)      │                  │
└──────────────┴──────────────────┴──────────────────┘
```
Click "See details" → shift center pane to [Node.detail]

## Cost Calculation
Every node tracks cost:

```typescript
// pricing.ts
export const PRICING = {
  OPUS_PER_TOKEN_USD:   15 / 1_000_000,
  HAIKU_PER_TOKEN_USD:  1  / 1_000_000,  // corrected
  SONNET_PER_TOKEN_USD: 3  / 1_000_000,
} as const;

// cost.ts
import { PRICING } from './pricing';

type NodeCost = {
  tokens: { opus: number; haiku: number; sonnet: number; total: number };
  usd:    { opus: number; haiku: number; sonnet: number; total: number };
};

export function calculateNodeCost(node: NavigableNode): NodeCost {
  const opusT    = node.modelMetadata?.opus?.tokens ?? 0;
  const haikuT   = (node.modelMetadata?.haikuRuns ?? []).reduce((sum, run) => sum + run.tokens, 0);
  const sonnetT  = node.modelMetadata?.sonnet?.tokens ?? 0;

  const opusUSD   = opusT   * PRICING.OPUS_PER_TOKEN_USD;
  const haikuUSD  = haikuT  * PRICING.HAIKU_PER_TOKEN_USD;
  const sonnetUSD = sonnetT * PRICING.SONNET_PER_TOKEN_USD;

  return {
    tokens: { opus: opusT, haiku: haikuT, sonnet: sonnetT, total: opusT + haikuT + sonnetT },
    usd:    { opus: opusUSD, haiku: haikuUSD, sonnet: sonnetUSD, total: opusUSD + haikuUSD + sonnetUSD }
  };
}
```

Rates align with Token Economics (input rates): Opus $15/M, Haiku $1/M, Sonnet $3/M. See [Pricing](../appendix/pricing).

```typescript
const node = buildNodeFromLLMs();
node.cost = calculateNodeCost(node);
// Example: "Generated by Opus ($0.003) + Haiku ($0.003) + Sonnet ($0.0015)"
```

## System Invariants
- Every node has summary
- Every node has unique id
- Summary read time ≤ 10 minutes
- Detail read time ≤ 30 minutes
- Links point to real nodes
- linkedFrom auto-generated (not manual)
- Model attribution always visible
- Cost always tracked
- Breadcrumb accurate and current

Reference: [Information Flow](../architecture/information-flow) | See: [Model Metadata](../implementation/model-metadata) | Learn: [Dual Representation](../three-pillars/pillar-2/pillar-2-dual-representation)
