const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.log('MongoDB error:', error.message))

// Create Student Schema and Model
const Student = mongoose.model('Student', {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  }
})

// CREATE - Add a student
app.post('/students', async (req, res) => {
  try {
    const student = await Student.create(req.body)
    res.status(201).json(student)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// READ - Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find()
    res.json(students)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// UPDATE - Update a student by ID
app.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.json(student)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// DELETE - Delete a student by ID
app.delete('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id)

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.json({ message: 'Student deleted successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Start server after MongoDB connects
mongoose.connection.once('open', () => {
  const PORT = process.env.PORT || 5000

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
})