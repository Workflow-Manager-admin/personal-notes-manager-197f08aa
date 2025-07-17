import React, { useState, useEffect } from 'react';
import './App.css';

/*
 * Picks up backend URL from .env (REACT_APP_BACKEND_URL); defaults to HTTPS+port as fallback.
 * For local dev, set .env accordingly; in cloud/CI, HTTPS mandatory!
 */
const API_BASE = process.env.REACT_APP_BACKEND_URL
  || 'https://vscode-internal-595-beta.beta01.cloud.kavia.ai:3001'; // safest fallback for Kavia

const COLOR_PRIMARY = '#4A90E2';
const COLOR_SECONDARY = '#50E3C2';
const COLOR_ACCENT = '#F5A623';

// ------------------------------------------
// Components
// ------------------------------------------

function Header({ user, onLogout }) {
  return (
    <header className="app-header" style={{
      background: COLOR_PRIMARY, color: '#fff', padding: 0, marginBottom: 0
    }}>
      <nav className="navbar" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        height: 64
      }}>
        <div className="logo" style={{ fontWeight: 700, fontSize: 24, letterSpacing: 1 }}>
          Notes<span style={{ color: COLOR_ACCENT }}>Manager</span>
        </div>
        <div>
          {user ? (
            <>
              <span style={{
                background: COLOR_SECONDARY,
                color: '#222',
                borderRadius: 16,
                padding: '0.2em 1em',
                marginRight: 8,
                fontWeight: '600'
              }}>{user.username}</span>
              <button
                className="btn"
                style={{
                  background: COLOR_ACCENT,
                  color: '#222',
                  border: 'none'
                }}
                onClick={onLogout}
              >Logout</button>
            </>
          ) : null}
        </div>
      </nav>
    </header>
  );
}

function AuthForm({ mode, onModeChange, onSubmit, submitting, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="auth-ct" style={{
      maxWidth: 380,
      background: 'var(--bg-secondary, #fff)',
      margin: 'auto',
      borderRadius: 16,
      marginTop: 40,
      boxShadow: '0 2px 16px #0001',
      padding: 32
    }}>
      <h2 style={{margin:0, color: COLOR_PRIMARY}}>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
      <form
        style={{display:'flex',flexDirection:'column',marginTop:18}}
        onSubmit={e => { e.preventDefault(); onSubmit(username, password); }}
      >
        <label style={{marginBottom:4}}>Username</label>
        <input
          autoFocus
          required
          value={username}
          autoComplete={mode}
          disabled={submitting}
          onChange={e => setUsername(e.target.value)}
          style={{
            border: `1px solid ${COLOR_PRIMARY}`,
            borderRadius: 8,
            padding: 8,
            marginBottom: 14
          }}
        />
        <label style={{marginBottom:4}}>Password</label>
        <input
          required
          type="password"
          value={password}
          autoComplete={mode}
          disabled={submitting}
          onChange={e => setPassword(e.target.value)}
          style={{
            border: `1px solid ${COLOR_PRIMARY}`,
            borderRadius: 8,
            padding: 8,
            marginBottom: 16
          }}
        />
        <button
          type="submit"
          className="btn"
          style={{
            background: COLOR_PRIMARY,
            color: '#fff',
            fontWeight: 600,
            marginBottom: 8
          }}
          disabled={submitting}
        >
          {submitting ? (mode === 'login' ? 'Logging in...' : 'Signing up...') : (mode === 'login' ? 'Login' : 'Sign Up')}
        </button>
      </form>
      <button
        className="btn"
        onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
        style={{
          background: 'none',
          color: COLOR_PRIMARY,
          border:'none',
          fontWeight: 600,
          textDecoration: 'underline',
          marginTop: 10
        }}
        disabled={submitting}
      >
        {mode === 'login' ? "Don't have an account? Sign Up" : "Already registered? Login"}
      </button>
      {error ? <div style={{
        color: '#b00', marginTop: 8, fontWeight: 600
      }}>{error}</div> : null}
    </div>
  );
}

