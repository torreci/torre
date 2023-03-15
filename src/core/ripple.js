const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const xrpl  = require('xrpl')
const utils = require('./utils.js')

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

// Fetch ripple rpc servers
async function fetchXRPL(payload) {
  try {
    let url = process.env.RPC_URL
    let options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    }
    let result = await fetch(url, options)
    let data = await result.json()
    return data
  } catch(ex) {
    console.error(ex)
    return {error: ex.message}
  }
}

function findToken(txInfo){
  let found = null
  for (var i=0; i<txInfo.result.meta.AffectedNodes.length; i++) {
    let node = txInfo.result.meta.AffectedNodes[i]
    if(node.ModifiedNode && node.ModifiedNode.LedgerEntryType=='NFTokenPage'){
      let m = node.ModifiedNode.FinalFields.NFTokens.length
      let n = node.ModifiedNode.PreviousFields.NFTokens.length
      for (var j=0; j<m; j++) {
        let tokenId = node.ModifiedNode.FinalFields.NFTokens[j].NFToken.NFTokenID
        found = tokenId
        for (var k=0; k<n; k++) {
          if(tokenId==node.ModifiedNode.PreviousFields.NFTokens[k].NFToken.NFTokenID){
            found = null
            break
          }
        }
        if(found){ break }
      }
    }
    if(found){ break }
  }
  return found
}

// sell: {value:  '1000', currency:tokenCode('TLND123456'), issuer:process.env.ISSUER_PUB}
// buy:  {value:'123456', currency:tokenCode('TORRE'),      issuer:process.env.TORRE_ISSUER}
//createOffer(sell, buy) // TLND123456/TORRE
async function createOffer(sell, buy) {
  console.log('Offer to sell', sell, 'and get', buy)
  /*
  FLAGS:
  tfPassive           0x00010000   65536  If enabled, the Offer does not consume Offers that exactly match it, and instead becomes an Offer object in the ledger. It still consumes Offers that cross it.
  tfImmediateOrCancel 0x00020000  131072  Treat the Offer as an Immediate or Cancel order . The Offer never creates an Offer object in the ledger: it only trades as much as it can by consuming existing Offers at the time the transaction is processed. If no Offers match, it executes "successfully" without trading anything. In this case, the transaction still uses the result code tesSUCCESS.
  tfFillOrKill        0x00040000  262144  Treat the offer as a Fill or Kill order . The Offer never creates an Offer object in the ledger, and is canceled if it cannot be fully filled at the time of execution. By default, this means that the owner must receive the full TakerPays amount; if the tfSell flag is enabled, the owner must be able to spend the entire TakerGets amount instead.
  tfSell              0x00080000  524288  Market price. Exchange the entire TakerGets amount, even if it means obtaining more than the TakerPays amount in exchange.
  */
  let act = process.env.MINTER_PUB
  let key = process.env.MINTER_KEY
  try {
    let txn = {
      TransactionType: "OfferCreate",
      Account: act,
      TakerGets: sell, // user sells and taker gets { currency issuer value } or amt if XRP
      TakerPays: buy,  // user buys  and taker pays { currency issuer value } or amt if XRP
      Fee: '12',
      Flags: 0
    }
    let res = await submitAndWait(txn, key)
    if(res.error){
      console.log('Error creating offer:', res.error)
      return {error:res.error}
    }
    return {success:true, txid:res.txid, validated:res.validated}
  } catch(ex) {
    console.error('ERROR:', ex)
    return {error:ex.message}
  }
}

async function getOrderbook(){
  let currency = utils.tokenCode('TORRE')
  let query = {
    method: "book_offers",
    params: [
      {
        taker: process.env.TORRE_MINTER,
        taker_gets: {
          currency: "XRP"
        },
        taker_pays: {
          currency: currency,
          issuer: process.env.TORRE_ISSUER
        },
        limit: 10
      }
    ]
  }
  let data = await fetchXRPL(query)
  console.log(data)
  return data
}

async function getTicker() {
  //console.warn('Getting CMC ticker...')
  let url, opt, res, tkr = {}
  try {
    url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
    //url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=100&convert=USD%2CBTC'
    opt = {
      method: 'GET', 
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'X-CMC_PRO_API_KEY': process.env.CMCAPIKEY
      }
    }
    res = await fetch(url, opt)
    tkr = await res.json()
    //console.warn('Ticker:', tkr)
  } catch(ex) {
    console.error('Error in CMC ticker:', ex)
    tkr = {error:ex.message}
  }
  return tkr
}

