FROM node:17.8-alpine

COPY . /srv

WORKDIR /srv

RUN npm install --force
RUN npm install -g serve
RUN npm install --save-dev @types/leaflet --force

RUN npm run build

CMD ["serve", "-s", "build", "-l", "3000"]
