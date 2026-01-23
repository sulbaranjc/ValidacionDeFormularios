# 🏋️ Sistema de Validación de Formularios - Inscripción Gimnasio

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript ES6+](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Responsive Design](https://img.shields.io/badge/Responsive-Design-green)](https://web.dev/responsive-web-design-basics/)
[![Accessibility](https://img.shields.io/badge/A11y-WCAG%202.1-blue)](https://www.w3.org/WAI/WCAG21/quickref/)

## 📋 Descripción

Sistema completo de validación de formularios desarrollado con **HTML5, CSS3 y JavaScript vanilla (ES6+)**. Presenta un formulario de inscripción a gimnasio con validación nativa reforzada por validaciones JavaScript personalizadas, diseño responsive y características de accesibilidad.

### ✨ Características Principales

- **🔍 Validación Dual**: Combinación de validación HTML5 nativa + JavaScript personalizado
- **📱 Responsive Design**: Adaptable a dispositivos móviles, tablets y desktop
- **♿ Accesibilidad**: Cumple estándares WCAG 2.1 con ARIA y navegación por teclado
- **🎨 UI/UX Moderna**: Diseño dark theme con animaciones suaves
- **⚡ Rendimiento**: JavaScript modular y optimizado
- **🧩 Arquitectura Modular**: Código organizado en módulos reutilizables

## 🏗️ Estructura del Proyecto

```
ValidacionDeFormularios/
├── 📁 .github/
│   └── 📁 workflows/
│       └── deploy.yml            # GitHub Actions CI/CD
├── 📁 assets/
│   └── 📁 data/
│       ├── ciudades.json          # Datos de ciudades españolas
│       └── sample.json            # Datos de ejemplo (vacío)
├── 📁 components/
│   ├── footer.html               # Componente pie de página
│   └── header.html               # Componente cabecera
├── 📁 css/
│   └── styles.css                # Estilos principales (dark theme)
├── 📁 docs/
│   └── guia.md                   # Documentación técnica
├── 📁 js/
│   ├── formValidation.js         # Controlador principal de validación
│   ├── main.js                   # Archivo principal de la aplicación
│   ├── 📁 utils/
│   │   └── dom.js                # Utilidades para manipulación del DOM
│   └── 📁 validation/
│       ├── messages.js           # Mensajes de error personalizados
│       └── rules.js              # Reglas de validación custom
├── 📁 pages/
│   └── about.html                # Página "Acerca de"
├── deploy-automation.sh          # 🤖 Script de despliegue automatizado
├── docker-compose.yml            # 🐳 Configuración Docker Compose
├── Dockerfile                    # 🐳 Imagen Docker con Nginx
├── index.html                    # Página principal con formulario
└── README.md                     # Este archivo
```

## 🚀 Instalación y Uso

### Requisitos Previos
- Navegador web moderno con soporte ES6+
- Servidor web local (opcional, pero recomendado)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/sulbaranjc/ValidacionDeFormularios.git
   cd ValidacionDeFormularios
   ```

2. **Opción A: Abrir directamente**
   ```bash
   # Abrir index.html directamente en el navegador
   open index.html  # macOS
   xdg-open index.html  # Linux
   start index.html  # Windows
   ```

3. **Opción B: Servidor local (recomendado)**
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js (si tienes http-server instalado)
   npx http-server
   
   # Con PHP
   php -S localhost:8000
   ```

4. **Acceder a la aplicación**
   ```
   http://localhost:8000
   ```

## 🔧 Funcionalidades Técnicas

### Sistema de Validación

#### Validación HTML5 Nativa
- `required`: Campos obligatorios
- `pattern`: Expresiones regulares para formato
- `min/max`: Rangos numéricos
- `minlength/maxlength`: Longitud de texto
- `type="email"`: Validación de correo electrónico
- `type="tel"`: Validación de teléfono
- `type="date"`: Selector de fecha

#### Validación JavaScript Personalizada
```javascript
// Ejemplo de regla personalizada
export const rules = {
  objetivos: v => contarPalabras(v) >= 3,  // Mínimo 3 palabras
  edad: v => calcularEdad(v) >= 16,        // Mayor de 16 años
  telefono: v => /^[0-9\s+()-]{9,20}$/.test(v)  // Formato teléfono
};
```

### Campos del Formulario

#### 1️⃣ Datos Personales
- **Nombre**: Mínimo 2 caracteres, requerido
- **Apellidos**: Mínimo 2 caracteres, requerido
- **DNI/NIE/Pasaporte**: Formato alfanumérico (5-15 caracteres), requerido
- **Fecha de nacimiento**: Edad mínima 16 años, requerido
- **Sexo**: Selección opcional
- **Estado civil**: Selección opcional

#### 2️⃣ Contacto y Dirección
- **Email**: Validación completa de formato, requerido
- **Teléfono**: Formato internacional con validación regex, requerido
- **Preferencia de contacto**: Radio buttons (Email/Teléfono/WhatsApp)
- **Dirección completa**: Calle, ciudad y código postal, requeridos

#### 3️⃣ Datos Médicos y Objetivos
- **Altura**: Rango 120-230 cm, requerido
- **Peso**: Rango 35-250 kg (decimales permitidos), requerido
- **Nivel de actividad**: Selección de dropdown
- **Objetivos**: Textarea con mínimo 3 palabras, requerido
- **Condiciones médicas**: Checkboxes con lógica exclusiva

#### 4️⃣ Plan y Horarios
- **Plan de membresía**: Mensual/Trimestral/Anual/Premium, requerido
- **Días preferidos**: Checkboxes múltiples
- **Franja horaria**: Selección de horarios
- **Clases grupales**: Select múltiple
- **Código de referido**: Campo opcional

#### 5️⃣ Facturación
- **NIF para factura**: Validación opcional
- **Dirección de facturación**: Campo opcional
- **IBAN (últimos 4 dígitos)**: Validación numérica, requerido

#### 6️⃣ Consentimientos
- **Términos y condiciones**: Checkbox requerido
- **RGPD/Privacidad**: Checkbox requerido
- **Comunicaciones promocionales**: Checkbox opcional

### Características de Accesibilidad

- **ARIA Labels**: Etiquetas descriptivas para lectores de pantalla
- **Roles y Estados**: `role="alert"`, `aria-invalid`, `aria-describedby`
- **Navegación por teclado**: Soporte completo para Tab, Enter, Space
- **Contraste de colores**: Cumple WCAG AA (4.5:1)
- **Mensajes de error**: Asociados correctamente con `aria-describedby`

### Responsive Design

```css
/* Breakpoints principales */
@media (min-width: 720px) {
  .grid.cols-2 { grid-template-columns: repeat(2, minmax(0,1fr)) }
}

@media (min-width: 980px) {
  .grid.cols-3 { grid-template-columns: repeat(3, minmax(0,1fr)) }
}
```

## 🧪 Casos de Uso de Validación

### Casos de Éxito ✅
```javascript
// Ejemplos de datos válidos
{
  nombre: "Juan Carlos",
  email: "juan@email.com",
  telefono: "+34 600 123 456",
  fecha_nacimiento: "1990-05-15",
  altura: 175,
  peso: 72.5,
  objetivos: "Perder peso y ganar músculo",
  plan: "anual"
}
```

### Casos de Error ❌
```javascript
// Ejemplos que generan errores
{
  nombre: "J",                    // Error: Mínimo 2 caracteres
  email: "correo-inválido",       // Error: Formato email
  telefono: "123",                // Error: Muy corto
  fecha_nacimiento: "2010-01-01", // Error: Menor de 16 años
  altura: 300,                    // Error: Fuera de rango
  objetivos: "bajar",             // Error: Menos de 3 palabras
}
```

## 🎨 Personalización del Diseño

### Variables CSS Principales
```css
:root {
  --bg: #0e0f13;           /* Fondo principal */
  --panel: #151821;        /* Paneles */
  --text: #e6e8ef;         /* Texto principal */
  --accent: #5b8def;       /* Color de acento */
  --danger: #ef5b5b;       /* Color de error */
  --ok: #4caf50;           /* Color de éxito */
  --radius: 16px;          /* Radio de bordes */
}
```

### Modificar Validaciones
```javascript
// En js/validation/rules.js
export const rules = {
  // Agregar nueva regla
  codigo_postal: v => /^\d{5}$/.test(v),
  
  // Modificar regla existente
  telefono: v => /^(\+34|0034|34)?[6-9]\d{8}$/.test(v)
};
```

## 🔄 Estados del Formulario

### 1. **Estado Inicial**
- Botón "Enviar" deshabilitado
- No hay mensajes de error
- Campos en estado neutral

### 2. **Estado de Validación**
- Validación en tiempo real (eventos `blur`, `input`)
- Mensajes de error contextuales
- Indicadores visuales (bordes rojos/verdes)

### 3. **Estado de Error**
- Campos marcados con `aria-invalid="true"`
- Mensajes descriptivos con iconos
- Enfoque automático en el primer error

### 4. **Estado Válido**
- Botón "Enviar" habilitado
- Indicadores visuales de éxito
- Todos los campos pasan validación

## 📊 Métricas de Rendimiento

### Lighthouse Score
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 95+

### Tamaño de Archivos
- **HTML**: ~8KB (gzipped)
- **CSS**: ~4KB (gzipped)  
- **JavaScript**: ~3KB (gzipped)
- **Total**: <15KB

## 🛠️ Desarrollo y Extensión

### Agregar Nuevos Campos
1. Añadir el HTML en `index.html`
2. Crear regla de validación en `js/validation/rules.js`
3. Definir mensaje en `js/validation/messages.js`
4. Aplicar estilos en `css/styles.css`

### Ejemplo: Campo Código Postal
```html
<!-- 1. HTML -->
<input id="cp" name="cp" type="text" pattern="^\d{5}$" required>
```

```javascript
// 2. Regla de validación
export const rules = {
  cp: v => /^\d{5}$/.test(v)
};

// 3. Mensaje de error
export const messages = {
  cp: "El código postal debe tener exactamente 5 dígitos."
};
```

## 🧪 Testing

### Pruebas Manuales
- [x] Validación de todos los campos
- [x] Responsive design en diferentes dispositivos
- [x] Accesibilidad con lectores de pantalla
- [x] Navegación por teclado
- [x] Estados de error y éxito

### Herramientas de Testing Recomendadas
- **Validación HTML**: [W3C Markup Validator](https://validator.w3.org/)
- **CSS**: [W3C CSS Validator](https://jigsaw.w3.org/css-validator/)
- **Accesibilidad**: [axe DevTools](https://www.deque.com/axe/devtools/)
- **Performance**: [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-validacion`)
3. Commit cambios (`git commit -m 'Agregar validación de código postal'`)
4. Push a la rama (`git push origin feature/nueva-validacion`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**@sulbaranjc** - [GitHub](https://github.com/sulbaranjc)

---

## � Despliegue y DevOps

### 📦 Arquitectura de Despliegue

Este proyecto implementa un sistema de **Despliegue Continuo (CD)** utilizando:
- **Docker** y **Docker Compose** para containerización
- **Nginx** como servidor web
- **Reverse Proxy** para gestión de múltiples aplicaciones
- **GitHub Actions** para automatización CI/CD

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE DESPLIEGUE                       │
└─────────────────────────────────────────────────────────────┘

Desarrollador Local
      │
      │ git push origin deploy
      ▼
┌──────────────────┐
│  GitHub Actions  │ ← Detecta push a rama 'deploy'
│   (CI/CD)        │
└────────┬─────────┘
         │ SSH Connection
         ▼
┌──────────────────────────────────────────────────────────┐
│              SERVIDOR DE PRODUCCIÓN                      │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │         Nginx Reverse Proxy (Puerto 80/443)        │ │
│  │  validacion.docker.sulbaranjc.com → Contenedor     │ │
│  └──────────────────┬─────────────────────────────────┘ │
│                     │                                     │
│          ┌──────────┴──────────┐                         │
│          │                     │                          │
│  ┌───────▼─────────┐   ┌──────▼──────────┐              │
│  │  validacion     │   │  otros-proyectos │              │
│  │  (Puerto 80)    │   │  (Puerto 80)     │              │
│  │                 │   │                  │              │
│  │  Nginx:Alpine   │   │  ...             │              │
│  │  + HTML/CSS/JS  │   │                  │              │
│  └─────────────────┘   └──────────────────┘              │
│                                                           │
│            Red Docker: 'proxy'                            │
└───────────────────────────────────────────────────────────┘
         ▲
         │ HTTP Request
         │
    Usuario Final
```

### 🐳 Containerización con Docker

#### Dockerfile
El proyecto usa **Nginx Alpine** como imagen base por:
- **Tamaño reducido**: ~5-10 MB (vs ~130 MB de imágenes estándar)
- **Seguridad**: Menor superficie de ataque
- **Rendimiento**: Solo componentes esenciales

**Capas de la imagen:**
1. **Base**: `nginx:alpine`
2. **Limpieza**: Elimina archivos HTML por defecto de Nginx
3. **Copia**: Transfiere todos los archivos del proyecto (HTML, CSS, JS, assets)
4. **Exposición**: Puerto 80 (HTTP estándar)

#### Docker Compose
Orquesta el contenedor con configuración declarativa:

```yaml
services:
  validacion:
    build: .                    # Construye desde Dockerfile local
    container_name: validacion-formularios
    environment:
      - VIRTUAL_HOST=validacion.docker.sulbaranjc.com  # Dominio
      - VIRTUAL_PORT=80                                 # Puerto interno
    networks:
      - proxy                   # Red compartida con reverse proxy
```

**Variables de entorno clave:**
- `VIRTUAL_HOST`: El reverse proxy usa esta variable para enrutar peticiones
- `VIRTUAL_PORT`: Indica dónde escucha el contenedor (80 para HTTP)

### 🔄 Reverse Proxy Pattern

#### ¿Qué es un Reverse Proxy?

Un **reverse proxy** actúa como intermediario entre clientes externos y servidores backend:

```
Cliente → [Internet] → Reverse Proxy → Servidor Backend
                           │
                           ├→ validacion.docker.sulbaranjc.com:80 → Contenedor 1
                           ├→ api.docker.sulbaranjc.com:80         → Contenedor 2
                           └→ admin.docker.sulbaranjc.com:80       → Contenedor 3
```

#### Ventajas del Reverse Proxy
✅ **Multiplex de aplicaciones**: Un servidor, múltiples dominios  
✅ **SSL/TLS centralizado**: Certificados gestionados en un solo lugar  
✅ **Balanceo de carga**: Distribuir tráfico entre múltiples instancias  
✅ **Caché**: Mejora rendimiento con caché HTTP  
✅ **Seguridad**: Oculta arquitectura interna, protección DDoS  

#### Implementación con nginx-proxy

El proyecto usa [nginx-proxy](https://github.com/nginx-proxy/nginx-proxy) que:
1. Detecta automáticamente contenedores con `VIRTUAL_HOST`
2. Genera configuración Nginx dinámicamente
3. Reenvía peticiones al contenedor correcto
4. Soporta SSL con [Let's Encrypt](https://letsencrypt.org/)

**Red Docker compartida:**
```bash
# Crear red externa (una sola vez)
docker network create proxy

# Todos los contenedores se conectan a 'proxy'
# El nginx-proxy inspecciona contenedores en esta red
```

### ⚙️ GitHub Actions - Despliegue Continuo

#### Workflow de Despliegue

**Archivo:** [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

**Trigger:** Push a rama `deploy`

**Proceso paso a paso:**

1. **Trigger Event**
   ```yaml
   on:
     push:
       branches:
         - deploy
   ```
   - Desarrollador hace `git push origin deploy`
   - GitHub Actions detecta el push automáticamente

2. **Runner Initialization**
   ```yaml
   runs-on: ubuntu-latest
   ```
   - GitHub provisiona VM con Ubuntu
   - Instala dependencias necesarias

3. **SSH Connection**
   ```yaml
   uses: appleboy/ssh-action@v1.0.3
   with:
     host: ${{ secrets.SSH_HOST }}
     username: ${{ secrets.SSH_USER }}
     key: ${{ secrets.SSH_KEY }}
   ```
   - Establece conexión SSH segura con servidor
   - Usa credenciales almacenadas en GitHub Secrets

4. **Git Synchronization**
   ```bash
   git reset --hard      # Descarta cambios locales
   git clean -fd         # Elimina archivos no trackeados
   git fetch origin
   git checkout -B deploy origin/deploy
   git pull --ff-only origin deploy
   ```
   - Limpia estado del repositorio
   - Sincroniza con código más reciente
   - Garantiza historial Git limpio

5. **Docker Rebuild**
   ```bash
   docker compose down            # Detiene contenedor actual
   docker compose up -d --build   # Reconstruye y reinicia
   ```
   - Detiene contenedor anterior
   - Construye nueva imagen con código actualizado
   - Inicia contenedor en modo detached

#### Secrets de GitHub

**Configuración:** Settings → Secrets and variables → Actions

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `SSH_HOST` | IP o dominio del servidor | `192.168.1.100` |
| `SSH_USER` | Usuario SSH | `ubuntu` |
| `SSH_KEY` | Clave privada SSH (PEM) | `-----BEGIN RSA PRIVATE KEY-----...` |
| `DEPLOY_PATH` | Ruta del proyecto | `/home/ubuntu/proyectos/ValidacionDeFormularios` |

**Generar par de claves SSH:**
```bash
# En tu máquina local
ssh-keygen -t rsa -b 4096 -C "deploy@validacion"

# Copiar clave pública al servidor
ssh-copy-id ubuntu@servidor.com

# Copiar clave privada a GitHub Secrets
cat ~/.ssh/id_rsa  # Copiar TODO el contenido
```

### 🛠️ Configuración del Servidor

#### Requisitos Previos

1. **Sistema Operativo**: Ubuntu 22.04 LTS (recomendado)
2. **Docker**: Versión 24.0+
3. **Docker Compose**: V2.20+
4. **Nginx Proxy**: Contenedor nginx-proxy corriendo

#### Instalación Paso a Paso

**1. Instalar Docker**
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario al grupo docker (sin sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalación
docker --version
docker compose version
```

**2. Crear Red Proxy**
```bash
# Red compartida para todos los proyectos
docker network create proxy
```

**3. Desplegar Nginx Proxy**
```bash
# Crear directorio
mkdir -p ~/nginx-proxy
cd ~/nginx-proxy

# Crear docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  nginx-proxy:
    image: nginxproxy/nginx-proxy:latest
    container_name: nginx-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - ./certs:/etc/nginx/certs
      - ./vhost:/etc/nginx/vhost.d
      - ./html:/usr/share/nginx/html
    networks:
      - proxy
    restart: unless-stopped

networks:
  proxy:
    external: true
EOF

# Iniciar nginx-proxy
docker compose up -d
```

**4. Clonar Repositorio**
```bash
# Crear directorio de proyectos
mkdir -p ~/proyectos
cd ~/proyectos

# Clonar proyecto
git clone https://github.com/sulbaranjc/ValidacionDeFormularios.git
cd ValidacionDeFormularios

# Cambiar a rama deploy
git checkout deploy
```

**5. Configurar DNS**
```
# En tu proveedor DNS (Cloudflare, GoDaddy, etc.)
# Agregar registro A:
validacion.docker.sulbaranjc.com  →  [IP_DEL_SERVIDOR]
```

**6. Primer Despliegue Manual**
```bash
# Construir y levantar contenedor
docker compose up -d --build

# Verificar logs
docker logs validacion-formularios

# Verificar estado
docker ps | grep validacion
```

**7. Probar Acceso**
```bash
# Desde el servidor
curl -I http://localhost

# Desde tu computadora
curl -I http://validacion.docker.sulbaranjc.com
```

### 🔐 Seguridad y Buenas Prácticas

#### SSL/TLS con Let's Encrypt (Opcional pero Recomendado)

Agregar HTTPS automático con certificados gratuitos:

```bash
cd ~/nginx-proxy

# Agregar companion para Let's Encrypt
cat >> docker-compose.yml << 'EOF'
  letsencrypt:
    image: nginxproxy/acme-companion:latest
    container_name: nginx-proxy-acme
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./certs:/etc/nginx/certs
      - ./vhost:/etc/nginx/vhost.d
      - ./html:/usr/share/nginx/html
      - ./acme:/etc/acme.sh
    environment:
      - DEFAULT_EMAIL=tu-email@ejemplo.com
    depends_on:
      - nginx-proxy
    networks:
      - proxy
EOF

# Reiniciar nginx-proxy
docker compose up -d
```

Modificar `docker-compose.yml` del proyecto:
```yaml
environment:
  - VIRTUAL_HOST=validacion.docker.sulbaranjc.com
  - VIRTUAL_PORT=80
  - LETSENCRYPT_HOST=validacion.docker.sulbaranjc.com
  - LETSENCRYPT_EMAIL=tu-email@ejemplo.com
```

#### Firewall (UFW)
```bash
# Habilitar firewall
sudo ufw enable

# Permitir SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Verificar reglas
sudo ufw status
```

### 📊 Monitoreo y Logs

#### Ver Logs del Contenedor
```bash
# Logs en tiempo real
docker logs -f validacion-formularios

# Últimas 100 líneas
docker logs --tail 100 validacion-formularios

# Logs con timestamps
docker logs -t validacion-formularios
```

#### Inspeccionar Contenedor
```bash
# Estado general
docker ps -a

# Detalles completos
docker inspect validacion-formularios

# Uso de recursos
docker stats validacion-formularios
```

#### Logs de GitHub Actions
- Ir a: **GitHub → Actions → Deploy ValidacionDeFormularios**
- Ver logs detallados de cada paso
- Identificar errores en despliegue

### 🔧 Troubleshooting

#### Problema: Contenedor no inicia
```bash
# Ver logs de error
docker logs validacion-formularios

# Verificar configuración
docker compose config

# Reconstruir forzando
docker compose build --no-cache
docker compose up -d
```

#### Problema: Sitio no accesible
```bash
# Verificar nginx-proxy
docker logs nginx-proxy

# Verificar red
docker network inspect proxy

# Verificar DNS
nslookup validacion.docker.sulbaranjc.com

# Probar localmente
curl http://localhost:80
```

#### Problema: Deploy falla en GitHub Actions
```bash
# En el servidor, verificar:
# 1. Clave SSH autorizada
cat ~/.ssh/authorized_keys

# 2. Permisos del proyecto
ls -la ~/proyectos/ValidacionDeFormularios

# 3. Git limpio
cd ~/proyectos/ValidacionDeFormularios
git status
```

### 📈 Métricas y Performance

#### Tamaño de Imagen Docker
```bash
# Ver tamaño de imagen
docker images | grep validacion

# Resultado esperado: ~10-15 MB (nginx:alpine + archivos)
```

#### Tiempo de Despliegue
- **Commit → Deploy completo**: ~30-60 segundos
- **Downtime**: <5 segundos (mientras se reinicia contenedor)

#### Optimizaciones
- ✅ Imagen Alpine (vs Ubuntu): 90% menor tamaño
- ✅ `--build` solo reconstruye capas modificadas (caché Docker)
- ✅ Archivos estáticos comprimidos por Nginx (gzip)

### 🎓 Conceptos Clave para Estudiantes

#### ¿Por qué Docker?
1. **Portabilidad**: "Funciona en mi máquina" → "Funciona en todas las máquinas"
2. **Aislamiento**: Cada app en su propio entorno
3. **Reproducibilidad**: Misma imagen = mismo comportamiento
4. **Eficiencia**: Contenedores vs VMs (menor overhead)

#### ¿Por qué Nginx?
1. **Alto rendimiento**: Maneja miles de conexiones concurrentes
2. **Ligereza**: Bajo consumo de memoria (~10 MB)
3. **Versatilidad**: Servidor web + reverse proxy + load balancer
4. **Estándar de industria**: Usado por Netflix, Airbnb, GitHub

#### CI/CD vs Despliegue Manual

| Aspecto | Manual | CI/CD |
|---------|--------|-------|
| **Tiempo** | 5-10 min | 30 seg |
| **Errores** | Frecuentes | Mínimos |
| **Consistencia** | Variable | Siempre igual |
| **Rollback** | Complicado | 1 comando Git |
| **Auditoría** | Poca | Completa (logs) |

#### Estrategia de Ramas (Git Flow Simplificado)

```
main (desarrollo)
  ├─ feature/nueva-validacion
  ├─ fix/corregir-email
  └─ ...

deploy (producción)
  ← Merge desde main cuando esté listo
```

**Flujo de trabajo:**
1. Desarrollar en `main` o feature branches
2. Probar localmente
3. Merge a `main`
4. Cuando esté listo para producción: `git push origin main:deploy`
5. GitHub Actions despliega automáticamente

### 🤖 Script de Automatización de Despliegue

Para facilitar el proceso de despliegue, el proyecto incluye un **script de automatización** que ejecuta todos los pasos necesarios de forma automática.

#### Archivo: `deploy-automation.sh`

**Ubicación:** Raíz del proyecto

**¿Qué hace el script?**
1. ✅ Detecta la rama actual (o recibe una como parámetro)
2. ✅ Hace commit de todos los cambios pendientes
3. ✅ Push de la rama actual al remoto
4. ✅ Cambia a la rama `deploy`
5. ✅ Mergea los cambios de la rama origen a `deploy`
6. ✅ Push de la rama `deploy` (dispara GitHub Actions)

#### Uso del Script

**Opción 1: Detección automática de rama**
```bash
# Desde cualquier rama (main, feature/nueva-ui, etc.)
./deploy-automation.sh
```

**Opción 2: Especificar rama manualmente**
```bash
# Especificar rama como parámetro
./deploy-automation.sh main
./deploy-automation.sh feature/mejoras
```

#### Proceso Paso a Paso

```bash
# 1. Dar permisos de ejecución (solo primera vez)
chmod +x deploy-automation.sh

# 2. Hacer cambios en tu código
# ... editar archivos ...

# 3. Ejecutar script
./deploy-automation.sh

# El script automáticamente:
# ✅ Agrega todos los cambios (git add -A)
# ✅ Crea commit con mensaje "Preparación al pase de producción"
# ✅ Push a rama actual
# ✅ Cambia a deploy
# ✅ Merge de rama origen → deploy
# ✅ Push de deploy (activa CI/CD)
```

#### Características del Script

**✨ Validaciones de Seguridad:**
- Verifica que estés en un repositorio Git
- Valida configuración de Git (user.name, user.email)
- Detecta si hay cambios para commitear
- Previene ejecución desde rama `deploy` (evita loops)
- Maneja conflictos de merge con mensajes claros

**🎨 Interfaz Amigable:**
- Mensajes con colores (verde=éxito, rojo=error, azul=info)
- Emojis para mejor visualización
- Progreso paso a paso
- Resumen final del despliegue

**🛡️ Manejo de Errores:**
- Detección temprana de problemas
- Mensajes descriptivos de errores
- Salida limpia sin dejar el repo en estado inconsistente

**🔄 Opciones Interactivas:**
- Pregunta si quieres crear rama `deploy` si no existe
- Opción de regresar a rama origen al finalizar

#### Ejemplo de Salida

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
 M docker-compose.yml
?? deploy-automation.sh

▶ Haciendo commit de todos los cambios...
ℹ️  Agregando archivos al staging area...
ℹ️  Creando commit con mensaje: 'Preparación al pase de producción'
✅ Commit realizado exitosamente
ℹ️  Hash del commit: a3f5d21

▶ Haciendo push de rama main...
ℹ️  Remote detectado: origin
ℹ️  Ejecutando: git push origin main
✅ Push de main completado

▶ Cambiando a rama deploy...
ℹ️  Rama deploy existe localmente
✅ Ahora estás en rama deploy

▶ Actualizando rama deploy desde remoto...
✅ Rama deploy actualizada desde remoto

▶ Mergeando main en deploy...
ℹ️  Ejecutando: git merge main
✅ Merge completado exitosamente
ℹ️  Último commit en deploy: a3f5d21 Preparación al pase de producción

▶ Haciendo push de rama deploy...
ℹ️  Ejecutando: git push origin deploy
✅ Push de deploy completado

╔════════════════════════════════════════════════════════════╗
║          🎉 DESPLIEGUE COMPLETADO EXITOSAMENTE 🎉          ║
╚════════════════════════════════════════════════════════════╝

✅ Rama origen: main
✅ Rama destino: deploy
✅ Cambios enviados al servidor remoto

ℹ️  El workflow de GitHub Actions se ejecutará automáticamente
ℹ️  Monitorea el despliegue en: https://github.com/<usuario>/<repo>/actions

⚠️  Recuerda regresar a tu rama de trabajo:
  git checkout main

¿Deseas regresar a la rama main ahora? (S/n):
```

#### Casos de Uso

**Caso 1: Desarrollo normal en main**
```bash
# Trabajas en main
git checkout main

# Haces cambios
vim index.html
vim css/styles.css

# Ejecutas script
./deploy-automation.sh
# → Automáticamente: commit → push main → merge a deploy → push deploy
```

**Caso 2: Feature branch**
```bash
# Trabajas en una feature
git checkout -b feature/nueva-validacion

# Haces cambios
vim js/validation/rules.js

# Ejecutas script
./deploy-automation.sh
# → Automáticamente despliega desde feature branch
```

**Caso 3: Especificar rama manualmente**
```bash
# Estás en cualquier rama pero quieres desplegar desde main
./deploy-automation.sh main
```

#### Troubleshooting del Script

**Problema: "No estás en un repositorio Git"**
```bash
# Solución: Ejecuta el script desde dentro del proyecto
cd /ruta/al/proyecto
./deploy-automation.sh
```

**Problema: "Git no está configurado"**
```bash
# Solución: Configura Git
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

**Problema: "Conflictos de merge detectados"**
```bash
# El script se detendrá, resuelve conflictos manualmente:
git status                    # Ver archivos en conflicto
vim archivo-conflicto.txt     # Resolver conflictos
git add archivo-conflicto.txt
git merge --continue
git push origin deploy
```

**Problema: "Error al hacer push"**
```bash
# Posibles causas:
# 1. Sin conexión a Internet
# 2. Sin permisos en el repositorio
# 3. Autenticación fallida

# Solución: Verificar credenciales
git config credential.helper store
git push  # Pedirá usuario/contraseña o token
```

#### Ventajas del Script vs Manual

| Aspecto | Manual | Con Script |
|---------|--------|------------|
| **Tiempo** | 5-10 comandos | 1 comando |
| **Errores** | Fácil olvidar pasos | Automatizado |
| **Consistencia** | Variable | Siempre igual |
| **Aprendizaje** | Requiere conocer Git | Plug & play |
| **Rollback** | Manual | Detecta problemas temprano |

#### Código del Script (Resumen)

El script está completamente documentado con:
- **Colores** para mensajes (verde, rojo, amarillo, azul)
- **Validaciones** en cada paso
- **Manejo de errores** robusto
- **Comentarios educativos** para estudiantes
- **Funciones auxiliares** reutilizables

**Funciones principales:**
```bash
error()    # Imprime error en rojo y sale
success()  # Imprime éxito en verde
info()     # Imprime información en azul
warning()  # Imprime advertencia en amarillo
step()     # Imprime paso del proceso en cyan
```

**Flujo de validación:**
```bash
1. Validar que estamos en repo Git
2. Validar configuración de Git
3. Detectar/recibir rama origen
4. Verificar que no estamos en deploy
5. Verificar cambios pendientes
6. Ejecutar commit + push
7. Cambiar a deploy
8. Merge + push
9. Resumen final
```

#### Integración con CI/CD

```
Desarrollador                Script                  GitHub              Servidor
    │                         │                        │                    │
    │  ./deploy-automation.sh │                        │                    │
    │─────────────────────────>│                        │                    │
    │                         │  git push origin deploy│                    │
    │                         │───────────────────────>│                    │
    │                         │                        │  SSH al servidor   │
    │                         │                        │───────────────────>│
    │                         │                        │                    │
    │                         │                        │  docker compose up │
    │                         │                        │  --build           │
    │                         │                        │<───────────────────│
    │  ✅ Deploy completo     │                        │                    │
    │<─────────────────────────│                        │                    │
```

**Tiempo total:** ~30-60 segundos desde ejecución hasta deploy en producción

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [GitHub Actions](https://docs.github.com/en/actions)

### Tutoriales y Guías
- [MDN Web Docs - Validación de Formularios](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [HTML5 Form Validation](https://web.dev/learn/forms/validation/)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Nginx Reverse Proxy Guide](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Herramientas DevOps
- [nginx-proxy](https://github.com/nginx-proxy/nginx-proxy) - Reverse proxy automatizado
- [Let's Encrypt](https://letsencrypt.org/) - Certificados SSL gratuitos
- [Portainer](https://www.portainer.io/) - Gestión visual de Docker
- [Watchtower](https://containrrr.dev/watchtower/) - Auto-actualización de contenedores

---

⭐ **¿Te ha gustado el proyecto? ¡Dale una estrella en GitHub!**

📧 **Preguntas o sugerencias**: Abre un [issue](https://github.com/sulbaranjc/ValidacionDeFormularios/issues)