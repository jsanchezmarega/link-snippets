# Link Snippets

A Next.js application for saving and organizing useful URLs with tags and user management. Built with Prisma ORM, PostgreSQL, and Docker.

## Features

- **Link Management**: Add, edit, and delete links with titles and tags
- **User System**: Multiple users can save their own links
- **Tag Filtering**: Filter links by tags to find specific content
- **User Filtering**: Filter links by user
- **Pagination**: Browse through large collections of links with configurable page sizes
- **Sorting**: Sort links by date added, title, or URL in ascending or descending order
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Hot reload during development

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Development**: Docker & Docker Compose
- **Testing**: Jest, React Testing Library
- **Code Quality**: ESLint, Prettier, Husky (Git hooks)

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd link-snippets
   ```

2. **Create environment file**

   ```bash
   # Create .env file with the following content:
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=linksnippets
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/linksnippets
   ```

3. **Start the application**

   ```bash
   docker compose up -d
   ```

4. **Run database migrations and seed**

   ```bash
   docker compose exec app npx prisma migrate dev
   docker compose exec app npx prisma db seed
   ```

5. **Access the application**
   - Open http://localhost:3000 in your browser

## Development

### Running Locally

```bash
# Start the database
docker compose up db -d

# Install dependencies
npm install

# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start the development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

## API Endpoints

### Links

- `GET /api/links` - Get all links with pagination and sorting
  - Query parameters:
    - `page` (number): Page number (default: 1)
    - `limit` (number): Items per page (default: 10)
    - `orderBy` (string): Sort field (createdAt, title, url)
    - `order` (string): Sort direction (asc, desc)
    - `userId` (number): Filter by user ID
    - `tag` (string): Filter by tag

- `POST /api/links` - Create a new link
- `PATCH /api/links` - Update a link
- `DELETE /api/links` - Delete a link

### Users

- `GET /api/users` - Get all users

## Testing

The application includes comprehensive tests for all components:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── components/    # React components
│   └── page.tsx      # Main page
├── lib/
│   └── prisma.ts     # Prisma client
└── types/
    └── link.ts       # TypeScript types
```

## Database Schema

The application uses PostgreSQL with the following main entities:

- **User**: Users who can save links
- **Link**: URLs with metadata (title, tags, creation date)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is for learning and portfolio purposes.
