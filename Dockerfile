# Imagen ligera de nginx
FROM nginx:alpine

# Limpiamos config por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiamos TODO el proyecto
COPY . /usr/share/nginx/html

# Puerto interno
EXPOSE 80
