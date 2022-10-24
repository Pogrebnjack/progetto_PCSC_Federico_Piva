const mongoose = require('mongoose')

let Schema = mongoose.Schema

let Order = new Schema({
  first_name: {
    type: String,
    required: false
  },
  last_name: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: false
  },
  userid: {
    type: String,
    required: true
  },
  table: {
    type: String,
    required: true
  },
  queue: {
    type: Number,
    required: true
  },
  food: {
    type: String,
    required: true
  },
  timestamp: {
    default: Date.now,
    type: Date,
    required: true
  },
  completed: {
    default: false,
    type: Boolean,
    required: true
  }
})

module.exports = mongoose.model('Order', Order)

