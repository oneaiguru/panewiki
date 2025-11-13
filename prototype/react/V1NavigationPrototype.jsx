import React, { useReducer, useRef, useEffect, useMemo, useState } from 'react';
import CompleteMarkdownRenderer from './COMPLETE-MARKDOWN-RENDERER-V2.jsx';
import { DOCS, START_DOC_ID } from './docsData.js';

const MAX_VISIBLE_PANES = 3;
const MAX_FIRST_JUMP_BUTTONS = 5;
const MAX_LAST_JUMP_BUTTONS = 5;
const HISTORY_WARNING_THRESHOLD = 100;

const initialState = {
  history: [START_DOC_ID],
  currentIndex: 0,
};

function navigationReducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE': {
      const nextHistory = [...state.history.slice(0, state.currentIndex + 1), action.id];
      return { history: nextHistory, currentIndex: nextHistory.length - 1 };
    }
    case 'BACK':
      return state.currentIndex > 0 ? { ...state, currentIndex: state.currentIndex - 1 } : state;
    case 'HOME':
      return { ...state, currentIndex: 0 };
    case 'JUMP':
      return { ...state, currentIndex: action.index };
    case 'RESET_HOME':
      return { history: [START_DOC_ID], currentIndex: 0 };
    default:
      return state;
  }
}

