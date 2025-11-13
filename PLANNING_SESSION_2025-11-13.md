# Planning Session: Project Status & Next Directions
**Date:** 2025-11-13
**Session Goal:** Assess current state, evaluate product architecture readiness, plan TUI implementation, review AI product clarity, and identify documentation gaps.

---

## 1. WHERE WE ARE NOW: Current State Assessment

### ✅ V1 (React Web Prototype) - COMPLETED
**Status:** **SHIPPED & STABLE**

**What exists:**
- Three-pane React navigation prototype (`prototype/react/`)
- Append-only history reducer with full navigation controls
- Custom markdown renderer (subset: headings, bullets, bold, code)
- Keyboard controls: Home, ←, →
- Jump buttons with smart truncation (first 5 + gap + last 5)
- Toast notifications and error boundaries
- Mock data pipeline (`scripts/generateDocsData.js`)

**Key achievements:**
- ✅ Proven navigation model (append-only history)
- ✅ Data contract defined (`docs/DATA_MODEL.md`)
- ✅ Markdown subset specification (`docs/RenderingSpec.md`)
- ✅ Implementation notes documented (`final/V1_IMPLEMENTATION_NOTES.md`)
- ✅ 17 summary markdown files successfully loaded
- ✅ Accessibility features (ARIA, keyboard nav)

**Known limitations (documented in `docs/KNOWN_ISSUES.md`):**
- No session persistence
- Unbounded history (performance degrades >200 panes)
- No pane virtualization
- Inline links non-interactive
- Desktop-only layout

### 📊 Documentation System - TWO PARALLEL TRACKS

#### Track 1: Original V1 Docs (Navigation Prototype)
**Location:** `docs/`, `final/`
**Purpose:** Document the React navigation prototype itself
**Status:** ✅ Complete and well-organized

#### Track 2: Haiku Docs (AI Product Concept)
**Location:** `docs/haiku-docs/`
**Purpose:** Document the 3-column AI interface vision
**Status:** ⚠️ Well-structured but needs integration clarity

**Current structure:**
```
docs/haiku-docs/
├── INDEX.md          # Navigation hub
├── SYSTEM.md         # System overview
├── home.md           # 5-min intro
├── home-detail.md    # 15-min deep dive
├── architecture/     # Data model, token economics, viewport
├── three-pillars/    # Core concepts (Pillar 1, 2, 3)
├── implementation/   # Integration guides, conventions
├── use-cases/        # Code review, research, debugging, learning
└── appendix/         # Models, pricing, batch API
```

---

## 2. ORIGINAL NON-UI PRODUCT ARCHITECTURE: Readiness Assessment

### Core Architecture Components

#### ✅ **1. Data Model** - READY
**Status:** Well-defined and complete

The `NavigableNode` structure in `docs/haiku-docs/architecture/data-model.md` is production-ready:

```typescript
interface NavigableNode {
  // Identity
  id: string;
  title: string;

  // Dual Representation (THE CORE PATTERN)
  summary: { content, lineCount, estimatedReadSeconds };
  detail?: { content, lineCount, estimatedReadSeconds };

  // Model Attribution
  modelSource: 'opus' | 'haiku' | 'sonnet' | 'combined';
  modelMetadata?: { opus?, haikuRuns?, sonnet? };

  // Navigation
  breadcrumb: string[];
  linkedTo: string[];
  linkedDetailOnly?: string[];

  // Cost Tracking
  cost?: { opus, haiku, sonnet, total };
}
```

**Strengths:**
- ✅ Clear separation between summary and detail
- ✅ Model attribution built-in
- ✅ Cost tracking for token economics
- ✅ Support for parallel Haiku runs
- ✅ Bidirectional link tracking

**Gap:** V1 data model is simpler (id, title, content, links). Need migration path.

#### ⚠️ **2. Three-Model Orchestration** - CONCEPTUALLY READY, NO IMPLEMENTATION

**The Pattern (from `docs/haiku-docs/SYSTEM.md`):**
```
User ask
   ↓
Opus (Strategy, ~200 tokens) → $0.003
   ↓
Haiku 1, 2, 3 (Parallel execution, ~3K tokens) → $0.045
   ↓
Sonnet (Validation, ~500 tokens) → $0.0075
   ↓
User (3-column output)
Total: ~$0.055 (vs $0.30 all-Opus)
```

