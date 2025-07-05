# Personal Finance Visualizer

A simple web application for tracking personal finances built with Next.js, React, shadcn/ui, Recharts, and MongoDB.

## Features (Stage 1)

- ✅ Add/Edit/Delete transactions (amount, date, description)
- ✅ Transaction list view with search and filtering
- ✅ Monthly expenses bar chart visualization
- ✅ Basic form validation with error handling
- ✅ Responsive design for mobile and desktop
- ✅ Real-time data updates

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or cloud)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd personal-finance-visualizer
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a \`.env.local\` file in the root directory:
\`\`\`
MONGODB_URI=your_mongodb_connection_string
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Transactions
1. Click "Add Transaction" from the dashboard or transactions page
2. Fill in the transaction details:
   - Type (Income/Expense)
   - Amount (positive number)
   - Date
   - Description
3. Click "Create Transaction"

### Managing Transactions
- View all transactions in the transactions list
- Edit transactions by clicking the edit button
- Delete transactions with confirmation dialog
- Transactions are automatically sorted by date (newest first)

### Dashboard Features
- Summary cards showing total income, expenses, and net balance
- Monthly expenses bar chart for the last 6 months
- Recent transactions list with quick access

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                 # Dashboard
│   ├── transactions/
│   │   ├── page.tsx            # Transaction list
│   │   ├── new/page.tsx        # Add transaction
│   │   └── [id]/edit/page.tsx  # Edit transaction
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── transaction-form.tsx    # Transaction form component
│   ├── transaction-list.tsx    # Transaction list component
│   ├── monthly-chart.tsx       # Bar chart component
│   └── recent-transactions.tsx # Recent transactions component
├── lib/
│   └── transactions.ts         # Database operations
└── README.md
\`\`\`

## Database Schema

### Transactions Collection
\`\`\`typescript
{
  _id: ObjectId
  amount: number        // Positive for income, negative for expenses
  description: string   // Transaction description
  date: Date           // Transaction date
  createdAt: Date      // Record creation timestamp
  updatedAt: Date      // Record update timestamp
}
\`\`\`

## Deployment

The application can be deployed to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your \`MONGODB_URI\` environment variable in Vercel dashboard
4. Deploy

## Future Enhancements (Stages 2 & 3)

- **Stage 2**: Categories, pie charts, enhanced dashboard
- **Stage 3**: Budgeting, budget vs actual comparisons, spending insights

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
\`\`\`

## Environment Variables

Make sure to set up your MongoDB connection string in \`.env.local\`:

\`\`\`
MONGODB_URI=mongodb://localhost:27017/finance-tracker
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker
\`\`\`
