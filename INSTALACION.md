# 🚀 GUÍA DE INSTALACIÓN

## Instalación Rápida (5 minutos)

### Prerequisitos
- Node.js v16.0.0+ 
- npm v8.0.0+
- Git (opcional)

### Paso 1: Descargar/Clonar

**Opción A: Clonar con Git**
```bash
git clone https://github.com/Cristobalgonzalez/owasp-juice-shop-local-ia-report.git
cd owasp-juice-shop-local-ia-report
```

**Opción B: Descargar ZIP**
1. Haz clic en `Code` → `Download ZIP`
2. Descomprime el archivo
3. Abre terminal en la carpeta

### Paso 2: Instalar Dependencias
```bash
cd vulnerable-app
npm install
```

### Paso 3: Ejecutar
```bash
npm start
```

**Resultado esperado:**
```
========================================
Aplicación vulnerable iniciada
Accede a: http://localhost:3000
========================================
```

### Paso 4: Abrir en Navegador
```
http://localhost:3000
```

---

## Instalación Detallada

### Windows

#### 1. Instalar Node.js
1. Descarga desde: https://nodejs.org/ (versión LTS)
2. Ejecuta instalador
3. Sigue pasos por defecto
4. Reinicia la computadora

#### 2. Verificar Instalación
```powershell
node --version
npm --version
```

#### 3. Descargar Proyecto
- Opción A: `git clone` (requiere Git)
- Opción B: Descargar ZIP desde GitHub

#### 4. Navegar a Carpeta
```powershell
cd ruta/del/proyecto/vulnerable-app
```

#### 5. Instalar y Ejecutar
```powershell
npm install
npm start
```

#### 6. Abrir Navegador
```
http://localhost:3000
```

---

### macOS

#### 1. Instalar Node.js con Homebrew
```bash
brew install node
```

O descarga desde: https://nodejs.org/

#### 2. Verificar
```bash
node --version
npm --version
```

#### 3. Descargar Proyecto
```bash
git clone https://github.com/Cristobalgonzalez/owasp-juice-shop-local-ia-report.git
cd owasp-juice-shop-local-ia-report
```

#### 4. Instalar y Ejecutar
```bash
cd vulnerable-app
npm install
npm start
```

#### 5. Abrir Navegador
```
http://localhost:3000
```

---

### Linux (Ubuntu/Debian)

#### 1. Instalar Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### 2. Verificar
```bash
node --version
npm --version
```

#### 3. Descargar Proyecto
```bash
git clone https://github.com/Cristobalgonzalez/owasp-juice-shop-local-ia-report.git
cd owasp-juice-shop-local-ia-report
```

#### 4. Instalar y Ejecutar
```bash
cd vulnerable-app
npm install
npm start
```

#### 5. Abrir Navegador
```
http://localhost:3000
```

---

## Solución de Problemas

### Error: "puerto 3000 en uso"
```bash
# Encuentra el proceso
lsof -i :3000  (macOS/Linux)
netstat -ano | findstr :3000  (Windows)

# Mata el proceso
kill -9 <PID>  (macOS/Linux)
taskkill /PID <PID> /F  (Windows)
```

### Error: "npm: comando no encontrado"
- Verifica que npm está instalado: `npm --version`
- Reinicia la terminal
- Reinstala Node.js

### Error: "módulos no encontrados"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "EACCES: permission denied"
```bash
sudo npm install
```

### Interfaz web no carga
1. Verifica: http://localhost:3000
2. Limpia caché: Ctrl+Shift+Delete
3. Intenta incógnito: Ctrl+Shift+N
4. Verifica que npm start está corriendo

---

## Verificación de Instalación

### Todos los Servicios
```bash
# Node.js
node --version

# npm
npm --version

# Servidor corriendo
curl http://localhost:3000

# Git (si lo instalaste)
git --version
```

### Resultado Esperado
```
v22.16.0
10.9.2
(HTML de la página)
git version 2.43.0
```

---

## Configuración Avanzada

### Variables de Entorno
Crea archivo `.env` en `vulnerable-app/`:
```
NODE_ENV=development
PORT=3000
DEBUG=true
```

### Puerto Personalizado
En `server.js`, cambia:
```javascript
const PORT = 3001; // En lugar de 3000
```

### Base de Datos
Por defecto usa SQLite en memoria. Para persistencia:
```javascript
const db = new sqlite3.Database('./database.db');
```

---

## Actualizar Dependencias

### Verificar versiones
```bash
npm outdated
```

### Actualizar todos
```bash
npm update
```

### Actualizar específico
```bash
npm install express@latest
```

### Audit de seguridad
```bash
npm audit
npm audit fix
```

---

## Deshabilitar Servidor

### Detener Temporal
En la terminal donde corre npm:
```bash
Ctrl + C
```

### Para Borrar Todo
```bash
# Desinstalar
npm uninstall -g npm

# O simplemente borrar carpetas
rm -rf vulnerable-app/node_modules
rm package-lock.json
```

---

## Instalación en Docker (Opcional)

Si tienes Docker instalado:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY vulnerable-app/ .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
```

Construir y ejecutar:
```bash
docker build -t owasp-app .
docker run -p 3000:3000 owasp-app
```

---

## Instalación en Hosting Online

### Requiere:
- Servidor con Node.js
- Acceso SSH o Control Panel
- Dominio (opcional)

### Pasos:
1. Sube archivos vía FTP/Git
2. `npm install` en servidor
3. Usa PM2 o similar para mantener corriendo
4. Configura HTTPS

**NO RECOMENDADO EN PRODUCCIÓN** (es vulnerable)

---

## Verificación Final

Cuando todo esté instalado, deberías:

✅ Ver: "Aplicación vulnerable iniciada"  
✅ Acceder: http://localhost:3000  
✅ Ver: Interfaz morada con 8 secciones  
✅ Poder: Hacer clic en cada vulnerabilidad  

Si todo funciona, ¡estás listo para comenzar!

---

## Soporte de Instalación

- 📖 Consulta: BIENVENIDA.md
- 💬 Issues en GitHub
- 🔍 Busca: error específico + Stack Overflow

---

**¡Listo para empezar!** 🎉
