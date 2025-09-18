import "server-only"
import { MongoClient, ServerApiVersion } from "mongodb"

const uri = process.env.MONGODB_URI as string

if (!uri) {
  console.warn("MONGODB_URI is not set. Using mock data only.")
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

export function getMongoClient(): Promise<MongoClient> {
  if (clientPromise) return clientPromise
  if (!uri) throw new Error("Missing MONGODB_URI")
  client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })
  clientPromise = client.connect()
  return clientPromise
}



