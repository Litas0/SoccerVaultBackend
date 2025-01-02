import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY
const CLERK_SIGN_IN_URL = process.env.CLERK_SIGN_IN_URL

export default {
  MONGODB_URI,
  PORT,
  CLERK_SECRET_KEY,
  CLERK_SIGN_IN_URL
}
