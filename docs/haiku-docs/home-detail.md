---
id: home-detail
title: "Home: The 3-Column Design (Detail)"
models: [haiku]
summary: false
readTime: 15m
---

> Path: Home › Detail

## The Problem with Traditional AI Interfaces

AI generates tremendous volume—often 10,000+ tokens in a single response. Human working memory processes ~100 tokens at a time. This mismatch creates paralysis: users face information overload and scroll endlessly through unfocused outputs.

Traditional single-pane interfaces compound the problem:
- Text extends 120+ characters per line, reducing comprehension by 15%
- Users can't distinguish signal from noise
- All models cost the same, wasting budget on expensive thinking for simple execution
- Verification requires separate manual review cycles

## The 3-Column Paradigm

The 3-column architecture splits the output problem into **three parallel, purpose-driven lanes**:

**Left (Opus: WHY)**
The thinking layer. Opus 4.1 provides strategic context, rationale, and high-level analysis. Expensive but thorough—reserved for problems requiring deep reasoning.

**Center (Haiku: WHAT)**
The execution layer. Haiku 4.5 delivers concrete details, implementations, and step-by-step guidance. Fast and cheap—handles the bulk of practical work.

**Right (Sonnet: VERIFY)**
The validation layer. Sonnet 4.5 catches errors, identifies edge cases, and confirms correctness. Balanced cost and capability—ensures quality gates.

## Model Orchestration Flow

```
Task Input
   ↓
Opus thinks (WHY)    Haiku executes (WHAT)    Sonnet validates (VERIFY)
   ↓                      ↓                            ↓
   [Strategic          [Implementation           [Verification
    Context]            Details]                  & Gotchas]
   ↓                      ↓                            ↓
User reads left → center → right (on demand)
```

Users read progressively. Start with Haiku's answer in the center. Deepen understanding by reading Opus context on the left. Verify correctness and edge cases on the right. Each column is independent but complementary.

## Cost Efficiency Through Model Selection

Traditional approach: Use Opus for everything.

3-column approach: Route work to the cheapest capable model, escalate only when necessary.

**Cost ratio:** Haiku is **18.75× cheaper than Opus** on input tokens (see Pricing).

**Real scenario:** Reviewing 50 code files
- All-Opus: ≈$750
- 3-column (Opus for architecture review, Haiku for line-by-line, Sonnet for final check): ≈$95
- **Savings: 87.5%**

Cost doesn't drop through cutting corners—it drops through smart allocation. Haiku excels at straightforward tasks. Sonnet validates. Opus focuses only on complex reasoning.

## Information Architecture Benefits

The 400px column constraint forces disciplined writing. No filler. No verbose explanations. Each column contains only what belongs there:
- Opus avoids implementation minutiae
- Haiku avoids strategic theory-crafting
- Sonnet focuses purely on verification

This constraint becomes a clarity mechanism. Narrower columns demand tighter thinking, producing better outputs across all three layers.

## Responsive Design

Desktop (≥1200px): Three columns visible side-by-side
Tablet (600–1200px): Two columns (stack Haiku + Sonnet; Opus on demand)
Mobile (<600px): Single column (progressive reveal)

The architecture adapts without losing its core structure.

## Related

- Next: [Pillar 1: Column Width (three-pillars/pillar-1/pillar-1-detail)
- See also: [Model Orchestration (three-pillars/pillar-3/pillar-3-detail)
- Deep dive: [Token Economics (architecture/token-economics)
- Reference: [Pricing (appendix/pricing)
- Back: [Home (home)
