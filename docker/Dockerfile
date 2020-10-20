FROM node:14

WORKDIR /app
RUN npm install express

COPY index.js /app/index.js
COPY build/ /app/html/

CMD [ "node", "index.js" ]
