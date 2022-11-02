const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const KeyboardWrapper = require('node-telegram-keyboard-wrapper')
const emoji = require('node-emoji').emoji

let spreadsheetId = '1eblCaLfd0j7O357cxfFS6OQj1RF3oQc1HLCCNPwOrWY'
let apikey = 'AIzaSyBiM_zYEIhyhC1yRUCVD49DMZw3O2G10Ho'

	class Party {
	  constructor(name, date, link){
	    this.name = name;
	    this.date = date;
	    this.link = link;
  }
}

const selectPartyKeyboard = new KeyboardWrapper.InlineKeyboard()
getPartyInfo();

async function getPartyInfo() {
	console.log('ciaoooo');
  const sheets = google.sheets({version: 'v4', auth: apikey});
  console.log('suuud');
  let res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: 'ListaParty2022!A2:C',
  })
  
  const rows = res.data.values;
  console.log(rows.length);
  let party;
  for(let i = 0; i < rows.length; i++){
    let row = rows[i]
    selectPartyKeyboard.addRow({
		text: rows[i][0],
		callback_data:  rows[i][2]
	})
    party = new Party(...row)
  }

  return party
}




/*for(festa in Party){
	console.log(festa.nome);
	console.log('cane');
	selectPartyKeyboard.addRow({
		text: 'FestivalFunky',
		callback_data:  'https://t.me/festivalfunky_bot'
	})
	selectPartyKeyboard.addRow({
		text: 'Battesimo Luca',
		callback_data:  '@battesimoluca_bot'
	})
}
*/

module.exports = {
  dati_feste: getPartyInfo,
  lista_feste: selectPartyKeyboard,
}

