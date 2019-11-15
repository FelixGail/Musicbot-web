FROM node:12-alpine
WORKDIR /usr/src/app
RUN ["mkdir", "config"]
RUN ["npm", "install", "-g", "yarn"]
COPY ["production/", "./"]
RUN ["yarn", "install", "--frozen-lockfile"]
CMD ["yarn", "start"]