// getTokenPrice({currency:tokenCode('TORRE'), issuer:'r3TMkSSNKwDEiTEqfT8wMyeDuTxLbMFVuu'}, {currency: 'XRP'})
async function getTokenPrice(sell, buy){
  let act = process.env.MINTER_PUB
  if(typeof(sell)=='object' && sell.currency.length>3) { sell.currency = utils.tokenCode(sell.currency) }
  if(typeof(buy)=='object' && buy.currency.length>3) { buy.currency = utils.tokenCode(buy.currency) }
  let query = {
    method: "book_offers",
    params: [
      {
        taker: act,
        taker_pays: sell,
        taker_gets: buy,
        limit: 10
      }
    ]
  }
  let data = await fetchXRPL(query)
  //console.log(data.result.offers)
  let last = data.result.offers[0]
  let base = last.TakerGets
  let quot = last.TakerPays
  if(typeof(base)=='string'){
    base = {currency:'XRP', value:base}
  }
  if(typeof(quot)=='string'){
    quot = {currency:'XRP', value:quot}
  }
  if(base.currency.length>3){ base.currency = utils.tokenSymbol(base.currency)}
  if(quot.currency.length>3){ quot.currency = utils.tokenSymbol(quot.currency)}
  let rate = base.value/quot.value
  console.log(rate.toFixed(6), quot.currency+'/'+base.currency)
  let xrpusd = await getXrpPrice()
  console.log(xrpusd.toFixed(6), 'XRP/USD')
  let tknusd = rate * xrpusd
  console.log(tknusd.toFixed(6), quot.currency+'/USD')
  return {rate, xrpusd, tknusd}
}

async function getXrpPrice(){
  let ticker = await getTicker()
  //console.log(ticker)
  for (var i = 0; i < ticker.data.length; i++) {
    if(ticker.data[i].symbol=='XRP'){
      return ticker.data[i].quote.USD.price
    }
  }
  return 0
}

async function mintNFT(metauri, taxon) {
  console.log('Minting NFT', metauri, taxon)
  try {
    let mntkey  = process.env.MINTER_KEY
    let wallet  = xrpl.Wallet.fromSeed(mntkey)
    let account = wallet.address
    let nftUri  = xrpl.convertStringToHex(metauri)
    let flags   = xrpl.NFTokenMintFlags.tfBurnable + xrpl.NFTokenMintFlags.tfTransferable
    //let flags = NFTokenMintFlags.tfBurnable + NFTokenMintFlags.tfOnlyXRP + NFTokenMintFlags.tfTransferable
    let txn = {
      TransactionType: 'NFTokenMint',
      Account: account,
      URI: nftUri,         // uri to metadata
      NFTokenTaxon: taxon, // id for all nfts minted by us
      Flags: flags,         // burnable, transferable
      Fee: '12'
    }
    console.log('TXN:', txn)
    let info = await submitAndWait(txn, mntkey)
    if(info?.success) {
      let tokenId = findToken(info.tx)
      console.log('TokenId:', tokenId)
      return {success:true, tokenid:tokenId, txid:info.txid, validated:info.validated}
    } else {
      console.log('Result:', JSON.stringify(info))
      return {error:(info?.error||'Error minting NFT')}
    }
  } catch (ex) {
    console.error(ex)
    return { error:ex.message }
  }
}


async function mintToken(sym, qty) {
  let tx, txid, prep, sign, res, retval = null
  try {
    console.log('Minting', qty, sym, 'tokens')
    let mntkey = process.env.MINTER_KEY
    let isrkey = process.env.ISSUER_KEY
    let minter = xrpl.Wallet.fromSeed(mntkey)
    let issuer = xrpl.Wallet.fromSeed(isrkey)

    // Create trust line from minter to issuer address, minter wallet signs txn
    console.log('Creating trust line from minter to issuer...')
    amt = '100000000000' // Large limit, arbitrarily chosen
    res = await trustline(mntkey, sym, issuer.address, amt)
    if(res.error){
      console.log('Error creating trustline:', res.error)
      return {error:res.error}
    }

    // MOVE TO ripple.js as sendToken
    // Send token, issuer wallet signs txn
    let currency = utils.tokenCode(sym)
    tx = {
      TransactionType: 'Payment',
      Account: issuer.address,
      Amount: {
        currency: currency,
        value: qty,
        issuer: issuer.address
      },
      Destination: minter.address,
      Fee: '12'
    }
    res = await submitAndWait(tx, isrkey)
    if(res.success){
      return {success:true, txid:res.txid, validated:res.validated}
    } else {
      console.warn('Error:', res.error)
      return {error:res.error}
    }
  } catch(ex) {
    console.error('ERROR:', ex)
    return {error:ex.message}
  }
}

