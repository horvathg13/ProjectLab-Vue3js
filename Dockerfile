FROM node:lts-alpine

# set the working direction
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

# Fix permissions for packages
# RUN npm config set unsafe-perm true
RUN apk upgrade
RUN apk add git
RUN git clone https://github.com/horvathg13/ProjectLab-Vue3js.git
RUN cd ProjectLab-Vue3js
RUN npm install
RUN npm install vue-router@4
RUN npm i -s vue3-click-away
RUN npm install vuex@next --save

# Bundle app source
COPY . ./

RUN chown -R node:node /app/node_modules

# start app
CMD ["npm", "run", "dev", "--", "--host","0.0.0.0"]