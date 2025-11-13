# Link Integrity and Connectivity Checks

Purpose: ensure docs remain navigable and consistent as they evolve.

Checks:
1) Link existence: every `[Text](target)` refers to a real peer file `target.md` in the same folder.
2) Graph connectivity: from the start page (`ExecutionPlan`), all documents in the folder are reachable by following links.

Folders:
- `final/full/` — detailed reference set
- `final/summaries/` — short prototype set

Quick scripts used locally

Link existence check (Python):

```python
import os, re
link_re = re.compile(r"\[[^\]]+\]\(([^)]+)\)")

def check_dir(d):
    files = [f for f in os.listdir(d) if f.endswith('.md')]
    bases = {os.path.splitext(f)[0] for f in files}
    broken = []
    for f in files:
        with open(os.path.join(d, f), 'r', encoding='utf-8') as fh:
            txt = fh.read()
        for m in link_re.finditer(txt):
            target = m.group(1)
            if '://' in target:
                continue
            base = target[:-3] if target.endswith('.md') else target
            if base not in bases:
                broken.append((f, target))
    return broken
```

Connectivity check (Python):

```python
import os, re, collections
link_re = re.compile(r"\[[^\]]+\]\(([^)]+)\)")

def graph_for(d):
    files = [f for f in os.listdir(d) if f.endswith('.md')]
    bases = {os.path.splitext(f)[0]: f for f in files}
    g = {b: set() for b in bases}
    for b, fn in bases.items():
        with open(os.path.join(d, fn), 'r', encoding='utf-8') as fh:
            txt = fh.read()
        for m in link_re.finditer(txt):
            t = m.group(1)
            if '://' in t: continue
            base = t[:-3] if t.endswith('.md') else t
            if base in bases: g[b].add(base)
    return g

def reachable(g, start='ExecutionPlan'):
    if start not in g: return set()
    q, seen = collections.deque([start]), {start}
    while q:
        u = q.popleft()
        for v in g.get(u, ()): 
            if v not in seen:
                seen.add(v); q.append(v)
    return seen
```

Acceptance:
- No broken links
- All nodes reachable from `ExecutionPlan` in both folders

When to run:
- Locally before commit (Phase 2+)
- CI step for future automation

