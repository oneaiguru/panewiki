# Artifact 4: Definition Dictionary

## All Key Terms (Defined Once, Used Consistently)

### Core Concepts

**History**
- Array of diagram nodes representing the entire navigation path
- Grows indefinitely as user clicks links
- Never pruned or truncated, only appended to
- Example: `[Homepage, Frontend, React, Components, Button, Homepage, React]`

**currentIndex**
- Integer position pointing to the user's current location in history
- Ranges from 0 to history.length - 1
- Updated when user navigates, but history array itself persists
- Example: at position 5 of 8-item history means 3 earlier positions can still be jumped to

**Breadcrumb** (navigation history display)
- Text-based representation of current visible panes in navigation bar
- Shows only the last 3 items currently visible in viewport
- Format: "Node1 > Node2 > Node3"
- NOT interactive (for readability only, actual navigation via links and buttons)

### UI Layout

**Strip**
- Horizontal container holding all diagram panes sequentially
- Total width: `history.length * 400px`
- Grows dynamically as user navigates deeper
- Contains all visited nodes as panes, left-to-right in order

**Viewport** (or Scroll Container)
- The visible 3-pane window on screen
- Fixed width: 1200px (shows exactly 3 A4-sized panes)
- Has visible border (2px double line) to show what's inside vs outside
- User sees `strip` through this viewport window

**Pane**
- Individual diagram display unit
- Width: 400px (A4-sized)
- Contains: header + mock PDF preview + list of clickable links
- There are `history.length` panes in total strip, but only 3 visible at once

**Visible Panes**
- The 3 panes currently showing in the viewport
- Calculated as: `history.slice(max(0, currentIndex - 2), currentIndex + 1)`
- At currentIndex=5, visible panes are at indices [3, 4, 5]

**Off-Screen Panes**
- Panes not currently visible in viewport (hidden left or right)
- Off-left (earlier indices): can be jumped to via jump buttons
- Off-right (later indices): can be navigated to via back button or other navigation

### Navigation

**Jump Button** (Ancestor Button)
- Clickable button in navigation bar: `[◄ NodeName]`
- Only shown for panes currently off-screen to the left
- Jumps `currentIndex` directly to that position
- Example: at position 50, shows buttons for positions [0-47]

**Navigate Forward**
- User clicks link in rightmost visible pane
- Action: append new node to history, set `currentIndex = history.length - 1`
- Result: strip scrolls right, new pane appears on right, left pane may disappear

**Navigate Back**
- User clicks [◄ BACK] button
- Action: `currentIndex--` (decrement, don't remove from history)
- Result: strip scrolls left, shows different 3 panes
- History array unchanged (can re-navigate forward)

**Jump Navigation**
- User clicks jump button for earlier position
- Action: set `currentIndex = targetPosition` (can be any earlier index)
- Result: viewport slides to show panes around that position
- Faster than clicking back multiple times

**Home Navigation**
- User clicks [🏠 HOME] button
- Action: set `currentIndex = 0` (go to first node)
- Result: viewport slides all the way left, shows first 3 panes (or fewer if history < 3)

### Scroll Behavior

**scrollLeft** (position)
- CSS property: how far the strip has scrolled horizontally
- Calculated as: `max(0, (currentIndex - 2) * 400px)`
- At position 0: scrollLeft = 0 (panes 0-2 visible)
- At position 5: scrollLeft = 1200px (panes 3-5 visible)

**Smooth Scroll Animation**
- When currentIndex changes, scrollLeft updates with 300ms animation
- Implemented via CSS `scroll-behavior: smooth` or JS animation
- Makes viewport visually "slide" to new position

**visibleStartIndex**
- Calculated as: `max(0, currentIndex - 2)`
- Marks the first visible pane index
- Used to determine which panes are hidden off-left
- Used to calculate which jump buttons to show

### Data Structure

**Node** (Diagram Node)
- Single diagram page/screen
- Properties: id (string), name (string), links (array of target node IDs)
- Can link to any other node (no parent-child constraint)
- Can link to itself (self-reference)
- Same node can appear multiple times in history at different positions

**Graph** (Network of Nodes)
- Collection of all available diagram nodes
- Interconnected: any node can link to any other node
- No hierarchy enforced (unlike tree structure)
- Prototype has ~15-20 nodes

**Link** (Edge)
- Arrow from one node to another
- Stored as target node ID in source node's `links` array
- Example: node "react" has `links: ["components", "hooks", "homepage"]`

### States

**Leaf Node**
- A node with no children (empty `links` array)
- No forward navigation possible
- User can only go back or jump to earlier positions

**Self-Reference**
- Node with link to itself in its own `links` array`
- Clicking creates new history entry of same node
- Legitimate navigation pattern (e.g., "More Details" on same page)

**Loop** (Cycle)
- Navigation pattern where user revisits previous nodes
- Example: Home → Frontend → React → Home → Frontend
- Creates history: `[Home, Frontend, React, Home, Frontend]`
- Allowed and expected

**Revisit**
- Same node appearing multiple times in history array at different positions
- Each position is independent (separate pane on strip)
- Doesn't create duplicates in data, just in history

### UI Components

**Navigation Bar**
- Top section showing: breadcrumb, jump buttons, back/home controls
- Fixed height, always visible
- Contains: Breadcrumb display + Ancestor jump buttons + Back/Home controls + Depth display

**ScrollContainer** (or Scroll Wrapper)
- Div with `overflow: hidden` and fixed width 1200px
- Manages the scrollLeft position
- Updates smoothly when currentIndex changes

**PaneStrip** (or Pane Container)
- Flex container holding all pane divs
- Width = `history.length * 400px`
- Positioned inside ScrollContainer

**Pane Component**
- Individual pane display
- Children: PaneHeader, PDFPreview (mock), RelatedDiagrams (links)
- Fixed width 400px, flex: 0 0 400px

### Metrics

**Depth**
- Current position in history
- Displayed as "Depth: X/Y" where X = currentIndex + 1, Y = history.length
- User-facing indicator of "how deep" they are in browsing

**History Length**
- Total number of nodes in history array
- Equals `history.length`
- Determines total strip width

**Position** (in history)
- Same as index, 0-based
- Example: "at position 5" means `currentIndex = 5`

---

**Usage**: Reference this glossary when reading sections to ensure consistent terminology.
