# Mock Data Template

## Data Structure

Each node:
```javascript
{
  id: "react",
  name: "React Components",
  links: ["comp-library", "custom-hooks"]
}
```

## The 32 Nodes (Interconnected Graph)

Level 1: home
Level 2: frontend, backend, random-deep
Level 3: react, state-mgmt, api-services, database
Level 4: comp-library, custom-hooks, redux-store, context-api
Level 4: rest-endpoints, graphql-layer, sql-db, cache-layer
Level 5: button-comps, form-comps, useauth-hook, usefetch-hook
Level 5: redux-actions, redux-reducers, auth-context, theme-context
Level 5: user-endpoints, post-endpoints, graphql-schema, graphql-resolvers
Level 5: user-schema, post-schema, redis-config, ttl-strategy

## Example Node with Links

```javascript
"react": {
  id: "react",
  name: "React Components",
  links: [
    "comp-library",      // child
    "custom-hooks",      // sibling
    "frontend",          // parent
    "home"               // cross-level
  ]
}
```

## Link Characteristics

- Forward: to "deeper" nodes (react → button-comps)
- Backward: to "shallower" nodes (button-comps → react)
- Cross-level: skipping levels (api-services → home)
- Self-reference: node links to itself (random-deep)
- Cycles: A→B→C→A loops allowed

## Statistics

- Total nodes: 32
- Leaf nodes: 17 (no children)
- Avg links per node: 2-3
- Max links: 4 (home, react)

See: [ImplementationRoadmap](ImplementationRoadmap)
See: [ConstraintsAndAssumptions](ConstraintsAndAssumptions)
