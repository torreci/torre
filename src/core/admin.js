const fetch  = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const path   = require('path')
const db     = require('./database.js') 
const xrpc   = require('./ripple.js') 
const upload = require('./upload.js')
const utils  = require('./utils.js')
const {log, hit, getSession} = require('./utils.js')


//----ADMIN

async function index(req, res){ 
  hit(req)
  let session = getSession(req)
  res.render('admin/index', {session})
}

async function newAsset(req, res){ 
  hit(req)
  let session = getSession(req)
  let randid  = await utils.randomAssetID()
  let assetid = 'T'+'LND'+randid
  //let assetid = await utils.randomAddress()
  let data = { assetid }
  res.render('admin/newasset', {session, data})
}

async function saveAsset(req, res){ 
  const validImages = ['image/jpg','image/jpeg','image/png','image/gif','image/webp']
  let session = getSession(req)
  let data = req.body
  hit(req, data.assetid)
  log('Data', data)
  // Validate data
  if(!data.assetid){ return res.end(JSON.stringify({error:'Asset id is required'})) }
  // Upload file
  if(req.files){
    log('Files', req.files)
    let file = req.files.file
    let folder = path.join(__dirname, '../public/uploads/assets/')
    let filePath = folder+data.image
    let fileType = file.mimetype
    log('Moving', file.name, 'to assets')
    if(validImages.indexOf(fileType)>-1){
      file.mv(filePath, function(err) {
        if(err){ log('ERROR UPLOADING FILE:', err) }
      })
    }
  }

  // Save assset to db
  let info = null
  let result = await db.newAsset(data)
  log('NEW ASSET', result)
  if(result.error){
    info = JSON.stringify({error:result.error})
  } else {
    info = JSON.stringify({success:true, id:result.id})
  }
  res.send(info)
}

async function mintNFT(req, res){ 
  let session = getSession(req)
  let data = req.body  //{assetid, description, price, image, location}
  hit(req, data.assetid)
  //log({data})
  if(!data.assetid){ return res.end(JSON.stringify({error:'Asset id is required'})) }
  if(!data.image){ return res.end(JSON.stringify({error:'Image id is required'})) }
  
  // upload image
  let folder = path.join(__dirname, '../public/uploads/assets/')
  let filePath = folder+data.image
  let info = await upload.file(filePath)
  if(info.error){
    return res.status(500).send(JSON.stringify({error:info.error}))
  }
  let imguri   = 'ipfs:'+info.cid
  let taxon    = parseInt(data.assetid.substr(4))
  let price    = 'USD $'+utils.money(data.price,0)
  let location = utils.locationName(data.location)
  let network  = process.env.NETWORK
  
  // upload metadata
  let metadata = {
    assetid: data.assetid,
    name: data.description,
    location: location,
    price: price,
    image: imguri,
    taxon: taxon
  }
  if(network!='mainnet'){ metadata.network = network }
  let metatext = JSON.stringify(metadata)
  let meta = await upload.text(metatext)
  if(meta.error){
    return res.status(500).send(JSON.stringify({error:meta.error}))
  }

  // mint NFT
  //{metauri, taxon}
  let metauri = 'ipfs:'+meta.cid
  let result  = await xrpc.mintNFT(metauri, taxon)
  log('Result:',result)
  if(result.error){
    return res.status(500).send(JSON.stringify({error:result.error}))
  }
  let nftid = result.tokenid
  let txid = result.txid

  // save nft to db
  //{assetid, nftid, taxon, metadata, image, imageurl, owner, original}
  let owner = process.env.MINTER_PUB
  let rec = {
    assetid: data.assetid,
    nftid: nftid,
    taxon: taxon,
    metadata: metauri,
    image: imguri,
    imageurl: data.image,
    owner: owner,
    original: true,
    txid: txid
  }
  let saved = await db.newNFT(rec)
  log('Saved:', saved)
  return res.status(200).send(JSON.stringify({success:true, assetid:data.assetid, nftid:nftid, metauri:metauri, image:imguri, txid:txid}))
}

