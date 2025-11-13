# ADR-006: Mock Data (No Real PDFs in Prototype)

**Status**: Accepted

**Date**: 2025-11-13

---

## Context

The prototype is designed to display PDF diagrams in a 3-pane layout. We needed to decide whether to:

1. **Render actual PDFs** - Use a PDF library (pdfjs, pdf-viewer) to display real documents
2. **Use mock placeholders** - Show colored boxes with text labels instead of real PDFs
3. **Hybrid approach** - Placeholder in prototype, real PDFs in Phase 2

---

## Decision

**We chose Mock Placeholders: Colored boxes representing PDFs, not actual rendering.**

Implementation:
- Each pane shows a placeholder div with:
  - Background color (light blue/gray)
  - Dashed border (indicates placeholder)
  - Text label: "[PDF Preview: {node.name}]"
  - Fixed height (~200-300px)
- No actual PDF library required
- Data structure ready for real PDFs in Phase 2

---

## Consequences

### Positive
✅ **Drastically simpler** - No PDF library overhead
✅ **Instant to implement** - Single CSS box + text
✅ **No performance overhead** - No rendering engine needed
✅ **No browser compatibility issues** - Works everywhere
✅ **Data structure ready for PDFs** - Can swap in real PDFs later
✅ **Focus on navigation UX** - Not distracted by PDF rendering bugs
✅ **No file dependencies** - Don't need actual PDF files to test

### Negative
❌ **Not realistic** - Users see boxes, not diagrams
❌ **Can't validate PDF layout** - Real PDFs might have different dimensions
❌ **No actual content** - Can't read diagram details
❌ **Doesn't test PDF rendering edge cases** - PDFs might have issues in Phase 2

### Mitigation
- Phase 2: Replace mock boxes with actual PDF rendering
- Document data structure for easy PDF integration
- Test with sample PDFs before Phase 2 release

---

## Alternatives Considered

### Alternative 1: Use Real PDFs in Prototype
- Download sample PDFs or create dummy ones
- Use pdfjs or pdf-viewer library
- Render in panes

**Why rejected**:
- Significant complexity (PDF library setup)
- Another dependency to manage
- PDF rendering bugs become distraction
- Testing PDFs adds complexity
- Doesn't improve navigation UX testing
- Deferred: Better to validate navigation first

### Alternative 2: Use Images Instead
- Create screenshot images of PDFs
- Show images in panes
- Simpler than PDF rendering

**Why rejected**:
- Still need to create/manage image files
- Not really better than placeholders
- Less flexible (changing diagrams requires new images)
- Placeholders more honest (shows this is prototype)

### Alternative 3: Use Lorem Ipsum Text
- Display text content in panes
- Simulate diagram content with paragraphs
- More "realistic" than boxes