**Status:**
- ✅ Pattern documented clearly
- ✅ Token economics calculated
- ✅ Cost savings proven (81% reduction)
- ❌ **NO IMPLEMENTATION CODE**
- ❌ No orchestration scripts
- ❌ No API integration
- ❌ No prompt templates

**This is the biggest gap.**

#### ✅ **3. Column Format / Viewport** - READY
- Width: 400px per column
- Math validated (`docs/haiku-docs/three-pillars/pillar-1/400px-width-math.md`)
- Readability science documented
- Proven in V1 React prototype

#### ⚠️ **4. Dual Representation (Summary/Detail)** - PATTERN READY, CONTENT GENERATION MISSING

**Pattern:** Every node has:
- Summary (~30 lines, 5-min read)
- Optional detail (~100 lines, 15-min read)

**Status:**
- ✅ Pattern documented
- ✅ UI navigation ready (V1 has "See details" links)
- ❌ No automated content generation
- ❌ No AI pipeline to create dual representations
- ❌ Manual authoring only

---

## 3. TUI (TERMINAL USER INTERFACE) - DETAILED PLANNING

### Current Status: **PLANNING STAGE**

`docs/V2_PLANNING.md` outlines TUI direction but lacks specifics.

### TUI Architecture Proposal

#### Option A: Single-Column Stacked Layout
```
┌────────────────────────────────────────────────────────────┐
│ [Breadcrumb: home > architecture > data-model]             │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ## Data Model: The Navigable Node                         │
│                                                            │
│ Everything is a node...                                   │
│ [content rendered in ANSI markdown]                        │
│                                                            │
│ [Commands: :home :back :forward :jump N :links]           │
├────────────────────────────────────────────────────────────┤
│ Links: [1] information-flow [2] model-metadata            │
│ Status: 5 min read | Model: sonnet                        │
└────────────────────────────────────────────────────────────┘
```

**Pros:**
- Simpler to implement
- Works on narrow terminals (80 cols)
- Single focus point

**Cons:**
- Loses 3-column visual paradigm
- Can't see related links simultaneously

#### Option B: Multi-Column TUI (tmux-style)
```
┌──────────┬───────────────────────┬──────────┐
│ Nav Tree │ Content Pane          │ Related  │
│          │                       │          │
│ • Home   │ ## Data Model         │ Links:   │
│ • Vision │                       │ • Info   │
│ • Arch   │ Everything is a node  │ • Meta   │
│   > Data │ ...                   │          │
│ • Impl   │                       │ Model:   │
│          │                       │ sonnet   │
│          │ [:detail | :back]     │          │
└──────────┴───────────────────────┴──────────┘
```

**Pros:**
- Preserves 3-column philosophy
- Better context awareness
- Richer navigation

**Cons:**
- Requires wider terminal (120+ cols)
- More complex rendering
- Harder to make responsive

### Technology Stack Options

#### Option 1: Node.js + Blessed / Blessed-contrib
**Pros:**
- Reuse existing JS reducer from V1
- Rich widget library
- Active community

**Cons:**
- Node.js dependency
- Less performant than native

#### Option 2: Python + Rich / Textual
**Pros:**
- Excellent ANSI rendering (Rich)
- Modern TUI framework (Textual)
- Strong async support

**Cons:**
- Need to rewrite reducer in Python
- Different ecosystem

#### Option 3: Rust + Ratatui (formerly tui-rs)
**Pros:**
- High performance
- Excellent for CLI tools
- Growing ecosystem

**Cons:**
- Steeper learning curve
- Complete rewrite

### TUI Implementation Roadmap

#### Phase 1: Foundation (2-3 weeks)
1. Choose technology stack (recommend: Node.js + Blessed)
2. Port navigation reducer from V1
3. Implement basic ANSI markdown renderer
4. Add command parser (`:home`, `:back`, `:forward`, `:jump N`)
5. Load data from same source as V1

#### Phase 2: Core Features (2-3 weeks)
1. Implement chosen layout (recommend: Option A first)
2. Add breadcrumb display
3. Implement link navigation
4. Add status line with read time and model attribution
5. Toast/notification system

