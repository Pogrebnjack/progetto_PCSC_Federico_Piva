const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const KeyboardWrapper = require('node-telegram-keyboard-wrapper')
const mongoose = require('mongoose')

let gsheets = require(__dirname + '/googlesheets.js')
let _LANG = require(__dirname + '/lang.js')
let db = require(__dirname + '/database/mongoose.js')
let Order = require(__dirname + '/model/Order.js')
let Counter = require(__dirname + '/model/Counter.js')
let User = require(__dirname + '/model/User.js')
let Food = require(__dirname + '/model/Food.js')
let BeerTeam = require(__dirname + '/model/BeerTeam.js')
let kb = require(__dirname + '/keyboards.js')
let __config = require(__dirname + '/config.json');

let Bot;

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

TelegramBot.prototype.sendMessageSafe = function(chatId, msg, opts) {
  try {
    this.sendMessage(chatId, msg, opts)
  } catch(error) {
    console.error(error)
  }
}

TelegramBot.prototype.sendHTMLMessage = function(chatId, msg, opts) {
  if(!opts)
    opts = { parse_mode: 'HTML' }
  else
    opts.parse_mode = 'HTML'
  this.sendMessageSafe(chatId, msg, opts)
}

Bot = new TelegramBot(__config.debug_token, {
  polling: true
});

// Bot.prototype.sendMessageSafe = (chatId, msg, opts) => {
//   console.log(this)
// }


Counter.find({}).countDocuments().exec().then((res) => {
  if(res === 0){
    console.log("Initializing counter...")
    Counter.create({ _id: 'order', count: 0 })
  }
})

Bot.on("contact", async (msg)=>{
  if(msg.contact.user_id !== msg.from.id)
    return

  let phone = msg.contact.phone_number
  let user = await gsheets.getParticipantInfo(phone)
  if(!user){
    Bot.sendHTMLMessage(msg.chat.id, 'C\'è stato un errore, parla con un membro del Funky')
    return
  }

  if(!user.payment || user.payment == ""){
    Bot.sendHTMLMessage(msg.chat.id, 'Sembra che tu non abbia pagato, parla con un membro del Funky')
    return
  }

  User.verifyPhone(msg.from)
  User.updateName(msg.from, user.name, user.lastname)

  await Bot.sendMessage(msg.chat.id, 'Confermato! Benvenuto alla Sagra Funky')
  await Bot.sendMessage(msg.chat.id, 'Clicca sul tavolo in cui sei seduto', kb.table.build())
 // await Bot.sendMessage(msg.chat.id, 'Se per qualsiasi motivo preferisci non inviarlo, vai da qualcuno dei Tekno Funky e fattelo verificare a mano da loro')
})

Bot.on('photo', async (msg) => {
  if(msg.chat.type !== 'private'){
    return
  }

  let user = await User.findOne({ id: msg.from.id })
  if(!user || !user.is_funky){
    return
  }

  let file_id = msg.photo[msg.photo.length-1].file_id

  let participants = await User.find({})
  Bot.sendHTMLMessage(msg.chat.id, `Sto mandando la foto a tutti i partecipanti (${participants.length})...`)
  participants.forEach(async (participant) => {
    Bot.sendPhoto(participant.id, file_id).catch(e => {
      Bot.sendMessage(msg.chat.id, `Non sono riuscito a mandare la foto a ${participant.first_name} ${participant.last_name}`)
    })
  })
})


Bot.onText(/\/start.*/g, async (msg) => {
  if(msg.chat.type !== 'private')
    return

  let user = await User.findOrCreate(msg.from)
  if(!user) return

  if(user && user.active_participant){
    Bot.sendHTMLMessage(msg.chat.id, 'Clicca sul tavolo in cui sei seduto', kb.table.build())
    return
  }

  let reqPhone = {
    "reply_markup": {
      "one_time_keyboard": true,
      "keyboard": [[{
        text: "Invia numero di telefono",
        request_contact: true
      }]]
    }
  }
  Bot.sendHTMLMessage(msg.chat.id, 'Per verificare che tu abbia pagato dobbiamo conoscere il tuo numero di telefono, clicca sul bottone sottostante', reqPhone)
})

Bot.onText(/\/addtable (.*)/g, async (msg, match) => {
  if(msg.chat.type !== 'private')
    return
    
  match[1] = Number(match[1])
  let users = await User.find({'id': `${msg.from.id}`})
  
  if(!users || users.length == 0 || !users[0].is_funky)
    return

  if(match[1] <= 0 || match[1] >= 26 )
    return
  
  Bot.sendHTMLMessage(msg.chat.id, 'Sono stati inseriti ' + match[1] + ' tavoli', kb.n_tavoli(match[1]))
})

