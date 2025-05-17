FROM node:24
COPY . ./project
WORKDIR ./project
CMD npm install next@latest react@latest react-dom@latest
CMD npm run build
CMD npm run start