#### Phase 3: Polish (1-2 weeks)
1. Color schemes and themes
2. Configuration file (~/.panewikirc)
3. Help system (`:help`)
4. Search functionality
5. Session history

#### Phase 4: Advanced (optional)
1. Multi-column layout (Option B)
2. Mouse support
3. Split-screen mode
4. Export to PDF/HTML
5. Real-time collaboration

### TUI Open Questions

**Must decide:**
- [ ] Single-column vs multi-column layout?
- [ ] Technology stack (Node.js/Python/Rust)?
- [ ] Command syntax (`:cmd` vs `/cmd` vs `Ctrl+key`)?
- [ ] How to handle summary/detail toggle in terminal?
- [ ] Color scheme (support for dark/light themes)?

**Should decide:**
- [ ] Package as npm global (`npm i -g panewiki`) or standalone binary?
- [ ] Support for terminal pagers (less, more)?
- [ ] Integration with terminal multiplexers (tmux, screen)?
- [ ] Config file location and format?

---

## 4. AI PRODUCT CLARITY: Assessment

### Product Vision: ⚠️ CLEAR BUT FRAGMENTED

#### What's Clear:

**The Core Value Prop (from `docs/haiku-docs/home.md`):**
> "Three columns. Three models. Three roles.
> Opus = WHY | Haiku = WHAT | Sonnet = VERIFY"

**Metrics are compelling:**
- Cost: 81% cheaper ($0.055 vs $0.30)
- Time: 65% faster (14 min vs 40 min)
- Comprehension: 8× better engagement (80% vs 10%)

**Use cases are well-defined:**
1. Code Review - PR analysis workflow
2. Research - Paper analysis
3. Debugging - Bug investigation
4. Learning - Educational content

#### What's Unclear:

1. **Integration Story**
   - How does this integrate with existing tools (Cursor, Claude Code, ChatGPT)?
   - Is this a standalone product or a plugin/extension?
   - `docs/haiku-docs/implementation/future-vision/` has stubs but no detail

2. **User Flow**
   - How does a user start a session?
   - What's the input format (prompt, file, URL)?
   - How do users navigate between columns in practice?

3. **Implementation Path**
   - What's the MVP?
   - Which surface ships first (Web, TUI, Plugin)?
   - What's the timeline?

4. **Relationship Between Projects**
   - Is V1 (navigation prototype) a demo for the AI product?
   - Or is the AI product concept documentation?
   - How do they converge?

### Product Definition Gaps

#### Critical Missing Pieces:

1. **No Working AI Orchestration**
   ```
   HAVE: Documented pattern
   NEED: Working code that:
         - Takes user prompt
         - Calls Opus for strategy
         - Spawns parallel Haiku calls
         - Runs Sonnet validation
         - Outputs 3-column format
   ```

2. **No Prompt Templates**
   - `docs/haiku-docs/implementation/prompt-patterns.md` mentions this but doesn't show templates
   - Need actual prompts for Opus, Haiku, Sonnet roles

3. **No API Integration Layer**
   - How do we call Anthropic API?
   - Rate limiting?
   - Error handling?
   - Streaming vs batch?

4. **No Content Generation Pipeline**
   - How do we generate nodes with dual representation?
   - Automated or manual?
   - Quality control?

---

## 5. DOCUMENTATION ASSESSMENT

### What's Well-Documented ✅

1. **V1 Navigation Prototype**
   - `README.md` - Quick start guide
   - `final/V1_IMPLEMENTATION_NOTES.md` - Comprehensive retrospective
   - `docs/DATA_MODEL.md` - Data contract
   - `docs/RenderingSpec.md` - Markdown subset
   - `docs/KNOWN_ISSUES.md` - Limitations and backlog
   - `docs/ProductScope.md` - Phase 1 focus
   - `docs/AuthoringConventions.md` - Style guide

2. **AI Product Vision**
   - `docs/haiku-docs/INDEX.md` - Excellent navigation hub
   - `docs/haiku-docs/SYSTEM.md` - System overview
   - `docs/haiku-docs/home.md` & `home-detail.md` - Clear intro
   - Three Pillars documentation (Pillar 1, 2, 3) - Core concepts well explained
   - `docs/haiku-docs/architecture/data-model.md` - Advanced node structure

