let crypto = require('crypto')
//let xrpl   = require('xrpl')

function log(...args){ 
  console.warn(...args)
}

function hit(req, ...args){ 
  console.warn(new Date().toJSON().substr(5,14).replace('T',' '), req.path, ...args) 
  //console.warn('MEM', process.memoryUsage())
}


function getSession(req) {
  let session = {
    account:   req.cookies.account,
    apikey:    process.env.LIGHTHOUSE,
    explorer:  process.env.EXPLORER,
    network:   process.env.NETWORK,
    rpcurl:    process.env.RPC_URL,
    theme:     req.cookies.theme || 'lite'
  }
  return session
}

function locationName(loc) {
  let locs = {lnd:'London', dub:'Dubai', bnk:'Bangkok', klm:'Kuala Lumpur', sgp:'Singapore'}
  let name = locs[loc] || ''
  return name
}

function money(num, dec=2, curr) {
  const formatter = new Intl.NumberFormat('en-US', {
    //style: 'currency',
    //currency: 'USD',
    minimumFractionDigits: dec, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    maximumFractionDigits: dec  // (causes 2500.99 to be printed as $2,501)
  });
  let fmt = formatter.format(num)
  if(curr){
    fmt = '$'+fmt
  }
  return fmt
}

function titleCase(text) {
  return text[0].toUpperCase()+text.substr(1)
}

async function randomAddress() {
  let buf = await crypto.randomBytes(20)
  let adr = '0x'+buf.toString('hex')
  return adr
}

async function randomAssetID() {
  //let buf = await crypto.randomBytes(3)
  //let adr = buf.toString('hex').toUpperCase()
  let aid = parseInt(Math.random()*1000000).toString().padStart(6,'0')
  return aid
}

function stringToHex(str) {
    //return Buffer.from(str, 'utf8').toString('hex').toUpperCase();
    var hex = ''
    for (var i=0; i<str.length; i++) {
        hex += Number(str.charCodeAt(i)).toString(16)
    }
    return hex.toUpperCase()
}

function hexToString(hex) {
    var str = ''
    for (var i=0; i<hex.length; i+=2) {
        str += String.fromCharCode(parseInt(hex.substr(i,2),16))
    }
    return str
}

function tokenCode(str){
  return '01'+stringToHex(str).padEnd(38,'0')
  //return '01'+Buffer.from(str, 'utf8').toString('hex').toUpperCase().padEnd(38,'0')
  //return '01'+xrpl.convertStringToHex(str).padEnd(38,'0')
}

function tokenSymbol(hex){
  return hexToString(hex.substr(2)).replace(/\0/g, '')
  //return xrpl.convertHexToString(hex.substr(2))
}

/*
function tokenCode(txt){
  return '01'+xrpl.convertStringToHex(txt).padEnd(38,'0')
}

function tokenSymbol(hex){
  return xrpl.convertHexToString(hex.substr(2))
}
*/


module.exports = {
  getSession,
  hexToString,
  hit,
  log,
  locationName,
  money,
  randomAddress,
  randomAssetID,
  stringToHex,
  titleCase,
  tokenCode,
  tokenSymbol
}

// END