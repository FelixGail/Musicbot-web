FROM ubuntu
WORKDIR /usr/src/app
RUN ["mkdir", "config"]
RUN ["apt", "update"]
RUN ["apt", "install", "nodejs", "npm", "-y"]
RUN ["npm", "install", "-g", "yarn"]
COPY ["production/", "./"]
RUN ["yarn", "install", "--frozen-lockfile"]
CMD ["yarn", "start"]