3. **Token Economics**
   - `docs/haiku-docs/architecture/token-economics.md` - Cost analysis
   - `docs/haiku-docs/appendix/pricing.md` - Pricing details
   - Cost calculations with examples

### Documentation Gaps ⚠️

#### High Priority:

1. **Integration Guide Missing**
   - How to actually build the AI orchestration
   - API integration code examples
   - Error handling patterns
   - Rate limiting strategies

2. **Prompt Engineering Guide Missing**
   - Actual prompt templates for Opus/Haiku/Sonnet
   - How to structure prompts for the three-role pattern
   - Examples of good/bad prompts
   - Prompt versioning and iteration

3. **TUI Implementation Plan Missing**
   - Detailed architecture for terminal version
   - Technology comparison matrix
   - Step-by-step implementation guide
   - Testing strategy for TUI

4. **Migration Guide Missing**
   - How to go from simple V1 data model to advanced NavigableNode
   - Content migration scripts
   - Backward compatibility strategy

5. **Testing Documentation Missing**
   - Unit test examples
   - Integration test patterns
   - E2E test scenarios
   - CI/CD pipeline setup

#### Medium Priority:

1. **User Guides**
   - Getting started for end users (not developers)
   - Tutorial walkthroughs
   - Common workflows
   - Troubleshooting guide

2. **Plugin/Extension Documentation**
   - `docs/haiku-docs/implementation/future-vision/` files are stubs
   - Need real integration guides for:
     - Cursor integration
     - Claude Code integration
     - ChatGPT plugin

3. **API Reference**
   - If exposing APIs, need reference docs
   - Request/response formats
   - Authentication
   - Rate limits

#### Low Priority:

1. **Video/Visual Tutorials**
   - Screencasts showing the product in action
   - Animated GIFs in docs
   - Demo videos

2. **FAQ**
   - Common questions
   - Troubleshooting
   - Performance tips

3. **Changelog**
   - Version history
   - Migration notes between versions
   - Breaking changes

### Documentation Organization Issues

**Problem:** Two parallel documentation tracks without clear relationship

**Track 1:** V1 Navigation Prototype docs (`docs/`, `final/`)
**Track 2:** AI Product docs (`docs/haiku-docs/`)

**Recommended:**
- Add `docs/OVERVIEW.md` that explains:
  - What is V1 (the navigation prototype)
  - What is the AI product vision
  - How they relate
  - Where to start reading
- Add cross-references between the two tracks
- Consider renaming `haiku-docs` to `ai-product` for clarity

---

## 6. RECOMMENDED NEXT STEPS & DIRECTIONS

### Immediate Actions (This Week)

#### Decision Points (Must Decide):
1. **Product Strategy Decision**
   - [ ] Is the priority shipping TUI or building AI orchestration?
   - [ ] Are V1 and AI product the same thing or separate?
   - [ ] What's the 6-month vision?

2. **TUI Technology Choice**
   - [ ] Node.js + Blessed (reuse reducer)
   - [ ] Python + Textual (fresh start)
   - [ ] Rust + Ratatui (performance)

3. **AI Implementation Approach**
   - [ ] Build orchestration layer first (backend)
   - [ ] Or mock it in frontend first (UI-driven)

#### Documentation Tasks:
1. **Create** `docs/OVERVIEW.md` to clarify project structure
2. **Write** `docs/AI_ORCHESTRATION_GUIDE.md` with implementation plan
3. **Draft** `docs/TUI_ARCHITECTURE.md` with detailed design
4. **Update** `docs/V2_PLANNING.md` with decisions from this session

### Short Term (2-4 Weeks)

#### Option A: TUI-First Path
**Goal:** Ship working terminal version

**Tasks:**
1. Set up TUI project structure
2. Port navigation reducer
3. Implement basic ANSI markdown renderer
4. Build command parser
5. Create single-column layout
6. Load existing content from V1
7. Alpha testing with small group

**Deliverables:**
- Working TUI prototype
- Can navigate existing docs
- Command-line interface functional

#### Option B: AI-First Path
**Goal:** Prove the orchestration pattern works

