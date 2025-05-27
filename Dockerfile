FROM node:24
COPY . ./project
WORKDIR ./project
RUN npm run build
CMD npm run --prod --p 3000