async function mintToken(req, res){ 
  let session = getSession(req)
  let data = req.body
  hit(req, data.assetid)
  log({data})
  if(!data.assetid){ return res.end(JSON.stringify({error:'Asset Id is required'})) }
  if(!data.shares){  return res.end(JSON.stringify({error:'Shares quantity is required'})) }
  if(!data.shareprice){  return res.end(JSON.stringify({error:'Shares price is required'})) }
  let sym = data.assetid
  let qty = data.shares.toString()
  let minted = await xrpc.mintToken(sym, qty)
  if(minted.error){
    return res.status(500).end(JSON.stringify({success:false, error:minted.error}))
  }
  // save to db
  let issuer = process.env.ISSUER_PUB
  let rec = {
    assetid: data.assetid,
    symbol: data.assetid,
    issuer: issuer,
    shares: data.shares,
    price: data.shareprice,
    txid: minted.txid
  }
  let saved = await db.newToken(rec)
  log('Saved:', saved)
  return res.status(200).end(JSON.stringify({success:true, tokenid:data.assetid, txid:minted.txid, recid:saved.id}))
}

async function sellOffer(req, res){ 
  let session = getSession(req)
  let data = req.body
  hit(req, data.assetid)
  log({data})
  if(!data.assetid){ return res.end(JSON.stringify({error:'Asset Id is required'})) }
  if(!data.shares){  return res.end(JSON.stringify({error:'Shares quantity is required'})) }
  let mkt = data.assetid+'/TORRE'
  let sym = data.assetid
  let qty = data.shares.toString()
  let get = data.pricetorre.toString()
  let price = parseFloat(get)/parseFloat(qty)
  let sell = {value: qty, currency:utils.tokenCode(sym),     issuer:process.env.ISSUER_PUB}
  let buy  = {value: get, currency:utils.tokenCode('TORRE'), issuer:process.env.TORRE_ISSUER}
  let info = await xrpc.createOffer(sell, buy)
  if(info.error){
    return res.status(500).end(JSON.stringify({success:false, error:info.error}))
  }
  // save to db
  let minter = process.env.MINTER_PUB
  let issuer = process.env.ISSUER_PUB
  let torreissuer = process.env.TORRE_ISSUER
  let rec = {
    market: mkt,
    offertype: 0,  // 0.sell, 1.buy
    sellerid: minter,
    sellsymbol: sym,
    sellissuer: issuer,
    sellamount: qty,
    buysymbol: 'TORRE',
    buyissuer: torreissuer,
    buyamount: get,
    price: price, // 1 share in TORRE
    txid: info.txid
  }
  let saved = await db.newOffer(rec)
  log('Saved:', saved)
  return res.status(200).end(JSON.stringify({success:true, txid:info.txid, validated:info.validated, recid:saved.id}))
}

async function torrePrice(req, res){ 
  hit(req)
  let session = getSession(req)
  let info = await xrpc.getTokenPrice({currency:'TORRE', issuer:process.env.TORRE_ISSUER}, {currency: 'XRP'})
  log(info)
  let data = {xrpusd:info.xrpusd, torreusd:info.tknusd, torrexrp:info.rate }
  //let data = {xrpusd:0.396456, torreusd:0.001, torrexrp:0.00039 }
  log(data)
  res.render('admin/torreprice', {session, utils, data})
}

//-- UTILS

async function faucet(req, res){ 
  hit(req)
  res.render('admin/faucet')
}

async function apiFaucet(req, res){ 
  hit(req)
  try {
    let dst = req.body.address
    if(!dst){ return res.end(JSON.stringify({success:false, error:'No address'})) }
    let txid = await xrpc.sendToken(dst)
    return res.end(JSON.stringify({success:true, txid:txid}))
  } catch(ex) {
    console.error(ex)
    return res.end(JSON.stringify({success:false, error:ex.message}))
  }
}

module.exports = {
  index,
  newAsset,
  saveAsset,
  mintNFT,
  mintToken,
  sellOffer,
  torrePrice,
  faucet,
  apiFaucet
}
