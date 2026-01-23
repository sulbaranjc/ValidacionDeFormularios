# 🪟 Guía Rápida - Script de Despliegue para Windows

## ⚡ Inicio Rápido (Quick Start)

```cmd
REM Simplemente hacer doble clic en el archivo o ejecutar desde CMD:
deploy-automation.bat

REM O especificar una rama:
deploy-automation.bat main
```

¡Eso es todo! El script hará el resto automáticamente.

---

## 📋 Requisitos Previos

### 1. Git for Windows
```cmd
REM Verificar si Git está instalado:
git --version

REM Si no está instalado, descargar desde:
REM https://git-scm.com/download/win
```

### 2. Configurar Git (Solo la primera vez)
```cmd
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### 3. Clonar el repositorio
```cmd
git clone https://github.com/sulbaranjc/ValidacionDeFormularios.git
cd ValidacionDeFormularios
```

---

## 🎯 Casos de Uso Comunes

### Caso 1: Desarrollo en rama `main`
```cmd
REM Cambiarte a main
git checkout main

REM Hacer cambios
notepad index.html
notepad css\styles.css

REM Ejecutar script (doble clic o desde CMD)
deploy-automation.bat

REM Resultado:
REM ✅ Commit en main
REM ✅ Push de main
REM ✅ Merge a deploy
REM ✅ Push de deploy
REM ✅ GitHub Actions despliega automáticamente
```

### Caso 2: Feature Branch
```cmd
REM Crear una nueva feature
git checkout -b feature/nueva-validacion

REM Desarrollar
notepad js\validation\rules.js

REM Desplegar directamente desde feature
deploy-automation.bat

REM El script detectará automáticamente que estás en feature/nueva-validacion
```

### Caso 3: Especificar Rama Manualmente
```cmd
REM Estás en cualquier rama pero quieres desplegar desde main
deploy-automation.bat main

REM O desde otra rama
deploy-automation.bat feature/mejoras
```

---

## 🎨 Características del Script Windows

### ✅ Lo que funciona igual que Linux:
- ✅ Detección automática de rama actual
- ✅ Commit de todos los cambios
- ✅ Push a repositorio remoto
- ✅ Merge a rama deploy
- ✅ Validaciones de seguridad
- ✅ Manejo de errores

### 🆕 Diferencias con la versión Linux:
- ✅ **Colores ANSI**: Windows 10/11 soporta colores nativamente
- ✅ **UTF-8**: Soporte completo para emojis (⚠️ ✅ ❌ ℹ️)
- ✅ **Doble clic**: Puedes ejecutarlo haciendo doble clic
- ✅ **PAUSE**: Pausa al final para ver resultados
- ✅ **Sintaxis CMD**: Adaptado a batch de Windows

---

## 📊 Ejemplo de Salida

```cmd
C:\...\ValidacionDeFormularios> deploy-automation.bat

VALIDANDO ENTORNO...

OK - Entorno validado correctamente

IDENTIFICANDO RAMA DE ORIGEN...

INFO: Rama actual detectada: main
OK - Rama de origen: main

VERIFICANDO ESTADO DEL REPOSITORIO...

INFO: Se detectaron cambios pendientes

 M README.md
 M js/main.js

HACIENDO COMMIT DE TODOS LOS CAMBIOS...

INFO: Agregando archivos al staging area...
INFO: Creando commit con mensaje: 'Preparacion al pase de produccion'
OK - Commit realizado exitosamente
INFO: Hash del commit: a3f5d21

HACIENDO PUSH DE RAMA MAIN...

INFO: Remote detectado: origin
INFO: Ejecutando: git push origin main
OK - Push de main completado

CAMBIANDO A RAMA DEPLOY...

INFO: Rama deploy existe localmente
OK - Ahora estas en rama deploy

ACTUALIZANDO RAMA DEPLOY DESDE REMOTO...

OK - Rama deploy actualizada desde remoto

MERGEANDO MAIN EN DEPLOY...

INFO: Ejecutando: git merge main
OK - Merge completado exitosamente
INFO: Ultimo commit en deploy: a3f5d21 Preparacion al pase de produccion

HACIENDO PUSH DE RAMA DEPLOY...

INFO: Ejecutando: git push origin deploy
OK - Push de deploy completado

================================================================
           DESPLIEGUE COMPLETADO EXITOSAMENTE
================================================================

OK - Rama origen: main
OK - Rama destino: deploy
OK - Cambios enviados al servidor remoto

INFO: El workflow de GitHub Actions se ejecutara automaticamente
INFO: Monitorea el despliegue en: https://github.com/<usuario>/<repo>/actions

AVISO: Recuerda regresar a tu rama de trabajo:
  git checkout main

¿Deseas regresar a la rama main ahora? (S/n):
```

---

## 🛠️ Solución de Problemas

### Error: "Git no está instalado"
```cmd
REM Instalar Git for Windows
REM Descargar desde: https://git-scm.com/download/win
REM Ejecutar el instalador y seguir las instrucciones
REM Reiniciar CMD después de instalar
```

### Error: "Git no está configurado"
```cmd
git config --global user.name "Tu Nombre Completo"
git config --global user.email "tu.email@ejemplo.com"
```

### Error: "No estás en un repositorio Git"
```cmd
REM Navegar al directorio del proyecto
cd C:\Users\TuUsuario\proyectos\ValidacionDeFormularios

