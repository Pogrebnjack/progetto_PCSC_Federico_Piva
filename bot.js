const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const KeyboardWrapper = require('node-telegram-keyboard-wrapper')


let fst = require(__dirname + '/googlesheets_party.js')
let __config = require(__dirname + '/config.json');

let Bot;

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

Bot.onText(/\/festa$/g, async (msg) => {
  if(msg.chat.type !== 'private')
    return

  
    Bot.sendHTMLMessage(msg.chat.id, 'Scegli la festa in cui vuoi andare', fst.lista_feste.build())
    Bot.on('callback_query', async query => {
    	Bot.sendHTMLMessage(msg.chat.id, 'Ecco il link per la festa ' + query.data)
    return
    })
    
})

