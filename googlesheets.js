const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

let spreadsheetId = '1uqj0o9yIi7b8VzhHjo4x8NK-mOXhqzBhNcmcW_O77oE'
let apikey = 'AIzaSyCBuKnldRyNt3WtE0bcpioLPeZcruzq_j8'

class User {
  constructor(name, lastname, phone, payment, pr){
    this.name = name;
    this.lastname = lastname
    this.phone = phone
    this.payment = payment
    this.pr = pr
  }
}

async function getParticipantInfo(phone) {
  phone = phone.replace("+39", "").replace("+34", "").replace(/\ /g, "").trim()
  if(phone.charAt(0) == "3" && phone.charAt(1) == "9")
    phone = phone.replace("39", "")
  if(phone.charAt(0) == "3" && phone.charAt(1) == "4" && phone.length > 10)
    phone = phone.replace("34", "")

  const sheets = google.sheets({version: 'v4', auth: apikey});

  let res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: 'SagraFunky6!A2:E',
  })

  const rows = res.data.values;
  let user;
  for(let i = 0; i < rows.length; i++){
    let row = rows[i]
    let phone_fromgsheet = (row[2]+"").replace("+39", "").replace(/\ /g, "").trim()
    if(phone_fromgsheet === phone){
      user = new User(...row)
    }
  }

  return user
}


module.exports = {
  getParticipantInfo
}
