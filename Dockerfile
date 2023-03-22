################################################################
#Stage 1: Install the base dependencies
################################################################
FROM node:18-alpine3.17.2@sha256:ffc770cdc09c9e83cccd99d663bb6ed56cfaa1bab94baf1b12b626aebeca9c10 AS base

# Set maintainer and description labels
LABEL maintainer="ABHISHEK KUMAR SINGH <aksingh25@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Set the NODE_ENV to production
ENV NODE_ENV=production

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json /app/

# Install node dependencies as defined in the package-lock.json
RUN npm ci --only=production

################################################################
#Stage 2: Build and Serve the application
################################################################
FROM node:18-alpine3.17.2@sha256:ffc770cdc09c9e83cccd99d663bb6ed56cfaa1bab94baf1b12b626aebeca9c10 AS build

#Set the working directory
WORKDIR /app

#Copy the generated node_modules from the previous stage
COPY --from=base /app/ /app/

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD ["npm","start"]

# We run our service on port 8080
EXPOSE 8080






