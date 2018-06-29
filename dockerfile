FROM nginx
RUN mkdir -p /usr/src/nginx-config-editor
WORKDIR /usr/src/nginx-config-editor
COPY package.json /usr/src/nginx-config-editor/
RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install npm
RUN npm install
COPY . /usr/src/nginx-config-editor
EXPOSE 7676
CMD [ "node", "server.js" ]
