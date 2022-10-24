const mongoose = require('mongoose')

let Schema = mongoose.Schema

let User = new Schema({
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
  id: {
    type: String,
    required: true,
    unique: true
  },
  table: {
    type: String,
    required: false
  },
  is_funky: {
    type: Boolean,
    default: false
  },
  phone_verified: {
    type: Boolean,
    default: false
  },
  greenpass_verified: {
    type: Boolean,
    default: false
  },
  active_participant: {
    type: Boolean,
    default: false
  },
})


User.static('findOrCreate', async function findOrCreate(user) {
  let u = await this.findOne({'id': user.id})
  if(u)
    return u

  u = this.create({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    username: user.username || '',
    id: user.id
  }).catch(e => console.log(e))

  return u
})

User.static('funky', async function funky(user){
  let u = await this.findOne({'id': user.id})
  return u.is_funky
})

User.static('verifyPhone', async function verifyPhone(user){
  let u = await this.findOne({'id': user.id})
  if(u){
    u.phone_verified = true
    // if(u.phone_verified && u.greenpass_verified)
    if(u.phone_verified)
      u.active_participant = true
    u.save()
    return
  }
})

User.static('verifyGreenpass', async function verifyGreepass(user){
  let u = await this.findOne({'id': user.id})
  if(u){
    u.greenpass_verified = true
    if(u.phone_verified && u.greenpass_verified)
      u.active_participant = true
    u.save()
    return
  }
})

User.static('updateName', async function updateName(user, first_name, last_name){
  let u = await this.findOne({'id': user.id})
  if(!u) return
  u.first_name = first_name
  u.last_name = last_name
  u.save()
  return
})

User.static('setTable', async function setTable(user, table){
  let u = await this.findOne({'id': user.id })
  if(u){
    u.table = table
    u.save()
    return
  }
  return await this.create({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    username: user.username || '',
    id: user.id,
    table: table
  })
})

User.static('getFullname', function getFullname(user){
  if(!user.first_name || !user.last_name)
    return user.first_name
  return user.first_name + ' ' + user.last_name
})

module.exports = mongoose.model('User', User)
