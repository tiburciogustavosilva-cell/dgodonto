# Site estático (LP + cartão digital) servido pelo Nginx.
# O HTTPS fica a cargo do Traefik; o container só expõe HTTP na porta 80.
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY index.html smart-card.html styles.css script.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
# Garante leitura pelo Nginx mesmo se o build vier de um disco com permissões restritas
RUN chmod -R a+rX /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
