FROM node:24
COPY . ./project
WORKDIR ./project
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
