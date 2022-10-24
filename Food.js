const mongoose = require('mongoose')

let Schema = mongoose.Schema

let Food = new Schema({
  emoji: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avaible: {
    type: Boolean,
    default: true
  },
  maxOrders: {
    type: Number,
    required: true
  }
})

Food.static('getButtons', async function getButtons(){
  let foods = await this.find({avaible: true})
  return foods.map(f => `${f.emoji} ${f.name} ${f.emoji}`)
})

Food.static('add', async function add(name, emoji, quantity){
  let duplicates = await this.find({name: name})
  if(duplicates.length !== 0)
    return
  if(isNaN(Number(quantity)))
    return
  return this.create({
    name: name,
    emoji: emoji,
    avaible: true,
    maxOrders: quantity
  })
})

Food.static('setUnavaible', async function setUnavaible(name){
  /*
  let f = await this.findOne({avaible: true, name: new RegExp(`^${name}$`, 'i')})
  if(!f)
    return
  f.avaible = false
  f.save()
  return
  */
  return await this.remove({name: new RegExp(`^${name}$`, 'i')})
})


Food.static('findByEmojiAndName', async function findByEmojiAndName(emoji, name){
  return await this.findOne({emoji: emoji, name: name})
})

Food.static('exists', async function exists(name){
  return await this.findOne({name: name})
})

module.exports = mongoose.model('Food', Food)
