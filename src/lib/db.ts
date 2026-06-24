import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
})

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})

export default prisma;
