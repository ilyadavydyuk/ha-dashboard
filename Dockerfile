FROM node:20-alpine

WORKDIR /app

# Копируем исходники и устанавливаем зависимости
COPY app/package*.json ./
RUN npm ci

COPY app/ ./

COPY run.sh /run.sh
RUN chmod +x /run.sh

EXPOSE 3000
CMD ["/run.sh"]
