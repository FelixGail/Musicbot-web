FROM ubuntu
RUN ["mkdir", "config"]
RUN ["apt", "update"]
RUN ["apt", "install", "nodejs", "npm", "-y"]
RUN ["npm", "install", "-g", "yarn"]
COPY ["production/", "./"]
RUN ["yarn", "install", "--frozen-lockfile"]
CMD ["yarn", "start"]
