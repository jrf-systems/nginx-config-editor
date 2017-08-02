FROM jacfearsome/nginx-demo
RUN mkdir -p /usr/src/nginx-config-editor
WORKDIR /usr/src/nginx-config-editor
COPY package.json /usr/src/nginx-config-editor/
RUN npm install
COPY . /usr/src/nginx-config-editor
EXPOSE 7676
CMD [ "node", "server.js" ]
