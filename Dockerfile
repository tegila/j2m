FROM node:alpine

# Create app directory
WORKDIR /usr/src/server

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

# If you are building your code for production
# RUN npm install --only=production
RUN yarn install

# Bundle app source
COPY . .

ENV DOCKER 1

CMD [ "yarn", "test" ]

EXPOSE 3000