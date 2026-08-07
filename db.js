const fs = require('fs');
const path = require('path');

const file = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.join(__dirname, 'data.json');

function load() {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { users: [], notes: [], _meta: { nextUserId: 1, nextNoteId: 1 } };
  }
}

function save(db) {
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
}

const db = load();

module.exports = {
  file,
  getUserByUsername(username) {
    return db.users.find(u => u.username === username) || null;
  },
  createUser(username, password) {
    if (db.users.find(u => u.username === username)) throw new Error('exists');
    const id = db._meta.nextUserId++;
    const user = { id, username, password, created_at: new Date().toISOString() };
    db.users.push(user);
    save(db);
    return user;
  },
  getNotesByUser(userId) {
    return db.notes.filter(n => n.user_id === userId).sort((a,b)=>b.created_at.localeCompare(a.created_at));
  },
  createNote(userId, title, body) {
    const id = db._meta.nextNoteId++;
    const note = { id, user_id: userId, title, body, created_at: new Date().toISOString() };
    db.notes.push(note);
    save(db);
    return note;
  },
  updateNote(userId, id, title, body) {
    const note = db.notes.find(n => n.id === id && n.user_id === userId);
    if (!note) return null;
    note.title = title;
    note.body = body;
    save(db);
    return note;
  },
  deleteNote(userId, id) {
    const idx = db.notes.findIndex(n => n.id === id && n.user_id === userId);
    if (idx === -1) return false;
    db.notes.splice(idx,1);
    save(db);
    return true;
  }
};
