# Use the official Node.js image as our base
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy packege.json and packege-lock.json first to leverage Docker cache
COPY package*.json ./

# Install app dependencies [its run while building the image]
RUN npm install

# Copy the rest of our app's source code into the container
COPY . .

# Expose the port the app will run on
EXPOSE 5001

# The command to run our app [its run when we run the container]
CMD [ "npm" , "run" , "dev" ]

