const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    // Crear tabla de usuarios
    db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT,
    role TEXT DEFAULT 'user'
  )`);

    // Crear tabla de notas
    db.run(`CREATE TABLE notes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    title TEXT,
    content TEXT
  )`);

    // Insertar usuario demo
    const hashedPassword = bcrypt.hashSync('password123', 10);
    db.run(`INSERT INTO users (username, password, email, role) 
          VALUES ('admin', ?, 'admin@example.com', 'admin')`, [hashedPassword]);

    db.run(`INSERT INTO users (username, password, email, role) 
          VALUES ('user1', ?, 'user1@example.com', 'user')`,
        [bcrypt.hashSync('user123', 10)]);

    db.run(`INSERT INTO notes (user_id, title, content) 
          VALUES (1, 'Admin Notes', 'Configuración del servidor')`);
});

let loggedInUser = null;

// ============================================
// VULNERABILIDAD 1: SQL INJECTION
// ============================================
app.get('/users/search', (req, res) => {
    const username = req.query.username;

    // VULNERABLE: No usa prepared statements
    const query = `SELECT id, username, email FROM users WHERE username = '${username}'`;

    db.get(query, (err, row) => {
        if (err) {
            return res.json({ error: err.message });
        }
        res.json(row || { message: 'Usuario no encontrado' });
    });
});

// ============================================
// VULNERABILIDAD 2: BROKEN AUTHENTICATION
// ============================================
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // VULNERABLE: Sin validación, credenciales en logs
    console.log(`[LOG] Login attempt - Username: ${username}, Password: ${password}`);

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) return res.json({ error: err.message });

        if (!user) {
            return res.json({ error: 'Usuario no encontrado' });
        }

        if (bcrypt.compareSync(password, user.password)) {
            loggedInUser = user;
            // VULNERABLE: Token sin validación
            res.json({
                success: true,
                token: Buffer.from(user.id.toString()).toString('base64')
            });
        } else {
            res.json({ error: 'Contraseña incorrecta' });
        }
    });
});

// ============================================
// VULNERABILIDAD 3: CROSS-SITE SCRIPTING (XSS)
// ============================================
app.get('/profile', (req, res) => {
    if (!loggedInUser) {
        return res.send('<h1>No autenticado</h1>');
    }

    // VULNERABLE: Renderiza datos del usuario sin sanitizar
    const html = `
    <!DOCTYPE html>
    <html>
    <head><title>Perfil</title></head>
    <body>
      <h1>Perfil de Usuario</h1>
      <p>Username: ${loggedInUser.username}</p>
      <p>Email: ${loggedInUser.email}</p>
      <script>
        // Usuario podría inyectar: admin" onload="alert('XSS')" x="
      </script>
    </body>
    </html>
  `;
    res.send(html);
});

// ============================================
// VULNERABILIDAD 4: INSECURE DIRECT OBJECT REFERENCES (IDOR)
// ============================================
app.get('/notes/:id', (req, res) => {
    const noteId = req.params.id;

    // VULNERABLE: No verifica si el usuario es dueño de la nota
    db.get(`SELECT * FROM notes WHERE id = ?`, [noteId], (err, note) => {
        if (err) return res.json({ error: err.message });
        res.json(note || { message: 'Nota no encontrada' });
    });
});

// ============================================
// VULNERABILIDAD 5: SECURITY MISCONFIGURATION
// ============================================
app.get('/debug', (req, res) => {
    // VULNERABLE: Endpoint de debug expuesto
    res.json({
        environment: process.env.NODE_ENV,
        databasePath: ':memory:',
        secretKey: 'super-secret-key-12345',
        users: 'SELECT * FROM users' // Información sensible
    });
});

// ============================================
// VULNERABILIDAD 6: SENSITIVE DATA EXPOSURE
// ============================================
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;

    db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, user) => {
        if (err) return res.json({ error: err.message });

        // VULNERABLE: Retorna contraseña en respuesta
        res.json(user);
    });
});

// ============================================
// VULNERABILIDAD 7: MISSING ACCESS CONTROLS
// ============================================
app.post('/admin/users', (req, res) => {
    const { username, email, role } = req.body;

    // VULNERABLE: Sin verificación de permisos
    if (!username || !email) {
        return res.status(400).json({ error: 'Campos requeridos' });
    }

    const hashedPassword = bcrypt.hashSync('default123', 10);
    db.run(
        `INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)`,
        [username, hashedPassword, email, role || 'user'],
        function (err) {
            if (err) return res.json({ error: err.message });
            res.json({ success: true, userId: this.lastID });
        }
    );
});

// ============================================
// VULNERABILIDAD 8: USING COMPONENTS WITH KNOWN VULNERABILITIES
// ============================================
app.get('/old-endpoint', (req, res) => {
    // Simula componentes con vulnerabilidades conocidas
    res.json({
        info: 'Este endpoint usa componentes que pueden tener vulnerabilidades',
        libraries: [
            'express@4.18.2',
            'sqlite3@5.1.6'
        ]
    });
});

// Rutas básicas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`Aplicación vulnerable iniciada`);
    console.log(`Accede a: http://localhost:${PORT}`);
    console.log(`========================================\n`);
});

module.exports = app;
