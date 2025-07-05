import { MongoClient, ObjectId } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export interface Transaction {
  _id: string
  amount: number
  description: string
  date: Date
  category: string
  createdAt: Date
  updatedAt: Date
}

export async function getTransactions(): Promise<Transaction[]> {
  try {
    console.log("Fetching transactions...")
    const client = await clientPromise
    const db = client.db("finance-tracker")
    const transactions = await db.collection("transactions").find({}).sort({ date: -1, createdAt: -1 }).toArray()

    console.log(`Found ${transactions.length} transactions`)
    return transactions.map((t) => ({
      ...t,
      _id: t._id.toString(),
    })) as Transaction[]
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return []
  }
}

export async function getTransaction(id: string): Promise<Transaction | null> {
  try {
    console.log("Fetching transaction:", id)
    const client = await clientPromise
    const db = client.db("finance-tracker")
    const transaction = await db.collection("transactions").findOne({ _id: new ObjectId(id) })

    if (!transaction) {
      console.log("Transaction not found:", id)
      return null
    }

    return {
      ...transaction,
      _id: transaction._id.toString(),
    } as Transaction
  } catch (error) {
    console.error("Failed to fetch transaction:", error)
    return null
  }
}

export async function createTransaction(data: {
  amount: number
  description: string
  date: Date
  category: string
}): Promise<void> {
  try {
    console.log("Connecting to MongoDB...")
    const client = await clientPromise
    console.log("Connected to MongoDB")

    const db = client.db("finance-tracker")
    console.log("Using database: finance-tracker")

    const result = await db.collection("transactions").insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("Transaction inserted with ID:", result.insertedId)
  } catch (error) {
    console.error("Failed to create transaction:", error)
    throw error
  }
}

export async function updateTransaction(
  id: string,
  data: {
    amount: number
    description: string
    date: Date
    category: string
  },
): Promise<void> {
  try {
    console.log("Updating transaction:", id)
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const result = await db.collection("transactions").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
    )

    console.log("Transaction update result:", result)
  } catch (error) {
    console.error("Failed to update transaction:", error)
    throw error
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  try {
    console.log("Deleting transaction:", id)
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const result = await db.collection("transactions").deleteOne({ _id: new ObjectId(id) })
    console.log("Transaction delete result:", result)
  } catch (error) {
    console.error("Failed to delete transaction:", error)
    throw error
  }
}

export async function getMonthlyExpenses() {
  try {
    console.log("Fetching monthly expenses...")
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const pipeline = [
      {
        $match: {
          amount: { $lt: 0 },
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          expenses: { $sum: { $abs: "$amount" } },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]

    const results = await db.collection("transactions").aggregate(pipeline).toArray()
    console.log("Monthly expenses results:", results)

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    return results.map((result) => ({
      month: `${monthNames[result._id.month - 1]} ${result._id.year}`,
      expenses: result.expenses,
    }))
  } catch (error) {
    console.error("Failed to fetch monthly expenses:", error)
    return []
  }
}

export async function getCategoryBreakdown() {
  try {
    console.log("Fetching category breakdown...")
    const client = await clientPromise
    const db = client.db("finance-tracker")

    const pipeline = [
      {
        $group: {
          _id: "$category",
          total: { $sum: { $abs: "$amount" } },
          count: { $sum: 1 },
          type: { $first: { $cond: [{ $gt: ["$amount", 0] }, "income", "expense"] } },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]

    const results = await db.collection("transactions").aggregate(pipeline).toArray()
    console.log("Category breakdown results:", results)

    return results.map((result) => ({
      category: result._id,
      total: result.total,
      count: result.count,
      type: result.type,
    }))
  } catch (error) {
    console.error("Failed to fetch category breakdown:", error)
    return []
  }
}