**Why rejected**:
- Doesn't represent actual PDF structure
- Misleading (text isn't what diagrams will show)
- More work than placeholder boxes
- Placeholders clearer that it's a prototype

---

## Related Decisions

- **ADR-001 through ADR-005**: All ADRs directly support focusing on navigation (ADR-006 handles the content representation)
- **Implicit Phase 2**: Real PDF rendering deferred

---

## Implications for Implementation

### Pane Component Structure
```javascript
function Pane({ node, onClickLink }) {
  return (
    <div className="pane">
      <div className="pane-header">
        LEVEL {node.level}: {node.name}
      </div>
      
      <div className="pdf-preview">
        <div className="mock-pdf">
          [PDF Preview: {node.name}]
        </div>
      </div>
      
      <div className="related-diagrams">
        <h4>Related Diagrams:</h4>
        <ul>
          {node.links.map(linkId => (
            <li key={linkId}>
              <button onClick={() => onClickLink(linkId)}>
                {DIAGRAMS_DATA[linkId].name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### CSS Styling
```css
.mock-pdf {
  background: linear-gradient(135deg, #f0f4f8 0%, #e8f0f7 100%);
  border: 2px dashed #999;
  border-radius: 4px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin-bottom: 20px;
}

.mock-pdf::before {
  content: "📄";  /* Optional: PDF icon */
  margin-right: 10px;
}
```

### Data Structure
```javascript
interface DiagramNode {
  id: string;
  name: string;
  links: string[];  // Ready for real content later
  // phase-2-ready fields (unused in prototype):
  pdfPath?: string;         // Path to real PDF file
  pdfDimensions?: {w, h};   // PDF dimensions
  content?: string;         // PDF content/description
}
```

### Placeholder Variation (Optional)
```javascript
// Could randomize colors per pane for visual differentiation
const colors = [
  'linear-gradient(135deg, #f0f4f8 0%, #e8f0f7 100%)',
  'linear-gradient(135deg, #f5f0f8 0%, #e8e0f7 100%)',
  'linear-gradient(135deg, #f8f0f5 0%, #f7e0e8 100%)',
];

const bgColor = colors[node.id.charCodeAt(0) % colors.length];

// Result: visually distinct panes, easier to see transitions
```

---

## Phase 2 Migration Strategy

### When Moving to Real PDFs

**Step 1: Add pdfPath to data**
```javascript
{
  id: "react",
  name: "React Components",
  links: [...],
  pdfPath: "/diagrams/react-components.pdf"  // New field
}
```

**Step 2: Install PDF library**
```bash
npm install pdfjs-dist
```

**Step 3: Replace mock component**
```javascript
import * as PDFJS from 'pdfjs-dist';

function Pane({ node, onClickLink }) {
  const [pdfPage, setPdfPage] = useState(null);
  
  useEffect(() => {
    if (node.pdfPath) {
      PDFJS.getDocument(node.pdfPath).promise
        .then(pdf => pdf.getPage(1))
        .then(page => setPdfPage(page));
    }
  }, [node.pdfPath]);
  
  return (
    <div className="pane">
      <div className="pane-header">...</div>
      <div className="pdf-preview">
        {pdfPage ? (
          <PDFRenderer page={pdfPage} />
        ) : (
          <div className="mock-pdf">Loading...</div>
        )}
      </div>
      ...
    </div>
  );
}
```

**Step 4: No change to navigation logic** - Everything else stays the same

---

## Testing with Placeholders

### What We Can Test
- ✅ Navigation (forward, back, jump)
- ✅ Viewport transitions (scroll animation)
- ✅ Layout (panes sizing, spacing)
- ✅ Links (click triggers navigation)
- ✅ State (currentIndex, history)
- ✅ Breadcrumb display
- ✅ Jump buttons visibility
- ✅ Keyboard shortcuts

### What We Can't Test Yet
- ❌ PDF rendering performance
- ❌ PDF layout issues
- ❌ PDF zoom/pan interactions
- ❌ PDF large file loading
- ❌ Cross-browser PDF support

### Deferred to Phase 2
- Real PDF rendering testing
- PDF-specific optimizations
- File loading & caching

---

## User Communication

### Prototype Label
Should clearly indicate this is a prototype with mocks:

```javascript
<div className="prototype-badge">
  🚀 Prototype - Navigation UI mockup with placeholder diagrams
</div>
```

### Expectation Setting
- Tell users: "This shows the navigation layout; real diagrams come later"
- Focus feedback on: Navigation flow, pane sizing, viewport behavior
- Not focused on: PDF rendering, diagram details

---

## Content Fidelity

### Prototype (Now)
- Placeholder boxes with labels
- All navigation works
- Can validate user flow

### Phase 2 (with Real PDFs)
- Actual diagram content
- PDF rendering
- Same navigation (no changes needed)

### Benefits of This Approach
- Separates concerns (navigation ≠ rendering)
- Validate navigation before investing in PDF setup
- Easy to iterate on navigation UX
- Can reuse mock setup for testing

---

## Alternative Mock Representations (Optional)

If placeholder boxes seem too minimal:

### Option 1: Diagram Sketches
- Simple SVG diagrams representing content
- More visual than boxes, but still mock
- E.g., simple boxes-and-arrows flowcharts

### Option 2: Lorem Ipsum Blocks
- Paragraph text representing diagram content
- More realistic layout simulation
- Harder to create/maintain

### Option 3: Procedural Content
- Generate pseudo-diagrams based on node name
- Interesting visual variation
- Over-engineered for prototype

**Recommendation**: Stick with placeholder boxes (simplest, clearest).

---

## Performance Notes

### Placeholder Performance
- Rendering: Negligible (just CSS boxes)
- File size: 0KB (no PDF library)
- Load time: <100ms for entire page
- Memory: Minimal (no PDF parser)

### Placeholder vs Real PDFs
**Placeholder vs Real PDFs**
- Load time: `<100ms` vs `500ms–2s` per PDF
- Memory: ~1KB per pane vs 50–500KB per PDF
- Complexity: trivial JSX vs full PDF pipeline
- Artifacts needed: none vs 20+ PDF files to test

---

## Open Questions

- Should placeholder boxes show different colors? **Answer**: Optional; not required.
- Should we use icons (📄) in placeholders? **Answer**: Nice to have, not required.
- What size should mock PDFs be? **Answer**: 200-300px height, fill pane width.
- Should we add animation to mock PDFs? **Answer**: No; keep simple.

---

## Sign-Off

- [ ] Architecture Lead: Approved
- [ ] Product: Approved
- [ ] Engineering Lead: Approved
