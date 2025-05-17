FROM node:24
COPY . ./project
WORKDIR ./project
CMD npm run build
CMD npm run start
