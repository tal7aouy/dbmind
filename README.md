# DB Mind - Database Schema Generator

DB Mind is an interactive web application that generates database schemas from natural language descriptions. It uses AI to convert text descriptions into detailed database designs, complete with tables, columns, and relationships.

## Features

- **Natural Language Input**: Simply describe your database requirements in plain English
- **Real-time Visualization**: Instantly see your database schema rendered as an interactive diagram
- **Interactive Schema Display**: Drag and zoom to explore complex database relationships
- **Support for Complex Relationships**: Handles one-to-one, one-to-many, and many-to-many relationships

## Getting Started

1. Clone the repository
```bash
git clone git@github.com:tal7aouy/dbmind.git
```
2. Install dependencies:
```bash
npm install
```

3. Create a .env file and add your Google API key:
```
GOOGLE_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Enter a description of your database needs in the text area (e.g., "Create a blog system with users, posts, and comments")
2. Click "Generate Schema" to create your database design
3. The resulting schema will be displayed as an interactive diagram
4. Drag tables to rearrange them and use mouse wheel to zoom in/out

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [D3.js](https://d3js.org/) - Visualization library
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI model for schema generation
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Development

To run linting:
```bash
npm run lint
```

To build for production:
```bash
npm run build
```
