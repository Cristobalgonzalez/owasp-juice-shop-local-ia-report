# 🔒 ANÁLISIS DE SEGURIDAD OWASP TOP 10

## 📌 Descripción

Este proyecto contiene una **aplicación web deliberadamente vulnerable** diseñada para enseñar sobre seguridad en aplicaciones web según el estándar **OWASP Top 10 2021**.

Incluye:
- ✅ Aplicación Node.js/Express con 8 vulnerabilidades críticas
- ✅ Interfaz web interactiva para testear cada vulnerabilidad
- ✅ Análisis detallado de cada hallazgo
- ✅ Documentación profesional
- ✅ Código vulnerable vs código seguro

**⚠️ USO EDUCATIVO ÚNICAMENTE - NO USES EN PRODUCCIÓN**

---

## 🎯 Estructura del Proyecto

```
juice-shop-analisis-owasp/
├── vulnerable-app/              # Aplicación web vulnerable
│   ├── server.js               # Backend Express (vulnerabilidades)
│   ├── public/
│   │   └── index.html          # Interfaz interactiva
│   └── package.json            # Dependencias
├── ANALISIS_OWASP_TOP10.md    # Análisis detallado (8 vulnerabilidades)
├── GUIA_PRACTICA_ANALISIS.md  # Guía paso a paso
├── REPORTE_FINAL.html         # Reporte profesional (HTML)
├── START.bat                   # Script para iniciar app
├── README.md                   # Este archivo
└── juice-shop/                # Repositorio OWASP Juice Shop (opcional)
```

---

## ⚡ Inicio Rápido

### Opción 1: Usar Script (Windows)

```powershell
# Doble click en START.bat
# O en terminal:
START.bat
```

### Opción 2: Manual

```powershell
# Terminal PowerShell
cd c:\Users\rock_\Desktop\juice-shop-analisis-owasp\vulnerable-app
npm start
```

**Salida esperada:**
```
========================================
Aplicación vulnerable iniciada
Accede a: http://localhost:3000
========================================
```

### Paso 3: Abrir en Navegador

```
http://localhost:3000
```

---

## 🔍 Vulnerabilidades Incluidas

### 1. 🔴 SQL INJECTION (A01:2021 - Injection)
- **Endpoint**: `GET /users/search?username=...`
- **Payload**: `admin' -- ` o `' UNION SELECT ...`
- **Impacto**: Acceso a todos los datos

### 2. 🔴 BROKEN AUTHENTICATION (A07:2021)
- **Endpoint**: `POST /login`
- **Problema**: Tokens predecibles (base64 simple)
- **Impacto**: Suplantación de identidad

### 3. 🟠 CROSS-SITE SCRIPTING - XSS (A03:2021)
- **Endpoint**: `GET /profile`
- **Payload**: `<img src=x onerror="alert('xss')">`
- **Impacto**: Robo de sesiones

### 4. 🟠 INSECURE DIRECT OBJECT REFERENCES - IDOR (A01:2021)
- **Endpoint**: `GET /notes/:id`
- **Problema**: Sin validación de propiedad
- **Impacto**: Acceso a datos de otros usuarios

### 5. 🟠 SECURITY MISCONFIGURATION (A05:2021)
- **Endpoint**: `GET /debug`
- **Expone**: Secret keys y información sensible
- **Impacto**: Compromiso de seguridad completo

### 6. 🟠 SENSITIVE DATA EXPOSURE (A02:2021)
- **Endpoint**: `GET /api/user/:id`
- **Problema**: Retorna hashes de password
- **Impacto**: Información sensible expuesta

### 7. 🟠 MISSING ACCESS CONTROLS (A01:2021)
- **Endpoint**: `POST /admin/users`
- **Problema**: Sin validación de permisos
- **Impacto**: Escalación a admin

### 8. 🟡 USING COMPONENTS WITH KNOWN VULNERABILITIES (A06:2021)
- **Herramienta**: `npm audit`
- **Problema**: Dependencias potencialmente vulnerables
- **Impacto**: Explotación de vulnerabilidades conocidas

---

## 📚 Documentación

### 📄 ANÁLISIS_OWASP_TOP10.md
Análisis completo de cada vulnerabilidad con:
- Descripción detallada
- Código vulnerable
- Impacto en confidencialidad/integridad/disponibilidad
- Ejemplos de ataque
- Código seguro (correcciones)
- Referencias CWE/CVE

### 🎓 GUIA_PRACTICA_ANALISIS.md
Guía paso a paso para:
1. Iniciar la aplicación
2. Reproducir cada vulnerabilidad
3. Documentar hallazgos
4. Capturar evidencia
5. Crear reporte

### 🎨 REPORTE_FINAL.html
Reporte profesional HTML con:
- Portada formal
- Resumen ejecutivo
- Tabla de hallazgos
- Análisis detallado
- Plan de remediación
- Referencias

---

## 🧪 Casos de Uso

### Para Estudiantes

