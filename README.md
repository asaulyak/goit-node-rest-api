# Project Name

A brief description of your project.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository

   ```sh
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables. At the very least, you'll need:
   ```sh
   PORT=3000
   DB_PASSWORD=db_password
   DB_USER=db_user
   DB_HOST=db_host
   JWT_SECRET=your_secret_key
   ```

## Usage

1. Start the server

   ```sh
   npm start
   ```

2. The server should now be running at `http://localhost:3000`

## Scripts

- `npm start`: Starts the server.
- `npm run dev`: Starts the server with auto-reloading using nodemon.
- `npm test`: Runs Jest tests.
- `npm run lint`: Runs ESLint to check for linting errors.
- `npm run coverage`: Runs Jest and collects test coverage.

## DB setup
Add extension to enable DB generating uuids
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
