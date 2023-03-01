FROM node:17.3.0
LABEL key="rct"
ADD . /app
WORKDIR /app

COPY package.json ./app
RUN npm install --registry https://registry.npm.taobao.org

# CMD ["npm", "run", "dev"]
CMD node app.js