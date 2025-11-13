Got it. PRO here. I reviewed the **13 files** you pasted and cross‑checked against the two earlier artifacts (System viz + Token Economics). Below is a **tight, actionable** plan: P0 issues first, then per‑file fixes with drop‑in patches.

------

## 🚨 P0 global issues (fix first)

1. **Pricing inconsistencies**
   - Several docs still use **Haiku = $0.80/M** and **Sonnet output = $3/M**. Correct rates (per `pricing.md`) are:
     - **Haiku 4.5**: **$1/M input**, **$5/M output**
     - **Sonnet 4.5**: **$3/M input**, **$15/M output**
     - **Opus 4.1**: **$15/M input**, **$75/M output**
   - Offending older examples remain in:
     - `token-economics.md` (uses $0.80/M) 
     - `System Visualization & Reference` rate callouts (“$0.80/M Haiku”) 
     - `batch-api-guide.md` math uses input rates for **output** tokens (see patch below).
2. **Front‑matter + breadcrumb missing**
   - Old‑format files lack YAML and breadcrumb: `vision.md`, `token-economics.md`, `research.md`, `learning.md`, `debugging.md`.
3. **Link style**
   - Some links still include `.md`. Standardize on **extension‑less** internal links.
4. **Hardcoded $ in body**
   - Where possible, **reference Appendix/Pricing** instead of repeating dollar math inline. If you must show numbers, ensure they use the **output** rate for generated tokens.

------

## ✅ P0 fixes—file by file (with patches)

> **Note**: These are *surgical* changes; apply exactly as shown.

### 1) `batch-api-guide.md` — **Fix cost math to use output rates**

**Problem**: Standard (real‑time) section priced Haiku output at **$1/M** and Sonnet output at **$3/M**. Should be **$5/M** and **$15/M**.

**Patch (replace the “Cost Comparison: Auth System Example” section):**

```diff
 ## Cost Comparison: Auth System Example

-**Standard (real-time):**
-```
-Opus:   200 tokens = $0.003
-Haiku:  3000 tokens = $0.003
-Sonnet: 500 tokens = $0.0015
-────────────────────
-Total = $0.0075
-```
+**Standard (real-time):** *(using Appendix rates: Opus=$15/M in, Haiku=$5/M out, Sonnet=$15/M out)*
+```
+Opus (input):   200 tok × $15/M  = $0.0030
+Haiku (output): 3000 tok × $5/M  = $0.0150
+Sonnet (output): 500 tok × $15/M = $0.0075
+────────────────────────────────────────────
+Total (real-time) = $0.0255
+```

-**Batch API (50% discount):**
-```
-Opus:   200 × 0.5 = $0.0015
-Haiku:  3000 × 0.5 = $0.0015
-Sonnet: 500 × 0.5 = $0.00075
-────────────────────
-Total = $0.00375 (50% less)
-```
+**Batch API (50% discount):**
+```
+Opus (in):    $0.0030 → $0.0015
+Haiku (out):  $0.0150 → $0.0075
+Sonnet (out): $0.0075 → $0.00375
+────────────────────────────────
+Total (batch) = $0.01275  (≈50% less)
+```

-See [Token Economics](../architecture/token-economics) for more cost optimization strategies.
+See [Token Economics](../architecture/token-economics) and [Pricing Appendix](pricing) for rates.
```

### 2) `token-economics.md` — **Normalize rates + recompute examples**

**Problems**

- Uses **$0.80/M** for Haiku and wrong Sonnet output pricing. 
- Examples must separate **input vs output** rates.

**Patch (header + examples):**

```diff
-## Pricing Reality
-```
-Claude Opus 4:     $15.00 / 1M tokens
-Claude Sonnet 4.5: $3.00  / 1M tokens
-Claude Haiku 4.5:  $0.80  / 1M tokens
-
-Cost ratio: Opus is 18.75× more expensive than Haiku
-```
+## Pricing Reality
+*(See [Appendix: Pricing](../appendix/pricing) for source-of-truth.)*
+```
+Opus 4.1:   $15/M input,  $75/M output
+Sonnet 4.5: $3/M input,   $15/M output
+Haiku 4.5:  $1/M input,   $5/M output
+```

-### All-Opus (Naive)
-```
-Total: 4000 tokens × $15/M = $0.06
-```
+### All-Opus (Naive)
+```
+Assume Opus both plans and generates all content (output).
+Total output ~4000 tok × $75/M = $0.30
+```

-### Three-Model Orchestration
-```
-1. Opus: Architecture (200)           → $0.003
-2. Haiku: User model (1000)           → $0.001
-3. Haiku: Middleware (1000)           → $0.001
-4. Haiku: Endpoints (1000)            → $0.001
-5. Sonnet: Security review (500)      → $0.0015
-─────────────────────────────────────
-Total: ~5700 tokens = $0.0075 (87.5% cheaper)
-```
+### Three-Model Orchestration (correct rates)
+```
+1. Opus (planning, input):      200 tok × $15/M  = $0.0030
+2. Haiku (examples, output):  3×1000 tok × $5/M  = $0.0450
+3. Sonnet (review, output):     500 tok × $15/M  = $0.0075
+──────────────────────────────────────────────────────────
+Total ≈ $0.0555
+```
+**Savings vs All‑Opus‑output ($0.30): ~81.5%**

-## General Formula
-Naive cost:     (N + 1) × N_tokens × $15/M
+## General Formula (separating input vs output)
```

