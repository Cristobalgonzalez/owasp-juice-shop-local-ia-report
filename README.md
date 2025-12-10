# 🔒 OWASP Top 10 - Análisis de Seguridad Completo

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-v22.16.0-green)
![npm](https://img.shields.io/badge/npm-10.9.2-blue)
![Status](https://img.shields.io/badge/Status-Educational-yellow)

> **Proyecto educativo completo para aprender sobre las 8 vulnerabilidades más críticas de OWASP Top 10 2021**

---

## 🎯 ¿Qué es este Proyecto?

Este repositorio contiene:

- ✅ **Aplicación Web Vulnerable** - Node.js/Express deliberadamente vulnerable
- ✅ **8 Vulnerabilidades OWASP** - Implementadas y listas para testear
- ✅ **Interfaz Interactiva** - Web morada con 8 secciones de pruebas
- ✅ **Documentación Completa** - 5000+ líneas en español
- ✅ **Análisis Profundo** - Técnicas, payloads y correcciones
- ✅ **Reporte Profesional** - Plantilla HTML lista para entregar

**⚠️ Uso educativo únicamente. NO usar en producción.**

---

## 📊 Vulnerabilidades OWASP Top 10 Incluidas

| # | Vulnerabilidad | Endpoint | Severidad | Estado |
|---|---|---|---|---|
| 1 | SQL Injection (A01:2021) | `/users/search` | 🔴 CRÍTICA | ✅ |
| 2 | Broken Authentication (A07:2021) | `/login` | 🔴 CRÍTICA | ✅ |
| 3 | Cross-Site Scripting - XSS (A03:2021) | `/profile` | 🟠 ALTA | ✅ |
| 4 | Insecure Direct Object References (A01:2021) | `/notes/:id` | 🟠 ALTA | ✅ |
| 5 | Security Misconfiguration (A05:2021) | `/debug` | 🟠 ALTA | ✅ |
| 6 | Sensitive Data Exposure (A02:2021) | `/api/user/:id` | 🟠 ALTA | ✅ |
| 7 | Missing Access Controls (A01:2021) | `/admin/users` | 🟠 ALTA | ✅ |
| 8 | Using Components with Vulnerabilities (A06:2021) | `npm audit` | 🟡 MEDIA | ✅ |

---

## 🚀 Inicio Rápido (3 Pasos)

### 1️⃣ Clonar el Repositorio
```bash
git clone https://github.com/Cristobalgonzalez/owasp-juice-shop-local-ia-report.git
cd owasp-juice-shop-local-ia-report
```

### 2️⃣ Instalar Dependencias
```bash
cd vulnerable-app
npm install
```

### 3️⃣ Ejecutar la Aplicación
```bash
npm start
```

**Accede a:** `http://localhost:3000`

---

## 📚 Documentación

### Para Estudiantes
- 📖 **BIENVENIDA.md** - Comienza aquí (5 min)
- 📖 **GUIA_PRACTICA_ANALISIS.md** - Paso a paso (2 horas)
- 📖 **CHECKLIST_TRABAJO_COMPLETO.md** - Seguimiento

### Para Profundizar
- 📖 **ANALISIS_OWASP_TOP10.md** - Análisis técnico (1200+ líneas)
- 📖 **EJEMPLOS_CURL_DEVTOOLS.md** - Ejemplos prácticos
- 📖 **INDICE_COMPLETO.md** - Mapa de navegación

### Para Entregar
- 🎨 **REPORTE_FINAL.html** - Plantilla profesional

---

## 📁 Estructura del Proyecto

```
owasp-juice-shop-local-ia-report/
│
├── vulnerable-app/                    # 🌐 Aplicación Web
│   ├── server.js                      # Backend Express (200+ líneas)
│   ├── public/
│   │   └── index.html                 # Interfaz web (300+ líneas)
│   ├── package.json                   # Dependencias
│   └── node_modules/                  # 199 paquetes instalados
│
├── 📖 DOCUMENTACIÓN
│   ├── BIENVENIDA.md                  # Orientación inicial
│   ├── README.md                      # Este archivo (GitHub)
│   ├── GUIA_PRACTICA_ANALISIS.md     # Paso a paso (600+ líneas)
│   ├── ANALISIS_OWASP_TOP10.md       # Análisis profundo (1200+ líneas)
│   ├── EJEMPLOS_CURL_DEVTOOLS.md     # Ejemplos prácticos
│   ├── CHECKLIST_TRABAJO_COMPLETO.md # Checklist
│   ├── INDICE_COMPLETO.md            # Índice
│   ├── RESUMEN_PROYECTO.md           # Resumen
│   └── PROYECTO_COMPLETADO.md        # Estado del proyecto
│
├── 🎨 REPORTE
│   └── REPORTE_FINAL.html             # Plantilla profesional (800+ líneas)
│
├── 🔧 UTILIDADES
│   ├── START.bat                      # Script de inicio (Windows)
│   ├── PANEL_CONTROL.txt              # Panel de estado
│   └── .gitignore                     # Configuración Git
│
└── 📦 CONFIGURACIÓN
    └── package.json                   # Metadatos del proyecto
```

---

## 💻 Requisitos del Sistema

- **Node.js**: v16.0.0 o superior (v22.16.0 recomendado)
- **npm**: v8.0.0 o superior (10.9.2 recomendado)
- **Sistema Operativo**: Windows, macOS o Linux
- **Navegador**: Chrome, Firefox o Edge
- **Espacio en Disco**: ~500 MB

### Verificar Requisitos
```bash
node --version    # v22.16.0
npm --version     # 10.9.2
```

---

## 🎓 Cómo Usar Este Proyecto

### Para Estudiantes
```
1. Lee: BIENVENIDA.md (5 min)
2. Abre: http://localhost:3000
3. Sigue: GUIA_PRACTICA_ANALISIS.md
4. Documenta: Cada vulnerabilidad
5. Crea: Tu reporte usando REPORTE_FINAL.html
6. Entrega: Tu análisis
```

### Para Docentes
```
1. Prepara el entorno (instalación)
2. Explica: Usando ANALISIS_OWASP_TOP10.md
3. Que practiquen: Los estudiantes
4. Valida: Con CHECKLIST_TRABAJO_COMPLETO.md
```

### Para Investigadores
```
1. Lee: ANALISIS_OWASP_TOP10.md
2. Experimenta: Con EJEMPLOS_CURL_DEVTOOLS.md
3. Automatiza: Usando los scripts
4. Documenta: Tus hallazgos
```

---

## 🔍 Ejemplos de Vulnerabilidades

### 1. SQL Injection
```bash
# Busca: admin' --
GET /users/search?username=admin' --

# Resultado: Datos del admin sin validación
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com"
}
```

### 2. Broken Authentication
```bash
# Login
POST /login
Body: {"username": "admin", "password": "password123"}

# Token débil retornado: MQ== (base64 para "1")
{
  "success": true,
  "token": "MQ=="
}
```

### 3. XSS - Cross-Site Scripting
```html
<!-- Payload -->
<img src=x onerror="alert('XSS Vulnerable!')">

<!-- Se ejecutaría en navegador del usuario -->
```

---

## 📊 Estadísticas del Proyecto

```
DOCUMENTACIÓN
├─ 9 archivos (5000+ líneas)
├─ 15+ ejemplos de código
├─ 100,000+ caracteres
└─ 100% en español

APLICACIÓN
├─ 200+ líneas de código backend
├─ 300+ líneas de interfaz web
├─ 8 vulnerabilidades implementadas
└─ 199 paquetes instalados

CARGA DE TRABAJO
├─ Lectura: 2-3 horas
├─ Práctica: 2-3 horas
├─ Análisis: 1 hora
└─ Total: 5-6 horas aprox.
```

---

## ⏱️ Tiempo Estimado

| Actividad | Tiempo |
|---|---|
| Lectura de documentación | 30 min |
| Reproducir 8 vulnerabilidades | 90 min |
| Capturar evidencia | 30 min |
| Análisis profundo | 60 min |
| Creación de reporte | 120 min |
| Revisión final | 30 min |
| **TOTAL** | **~360 min (6 horas)** |

---

## 🛠️ Herramientas y Tecnologías

### Backend
- **Express.js** 4.18.2 - Framework web
- **SQLite3** 5.1.6 - Base de datos
- **bcryptjs** 2.4.3 - Hash de contraseñas
- **body-parser** 1.20.2 - Parseo de requests

### Frontend
- HTML5
- CSS3
- JavaScript Vanilla

### Herramientas Incluidas
- cURL - Peticiones HTTP desde terminal
- Postman Collection - Requests pre-configuradas
- DevTools - Inspección del navegador
- PowerShell - Automatización

---

## 📖 Contenido de Documentación

### BIENVENIDA.md
- Orientación del proyecto
- Resumen ejecutivo
- Próximos pasos

### GUIA_PRACTICA_ANALISIS.md
- Paso a paso por cada vulnerabilidad
- Cómo reproducirlas
- Dónde capturar evidencia
- Cómo documentar hallazgos

### ANALISIS_OWASP_TOP10.md
- Análisis técnico profundo (1200+ líneas)
- Código vulnerable mostrado
- Código seguro explicado
- Impacto y CWE/CVE

### EJEMPLOS_CURL_DEVTOOLS.md
- Ejemplos con cURL
- Scripts PowerShell
- Collection Postman
- DevTools tutorial

### REPORTE_FINAL.html
- Plantilla profesional
- Diseño elegante
- Listo para personalizar
- Imprimible

---

## 🎯 Objetivos de Aprendizaje

Al completar este proyecto aprenderás:

✅ Las 8 vulnerabilidades OWASP Top 10 más críticas  
✅ Cómo reproducir ataques reales  
✅ Diferencia entre código vulnerable y seguro  
✅ Cómo documentar hallazgos profesionalmente  
✅ Mejores prácticas de seguridad web  
✅ Impacto real de vulnerabilidades  
✅ Herramientas de penetration testing  
✅ Estándares OWASP y CWE/CVE  

---

## ❓ Preguntas Frecuentes

### P: ¿Dónde empiezo?
**R:** Comienza con `BIENVENIDA.md` (5 minutos)

### P: ¿Cuánto tiempo toma?
**R:** 5-6 horas para completar todo

### P: ¿Es seguro ejecutar esto?
**R:** Sí, solo funciona en `localhost:3000`

### P: ¿Puedo usarlo en producción?
**R:** NO. Es solo para educación y testing local.

### P: ¿Necesito instalar Git?
**R:** Solo si quieres clonar. También puedes descargar ZIP.

---

## 🚨 Advertencias de Seguridad

⚠️ **IMPORTANTE:**
- Esta aplicación es **DELIBERADAMENTE VULNERABLE**
- Solo debe usarse en **desarrollo local**
- NUNCA en producción
- NUNCA en servidores reales
- NUNCA en sitios que no controles
- Para **educación únicamente**

---

## 📝 Licencia

MIT License - Ver archivo LICENSE para detalles

```
Este proyecto se proporciona "tal cual" para fines educativos.
Los autores no son responsables de mal uso.
```

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea tu rama de features (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📞 Contacto y Soporte

### Documentación
- 📖 Todos los archivos `.md` incluyen guías completas
- 🎨 Plantilla HTML incluida para reportes
- 📋 Checklist para seguimiento

### Referencias
- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [CWE - Common Weakness Enumeration](https://cwe.mitre.org/)

---

## 🎉 Créditos

- **OWASP Foundation** - Estándares y guías
- **Comunidad de Seguridad** - Mejores prácticas
- **Desarrolladores** - Implementación local

---

## 🏆 Casos de Uso

- 🎓 **Educación** - Aprender sobre seguridad web
- 👨‍🏫 **Docencia** - Enseñar OWASP
- 🔍 **Investigación** - Analizar vulnerabilidades
- 💼 **Auditoría** - Crear reportes profesionales
- 🎯 **Entrenamiento** - Capacitación en seguridad

---

## 📈 Roadmap Futuro

- [ ] Adicionar más vulnerabilidades OWASP
- [ ] Integración con BURP Suite
- [ ] Dashboard de seguridad
- [ ] Automatización de pruebas
- [ ] Versión en Docker

---

## ⭐ Si te Gustó Este Proyecto

Déjanos una ⭐ en GitHub para apoyarnos

---

**¡Gracias por usar este proyecto educativo!** 🎉

**Para comenzar:** `npm start` en `vulnerable-app/`

**URL:** `http://localhost:3000`

