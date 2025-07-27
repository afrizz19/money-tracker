# Money Tracker

A modern money tracking application built with Next.js, TypeScript, and MySQL. Track your income, expenses, and maintain a clear overview of your financial status.

## Features

- 🎯 **Income & Expense Tracking**: Add and categorize your financial transactions
- 💰 **Real-time Balance Calculation**: See your current balance after all transactions
- 📊 **Financial Overview**: View total income, expenses, and net balance
- 📅 **Date & Time Tracking**: Record when each transaction occurred
- 🗑️ **Transaction Management**: Delete transactions as needed
- 🎨 **Modern UI**: Clean black and white theme with responsive design

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather Icons)
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd money-tracker
   ```

2. **Start the MySQL database**
   ```bash
   docker-compose up -d
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=moneytracker
   DB_PASSWORD=moneytracker123
   DB_NAME=money_tracker
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

The application automatically creates the necessary database tables when you first start the MySQL container. The database includes:

- **transactions**: Stores all income and expense records
- **settings**: Stores user preferences like initial balance

## Usage

1. **Add Transactions**: Click "Add Transaction" to record income or expenses
2. **Track Usage**: Use the "Usage" field to categorize your transactions
3. **Monitor Balance**: View your current balance in the summary cards
4. **Manage Transactions**: Delete transactions using the trash icon

## API Endpoints

- `GET /api/transactions` - Fetch all transactions
- `POST /api/transactions` - Create a new transaction
- `DELETE /api/transactions/[id]` - Delete a transaction
- `GET /api/settings` - Fetch user settings

## Project Structure

```
money-tracker/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── transactions/
│   │   │   └── settings/
│   │   └── page.tsx
│   ├── lib/
│   │   └── db.ts
│   └── types/
│       └── index.ts
├── database/
│   └── init.sql
├── docker-compose.yml
└── README.md
```

## Development

- **Database**: The MySQL database runs in a Docker container
- **Hot Reload**: Next.js provides automatic reloading during development
- **Type Safety**: Full TypeScript support for better development experience

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. Ensure your MySQL database is accessible and properly configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