```markdown
1. Abrir http://localhost:3000
2. Seguir GUIA_PRACTICA_ANALISIS.md
3. Reproducir cada vulnerabilidad
4. Documentar hallazgos
5. Crear reporte basado en REPORTE_FINAL.html
```

### Para Docentes

```markdown
1. Preparar el entorno
2. Mostrar cada vulnerabilidad en clase
3. Explicar usando ANALISIS_OWASP_TOP10.md
4. Que estudiantes encuentren por sí mismos
5. Comparar con código seguro
```

### Para Auditores

```markdown
1. Ejecutar la aplicación
2. Usar DevTools del navegador
3. Testear cada endpoint
4. Documentar en formato profesional
5. Generar reporte
```

---

## 🛠️ Requisitos

- **Node.js** v16.0.0 o superior
- **npm** v8.0.0 o superior
- **Navegador web** (Chrome, Firefox, Edge)
- **VS Code** (opcional pero recomendado)

### Verificar Requisitos

```powershell
node --version
npm --version
```

---

## 📖 Cómo Usar la Interfaz Web

### Sección 1: SQL Injection
- Campo: `Buscar usuario`
- Prueba: `admin' --`
- Resultado: Ver admin sin búsqueda válida

### Sección 2: Login (Broken Auth)
- Credenciales: `admin` / `password123`
- Resultado: Token en base64 (`MQ==`)
- Nota: Ver logs en terminal

### Sección 3: XSS
- Click: "Ver Perfil"
- Nota: HTML sin escapar

### Sección 4: IDOR
- ID: `1`
- Resultado: Nota privada del admin

### Sección 5: Debug Info
- Click: "Ver Información"
- Resultado: Secret keys expuestas

### Sección 6: Datos de Usuario
- ID: `1`
- Resultado: Password hash visible

### Sección 7: Panel Admin
- Sin autenticación
- Crear usuario como admin

### Sección 8: Componentes
- Ver versiones con vulnerabilidades

---

## 🔐 Código Vulnerable vs Seguro

### Ejemplo: SQL Injection

**❌ Vulnerable:**
```javascript
const query = `SELECT * FROM users WHERE username = '${username}'`;
```

**✅ Seguro:**
```javascript
const query = `SELECT * FROM users WHERE username = ?`;
db.get(query, [username], callback);
```

### Ejemplo: Authentication

**❌ Vulnerable:**
```javascript
const token = Buffer.from(user.id.toString()).toString('base64');
```

**✅ Seguro:**
```javascript
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
```

---

## 📊 Matriz de Riesgo

| Vulnerabilidad | Severidad | Probabilidad | Impacto |
|---|---|---|---|
| SQL Injection | 🔴 CRÍTICA | Alto | Datos comprometidos |
| Broken Auth | 🔴 CRÍTICA | Alto | Suplantación |
| XSS | 🟠 ALTA | Medio | Robo sesión |
| IDOR | 🟠 ALTA | Medio | Acceso no autorizado |
| Misconfig | 🟠 ALTA | Bajo | Información expuesta |
| Data Exposure | 🟠 ALTA | Bajo | Privacidad |
| Missing Controls | 🟠 ALTA | Alto | Escalación |
| Components | 🟡 MEDIA | Bajo | RCE potencial |

---

## 🎓 Preguntas de Aprendizaje

1. ¿Por qué `prepared statements` previenen SQL injection?
2. ¿Cómo decodificar `MQ==` de base64?
3. ¿Cuál es la diferencia entre escapar HTML y CSP?
4. ¿Por qué IDOR permite enumeración de IDs?
5. ¿Qué información sensible NO debe exponerse?
6. ¿Cómo implementar control de acceso basado en roles?
7. ¿Qué es un "prepared statement"?
8. ¿Por qué las credenciales en logs son problemáticas?

---

## 🚀 Próximos Pasos

1. **Completar el análisis** de las 8 vulnerabilidades
2. **Documentar con pantallas** de cada hallazgo
3. **Crear reporte profesional** (ver REPORTE_FINAL.html)
4. **Proponer correcciones** para cada vulnerabilidad
5. **Entregar trabajo** con análisis completo

---

## 📞 Soporte

### Problemas Comunes

**Q: El puerto 3000 está en uso**
```powershell
# Matar proceso
lsof -i :3000
kill -9 <PID>

# O usar otro puerto en server.js
const PORT = 3001;
```

**Q: No aparece la interfaz web**
- Verificar que el servidor esté corriendo
- Limpiar cache del navegador (Ctrl+Shift+Del)
- Abrir http://localhost:3000 en incógnito

**Q: npm install falla**
```powershell
npm cache clean --force
npm install
```

---

## 📝 Licencia

Proyecto educativo basado en OWASP Top 10  
Uso permitido para fines de enseñanza y aprendizaje

---

## 🙏 Créditos

- OWASP Foundation
- OWASP Top 10
- Comunidad de seguridad

---

**¡Éxito en tu análisis de seguridad!** 🎯

