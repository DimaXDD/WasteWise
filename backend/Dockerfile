# Используем официальный образ Node.js
FROM node:16

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Переустанавливаем bcrypt для Linux
RUN npm rebuild bcrypt --update-binary

# Открываем порт, который использует приложение
EXPOSE 8082

# Команда для запуска приложения
CMD ["node", "server.js"]