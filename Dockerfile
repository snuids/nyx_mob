FROM node:7.7
RUN npm i express
RUN apt-get update
RUN apt-get install vim -y
COPY ./start.sh /etc/opt/start.sh
COPY ./app.js /etc/opt/app.js
COPY ./dist/spa-mat /etc/opt/nyx_ui/spa-mat/
RUN ls -l /etc/opt/nyx_ui/spa-mat/
CMD /etc/opt/start.sh
