document.addEventListener('DOMContentLoaded', () => {
  const notesList = document.getElementById('notesList');
  const noteForm = document.getElementById('noteForm');
  const message = document.getElementById('message');
  const searchInput = document.getElementById('searchInput');

  const API_BASE = "https://notes-backend-mfjc.onrender.com/api";
  const token = localStorage.getItem('token');

  if (!token) {
    message.textContent = "You must be logged in to view notes.";
    window.location.href = "login.html";
    return;
  }

  let allNotes = [];

  async function fetchNotes() {
    try {
      const res = await fetch(`${API_BASE}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (res.ok) {
        allNotes = data;
        renderNotes(allNotes);
      } else {
        message.textContent = data.message;
      }
    } catch {
      message.textContent = "Error fetching notes.";
    }
  }

  function renderNotes(notes) {
    notesList.innerHTML = "";

    notes.forEach(note => {
      const li = document.createElement('li');

      li.innerHTML = `
        <div class="note-content">
          <h3 class="note-title">${note.title}</h3>
          <p class="note-description">${note.description}</p>
          <p class="note-created">Created: ${new Date(note.createdAt).toLocaleString()} </p>
          <p class="note-updated">Updated: ${new Date(note.updatedAt).toLocaleString()} </p>
        </div>

        <div class="note-actions">
          <button onclick="startEdit('${note._id}')">Edit</button>
          <button onclick="deleteNote('${note._id}')">Delete</button>
        </div>
      `;

      notesList.appendChild(li);
    });
  }

  if (noteForm) {
    noteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;

      try {
        const res = await fetch(`${API_BASE}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ title, description })
        });

        const data = await res.json();

        if (res.ok) {
          noteForm.reset();
          fetchNotes();
        } else {
          message.textContent = data.message;
        }
      } catch {
        message.textContent = "Error creating note.";
      }
    });
  }

  window.deleteNote = async function (id) {
    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        fetchNotes();
      }
    } catch {
      message.textContent = "Error deleting note.";
    }
  };

  window.startEdit = function (id) {
    const note = allNotes.find(n => n._id === id);
    if (!note) return;

    const li = [...notesList.children].find(child =>
      child.querySelector(".note-title")?.textContent === note.title
    );

    li.innerHTML = `
      <input type="text" id="edit-title-${id}" value="${note.title}" />
      <textarea id="edit-desc-${id}">${note.description}</textarea>
      <div class="note-actions">
        <button onclick="saveEdit('${id}')">Save</button>
        <button onclick="fetchNotes()">Cancel</button>
      </div>
    `;
  };

  window.saveEdit = async function (id) {
    const newTitle = document.getElementById(`edit-title-${id}`).value;
    const newDescription = document.getElementById(`edit-desc-${id}`).value;

    try {
      const res = await fetch(`${API_BASE}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle, description: newDescription })
      });

      if (res.ok) {
        fetchNotes();
      }
    } catch {
      message.textContent = "Error updating note.";
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const value = searchInput.value.toLowerCase();

      const filtered = allNotes.filter(note =>
        note.title.toLowerCase().includes(value) ||
        note.description.toLowerCase().includes(value)
      );

      renderNotes(filtered);
    });
  }

  fetchNotes();
});