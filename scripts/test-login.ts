import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" })
const prisma = new PrismaClient({ adapter })

async function testSignIn() {
  const email = "admin@nexuserp.com"
  const password = "admin123"

  const user = await prisma.user.findUnique({
    where: { email }
  })

  console.log("User found:", !!user)
  if (!user) return

  const isValid = await bcrypt.compare(password, user.password!)
  console.log("Password valid:", isValid)
}

testSignIn().finally(() => process.exit())
