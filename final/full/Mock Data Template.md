# Artifact 8: Mock Data Template

## Complete Mock Data Structure (Copy-Paste Ready)

```javascript
// Mock diagram nodes - 32 total with interconnected links
const DIAGRAMS_DATA = {
  // LEVEL 1: Homepage (root)
  "home": {
    id: "home",
    name: "Homepage",
    links: ["frontend", "backend", "random-deep"]
  },

  // LEVEL 2: Frontend Branch
  "frontend": {
    id: "frontend",
    name: "Frontend Stack",
    links: ["react", "state-mgmt", "home"]
  },

  // LEVEL 2: Backend Branch
  "backend": {
    id: "backend",
    name: "Backend Stack",
    links: ["api-services", "database", "home"]
  },

  // LEVEL 3: Frontend Sub-branches
  "react": {
    id: "react",
    name: "React Components",
    links: ["comp-library", "custom-hooks", "frontend", "home"]
  },

  "state-mgmt": {
    id: "state-mgmt",
    name: "State Management",
    links: ["redux-store", "context-api", "frontend"]
  },

  // LEVEL 3: Backend Sub-branches
  "api-services": {
    id: "api-services",
    name: "API Services",
    links: ["rest-endpoints", "graphql-layer", "backend", "home"]
  },

  "database": {
    id: "database",
    name: "Database Layer",
    links: ["sql-db", "cache-layer", "backend"]
  },

  // LEVEL 4: React Branch Details
  "comp-library": {
    id: "comp-library",
    name: "Component Library",
    links: ["button-comps", "form-comps", "react", "state-mgmt"]
  },

  "custom-hooks": {
    id: "custom-hooks",
    name: "Custom Hooks",
    links: ["useauth-hook", "usefetch-hook", "react", "comp-library"]
  },

  // LEVEL 4: State Management Details
  "redux-store": {
    id: "redux-store",
    name: "Redux Store",
    links: ["redux-actions", "redux-reducers", "state-mgmt", "comp-library"]
  },

  "context-api": {
    id: "context-api",
    name: "Context API",
    links: ["auth-context", "theme-context", "state-mgmt"]
  },

  // LEVEL 4: API Details
  "rest-endpoints": {
    id: "rest-endpoints",
    name: "REST Endpoints",
    links: ["user-endpoints", "post-endpoints", "api-services", "database"]
  },

  "graphql-layer": {
    id: "graphql-layer",
    name: "GraphQL Layer",
    links: ["graphql-schema", "graphql-resolvers", "api-services", "rest-endpoints"]
  },

  // LEVEL 4: Database Details
  "sql-db": {
    id: "sql-db",
    name: "SQL Database",
    links: ["user-schema", "post-schema", "database"]
  },

  "cache-layer": {
    id: "cache-layer",
    name: "Cache Layer",
    links: ["redis-config", "ttl-strategy", "database", "sql-db"]
  },

  // LEVEL 5: Component Details
  "button-comps": {
    id: "button-comps",
    name: "Button Components",
    links: ["comp-library", "form-comps"]
  },

  "form-comps": {
    id: "form-comps",
    name: "Form Components",
    links: ["button-comps", "comp-library"]
  },

  // LEVEL 5: Hook Details
  "useauth-hook": {
    id: "useauth-hook",
    name: "useAuth Hook",
    links: ["usefetch-hook", "custom-hooks", "auth-context"]
  },

  "usefetch-hook": {
    id: "usefetch-hook",
    name: "useFetch Hook",
    links: ["useauth-hook", "custom-hooks"]
  },

  // LEVEL 5: Redux Details
  "redux-actions": {
    id: "redux-actions",
    name: "Redux Actions",
    links: ["redux-reducers", "redux-store"]
  },

  "redux-reducers": {
    id: "redux-reducers",
    name: "Redux Reducers",
    links: ["redux-actions", "redux-store"]
  },

  // LEVEL 5: Context Details
  "auth-context": {
    id: "auth-context",
    name: "Auth Context",
    links: ["theme-context", "context-api", "useauth-hook"]
  },

  "theme-context": {
    id: "theme-context",
    name: "Theme Context",
    links: ["auth-context", "context-api"]
  },

  // LEVEL 5: REST Endpoints
  "user-endpoints": {
    id: "user-endpoints",
    name: "User Endpoints",
    links: ["post-endpoints", "rest-endpoints", "user-schema"]
  },

  "post-endpoints": {
    id: "post-endpoints",
    name: "Post Endpoints",
    links: ["user-endpoints", "rest-endpoints", "post-schema"]
  },

  // LEVEL 5: GraphQL Details
  "graphql-schema": {
    id: "graphql-schema",
    name: "GraphQL Schema",
    links: ["graphql-resolvers", "graphql-layer"]
  },

  "graphql-resolvers": {
    id: "graphql-resolvers",
    name: "GraphQL Resolvers",
    links: ["graphql-schema", "graphql-layer", "rest-endpoints"]
  },

  // LEVEL 5: Database Schema
  "user-schema": {
    id: "user-schema",
    name: "User Schema",
    links: ["post-schema", "sql-db", "user-endpoints"]
  },

  "post-schema": {
    id: "post-schema",
    name: "Post Schema",
    links: ["user-schema", "sql-db", "post-endpoints"]
  },

  // LEVEL 5: Cache Configuration
  "redis-config": {
    id: "redis-config",
    name: "Redis Config",
    links: ["ttl-strategy", "cache-layer"]
  },

  "ttl-strategy": {
    id: "ttl-strategy",
    name: "TTL Strategy",
    links: ["redis-config", "cache-layer", "sql-db"]
  },

  // SPECIAL: Cross-level and self-reference examples
  "random-deep": {
    id: "random-deep",
    name: "Random Deep Link",
    links: ["button-comps", "home", "random-deep"]
  }
};
```