function Sidebar({ notes, selectedNoteId, onSelect, onNewNote, searchQuery, setSearchQuery }) {
  return (
    <aside className="sidebar" style={{
      width: '100%',
      maxWidth: 300,
      minWidth: 180,
      background: 'var(--bg-secondary, #f8f9fa)',
      borderRight: `2px solid ${COLOR_PRIMARY}10`,
      padding: '2em 1em 1em',
      height: 'calc(100vh - 64px)',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }}>
      <button
        className="btn"
        onClick={onNewNote}
        style={{
          background: COLOR_ACCENT,
          color: '#fff',
          fontWeight: 700,
          border: 'none',
          borderRadius: 8,
          marginBottom: 8
        }}
      >+ New note</button>
      <input
        autoComplete="off"
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{
          border: `1px solid ${COLOR_PRIMARY}`,
          borderRadius: 6,
          marginBottom: 6,
          padding: '8px 8px'
        }}
      />
      <div className="note-list" style={{overflowY:'auto', flex:1}}>
        {notes.length === 0 ? (
          <div style={{ color: '#888', fontStyle: 'italic', marginTop:44 }}>No notes found.</div>
        ) : notes.map(note =>
          <SidebarNoteItem
            key={note._id}
            note={note}
            selected={note._id === selectedNoteId}
            onSelect={() => onSelect(note._id)}
          />
        )}
      </div>
    </aside>
  );
}

function SidebarNoteItem({ note, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      role="button"
      className="sidebar-note"
      style={{
        padding: '10px 10px',
        borderRadius: 8,
        background: selected ? COLOR_SECONDARY : 'transparent',
        cursor: 'pointer',
        marginBottom: 3,
        border: selected ? `2px solid ${COLOR_ACCENT}` : '2px solid transparent',
        fontWeight: selected ? 800 : 400,
        transition: 'background .14s,border .14s'
      }}
    >
      <div style={{
        fontWeight: 600,
        color: selected ? '#222' : COLOR_PRIMARY,
        fontSize: 16,
        maxWidth: '90%',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }}>{note.title || "Untitled Note"}</div>
      <div style={{
        color: '#888', fontSize: 12,
        maxWidth: '94%',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
        {note.updatedAt ? (new Date(note.updatedAt)).toLocaleString() : ''}
      </div>
    </div>
  );
}

function NoteEditor({ note, onSave, onDelete, saving }) {
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');
  useEffect(() => {
    setTitle(note ? note.title : '');
    setContent(note ? note.content : '');
  }, [note?._id]);
  if (!note) return <div style={{padding:40,fontSize:25,opacity:0.6}}>Select a note to view/edit.</div>;

  return (
    <div className="note-editor" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minWidth: 0,
      padding: 28
    }}>
      <input
        type="text"
        placeholder="Title"
        style={{
          border: `1.5px solid ${COLOR_PRIMARY}`, fontSize: 22,
          borderRadius: 8, padding: 8, marginBottom: 10, fontWeight: 700, width: '100%',
          outline: 'none'
        }}
        value={title}
        disabled={saving}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Start writing your note here..."
        style={{
          border: `1.5px solid ${COLOR_PRIMARY}`,
          borderRadius: 8,
          padding: 10,
          fontSize: 16,
          fontFamily: 'inherit',
          width: '100%',
          height: '260px',
          resize: "vertical",
          outline: 'none',
          marginBottom: 14
        }}
        value={content}
        disabled={saving}
        onChange={e => setContent(e.target.value)}
      />
      <div style={{display:'flex', gap:10}}>
        <button
          className="btn"
          style={{
            background: COLOR_PRIMARY,
            color:'#fff',
            fontWeight:700
          }}
          disabled={saving}
          onClick={() => onSave({...note, title, content})}
        >{saving ? "Saving..." : "Save"}</button>
        <button
          className="btn"
          style={{
            background: '#fff',
            color: COLOR_PRIMARY,
            fontWeight: 600,
            border: `1.5px solid ${COLOR_PRIMARY}`,
            marginLeft: 6
          }}
          disabled={saving}
          onClick={() => window.confirm('Delete this note?') && onDelete(note)}
        >Delete</button>
      </div>
    </div>
  );
}

