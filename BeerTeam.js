const mongoose = require('mongoose')

let Schema = mongoose.Schema

let BeerTeam = new Schema({
  owner: {
    type: String,
    required: true,
  },
  partner: {
    type: String,
    required: false,
  },
  points: {
    type: Number,
    default: 0,
  },
  belt: {
    type: Boolean,
    default: false,
  },
})

BeerTeam.static('findOrCreate', async function findOrCreate(user) {
  let t = await this.findOne({
    $or: [
      {owner: user.id},
      {partner: user.id}
    ]
  })

  if(t)
    return t

  t = this.create({
    owner: user.id
  }).catch(e => console.log(e))

  return t
})

BeerTeam.static('leave', async function leave(user) {
  let t = await this.findOne({
    $or: [
      {owner: user.id},
      {partner: user.id}
    ]
  })

  if(!t)
    return false

  if(t.owner == user.id) {
    t.owner = t.partner
  }
  t.partner = null
  t.save()

  return true
})

BeerTeam.static('setPartner', async function setPartner(owner, partner) {
  let t = await this.findOne({'owner': owner.id })
  if(t){
    t.partner = partner.id
    t.save()
    return
  }
})

module.exports = mongoose.model('BeerTeam', BeerTeam)
