let DataServer = require('./dataserver.js')
let DS = new DataServer()

//---- USERS

async function newUser(account) {
  let sql = 'insert into users(account) values($1) returning recid'
  let par = [account]
  let dat = await DS.insert(sql, par)
  return dat
}

async function getUser(account) {
  let sql = 'select * from users where account=$1'
  let par = [account]
  let dat = await DS.queryObject(sql, par)
  return dat
}


//-- ASSETS

async function getAsset(id) {
  let sql = 'select * from assets where assetid=$1'
  let par = [id]
  let dat = await DS.queryObject(sql, par)
  return dat
}

async function getAssets(page=1, num=100) {
  let ini = (page-1)*num
  let sql = 'select * from assets limit $1 offset $2'
  let par = [num, ini]
  let dat = await DS.queryObject(sql, par)
  return dat
}



//-- SHARES

async function newShares(rec) {
  let sql = 'insert into shares(userid, assetid, price, shares, txid) values($1,$2,$3,$4,$5) returning recid'
  let par = [rec.assetid,rec.location,rec.currency,rec.price,rec.shares,rec.shareprice,rec.torreusd,rec.pricetorre,rec.sharetorre,rec.description,rec.type,rec.rooms,rec.area,rec.address,rec.region,rec.postal,rec.country,rec.latlong,rec.image]
  let dat = await DS.insert(sql, par, 'recid')
  return dat
}

async function getShares(userid, page=1, num=100) {
  let ini = (page-1)*num
  let sql = 'select * from shares where userid = $1 limit $2 offset $3'
  let par = [userid, num, ini]
  let dat = await DS.queryObject(sql, par)
  return dat
}



//-- ADMIN

async function newAsset(rec) {
  let sql = 'insert into assets(assetid,location,currency,price,shares,shareprice,torreusd,pricetorre,sharetorre,description,type,rooms,area,address,region,postal,country,latlong,image) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) returning recid'
  let par = [rec.assetid,rec.location,rec.currency,rec.price,rec.shares,rec.shareprice,rec.torreusd,rec.pricetorre,rec.sharetorre,rec.description,rec.type,rec.rooms,rec.area,rec.address,rec.region,rec.postal,rec.country,rec.latlong,rec.image]
  let dat = await DS.insert(sql, par, 'recid')
  return dat
}

async function newNFT(rec) {
  let sql = 'insert into nfts(assetid, nftid, taxon, metadata, image, imageurl, owner, original, inactive) values($1,$2,$3,$4,$5,$6,$7,$8,$9) returning recid'
  let par = [rec.assetid, rec.nftid, rec.taxon, rec.metadata, rec.image, rec.imageurl, rec.owner, rec.original, rec.inactive]
  let dat = await DS.insert(sql, par, 'recid')
  return dat
}

async function newOffer(rec) {
  let sql = 'insert into offers(market, offertype,  sellerid, sellsymbol, sellissuer, sellamount, buysymbol, buyissuer, buyamount, price, txid) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) returning recid'
  let par = [rec.market, rec.offertype, rec.sellerid, rec.sellsymbol, rec.sellissuer, rec.sellamount, rec.buysymbol, rec.buyissuer, rec.buyamount, rec.price, rec.txid]
  let dat = await DS.insert(sql, par, 'recid')
  return dat
}

async function newToken(rec) {
  let sql = 'insert into tokens(assetid, symbol, issuer, shares, price, txid) values($1,$2,$3,$4,$5,$6) returning recid'
  let par = [rec.assetid, rec.symbol, rec.issuer, rec.shares, rec.price, rec.txid]
  let dat = await DS.insert(sql, par, 'recid')
  return dat
}


module.exports = {
  newUser,
  getUser,
  getAsset,
  getAssets,
  newShares,
  getShares,

  // ADMIN
  newAsset,
  newNFT,
  newOffer,
  newToken
}

// END