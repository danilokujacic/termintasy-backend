# Step 1: Use Node.js as the base image
FROM node:18-alpine

# Step 2: Set the working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the application
RUN npm run build


# Copy entrypoint script for migrations and seeding
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the entrypoint to handle migrations and start both applications
ENTRYPOINT ["/entrypoint.sh"]

# Step 7: Expose the port the app runs on
EXPOSE 3000

# Step 8: Define the command to run the application
CMD ["npm", "run", "start:prod"]
