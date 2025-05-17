FROM node:24
COPY . ./project
WORKDIR ./project
CMD npm run build
CMD npm run --prod --port 3000
