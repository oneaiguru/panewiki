# ADR-006: Mock PDFs (Not Real Rendering)

**Status**: Accepted

> Implementation status: **Shipped in V1 ✅** — panes show decorative PDF placeholders only.

## Decision

Use colored placeholder boxes instead of real PDFs.

## Why

- Simplifies prototype (no PDF library)
- Focuses on navigation UX, not rendering
- Data structure ready for Phase 2+
- Easy to swap for real PDFs later

## What It Looks Like

```
┌─────────────────────┐
│ [PDF Preview: Name] │
│                     │
│  (Colored box)      │
│                     │
└─────────────────────┘
```

## Benefits

✓ Fast to implement
✓ No external dependencies
✓ Proves navigation works

## Trade-offs

✗ Not realistic
✗ Can't validate PDF layout
✗ No actual diagram content

## Migration to Real PDFs (Phase 2+)

Same data model, different renderer:

```javascript
// Phase 1 (mock):
<MockPDFBox node={node} />

// Phase 2+ (real):
<PDFRenderer node={node} />
```

Same navigation code, different rendering.

## Related

- [ADR008PureStatelessRenderer](ADR008PureStatelessRenderer)
- [MockDataTemplate](MockDataTemplate)

See: [ImplementationRoadmap](ImplementationRoadmap)