Bot.onText(/\/removetable$/g, async (msg, match) => {
  if(msg.chat.type !== 'private')
    return
    
  let users = await User.find({'id': `${msg.from.id}`})
  
  if(!users || users.length == 0 || !users[0].is_funky)
    return
  
  Bot.sendHTMLMessage(msg.chat.id, 'I tavoli sono stati eliminati', kb.elimina())
})

Bot.onText(/\/addfood$/g, async (msg, match) => {
  Bot.sendHTMLMessage(msg.from.id, `Il comando è<pre>/addfood NOME EMOJI MAXQUANTITA</pre>`)
})

Bot.onText(/\/addfood (.+) (.+) (.+)/g, async (msg, match) => {
  if(msg.chat.type !== 'private')
    return

  let users = await User.find({'id': `${msg.from.id}`})

  if(!users || users.length == 0 || !users[0].is_funky){
    Bot.sendHTMLMessage(msg.from.id, `Non hai il permesso di fare questa cosa.`)
    return
  }

  if(match.length < 4){
    Bot.sendHTMLMessage(msg.from.id, `Il comando è \`/addfood NOME EMOJI MAXQUANTITA'`)
    return
  }

  let food = await Food.add(match[1], match[2], match[3])
  if(!food){
    Bot.sendHTMLMessage(msg.from.id, `Questo cibo esiste già o hai sbagliato il comando`)
    return
  }

  users = await User.find({active_participant: true})
  users.forEach(async user => {
    Bot.sendHTMLMessage(user.id, `Nuovo Cibo: ${match[2]} ${match[1]} ${match[2]} (Ne puoi ordinare al massimo ${match[3]})`, (await kb.menu()).open())
  })
})

Bot.onText(/\/removefood (.*)/g, async (msg, match) => {
  if(msg.chat.type !== 'private')
    return
/* Il comando è \`/removefood NOME` 
 */
  let users = await User.find({'id': `${msg.from.id}`})
  let food = await Food.findOne({ avaible: true, name: new RegExp(`^${match[1]}$`,'i') })

  if(!users || users.length == 0 || !users[0].is_funky)
    return

  if(!food || !food.avaible)
    return

  await Food.setUnavaible(match[1])

  users = await User.find({active_participant: true})
  users.forEach(async user => {
    Bot.sendHTMLMessage(user.id, `${food.emoji} ${food.name} ${food.emoji} non è più disponibile!`, (await kb.menu()).open())
  })
})

Bot.onText(/\/id$/g, async (msg, match) => {
  if(msg.chat.type !== 'private')
    return

  let users = await User.find({'id': `${msg.from.id}`})
  if(!users || users.length <= 0)
    return
  let user = users[0]

  let info_msg = `<b>Queste sono tutte le informazioni che abbiamo su di te:</b>\n`
  if(user.first_name)
      info_msg += `Nome: ${user.first_name}\n`
  if(user.last_name)
      info_msg += `Cognome: ${user.last_name}\n`
  if(user.username)
      info_msg += `Username: ${user.username}\n`
  if(user.table)
      info_msg += `Tavolo: ${user.table}\n`
  info_msg += `Membro Funky: ${user.is_funky}\n`
  info_msg += `Verificato: ${user.active_participant}\n`
  info_msg += `Chat Id: ${user.id}\n`
  Bot.sendHTMLMessage(msg.chat.id, info_msg)
})

Bot.onText(/\/broadcast (.*)+/g, async (msg, match) => {
  if(msg.chat.type !== 'private')
    return

  let users = await User.find({'id': `${msg.from.id}`})
  if(!users || users.length == 0 || !users[0].is_funky)
    return

  users = await User.find({})
  users.forEach(async user => {
    Bot.sendMessage(user.id, match[1]).catch(e => {})
  })
})



Bot.onText(/\/promote (\d+)/g, async (msg, match) => {
  if(msg.chat.type !== 'private'){
    console.log(`Someone tried to execute /promote without permissions`)
    console.log(msg)
    return
  }

  let users = await User.find({'id': `${msg.from.id}`})

  if(!users || users.length == 0 || !users[0].is_funky){
    return
  }
  if(match.length < 1){
    return
  }

  let to_promote = await User.findOne({'id': `${match[1]}`})
  if(!to_promote){
    return
  }

  to_promote.is_funky = true
  to_promote.save()

  Bot.sendHTMLMessage(msg.chat.id, 'Fatto')
  Bot.sendHTMLMessage(match[1], 'Da un grande potere derivano grandi responsabilità.')
})