**Tasks:**
1. Create `scripts/orchestration/` directory
2. Write Anthropic API wrapper
3. Implement prompt templates
4. Build Opus → Haiku → Sonnet pipeline
5. Test with example prompts
6. Generate sample content
7. Measure costs and quality

**Deliverables:**
- Working orchestration script
- Sample generated content
- Cost/quality metrics
- Prompt template library

#### Recommended: **Hybrid Approach**
**Week 1-2:** AI Orchestration Spike
- Prove the 3-model pattern works
- Generate real content
- Validate costs

**Week 3-4:** TUI Foundation
- Start TUI with proven content
- Reuse V1 reducer
- Basic navigation working

### Medium Term (1-3 Months)

1. **Complete TUI Implementation**
   - Multi-column layout option
   - Configuration system
   - Help documentation
   - Package for distribution

2. **Build AI Content Pipeline**
   - Automated content generation
   - Quality validation
   - Cost optimization
   - Batch processing

3. **Integration Layer**
   - Plugin architecture
   - First integration (Cursor or Claude Code)
   - API for external tools

4. **Testing & Quality**
   - Unit tests for reducer
   - Integration tests for orchestration
   - E2E tests for TUI
   - CI/CD pipeline

### Long Term (3-6 Months)

1. **Product Maturity**
   - Beta release
   - User feedback loop
   - Performance optimization
   - Stability improvements

2. **Ecosystem Expansion**
   - Multiple editor integrations
   - Web app version
   - Mobile considerations
   - API for third parties

3. **Community Building**
   - Documentation site
   - Tutorial videos
   - Example projects
   - Plugin marketplace

---

## 7. CRITICAL QUESTIONS TO ANSWER

### Product Direction

1. **What is the actual product?**
   - [ ] A navigation UI framework (like V1)?
   - [ ] An AI content generation system?
   - [ ] An integrated tool (both)?
   - [ ] A methodology/pattern to share?

2. **Who is the target user?**
   - [ ] Developers (coding assistance)?
   - [ ] Researchers (paper analysis)?
   - [ ] Students (learning)?
   - [ ] General knowledge workers?

3. **What's the business model?**
   - [ ] Open source project?
   - [ ] SaaS product?
   - [ ] Plugin/extension sales?
   - [ ] Consulting/services?

### Technical Direction

1. **Architecture choice for TUI?**
   - Recommendation: **Node.js + Blessed** (reuse existing code)

2. **How to implement AI orchestration?**
   - Recommendation: **Separate Node.js service** with API

3. **How to handle content generation?**
   - Recommendation: **Hybrid** - automated generation with human review

### Resource Allocation

1. **What's the team size?**
   - Solo developer? Small team? Need to know for realistic timeline.

2. **What's the time commitment?**
   - Full-time? Part-time? Affects what's achievable.

3. **What's the budget?**
   - For AI API costs
   - For infrastructure
   - For testing

---

## 8. PROPOSED PLAN: NEXT 30 DAYS

### Week 1: Foundation & Decisions
**Goal:** Make critical decisions and prove AI orchestration

**Monday-Tuesday:**
- [ ] Review this planning doc with stakeholders
- [ ] Decide: TUI-first vs AI-first vs hybrid
- [ ] Choose TUI technology stack
- [ ] Set up project tracking

**Wednesday-Friday:**
- [ ] Create `scripts/orchestration/` with basic API wrapper
- [ ] Write first prompt templates (Opus/Haiku/Sonnet)
- [ ] Test single orchestration run
- [ ] Document results

**Deliverable:** Working AI orchestration spike

### Week 2: TUI Foundation
**Goal:** Start TUI with basic navigation

**Monday-Tuesday:**
- [ ] Set up TUI project structure
- [ ] Port navigation reducer from V1
- [ ] Set up dev environment and build process

**Wednesday-Friday:**
- [ ] Implement ANSI markdown renderer
- [ ] Build command parser (`:home`, `:back`, `:forward`)
- [ ] Load V1 data successfully
- [ ] Basic single-column display working

**Deliverable:** TUI prototype that can navigate V1 content

### Week 3: Integration
**Goal:** Connect AI generation to TUI display

**Monday-Wednesday:**
- [ ] Generate dual-representation content with AI
- [ ] Convert to TUI-compatible format
- [ ] Display generated content in TUI

