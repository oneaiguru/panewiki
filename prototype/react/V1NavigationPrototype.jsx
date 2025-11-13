import React, { useReducer, useRef, useEffect, useMemo, useState } from 'react';
import CompleteMarkdownRenderer from './COMPLETE-MARKDOWN-RENDERER-V2.jsx';
import { DOCS, START_DOC_ID } from './docsData.js';

const MAX_VISIBLE_PANES = 3;
const MAX_FIRST_JUMP_BUTTONS = 5;
const MAX_LAST_JUMP_BUTTONS = 5;
const HISTORY_WARNING_THRESHOLD = 100;

const ACTIONS = {
  NAVIGATE: 'NAVIGATE',
  BACK: 'BACK',
  HOME: 'HOME',
  JUMP: 'JUMP',
  RESET_HOME: 'RESET_HOME',
  CLEAR_KEEP_CURRENT: 'CLEAR_KEEP_CURRENT',
};

const JUMP_BUTTON_STYLES = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  scroll: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    maxWidth: 600,
    padding: '4px 0',
  },
  button: {
    padding: '4px 8px',
    border: '1px solid #ccc',
    background: '#fff',
    borderRadius: 4,
    fontSize: 12,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  gap: {
    color: '#666',
    fontSize: 12,
  },
};

function navigationReducer(state, action) {
  switch (action.type) {
    case ACTIONS.NAVIGATE: {
      const nextHistory = [...state.history, action.id];
      return { history: nextHistory, currentIndex: nextHistory.length - 1 };
    }
    case ACTIONS.BACK:
      return state.currentIndex > 0 ? { ...state, currentIndex: state.currentIndex - 1 } : state;
    case ACTIONS.HOME:
      return { ...state, currentIndex: 0 };
    case ACTIONS.JUMP: {
      const idx = Math.max(0, Math.min(action.index, state.history.length - 1));
      return { ...state, currentIndex: idx };
    }
    case ACTIONS.RESET_HOME:
      return { history: [action.homeId], currentIndex: 0 };
    case ACTIONS.CLEAR_KEEP_CURRENT: {
      const currentId = state.history[state.currentIndex];
      return { history: [currentId], currentIndex: 0 };
    }
    default:
      return state;
  }
}

export default function V1NavigationPrototype() {
  const homeDoc = DOCS[START_DOC_ID];

  if (!homeDoc) {
    return (
      <div style={styles.app}>
        <div style={styles.errorPane}>
          <h2>Home document "{START_DOC_ID}" not found.</h2>
          <p>Available documents: {Object.keys(DOCS).join(', ') || 'none'}.</p>
        </div>
      </div>
    );
  }

  return <NavigationShell homeId={START_DOC_ID} />;
}

