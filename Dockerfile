FROM node:20-alpine3.17
# ENV MONGO_DB_USERNAME=admin MONGO_DB_PASSWORD=password
RUN mkdir -p /home/app
COPY ./My-App /home/app
EXPOSE 3000
CMD ["node", "/home/app/server.js"]