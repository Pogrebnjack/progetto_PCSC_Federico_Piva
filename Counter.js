const mongoose = require('mongoose')

let Schema = mongoose.Schema

let Counter = new Schema({
  _id: {
    type: String
  },
  count: {
    type: Number,
    required: true
  }
})

Counter.static('getActualValue', async function getActualValue(counterName) {
  let c = await this.findOne({
    '_id': counterName
  })
  return c.count
})

Counter.static('nextValue', async function nextValue(counterName) {
  let c = await this.findOne({
    '_id': counterName
  })

  c.count += 1
  await c.save()
  return c.count
})

module.exports = mongoose.model('Counter', Counter)


