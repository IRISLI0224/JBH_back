FROM node:14.16.0
# base image
WORKDIR /app
#defines the working directory of a Docker container 
COPY package*.json ./
#
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "index.js"]