// -----------------------------------------
// Util for auth and API requests
// -----------------------------------------
function saveToken(token, username) {
  localStorage.setItem('token', token);
  localStorage.setItem('username', username);
}
function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
}
function getToken() {
  return localStorage.getItem('token');
}
function getUsername() {
  return localStorage.getItem('username');
}

async function apiFetch(path, { method = 'GET', token, body, query } = {}) {
  let url = API_BASE + path;
  if (query) {
    const params = new URLSearchParams(query).toString();
    url += `?${params}`;
  }
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? {'Content-Type': 'application/json'} : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (fetchErr) {
    // Handle CORS, network, HTTPS/HTTP errors explicitly
    throw new Error(
      "Failed to reach backend API. This is usually a network, CORS, or HTTP/HTTPS/protocol mismatch error. " +
      "Please check that your REACT_APP_BACKEND_URL in .env uses the correct protocol (https:// for cloud, http:// for local), host, and port, " +
      "and that the backend is running and accessible from your browser."
    );
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error (${res.status})`);
  }
  return res.json();
}

// -----------------------------------------
// Main App Component
// -----------------------------------------
function App() {
  // Theme support (light/dark)
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Auth state
  const [user, setUser] = useState(() =>
    getToken() && getUsername()
      ? { username: getUsername(), token: getToken() }
      : null
  );
  const [authMode, setAuthMode] = useState('login');
  const [isAuthLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState();

  // Notes state
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [editorLoading, setEditorLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notesError, setNotesError] = useState('');

  // Fetch notes on auth or search
  useEffect(() => {
    if (!user) { setNotes([]); return; }
    setNotesLoading(true);
    setNotesError('');
    apiFetch('/api/notes', {
      token: user.token,
      query: searchQuery ? { q: searchQuery } : undefined
    }).then(json => {
      setNotes(json && Array.isArray(json) ? json : []);
      // If after search, reset selection if not found
      if (selectedNoteId && !json.find(n => n._id === selectedNoteId))
        setSelectedNoteId(null);
    }).catch(err => {
      setNotesError('Failed to load notes.');
    }).finally(() => setNotesLoading(false));
    // eslint-disable-next-line
  }, [user, searchQuery]);

  // Load initial selection
  useEffect(() => {
    if (notes.length && !selectedNoteId) {
      setSelectedNoteId(notes[0]._id);
    }
    if (notes.length === 0) {
      setSelectedNoteId(null);
    }
    // eslint-disable-next-line
  }, [notes.length]);

  // -- Auth Actions --
  async function handleAuth(username, password) {
    setAuthLoading(true);
    setAuthError('');
    try {
      const resp = await apiFetch(`/api/${authMode}`, {
        method: 'POST',
        body: { username, password }
      });
      if (resp && resp.token) {
        saveToken(resp.token, username);
        setUser({ username, token: resp.token });
      } else {
        setAuthError('Invalid server response');
      }
    } catch (e) {
      // Detect our custom error and surface a friendlier prompt
      if (
        e.message &&
        e.message.includes("Failed to reach backend API. This is usually a network, CORS, or HTTP/HTTPS/protocol mismatch error")
      ) {
        setAuthError(
          <>
            <div>
              <b>Signup/Login failed:</b> Could not reach backend API. This is usually due to a network, CORS, or protocol (HTTP/HTTPS) mismatch.<br/>
              <ol>
                <li>
                  Make sure your <code>.env</code> file exists in <code>notes_frontend/</code>
                   and <code>REACT_APP_BACKEND_URL</code> is set to the <b>exact</b> backend URL
                   (including correct protocol and port, e.g., <code>https://...:3001</code>).
                </li>
                <li>
                  The backend server must be running and accessible from your browser.
                </li>
                <li>
                  If you are on cloud/CI, you <b>must</b> use <code>https://</code> for both frontend and backend.
                </li>
              </ol>
            </div>
          </>
        );
      } else {
        setAuthError(e.message || 'Login/Sign Up failed');
      }
    } finally {
      setAuthLoading(false);
    }
  }
  function handleLogout() {
    clearToken();
    setUser(null);
    setNotes([]);
    setSelectedNoteId(null);
    setNotesError('');
  }

  // -- Notes Actions --
  async function handleSaveNote(note) {
    setEditorLoading(true);
    try {
      let data;
      if (note._id) {
        data = await apiFetch(`/api/notes/${note._id}`, {
          method: 'PUT',
          token: user.token,
          body: { ...note, title: note.title||'', content: note.content||'' }
        });
      } else {
        data = await apiFetch('/api/notes', {
          method: 'POST',
          token: user.token,
          body: { title: note.title||'', content: note.content||'' }
        });
      }
      // Optimistic update
      const n = await apiFetch('/api/notes', { token: user.token, query: searchQuery ? {q:searchQuery}:undefined });
      setNotes(n && Array.isArray(n) ? n : []);
      setSelectedNoteId(data._id);
      setNotesError('');
    } catch (e) {
      setNotesError('Save failed: ' + (e.message||'Unknown Error'));
    } finally {
      setEditorLoading(false);
    }
  }
  async function handleDeleteNote(note) {
    setEditorLoading(true);
    try {
      await apiFetch(`/api/notes/${note._id}`, {
        method: 'DELETE',
        token: user.token
      });
      // Optimistic update
      const n = await apiFetch('/api/notes', { token: user.token, query: searchQuery ? {q:searchQuery}:undefined });
      setNotes(n && Array.isArray(n) ? n : []);
      setSelectedNoteId(n.length ? n[0]._id : null);
    } catch (e) {
      setNotesError('Delete failed: ' + (e.message||'Unknown Error'));
    } finally {
      setEditorLoading(false);
    }
  }
  function handleSelectNote(id) {
    setSelectedNoteId(id);
  }
  function handleNewNote() {
    setSelectedNoteId(null);
    // Note: creates a blank unsaved note in editor view
  }

  // Get current (selected or new) note
  let noteToEdit = null;
  if (selectedNoteId) {
    noteToEdit = notes.find(n => n._id === selectedNoteId) || null;
  } else if (!selectedNoteId && !notesLoading && user) {
    noteToEdit = { title:'', content:'' };
  }

  // Render
  if (!user) {
    // AUTH SCREEN
    return (
      <div className="App" style={{
        background: 'var(--bg-primary, #f6f9fa)', minHeight: '100vh'
      }}>
        <Header />
        <AuthForm
          mode={authMode}
          onModeChange={setAuthMode}
          onSubmit={handleAuth}
          submitting={isAuthLoading}
          error={authError}
        />
        <button
          className="theme-toggle"
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    );
  }

  // MAIN (app) SCREEN
  return (
    <div className="App" style={{
      background: 'var(--bg-primary, #fafbfc)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header user={user} onLogout={handleLogout} />
      <div className="main-content" style={{
        flex: 1,
        display:'flex',
        flexDirection:'row',
        minHeight:'calc(100vh - 64px)'
      }}>
        <Sidebar
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelect={handleSelectNote}
          onNewNote={handleNewNote}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="main-area" style={{
          flex:1,
          minWidth:0,
          background: 'var(--bg-primary, #fff)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {notesError && (
            <div style={{
              padding: '18px 0 0 13px',
              color: '#b00', fontWeight: 600, fontSize: 17
            }}>{notesError}</div>
          )}
          {notesLoading
            ? <div style={{
                fontSize:22,
                padding:60,
                color: COLOR_PRIMARY,
                fontWeight: 700
              }}>Loading notes...</div>
            : <NoteEditor
                note={noteToEdit}
                onSave={handleSaveNote}
                onDelete={handleDeleteNote}
                saving={editorLoading}
              />
          }
        </main>
      </div>
      <button
        className="theme-toggle"
        onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </div>
  );
}

export default App;