---

## Data Structure Explanation

### Node Properties (Consistent)
- **id**: Unique identifier (kebab-case, lowercase, no spaces)
- **name**: Display name (human-readable, can have spaces)
- **links**: Array of target node IDs (can be any valid node ID)

### Link Types in Mock Data

**Forward Links** (to "deeper" nodes):
- home → frontend → react → comp-library → button-comps
- home → backend → api-services → rest-endpoints → user-endpoints

**Backward Links** (to "shallower" nodes):
- button-comps → comp-library
- user-endpoints → rest-endpoints

**Cross-Level Links** (skipping intermediate levels):
- api-services → home (skip middle levels)
- react → state-mgmt (sibling level)
- random-deep → button-comps (level 1 to level 5 directly)

**Self-References**:
- random-deep → random-deep (can click to go deeper in same node)

**Cycles**:
- Various nodes create loops (e.g., user-schema ↔ post-schema ↔ user-endpoints ↔ post-endpoints)

---

## Node Statistics

| Metric | Value |
|--------|-------|
| Total Nodes | 32 |
| Root Node | home |
| Leaf Nodes | 16 |
| Non-Leaf Nodes | 16 |
| Avg Links Per Node | ~2-3 |
| Max Links From One Node | 4 (home, react) |
| Min Links From One Node | 1 |
| Self-References | 1 (random-deep) |
| Cross-Level Links | 3+ |
| Cycles Present | Yes (multiple) |

---

## Traversal Examples (Using This Data)

### Example 1: Linear Forward Path
```
Navigation: home → frontend → react → comp-library → button-comps
History: [home, frontend, react, comp-library, button-comps]
currentIndex: 4
visibleStartIndex: max(0, 4 - 2) = 2
visiblePanes: history.slice(2, 5) = [react, comp-library, button-comps]
scrollLeft: max(0, (4 - 2) * 400) = 800px
Jump buttons available: [home(0), frontend(1)]
```

### Example 2: Jumping Across Levels
```
Navigation: home → frontend → random-deep
History: [home, frontend, random-deep]
currentIndex: 2
visiblePanes: [home, frontend, random-deep]
scrollLeft: 0px (all 3 fit in viewport)
Demonstrates: Cross-level link (level 1 → level 5 equivalent)
```

### Example 3: Self-Reference
```
Navigation: home → random-deep → random-deep
History: [home, random-deep, random-deep]
currentIndex: 2
visiblePanes: [random-deep, random-deep, ?]
visiblePanes will show both same node (positions 1-2 are same node)
Demonstrates: Self-reference navigation
```

### Example 4: Creating a Loop
```
Navigation: home → backend → database → cache-layer → database
History: [home, backend, database, cache-layer, database]
currentIndex: 4
visiblePanes: [cache-layer, database, ?]
Demonstrates: Cycles in navigation
Can navigate back through loop multiple times
```

### Example 5: Complex Navigation
```
Navigation: 
  home → frontend → react → comp-library → button-comps 
  → (click comp-library link) comp-library 
  → (click form-comps link) form-comps 
  → (click comp-library link) comp-library

History: [home, frontend, react, comp-library, button-comps, comp-library, form-comps, comp-library]
currentIndex: 7
visiblePanes: [form-comps, comp-library, ?]
hiddenAncestors: [home, frontend, react, comp-library, button-comps, comp-library, form-comps]
jumpButtons: 7 buttons (one for each hidden position 0-6)

Demonstrates: Multiple revisits of same node at different positions
```

---

## Usage in React Component

```javascript
// In your App component
import { DIAGRAMS_DATA } from './data/mockDiagrams.js';

function App() {
  const [history, setHistory] = useState([DIAGRAMS_DATA.home]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // When user clicks a link in a pane
  const handleClickLink = (targetNodeId) => {
    const targetNode = DIAGRAMS_DATA[targetNodeId];
    setHistory(prev => [...prev, targetNode]);
    setCurrentIndex(history.length);  // New index = new length - 1
  };

  // Get current visible panes
  const visibleStartIndex = Math.max(0, currentIndex - 2);
  const visiblePanes = history.slice(visibleStartIndex, currentIndex + 1);

  // Get hidden ancestors for jump buttons
  const hiddenAncestors = history.slice(0, visibleStartIndex);

  // Get all nodes for rendering
  return (
    <>
      <NavigationBar
        breadcrumb={visiblePanes}
        depth={`${currentIndex + 1}/${history.length}`}
        hiddenAncestors={hiddenAncestors}
        onJump={(targetIndex) => setCurrentIndex(targetIndex)}
      />
      <PaneStrip
        panes={visiblePanes}
        onClickLink={handleClickLink}
      />
    </>
  );
}

export default App;
```

---

## Customization Notes

- To add more nodes: Add entry to DIAGRAMS_DATA with id, name, links
- To change link targets: Modify the `links` array (must reference valid node IDs)
- To remove nodes: Delete entry and remove references from other nodes' links
- To test self-reference: Click any link that points to the same node
- To test loops: Find any circular path (e.g., user-schema ↔ post-schema ↔ back to user-schema)
- To test cross-level jumps: Use random-deep or api-services → home

---

**Total nodes: 32 (provides richer test coverage for prototype)**
