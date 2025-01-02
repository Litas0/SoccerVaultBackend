import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import leaguesRouter from './routes/leagues.js'
import teamsRouter from './routes/teams.js'
import calendarRouter from './routes/calendar.js'
import config from './config.js'

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message)
  })

const app = express()
app.use(cors());
app.use(express.json())
app.use(clerkMiddleware())
app.use("/api/leagues", leaguesRouter)
app.use("/api/teams", teamsRouter)
app.use("/api/calendar", calendarRouter)

export default app