function NavigationShell({ homeId }) {
  const initializer = () => ({
    history: [homeId],
    currentIndex: 0,
  });
  const [state, dispatch] = useReducer(navigationReducer, undefined, initializer);
  const stateRef = useRef(state);
  const scrollRef = useRef(null);
  const currentPaneRef = useRef(null);
  const toastTimerRef = useRef(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message) => {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(''), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isTyping =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        document.activeElement?.isContentEditable;
      if (isTyping) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        dispatch({ type: ACTIONS.BACK });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateForwardFrom(stateRef.current, dispatch, showToast);
      } else if (e.key === 'Home') {
        e.preventDefault();
        dispatch({ type: ACTIONS.HOME });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({
      left: Math.max(0, (state.currentIndex - (MAX_VISIBLE_PANES - 1)) * 400),
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  }, [state.currentIndex]);

  useEffect(() => {
    if (currentPaneRef.current) {
      currentPaneRef.current.focus();
    }
  }, [state.currentIndex]);

  useEffect(() => {
    const firstPane = scrollRef.current?.querySelector('.pane');
    if (!firstPane) return;
    const width = firstPane.getBoundingClientRect().width;
    if (Math.abs(width - 400) > 1) {
      // eslint-disable-next-line no-console
      console.warn(`Pane width mismatch: expected 400px, got ${width}px`);
    }
  }, [state.history.length]);

  const visibleHistory = useMemo(() => {
    const start = Math.max(0, state.currentIndex - (MAX_VISIBLE_PANES - 1));
    return state.history.slice(start, state.currentIndex + 1);
  }, [state.history, state.currentIndex]);

  const hiddenAncestors = state.history.slice(
    0,
    Math.max(0, state.currentIndex - (MAX_VISIBLE_PANES - 1))
  );
  const showHistoryWarning = state.history.length > HISTORY_WARNING_THRESHOLD;

  const handleLinkClick = (targetId) => {
    if (!DOCS[targetId]) {
      showToast(`Cannot navigate to "${targetId}"`);
      return;
    }
    dispatch({ type: ACTIONS.NAVIGATE, id: targetId });
  };

  const handleClearToHome = () => dispatch({ type: ACTIONS.RESET_HOME, homeId });
  const handleClearKeepCurrent = () => dispatch({ type: ACTIONS.CLEAR_KEEP_CURRENT });

  const depthText = `${state.currentIndex + 1}/${state.history.length}`;
  const stripWidth = state.history.length * 400;

  return (
    <div style={styles.app}>
      <div style={styles.navBar}>
        <button className="btn" onClick={() => dispatch({ type: ACTIONS.HOME })} title="Home (Home key)">
          🏠 Home
        </button>
        <button
          className="btn"
          onClick={() => dispatch({ type: ACTIONS.BACK })}
          disabled={state.currentIndex === 0}
          title="Back (←)"
        >
          ◄ Back
        </button>
        <div className="breadcrumb" style={styles.breadcrumb}>
          {visibleHistory.map((id, idx) => {
            const doc = DOCS[id];
            const title = doc?.title || doc?.name || id;
            return (
              <span key={`${id}-${idx}`}>
                {idx ? ' › ' : ''}
                {title}
              </span>
            );
          })}
        </div>
        <div className="depth" style={styles.depth}>
          {depthText}
        </div>
        <JumpButtons hiddenAncestors={hiddenAncestors} onJump={(index) => dispatch({ type: ACTIONS.JUMP, index })} />
        {showHistoryWarning && (
          <div style={styles.historyWarning}>
            <span>History: {state.history.length}</span>
            <button className="btn" onClick={handleClearToHome}>
              Reset to Home
            </button>
            <button className="btn" onClick={handleClearKeepCurrent}>
              Clear, stay here
            </button>
          </div>
        )}
      </div>

      <div style={styles.scrollViewport} ref={scrollRef}>
        <div style={styles.paneGrid(stripWidth)}>
          {state.history.map((docId, idx) => {
            const doc = DOCS[docId];
            if (!doc) {
              return (
                <div key={`missing-${docId}-${idx}`} style={styles.errorPane}>
                  Missing document: {docId}
                </div>
              );
            }
            const title = doc.title || doc.name || docId;
            const isRightmost = idx === state.currentIndex;
            return (
              <PaneErrorBoundary key={`pane-${idx}`}>
                <div
                  className="pane"
                  style={styles.pane}
                  tabIndex={isRightmost ? 0 : -1}
                  ref={isRightmost ? currentPaneRef : null}
                  role={isRightmost ? 'region' : undefined}
                  aria-label={isRightmost ? title : undefined}
                >
                  <div style={styles.paneTitle}>Position {idx + 1}: {title}</div>
                  <div className="mock-pdf">[PDF Preview: {title}]</div>
                  <div className="markdown-content">
                    <CompleteMarkdownRenderer content={doc.content} />
                  </div>
                  <RelatedLinks doc={doc} highlightFirst={isRightmost} onClick={handleLinkClick} />
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
  const visible = state.history.slice(start, state.currentIndex + 1);
  const rightmostId = visible[visible.length - 1];
  const doc = DOCS[rightmostId];
  const firstLink = doc?.links?.[0];
  if (firstLink && DOCS[firstLink]) {
    dispatch({ type: ACTIONS.NAVIGATE, id: firstLink });
  } else {
    showToast('No links to navigate from this page');
  }
}

function JumpButtons({ hiddenAncestors, onJump }) {
  if (!hiddenAncestors.length) return null;

  if (hiddenAncestors.length <= MAX_FIRST_JUMP_BUTTONS + MAX_LAST_JUMP_BUTTONS + 2) {
    return (
      <div className="jump-buttons-container" style={JUMP_BUTTON_STYLES.container}>
        <div className="jump-buttons-scroll" style={JUMP_BUTTON_STYLES.scroll}>
          {hiddenAncestors.map((id, idx) => (
            <button
              key={`jump-${id}-${idx}`}
              className="jump-btn"
              style={JUMP_BUTTON_STYLES.button}
              onClick={() => onJump(idx)}
            >
              ◄ {DOCS[id]?.title || DOCS[id]?.name || id}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const first = hiddenAncestors.slice(0, MAX_FIRST_JUMP_BUTTONS);
  const last = hiddenAncestors.slice(-MAX_LAST_JUMP_BUTTONS);
  const gapCount = hiddenAncestors.length - first.length - last.length;

  return (
    <div className="jump-buttons-container" style={JUMP_BUTTON_STYLES.container}>
      <div className="jump-buttons-scroll" style={JUMP_BUTTON_STYLES.scroll}>
        {first.map((id, idx) => (
          <button
            key={`jump-first-${id}-${idx}`}
            className="jump-btn"
            style={JUMP_BUTTON_STYLES.button}
            onClick={() => onJump(idx)}
          >
            ◄ {DOCS[id]?.title || DOCS[id]?.name || id}
          </button>
        ))}
        <span className="gap-indicator" style={JUMP_BUTTON_STYLES.gap}>
          … {gapCount} earlier …
        </span>
        {last.map((id, idx) => {
          const absoluteIndex = hiddenAncestors.length - last.length + idx;
          return (
            <button
              key={`jump-last-${id}-${idx}`}
              className="jump-btn"
              style={JUMP_BUTTON_STYLES.button}
              onClick={() => onJump(absoluteIndex)}
            >
              ◄ {DOCS[id]?.title || DOCS[id]?.name || id}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RelatedLinks({ doc, onClick, highlightFirst }) {
  const validLinks = (doc.links || []).filter((id) => !!DOCS[id]);
  if (!validLinks.length) return null;
  return (
    <div className="related-diagrams">
      <h4>Related Diagrams</h4>
      <ul>
        {validLinks.map((linkId, idx) => {
          const target = DOCS[linkId];
          const title = target.title || target.name || linkId;
          const isFirst = highlightFirst && idx === 0;
          return (
            <li key={linkId}>
              <button
                onClick={() => onClick(linkId)}
                className={isFirst ? 'keyboard-hint' : undefined}
                aria-label={`Navigate to ${title}`}
                title={isFirst ? 'Arrow →' : undefined}
              >
                {title}
                {isFirst && <span className="hint">→</span>}
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
    // eslint-disable-next-line no-console
    console.warn('Pane rendering error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.errorPane}>
          <p>Content failed to load.</p>
          <button className="btn" onClick={() => this.setState({ hasError: false })}>
            Retry
          </button>
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
  breadcrumb: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: '#555',
    display: 'flex',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    gap: '4px',
  },
  depth: {
    fontSize: 12,
    color: '#666',
    whiteSpace: 'nowrap',
  },
  scrollViewport: {
    overflowX: 'auto',
  },
  paneGrid: (width) => ({
    display: 'flex',
    width,
  }),
  pane: {
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    padding: 16,
    maxHeight: '80vh',
    overflowY: 'auto',
    overflowX: 'auto',
    width: 400,
    boxSizing: 'border-box',
    borderRight: '1px solid #eee',
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
    width: '100%',
  },
};
