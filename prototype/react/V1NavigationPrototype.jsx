import { useState } from 'react';
import CompleteMarkdownRenderer from './COMPLETE-MARKDOWN-RENDERER-V2.jsx';
import { DOCS, START_DOC_ID } from './docsData.js';

const MAX_VISIBLE_PANES = 3;

export default function V1NavigationPrototype() {
  const [history, setHistory] = useState([START_DOC_ID]);

  const currentId = history[history.length - 1];
  const currentDoc = DOCS[currentId];

  const handleLinkClick = (targetId) => {
    if (!DOCS[targetId]) {
      return;
    }
    setHistory((prev) => [...prev, targetId]);
  };

  const handleBack = () => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const handleHome = () => {
    setHistory([START_DOC_ID]);
  };

  const visibleHistory = history.slice(-MAX_VISIBLE_PANES);

  return (
    <div style={{ padding: '24px', fontFamily: 'Inter, sans-serif', background: '#f7f7f7', minHeight: '100vh' }}>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        <button onClick={handleBack} disabled={history.length <= 1}>
          ◄ Back
        </button>
        <button onClick={handleHome}>🏠 Home</button>
        <div style={{ marginLeft: 'auto', color: '#666' }}>
          History length: {history.length}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${visibleHistory.length}, minmax(0, 1fr))`, gap: '16px' }}>
        {visibleHistory.map((docId) => {
          const doc = DOCS[docId];
          return (
            <div key={docId} style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '16px', overflow: 'auto', maxHeight: '80vh' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#888', marginBottom: '8px' }}>{doc.title}</div>
              <CompleteMarkdownRenderer content={doc.content} onClickLink={handleLinkClick} />
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '24px', background: '#fff', borderRadius: '8px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>All Documents</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.values(DOCS).map((doc) => (
            <button key={doc.id} onClick={() => handleLinkClick(doc.id)} style={{ padding: '6px 10px' }}>
              {doc.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