REM O clonar el repositorio si no lo tienes
git clone https://github.com/sulbaranjc/ValidacionDeFormularios.git
cd ValidacionDeFormularios
```

### Error: "No se pudo hacer push"
```cmd
REM Verificar conexión a Internet
ping github.com

REM Verificar credenciales (primera vez pedirá usuario/contraseña o token)
git config --global credential.helper wincred

REM Configurar SSH (alternativa más segura)
REM Ver: https://docs.github.com/es/authentication/connecting-to-github-with-ssh
```

### Los colores no se ven
```cmd
REM Windows 10/11 soporta colores ANSI por defecto
REM Si usas Windows más antiguo, los colores no aparecerán pero el script funciona igual

REM Para habilitar colores en Windows 10:
reg add HKCU\Console /v VirtualTerminalLevel /t REG_DWORD /d 1
```

---

## 🔍 Diferencias entre Windows y Linux

| Aspecto | Linux (Bash) | Windows (Batch) |
|---------|--------------|-----------------|
| **Extensión** | `.sh` | `.bat` o `.cmd` |
| **Ejecución** | `./script.sh` | `script.bat` o doble clic |
| **Permisos** | Requiere `chmod +x` | No requiere |
| **Variables** | `$VAR` | `%VAR%` o `!VAR!` |
| **If/Else** | `if [ ]; then` | `if errorlevel` |
| **Comentarios** | `#` | `REM` |
| **Echo** | `echo -e` con colores | `echo` con códigos ANSI |
| **Exit** | `exit 1` | `exit /b 1` |
| **Funciones** | `function name()` | `goto :label` |

---

## 💡 Tips para Estudiantes Windows

### 1. Usar Git Bash (Recomendado)
```bash
# Git for Windows incluye Git Bash (terminal Linux en Windows)
# Puedes usar el script .sh original en Git Bash:
./deploy-automation.sh
```

### 2. Usar PowerShell
```powershell
# También puedes crear versión PowerShell (.ps1)
# PowerShell es más potente que CMD pero requiere permisos de ejecución
```

### 3. Usar CMD nativo
```cmd
# El script .bat funciona en CMD estándar de Windows
deploy-automation.bat
```

### 4. Usar Windows Terminal (Recomendado)
```cmd
# Windows Terminal es más moderno y soporta mejor los colores
# Descargar desde Microsoft Store
# Buscar: "Windows Terminal"
```

---

## 🎓 Conceptos Aprendidos

### Batch Scripting (Windows)
- ✅ Variables de entorno (`set`, `setlocal`)
- ✅ Condicionales (`if`, `errorlevel`)
- ✅ Bucles (`for /f`)
- ✅ Colores ANSI en CMD
- ✅ Manejo de errores (`if errorlevel 1`)
- ✅ Expansión de variables (`enabledelayedexpansion`)

### Git en Windows
- ✅ Git funciona igual en Windows y Linux
- ✅ Rutas con `\` en Windows vs `/` en Linux
- ✅ Git Bash como alternativa multiplataforma
- ✅ Credenciales con `credential.helper`

---

## 📚 Recursos Adicionales

### Git for Windows
- [Descarga oficial](https://git-scm.com/download/win)
- [Documentación](https://git-scm.com/book/es/v2)

### Batch Scripting
- [SS64 - CMD Reference](https://ss64.com/nt/)
- [Microsoft Docs - Batch](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/windows-commands)

### Windows Terminal
- [Microsoft Store](https://aka.ms/terminal)
- [Documentación](https://docs.microsoft.com/es-es/windows/terminal/)

---

## ✅ Comparación: Ambas Versiones

| Característica | Linux (.sh) | Windows (.bat) |
|----------------|-------------|----------------|
| Validaciones | ✅ | ✅ |
| Detección rama | ✅ | ✅ |
| Commit automático | ✅ | ✅ |
| Push automático | ✅ | ✅ |
| Merge a deploy | ✅ | ✅ |
| Colores | ✅ | ✅ (Win10/11) |
| Emojis | ✅ | ✅ (UTF-8) |
| Manejo errores | ✅ | ✅ |
| Interactivo | ✅ | ✅ |
| Doble clic | ❌ | ✅ |
| PAUSE final | ❌ | ✅ |

---

## 🚀 Flujo Completo

```
1. Estudiante hace cambios en Windows
   ↓
2. Ejecuta: deploy-automation.bat (doble clic o CMD)
   ↓
3. Script hace commit + push a rama actual
   ↓
4. Script hace merge a deploy + push
   ↓
5. GitHub detecta push a deploy
   ↓
6. GitHub Actions inicia workflow
   ↓
7. Workflow se conecta al servidor Linux vía SSH
   ↓
8. Servidor ejecuta: docker compose up --build
   ↓
9. Aplicación actualizada en producción ✅
```

**Tiempo total: ~30-60 segundos** desde Windows hasta producción en Linux

---

**✨ Ambos scripts (.sh y .bat) hacen exactamente lo mismo - elige según tu sistema operativo ✨**
