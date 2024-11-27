# Usar una imagen base de Node.js
FROM node:16

# Crear y definir el directorio de trabajo
WORKDIR /app

# Copiar el package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias de Node.js
RUN npm install

# Copiar el resto de los archivos de tu proyecto
COPY . .

# Exponer el puerto 3000 (puerto de la aplicación Node.js)
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "server.js"]

