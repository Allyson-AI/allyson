# Allyson - AI Web Agent

<p align="center">
  <img src="https://allyson.ai/allyson-og.png" alt="Allyson Logo" width="200"/>
</p>

Allyson is an AI web agent that handles online tasks for you. It can navigate websites, fill forms, collect data, manage files, and perform various web-based operations with persistence through S3 storage.

> **Note:** This codebase is still a work in progress for open source. We're actively refactoring and cleaning up the code to make it more accessible to the community.

## 🚀 Features

- **AI-Powered Web Automation**: Allyson can navigate websites, fill forms, and perform complex web tasks
- **File Operations**: Read, write, and manage files with persistence through S3 buckets
- **Session Management**: Track and manage user sessions with detailed logging
- **API Access**: Interact with Allyson through a RESTful API
- **Modern UI**: Beautiful and responsive user interface built with Next.js and Tailwind CSS

## 📋 Project Structure

This is a monorepo (using Turborepo) with the following structure:

### Apps

- **apps/api**: Backend API server (Node.js/Express)
- **apps/web**: Web application (Next.js)
- **apps/www**: Marketing website (Next.js) (WIP)
- **apps/docs**: Documentation (Mintlify)

### Packages

- **@allyson/ui**: Shared UI components
- **@allyson/lib**: Shared libraries and utilities
- **@allyson/models**: Database models (MongoDB/Mongoose)
- **@allyson/data**: Shared data structures and constants
- **@allyson/context**: React context providers
- **@allyson/hooks**: Custom React hooks
- **@allyson/configs**: Shared configuration files
- **@allyson/eslint-config**: Shared ESLint configuration
- **@allyson/typescript-config**: Shared TypeScript configuration

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: Clerk
- **Storage**: AWS S3
- **AI Integration**: OpenAI API
- **Monorepo Management**: Turborepo
- **Payment Processing**: Stripe, Solana (WIP), Coinbase (WIP)
- **Analytics**: PostHog


## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v10.2.3 or higher)
- MongoDB instance
- S3 bucket
- OpenAI API key
- Clerk account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/allyson.git
   cd allyson
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the root directory
   - Copy `apps/api/.env.example` to `apps/api/.env`
   - Copy `apps/web/.env.example` to `apps/web/.env`
   - Fill in the required environment variables

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🧩 Usage

### Web Interface

Access the web interface at `http://localhost:3000` to:
- Create and manage sessions
- View session history and details
- Configure settings
- Access the API console

### API

The API is available at `http://localhost:3030` with the following endpoints:

- `/v1/sessions`: Manage Allyson sessions
- `/v1/documents`: Manage documents
- `/v1/user`: User management
- `/v1/chat/completions`: OpenAI API proxy

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE). This means if you use this software as part of a service you offer to others, you must make the complete source code available to the users of that service under the same license.

1. AGPL-3.0 - Personal Use
2. Commercial License (Contact us for details)

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes between versions.
