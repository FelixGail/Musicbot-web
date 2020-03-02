FROM node:12-alpine
WORKDIR /usr/src/app
RUN ["mkdir", "config"]
COPY ["production/", "./"]
RUN ["yarn", "install", "--frozen-lockfile"]
CMD ["yarn", "start"]