export default function V1NavigationPrototype() {
  const [state, dispatch] = useReducer(navigationReducer, initialState);
  const stateRef = useRef(state);
  const scrollRef = useRef(null);
  const [toast, setToast] = useState('');
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => () => toastTimeoutRef.current && clearTimeout(toastTimeoutRef.current), []);

  const showToast = (message) => {
    setToast(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(''), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        dispatch({ type: 'BACK' });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateForwardFrom(stateRef.current, dispatch, showToast);
      } else if (e.key === 'Home') {
        e.preventDefault();
        dispatch({ type: 'HOME' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({
      left: Math.max(0, (state.currentIndex - 2) * 400),
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  }, [state.currentIndex]);

  const visibleHistory = useMemo(() => {
    const start = Math.max(0, state.currentIndex - (MAX_VISIBLE_PANES - 1));
    return state.history.slice(start, state.currentIndex + 1);
  }, [state.history, state.currentIndex]);

  const hiddenAncestors = state.history.slice(0, Math.max(0, state.currentIndex - (MAX_VISIBLE_PANES - 1)));

  const handleLinkClick = (targetId) => {
    if (!DOCS[targetId]) {
      showToast(`Cannot navigate to "${targetId}"`);
      return;
    }
    dispatch({ type: 'NAVIGATE', id: targetId });
  };

  const showHistoryWarning = state.history.length > HISTORY_WARNING_THRESHOLD;

  return (
    <div style={styles.app}>
      <div style={styles.navBar}>
        <button onClick={() => dispatch({ type: 'BACK' })} disabled={state.currentIndex === 0}>
          ◄ Back
        </button>
        <button onClick={() => dispatch({ type: 'HOME' })}>🏠 Home</button>
        <JumpButtons hiddenAncestors={hiddenAncestors} onJump={(index) => dispatch({ type: 'JUMP', index })} />
        <div style={styles.spacer} />
        {showHistoryWarning && (
          <div style={styles.historyWarning}>
            History: {state.history.length}
            <button onClick={() => dispatch({ type: 'RESET_HOME' })} style={styles.clearBtn}>
              Reset to Home
            </button>
          </div>
        )}
      </div>

      <div ref={scrollRef} style={styles.scrollViewport}>
        <div style={styles.paneGrid(visibleHistory.length)}>
          {visibleHistory.map((docId, idx) => {
            const doc = DOCS[docId];
            const isRightmost = idx === visibleHistory.length - 1;
            return (
              <PaneErrorBoundary key={`pane-boundary-${docId}-${idx}`}>
                <div style={styles.pane}>
                  <div style={styles.paneTitle}>{doc.title}</div>
                  <CompleteMarkdownRenderer content={doc.content} />
                  <RelatedLinks node={doc} onClick={handleLinkClick} highlightFirst={isRightmost} />
                </div>
              </PaneErrorBoundary>
            );
          })}
        </div>
      </div>

      {toast && (
        <div style={styles.toast} role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}

function navigateForwardFrom(state, dispatch, showToast) {
  const start = Math.max(0, state.currentIndex - (MAX_VISIBLE_PANES - 1));
  const visibleHistory = state.history.slice(start, state.currentIndex + 1);
  const rightmostId = visibleHistory[visibleHistory.length - 1];
  const doc = DOCS[rightmostId];
  const firstLink = doc?.links?.[0];
  if (firstLink && DOCS[firstLink]) {
    dispatch({ type: 'NAVIGATE', id: firstLink });
  } else {
    showToast('No links available on this page');
  }
}

function JumpButtons({ hiddenAncestors, onJump }) {
  if (!hiddenAncestors.length) return null;

  if (hiddenAncestors.length <= MAX_FIRST_JUMP_BUTTONS + MAX_LAST_JUMP_BUTTONS + 2) {
    return (
      <div style={styles.jumpContainer}>
        <div style={styles.jumpScroll}>
          {hiddenAncestors.map((id, idx) => (
            <button key={`${id}-${idx}`} onClick={() => onJump(idx)} style={styles.jumpButton}>
              ◄ {DOCS[id]?.title ?? id}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const firstSlice = hiddenAncestors.slice(0, MAX_FIRST_JUMP_BUTTONS);
  const lastSlice = hiddenAncestors.slice(-MAX_LAST_JUMP_BUTTONS);
  const gapCount = hiddenAncestors.length - firstSlice.length - lastSlice.length;

  return (
    <div style={styles.jumpContainer}>
      <div style={styles.jumpScroll}>
        {firstSlice.map((id, idx) => (
          <button key={`first-${id}-${idx}`} onClick={() => onJump(idx)} style={styles.jumpButton}>
            ◄ {DOCS[id]?.title ?? id}
          </button>
        ))}
        <span style={styles.moreIndicator}>… {gapCount} earlier …</span>
        {lastSlice.map((id, idx) => {
          const actualIndex = hiddenAncestors.length - lastSlice.length + idx;
          return (
            <button key={`last-${id}-${idx}`} onClick={() => onJump(actualIndex)} style={styles.jumpButton}>
              ◄ {DOCS[id]?.title ?? id}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RelatedLinks({ node, onClick, highlightFirst }) {
  const validLinks = (node.links || []).filter((linkId) => !!DOCS[linkId]);
  if (!validLinks.length) return null;

  return (
    <div style={styles.related}>
      <h4>Related Diagrams</h4>
      <ul>
        {validLinks.map((linkId, idx) => {
          const target = DOCS[linkId];
          const isFirst = highlightFirst && idx === 0;
          return (
            <li key={`${linkId}-${idx}`}>
              <button
                onClick={() => onClick(linkId)}
                style={{
                  ...styles.relatedButton,
                  ...(isFirst ? styles.keyboardHint : {}),
                }}
                {...(isFirst ? { 'aria-label': `Navigate to ${target.title}` } : {})}
              >
                {target.title}
                {isFirst && <span style={styles.hintIcon}>→</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

class PaneErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn('Pane rendering error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.errorPane}>
          <p>Content failed to load.</p>
          <button onClick={() => this.setState({ hasError: false })}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const styles = {
  app: {
    padding: '24px',
    fontFamily: 'Inter, sans-serif',
    background: '#f7f7f7',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  navBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  scrollViewport: {
    overflowX: 'auto',
  },
  paneGrid: (count) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
    gap: '16px',
  }),
  pane: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    padding: 16,
    maxHeight: '80vh',
    overflowY: 'auto',
    overflowX: 'auto',
  },
  paneTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#888',
    marginBottom: 12,
  },
  related: {
    marginTop: 16,
  },
  relatedButton: {
    background: '#eef3ff',
    border: 'none',
    padding: '6px 10px',
    borderRadius: 6,
    cursor: 'pointer',
    color: '#1a45b0',
  },
  keyboardHint: {
    position: 'relative',
    fontWeight: 'bold',
  },
  hintIcon: {
    marginLeft: 6,
    color: '#1a73e8',
    fontSize: 12,
  },
  jumpContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  jumpScroll: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: 4,
    maxWidth: 600,
    whiteSpace: 'nowrap',
  },
  jumpButton: {
    border: 'none',
    background: '#f0f4ff',
    padding: '4px 8px',
    borderRadius: 4,
    cursor: 'pointer',
  },
  moreIndicator: {
    color: '#666',
    fontSize: 12,
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0 8px',
  },
  historyWarning: {
    background: '#fffbea',
    borderRadius: 6,
    padding: '4px 8px',
    border: '1px solid #ffe58f',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  clearBtn: {
    border: 'none',
    background: '#ff7a45',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: 4,
    cursor: 'pointer',
  },
  spacer: {
    flex: 1,
  },
  toast: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    background: '#333',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: 8,
    boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
  },
  errorPane: {
    background: '#fff6f6',
    borderRadius: 12,
    padding: 16,
    border: '1px solid #ffd1d1',
    textAlign: 'center',
  },
};