-Orchestrated:

- Opus:    1 × 200 × $15 / 1M
- Haiku:   N × 1000 × $0.80 / 1M
- Sonnet:  1 × 500 × $3 / 1M
   +Naive (all premium output):          N_out × $75/M
   +Orchestrated (typical):

- Opus input:   T_in  × $15/M
- Haiku output: T_hai_out × $5/M
- Sonnet out:   T_son_out × $15/M

```
-For N=5 ... Reduction: 95.9%
+*Plug in your real token counts; do not reuse hardcoded dollar amounts.*
```

> If you want to keep a “hero” scenario with **87.5%** savings, explicitly state assumptions (e.g., older rates, batch API used, or much smaller Haiku/Sonnet outputs) and label it **Scenario A** with the rates listed.

### 3) `vision.md`, `research.md`, `learning.md`, `debugging.md` — **Add front‑matter + breadcrumb; remove `.md`**

**Patch template (add at top of each of the 4 files and tweak IDs/titles):**

```yaml
---
id: vision-overview            # unique kebab id per file
title: "Why This Matters: The Paradigm Shift"
models: [opus]                 # or [haiku]/[sonnet] per file
summary: true                  # set true/false appropriately
readTime: 3m                   # adjust per file
---
```

**Immediately after the `<!-- model: ... -->` line, insert breadcrumb:**

```md
> **Path:** Home › Vision › Paradigm Shift
```

**Fix link extensions** (example from `learning.md`):

```diff
-**Compare:** [Code Review](code-review.md) | **Learn:** [Dual Representation](../three-pillars/pillar-2/pillar-2-detail.md)
+**Compare:** [Code Review](code-review) | **Learn:** [Dual Representation](../three-pillars/pillar-2/pillar-2-detail)
```

### 4) `pricing.md` — **Source of truth is good (keep), but sync examples**

- Your “Cost Per Task (Standard)” block matches the corrected math in `batch-api-guide.md` (**$0.0255**). Good.
- The “Orchestrated” example shows the **optimized** $0.00525; if that assumes **Batch 50%** *and* different token counts, label it explicitly:
  - “**Scenario B (Batch + short outputs)**: Total = $0.00525”.
  - Otherwise remove to avoid clashing with corrected numbers.

### 5) **System Visualization** (INDEX diagram) — update rate labels

Current diagram calls out **“Haiku $0.80/M”**; change to “$1/M in, $5/M out”. 

------

## 🧱 P1 consistency tasks (do next)

- **Model attribution tag**: ensure every doc starts with `<!-- model: opus|haiku|sonnet -->`.

- **Standardize “Related” footer**:

  ```
  ---
  **Related**
  - [Next: …](…)
  - [See also: …](…)
  - [Back: Home](../../home)
  ```

- **One “time estimate” source of truth**: choose either `INDEX.md` or `QUICK_START.md` and align the other.

------

## 🔧 Optional helper (prevent regressions)

Add a simple **lint** step (pre‑commit) to reject stale rates and `.md` links:

```bash
# fail if old Haiku pricing appears
grep -RInE '\$0\.80\s*/\s*1M|Haiku.*\$0\.80' docs/ && exit 1

# fail if internal .md links appear
grep -RInE '\]\([^)#]+\.md\)' docs/ && exit 1
```

------

## 📦 Ready‑to‑paste snippets you asked for earlier (kept minimal)

### A) **Pricing constants + cost utility (TypeScript)**

Use in examples to avoid hand math drift.

```ts
// pricing.ts
export const PRICING = {
  input:  { opus: 15, sonnet: 3, haiku: 1 },   // $ per 1M input tokens
  output: { opus: 75, sonnet: 15, haiku: 5 },  // $ per 1M output tokens
};

export function dollars(tokens: number, ratePerMillion: number) {
  return (tokens * ratePerMillion) / 1_000_000;
}
```

### B) **Front‑matter template** (reuse across missing files)

```yaml
---
id: <kebab-id>
title: "<Title Case>"
models: [opus]     # or [haiku]/[sonnet]
summary: true
readTime: 3m
---
```

------

## ✅ What to do now (checklist)

-  Apply the **six patches** above (Batch, Token‑Econ, 4×Old files, Pricing clarifier, System viz rates).
-  Run the **lint** to catch stale `$0.80` and `.md` links.
-  Re‑generate any computed **savings** with correct **output** rates (or label scenarios clearly).
-  Re‑tag docs update as `v1.0.1-docs`.

If you want, I can draft **fully corrected** versions of the five “old‑format” files (front‑matter + breadcrumb + link fixes) and the two pricing sections as complete markdown blocks you can paste in.