async function sendToken(dst) {
  let amt = '1000000'
  let sym = 'TORRE'
  let isr = 'r3TMkSSNKwDEiTEqfT8wMyeDuTxLbMFVuu'
  let key = process.env.MINTER_KEY
  let cur = utils.tokenCode(sym)

  let wallet = xrpl.Wallet.fromSeed(key)

  let txn = {
    TransactionType: 'Payment',
    Account: wallet.address,
    Amount: {
      currency: cur,
      issuer: isr,
      value: amt
    },
    Destination: dst,
    Fee: '12'
  }

  console.warn(`Sending ${amt} ${sym} to ${dst}...`)
  let res = await submitAndWait(txn, key)
  if(res.success){
    console.warn(`OK https://testnet.xrpl.org/transactions/${res.txid}`)
    return res.txid
  } else {
    console.error('Error sending tokens')
    return null
  }
}

async function submitAndWait(tx, key) {
  try {
    // tx.Account is required
    let info = await fetchXRPL({method:'account_info', params:[{account:tx.Account}]})
    if(info.error){ return {success:false, error:info.error} }
    tx.Sequence = info.result.account_data.Sequence
    console.warn('TX', tx)
    let walt = xrpl.Wallet.fromSeed(key)
    let blob = walt.sign(tx)
    let hash = blob.hash // txid
    console.warn('TXID', hash)
    let resp = await fetchXRPL({method:'submit', params:[{tx_blob:blob.tx_blob}]})
    if(resp.result.error){
      console.error('ERROR', resp)
      return {success:false, error:resp.result.error}
    }
    if(resp.result.accepted && resp.result.status=='success'){
      console.warn('SUBMITTED')
      let txid = resp.result.tx_json.hash
      let cntr = 0
      let data = null
      console.log(`SUCCESS: ${process.env.EXPLORER}/transactions/${txid}`)
      do { // wait for confirmation
        cntr += 1
        await sleep(2000)
        data = await fetchXRPL({method:'tx', params:[{transaction:txid}]})
        console.warn(cntr, 'confirmed', data.result.validated)
        if(data.result.status='success' && data.result.validated){
          console.warn('CONFIRMED', txid)
          return {success:true, validated:true, txid:txid, tx:data}
        }
      } while(cntr < 10)
      console.warn('TIMEOUT')
      return {success:true, validated:false, txid:txid, tx:data}
    } else {
      console.warn('FAIL', resp)
      return {success:false, error:'Transaction failure'}
    }
  } catch(ex) {
    console.error('ERROR:', ex)
    return {success:false, error:ex.message}
  }
}

// trustline(key, 'TLND123456', 'rIssuer12345', '1000000000')
async function trustline(key, token, issuer, amount){
  console.log('Creating trust line:', token, issuer, amount)
  try {
    let owner = xrpl.Wallet.fromSeed(key)
    let currency = (token.length>3) ? utils.tokenCode(token) : token
    let txn = {
      TransactionType: 'TrustSet',
      Account: owner.address,
      LimitAmount: {
        currency: currency,
        issuer: issuer,
        value: amount
      },
      Fee: '12'
    }
    let res = await submitAndWait(txn, key)
    if(res.success){
      console.log('TxId', res.txid, res.validated)
      return {success:true, txid:res.txid, validated:res.validated}
    } else {
      console.log('Error creating trustline:', res.error)
      return {error:res.error}
    }
  } catch(ex) {
    console.warn('ERROR:', ex)
    return {error:ex.message}
  }
}

module.exports = {
  fetchXRPL,
  findToken,
  createOffer,
  getOrderbook,
  getTicker,
  getTokenPrice,
  getXrpPrice,
  mintNFT,
  mintToken,
  sendToken,
  sleep,
  submitAndWait,
  trustline
}
