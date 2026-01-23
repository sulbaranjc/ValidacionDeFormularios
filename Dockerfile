# ====================================================================
# DOCKERFILE - CONTENEDOR WEB ESTÁTICO CON NGINX
# ====================================================================
# Este Dockerfile crea una imagen Docker que contiene:
# - Servidor web Nginx (ligero y eficiente)
# - Archivos estáticos de la aplicación (HTML, CSS, JS)
#
# PROPÓSITO: Servir la aplicación web de validación de formularios
# como un sitio estático usando Nginx como servidor HTTP.
# ====================================================================

# --------------------------------------------------------------------
# STAGE 1: IMAGEN BASE
# --------------------------------------------------------------------
# FROM: Especifica la imagen base sobre la cual construir
# nginx:alpine - Imagen oficial de Nginx basada en Alpine Linux
#
# ¿Por qué Alpine?
# - Tamaño reducido: ~5-10 MB vs ~130 MB de versiones estándar
# - Mayor seguridad: Menor superficie de ataque
# - Ideal para contenedores: Solo incluye lo esencial
FROM nginx:alpine

# --------------------------------------------------------------------
# STAGE 2: LIMPIEZA DE ARCHIVOS POR DEFECTO
# --------------------------------------------------------------------
# RUN: Ejecuta comandos durante la construcción de la imagen
# rm -rf: Elimina recursivamente todos los archivos HTML de ejemplo
#
# ¿Por qué limpiar?
# - Nginx incluye una página de bienvenida por defecto
# - Queremos servir nuestros propios archivos, no los de ejemplo
# - /usr/share/nginx/html es el directorio raíz web de Nginx
RUN rm -rf /usr/share/nginx/html/*

# --------------------------------------------------------------------
# STAGE 3: COPIA DE ARCHIVOS DE LA APLICACIÓN
# --------------------------------------------------------------------
# COPY: Copia archivos del contexto de construcción al contenedor
# Sintaxis: COPY <origen_host> <destino_contenedor>
#
# Origen (.): Directorio actual del host (donde está el Dockerfile)
#             Incluye: index.html, css/, js/, assets/, components/, etc.
#
# Destino (/usr/share/nginx/html): Directorio donde Nginx busca archivos
#                                   Es el "document root" por defecto
#
# IMPORTANTE: Copia TODO el proyecto, incluyendo:
# - index.html (página principal)
# - css/styles.css (estilos)
# - js/ (lógica de validación)
# - assets/data/ (datos JSON)
# - components/ (header/footer HTML)
# - pages/ (páginas adicionales)
COPY . /usr/share/nginx/html

# --------------------------------------------------------------------
# STAGE 4: EXPOSICIÓN DE PUERTO
# --------------------------------------------------------------------
# EXPOSE: Documenta qué puerto escucha el contenedor
# Puerto 80: Puerto HTTP estándar
#
# NOTA: EXPOSE es solo documentación, no publica el puerto
# El puerto real se mapea con:
# - docker run -p 8080:80 (mapeo manual)
# - docker-compose con VIRTUAL_PORT=80 (con reverse proxy)
EXPOSE 80

# ====================================================================
# FUNCIONAMIENTO AL EJECUTAR EL CONTENEDOR:
# ====================================================================
# 1. Nginx inicia automáticamente (CMD por defecto de nginx:alpine)
# 2. Escucha en el puerto 80 dentro del contenedor
# 3. Sirve archivos desde /usr/share/nginx/html/
# 4. Cuando alguien accede vía navegador:
#    GET / → Sirve /usr/share/nginx/html/index.html
#    GET /css/styles.css → Sirve /usr/share/nginx/html/css/styles.css
#    GET /js/main.js → Sirve /usr/share/nginx/html/js/main.js
#
# CONFIGURACIÓN DE NGINX:
# - Usa la configuración por defecto de nginx:alpine
# - Ideal para sitios estáticos (HTML, CSS, JS)
# - No requiere PHP, Python u otros lenguajes server-side
# ====================================================================

# ====================================================================
# CONSTRUCCIÓN Y EJECUCIÓN:
# ====================================================================
# Construir imagen:
#   docker build -t validacion-formularios .
#
# Ejecutar contenedor (modo prueba local):
#   docker run -d -p 8080:80 validacion-formularios
#   Acceder en: http://localhost:8080
#
# Con docker-compose (producción):
#   docker-compose up -d --build
#   Acceder en: http://validacion.docker.sulbaranjc.com
# ====================================================================
