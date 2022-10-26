const KeyboardWrapper = require('node-telegram-keyboard-wrapper')
const emoji = require('node-emoji').emoji

let Food = require(__dirname + '/model/Food.js')

const grigliaKeyboard = new KeyboardWrapper.InlineKeyboard()
grigliaKeyboard.addRow({
  text: `Griglia`,
  callback_data: `griglia`
})

const completatoKeyboard = new KeyboardWrapper.InlineKeyboard()
completatoKeyboard.addRow({
  text: `Completato`,
  callback_data: `completo`
})

async function getMenuKeyboard(){
  const menuKeyboard = new KeyboardWrapper.ReplyKeyboard()
  let foods = await Food.getButtons()
  for(let i = 0; i < foods.length; i+=2){
    if(foods[i] && foods[i+1])
      menuKeyboard.addRow(foods[i], foods[i+1])
    else
      menuKeyboard.addRow(foods[i])
  }
  return menuKeyboard
}

const selectTableKeyboard = new KeyboardWrapper.InlineKeyboard()
const tableName = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','X','Y','W','Z']

async function addTable(n_table){
	  console.log(n_table);
	  console.log('ciao');
	  for(let i = 0; i < n_table; i++){
		  console.log('suca');
		  console.log(tableName[i]);
		  selectTableKeyboard.addRow({
			  text: tableName[i],
			  callback_data:  tableName[i]
		  })
	  }
	}

async function eliminaTable(){
	var count = selectTableKeyboard.length
	console.log(selectTableKeyboard.length);
	  for(let i = 0; i < count; i++){
		  console.log('urca');
		  selectTableKeyboard.popRow();
	  }
	}

/*selectTableKeyboard.addRow({
  text: `A`,
  callback_data: `A`
},{
  text: `B`,
  callback_data: `B`
},{
  text: `C`,
  callback_data: `C`
})
selectTableKeyboard.addRow({
  text: `D`,
  callback_data: `D`
},{
  text: `E`,
  callback_data: `E`
},{
  text: `F`,
  callback_data: `F`
})
selectTableKeyboard.addRow({
  text: `G`,
  callback_data: `G`
},{
  text: `H`,
  callback_data: `H`
},{
  text: `I`,
  callback_data: `I`
})
selectTableKeyboard.addRow({
  text: `J`,
  callback_data: `J`
},{
  text: `K`,
  callback_data: `K`
},{
  text: `L`,
  callback_data: `L`
})
selectTableKeyboard.addRow({
  text: `M`,
  callback_data: `M`
},{
  text: `N`,
  callback_data: `N`
},{
  text: `O`,
  callback_data: `O`
})
*/
module.exports = {
  griglia: grigliaKeyboard,
  completo: completatoKeyboard,
  table: selectTableKeyboard,
  n_tavoli: addTable,
  elimina: eliminaTable,
  menu: getMenuKeyboard,
}
