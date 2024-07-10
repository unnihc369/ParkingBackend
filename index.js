require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors') 
const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')
const vehicleRoutes = require('./routes/vehicle')
const parkinglotRoutes = require('./routes/parkingLot')
const parkingRoutes = require('./routes/parking')

// express app
const app = express()

// middleware
app.use(cors()) 
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/workouts', workoutRoutes)
app.use('/user', userRoutes)
app.use('/vehicle',vehicleRoutes)
app.use('/parkinglot',parkinglotRoutes)
app.use('/parking',parkingRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })
