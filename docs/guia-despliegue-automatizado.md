# 🚀 Guía Rápida - Script de Despliegue Automatizado

## ⚡ Inicio Rápido (Quick Start)

```bash
# 1. Hacer ejecutable (solo primera vez)
chmod +x deploy-automation.sh

# 2. Ejecutar
./deploy-automation.sh
```

¡Eso es todo! El script hará el resto automáticamente.

---

## 📖 Casos de Uso Comunes

### Caso 1: Desarrollo en rama `main`
```bash
# Estás trabajando en main
git checkout main

# Haces cambios
vim index.html
vim css/styles.css

# Despliegue automático
./deploy-automation.sh

# Resultado:
# ✅ Commit en main
# ✅ Push de main
# ✅ Merge a deploy
# ✅ Push de deploy
# ✅ GitHub Actions despliega automáticamente
```

### Caso 2: Feature Branch
```bash
# Creas una nueva feature
git checkout -b feature/nueva-validacion

# Desarrollas
vim js/validation/rules.js

# Despliegas directamente desde feature
./deploy-automation.sh

# El script detectará automáticamente que estás en feature/nueva-validacion
```

### Caso 3: Especificar Rama Manualmente
```bash
# Estás en cualquier rama pero quieres desplegar desde main
./deploy-automation.sh main

# O desde otra rama
./deploy-automation.sh feature/mejoras
```

---

## 🎯 ¿Qué hace exactamente?

```
┌─────────────────────────────────────────────────┐
│         PROCESO AUTOMATIZADO                    │
└─────────────────────────────────────────────────┘

PASO 1: Validaciones
  ✓ Verificar que estás en un repo Git
  ✓ Verificar configuración de Git
  ✓ Detectar rama actual (o usar parámetro)

PASO 2: Commit en rama actual
  ✓ git add -A
  ✓ git commit -m "Preparación al pase de producción"

PASO 3: Push de rama actual
  ✓ git push origin [rama-actual]

PASO 4: Cambiar a deploy
  ✓ git checkout deploy
  ✓ git pull origin deploy (actualizar)

PASO 5: Merge a deploy
  ✓ git merge [rama-origen]

PASO 6: Push de deploy
  ✓ git push origin deploy

RESULTADO: GitHub Actions despliega automáticamente
```

---

## 🛡️ Validaciones de Seguridad

El script NO ejecutará si:
- ❌ No estás en un repositorio Git
- ❌ Git no está configurado (user.name, user.email)
- ❌ Intentas ejecutar desde la rama `deploy` (evita loops)
- ❌ Hay conflictos de merge

En cada caso, te mostrará un mensaje claro del problema.

---

## 📊 Ejemplo de Salida

```bash
$ ./deploy-automation.sh

▶ Validando entorno...
✅ Entorno validado correctamente

▶ Identificando rama de origen...
ℹ️  Rama actual detectada: main
✅ Rama de origen: main

▶ Verificando estado del repositorio...
ℹ️  Se detectaron cambios pendientes

 M README.md
 M js/main.js

▶ Haciendo commit de todos los cambios...
✅ Commit realizado exitosamente
ℹ️  Hash del commit: a3f5d21

▶ Haciendo push de rama main...
✅ Push de main completado

▶ Cambiando a rama deploy...
✅ Ahora estás en rama deploy

▶ Mergeando main en deploy...
✅ Merge completado exitosamente

▶ Haciendo push de rama deploy...
✅ Push de deploy completado

╔════════════════════════════════════════════════════════════╗
║          🎉 DESPLIEGUE COMPLETADO EXITOSAMENTE 🎉          ║
╚════════════════════════════════════════════════════════════╝

✅ Rama origen: main
✅ Rama destino: deploy
✅ Cambios enviados al servidor remoto

ℹ️  El workflow de GitHub Actions se ejecutará automáticamente

¿Deseas regresar a la rama main ahora? (S/n):
```

---

## ❓ Preguntas Frecuentes

### ¿Puedo ejecutarlo sin cambios pendientes?
Sí. Si no hay cambios, el script saltará el commit y solo hará el merge a deploy.

### ¿Qué pasa si hay conflictos?
El script se detendrá y te indicará cómo resolverlos manualmente.

### ¿Puedo cancelar la ejecución?
Sí, usa `Ctrl+C` en cualquier momento. El script es seguro.

### ¿Debo estar en una rama específica?
No. Puedes ejecutarlo desde cualquier rama (excepto deploy).

### ¿Qué pasa si la rama deploy no existe?
El script te preguntará si deseas crearla.

---

## 🔧 Solución de Problemas

### Error: "comando no encontrado"
```bash
# Dar permisos de ejecución
chmod +x deploy-automation.sh

# Ejecutar con bash explícito
bash deploy-automation.sh
```

### Error: "Git no está configurado"
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Error: "No se pudo hacer push"
```bash
# Verificar conexión
ping github.com

# Verificar credenciales
git config --list | grep user

# Configurar credenciales (si es necesario)
git config credential.helper store
```

---

## 🚀 Flujo Completo con GitHub Actions

```
1. Desarrollador ejecuta: ./deploy-automation.sh
   ↓
2. Script hace commit + push a rama actual
   ↓
3. Script hace merge a deploy + push
   ↓
4. GitHub detecta push a deploy
   ↓
5. GitHub Actions inicia workflow
   ↓
6. Workflow se conecta al servidor vía SSH
   ↓
7. Servidor ejecuta: docker compose up --build
   ↓
8. Aplicación actualizada en producción ✅
```

**Tiempo total: ~30-60 segundos**

---

## 💡 Tips y Mejores Prácticas

✅ **Ejecuta el script con frecuencia** para despliegues incrementales  
✅ **Revisa cambios antes** con `git status` y `git diff`  
✅ **Usa branches** para features grandes  
✅ **Monitorea GitHub Actions** para ver el progreso  
✅ **Haz rollback rápido** revirtiendo el commit si hay problemas  

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs del script (tiene salida detallada)
2. Verifica GitHub Actions en: `https://github.com/TU-USUARIO/TU-REPO/actions`
3. Revisa logs del servidor: `docker logs validacion-formularios`

---

**Creado para facilitar el despliegue continuo en entornos educativos** 🎓