**Thursday-Friday:**
- [ ] Add model attribution display
- [ ] Add cost tracking display
- [ ] Test end-to-end flow

**Deliverable:** AI-generated content displayed in TUI

### Week 4: Polish & Documentation
**Goal:** Make it usable and documented

**Monday-Tuesday:**
- [ ] Add help system (`:help`)
- [ ] Improve error handling
- [ ] Add configuration file support

**Wednesday-Thursday:**
- [ ] Write user documentation
- [ ] Create tutorial walkthrough
- [ ] Document installation process

**Friday:**
- [ ] Alpha release for testing
- [ ] Gather feedback
- [ ] Plan next iteration

**Deliverable:** Alpha release + documentation

---

## 9. SUMMARY: Where We Are & Where We're Going

### Current State: 🟢 STRONG FOUNDATION

**We Have:**
- ✅ Working V1 React prototype (proven navigation)
- ✅ Clear data model and architecture
- ✅ Excellent documentation for what exists
- ✅ Compelling vision for AI product
- ✅ Strong token economics case (81% cost savings)
- ✅ Well-defined use cases

### Gaps: 🟡 IMPLEMENTATION PHASE

**We Need:**
- ❌ Working AI orchestration implementation
- ❌ TUI implementation
- ❌ Prompt templates and patterns
- ❌ Integration layer
- ❌ Content generation pipeline
- ❌ Testing infrastructure

### Assessment:

#### Original Non-UI Product Architecture: **READY FOR IMPLEMENTATION**
- Core concepts: ✅ Solid
- Data model: ✅ Production-ready
- Token economics: ✅ Validated
- Missing: 🔴 Implementation code

#### TUI Planning: **NEEDS DETAILED DESIGN**
- Technology options: ✅ Identified
- Layout options: ✅ Proposed
- Missing: 🟡 Final decisions and detailed architecture

#### AI Product Clarity: **CONCEPT CLEAR, EXECUTION UNCLEAR**
- Vision: ✅ Compelling and well-articulated
- Use cases: ✅ Defined
- Missing: 🟡 How user actually uses it end-to-end

#### Documentation: **STRONG BUT GAPS IN KEY AREAS**
- Existing product: ✅ Well documented
- Vision: ✅ Well documented
- Missing: 🟡 Implementation guides, tutorials, integration docs

---

## 10. RECOMMENDATIONS

### Immediate Priority: **AI ORCHESTRATION PROOF-OF-CONCEPT**

**Why:**
- It's the core value proposition
- Everything else depends on it
- Need to validate costs and quality
- De-risk the entire product

**How:**
1. Build simple Node.js script
2. Use Anthropic API
3. Implement Opus → Haiku → Sonnet pipeline
4. Generate 5 sample nodes
5. Measure actual costs
6. Evaluate output quality

**Timeline:** 1 week

**Success Criteria:**
- Can generate dual-representation content
- Costs match predictions (~$0.055 per node)
- Output quality is usable
- Pattern is repeatable

### Second Priority: **TUI MVP**

**Why:**
- Reuses existing reducer (low risk)
- Tangible deliverable
- Can demo to users
- Tests navigation model in new context

**How:**
1. Node.js + Blessed (reuse code)
2. Single-column layout (simpler)
3. Command-based navigation
4. Load V1 content first
5. Add AI-generated content later

**Timeline:** 2-3 weeks

**Success Criteria:**
- Can navigate existing V1 content
- Commands work (`:home`, `:back`, `:forward`, `:links`)
- Markdown renders in ANSI
- Usable by alpha testers

### Third Priority: **Integration & Polish**

After POC + TUI MVP:
- Connect AI generation to TUI
- Add configuration
- Write tutorials
- Alpha release

---

## NEXT STEPS

1. **Review this planning doc** - Discuss with team/stakeholders
2. **Make decisions** on critical questions (section 7)
3. **Create** `docs/AI_ORCHESTRATION_GUIDE.md` with implementation plan
4. **Start** Week 1 tasks (AI orchestration spike)
5. **Track progress** in `docs/PROJECT_STATUS.md` or similar

---

**Document Version:** 1.0
**Author:** Planning Session 2025-11-13
**Next Review:** After Week 1 (2025-11-20)
