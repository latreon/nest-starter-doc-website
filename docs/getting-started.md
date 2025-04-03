---
id: getting-started
title: Getting Started
---

# Getting Started

Follow these steps to start using the NestJS Starter Kit.

## Creating a New Project

The easiest way to get started is by using our CLI:

```bash
npx nestjs-starter-kit my-project
```

This will create a new project in the `my-project` directory with all the starter kit features pre-configured.

## Manual Installation

Alternatively, you can clone the repository:

1. Clone the repository:

```bash
git clone https://github.com/latreon/nest-starter-kit.git
cd nest-starter-kit
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration.

4. Start the development server:

```bash
npm run start:dev
# or
yarn start:dev
```

The API server should now be running at http://localhost:3000.

## Project Structure

```
src/
├── app.module.ts              # Main application module
├── main.ts                    # Application entry point
├── common/                    # Shared functionality
├── config/                    # Configuration modules
├── modules/                   # Feature modules
│   ├── auth/                  # Authentication module
│   ├── users/                 # Users module
│   └── ...                    # Other modules
└── ...
```

## Next Steps

After setting up your project, check out the following sections to learn more about the features and how to use them:

- [Architecture](architecture)
- [Authentication](features/authentication)
- [Database Configuration](configuration/database) 