Bot.onText(/\/depromote (\d+)/g, async (msg, match) => {
  if(msg.chat.type !== 'private'){
    console.log(`Someone tried to execute /promote without permissions`)
    console.log(msg)
    return
  }

  let users = await User.find({'id': `${msg.from.id}`})

  if(!users || users.length == 0 || !users[0].is_funky){
    return
  }
  if(match.length < 1){
    return
  }

  let to_promote = await User.findOne({'id': `${match[1]}`})
  if(!to_promote){
    return
  }

  to_promote.is_funky = false
  to_promote.save()

  Bot.sendHTMLMessage(msg.chat.id, 'Fatto')
})

Bot.onText(/\/reset.*/g, async (msg, match) => {
  if(msg.chat.type !== 'private'){
    console.log(`Someone tried to execute /reset without permissions`)
    console.log(msg)
    return
  }

  let users = await User.find({'id': `${msg.from.id}`})

  if(!users || users.length == 0 || !users[0].is_funky){
    return
  }

  await Counter.remove({})
  await Counter.create({ _id: 'order', count: 0 })
  await Order.remove({})
  Bot.sendHTMLMessage(msg.chat.id, 'Reset effettuato')
})


Bot.on('text', async msg => {
  if(msg.text.match(/^\/start.*/g)) return
  if(msg.text.match(/^\/reset.*/g)) return
  let user = await User.findOrCreate(msg.from)
  let rg = /([^\ \/]+)\ (.+)\ ([^\ ]+)/g.exec(msg.text)
  if(!rg || rg.length < 3)
    return
  let f = await Food.findByEmojiAndName(rg[1], rg[2])

  if(msg.text.match(/^\/.*/g))
    return

  if(msg.chat.type !== 'private')
    return

  if(!msg.text.match(/([^\ ]+)\ .+\ ([^\ ]+)/g))
    return

  if(rg[1] !== rg[rg.length-1])
    return

  if(!user.active_participant){
    Bot.sendHTMLMessage(msg.chat.id, 'Non hai ancora verificato il tuo numero di telefono. Usa /start per verificarlo.\nPer qualsiasi problema contatta un membro del Funky.')
    return
  }

  if(!f || !f.avaible){
    Bot.sendHTMLMessage(msg.chat.id, 'Il cibo è finito :(')
    return
  }

  if(!user.table || user.table === ''){
    Bot.sendHTMLMessage(user.id, 'Prima seleziona il tavolo su cui sei seduto', kb.table.build())
    return
  }

  let orderMadeByUser = await Order.find({userid: user.id, food: msg.text}).countDocuments()
  if(orderMadeByUser >= f.maxOrders){
    Bot.sendHTMLMessage(user.id, 'Hai effettuato troppi ordini per questo cibo, riprova più tardi oppure ordina qualcos\'altro',
      (await kb.menu()).open())
    return
  }

  let order = await Order.create({
    userid: user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    table: user.table,
    food: msg.text,
    queue: await Counter.nextValue('order')
  })

  Bot.sendHTMLMessage(msg.chat.id, `Ordine effettuato! Il tuo ordine è il numero ${await Counter.getActualValue('order')}`, (await kb.menu()).open())
  Bot.sendHTMLMessage(
    __config.groups[user.table],
    _LANG('ORDERINFO', [order.queue, User.getFullname(user), order.food, 'Da fare']),
    kb.griglia.build()
  )
})

Bot.on('callback_query', async query => {
  let user = await User.findOrCreate(query.from)
  if(!user) return

  if(query.data.length === 1){
    User.setTable(user, query.data)
    Bot.answerCallbackQuery(query.id, {text: ``, show_alert: false}) // this is to avoid the keep loading bug
    Bot.sendHTMLMessage(query.from.id, `Sei seduto nel tavolo <pre>${query.data}</pre>!`, (await kb.menu()).open())
    return
  }

  let orderid = /Ordine: (\d+)/g.exec(query.message.text)[1]
  let name = /Nome: (.+)/g.exec(query.message.text)[1]

  let or = await Order.findOne({queue: orderid})

  let opts = {
    chat_id: query.message.chat.id,
    message_id: query.message.message_id,
    parse_mode: 'HTML'
  }

  if(query.data === 'griglia'){
    opts.reply_markup = kb.completo.build().reply_markup
    Bot.editMessageText(_LANG('ORDERINFO', [or.queue, name, or.food, 'Sulla griglia']), opts)
  } else if(query.data === 'completo'){
    Bot.editMessageText(_LANG('ORDERINFO', [or.queue, name, or.food, 'Completato']), opts)
    Bot.sendMessage(or.userid, `Il tuo ordine N°${or.queue} è pronto!`)
  }
})
