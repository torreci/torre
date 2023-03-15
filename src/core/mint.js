var xrpl  = require('xrpl')
let xrpc  = require('./ripple.js')
let utils = require('./utils.js')

// DEPRECATED
async function mintTokenSocket(sym, qty) {
  let client, tx, txid, prep, sign, res, retval = null
  try {
    console.log('Connecting to Testnet...')
    client = new xrpl.Client(process.env.WSS_URL)
    await client.connect()

    let minter = xrpl.Wallet.fromSeed(process.env.MINTER_KEY)
    let issuer = xrpl.Wallet.fromSeed(process.env.ISSUER_KEY)

    // Create trust line from minter to issuer address, minter wallet signs txn
    console.log('Creating trust line from minter to issuer...')
    const currencyCode = utils.tokenCode(sym)
    tx = {
      TransactionType: 'TrustSet',
      Account: minter.address,
      LimitAmount: {
        currency: currencyCode,
        issuer: issuer.address,
        value: '1000000000' // Large limit, arbitrarily chosen
      }
    }
    prep = await client.autofill(tx)
    sign = minter.sign(prep)
    res  = await client.submitAndWait(sign.tx_blob)
    if (res.result.meta.TransactionResult == 'tesSUCCESS') {
      console.log(`Trustline succeeded: ${process.env.EXPLORER}/transactions/${sign.hash}`)
    } else {
      //throw `Error sending transaction: ${res.result.meta.TransactionResult}`
      retval = {error:`Error sending transaction: ${res.result.meta.TransactionResult}`}
      client?.disconnect()
      return retval
    }

    // Send token, issuer wallet signs txn
    tx = {
      TransactionType: 'Payment',
      Account: issuer.address,
      Amount: {
        currency: currencyCode,
        value: qty,
        issuer: issuer.address
      },
      Destination: minter.address
    }
    prep = await client.autofill(tx)
    sign = issuer.sign(prep)
    console.log(`Sending ${qty} ${sym} to ${minter.address}...`)
    res = await client.submitAndWait(sign.tx_blob)
    if (res.result.meta.TransactionResult == 'tesSUCCESS') {
      console.log(`Payment succeeded: ${process.env.EXPLORER}/transactions/${sign.hash}`)
      retval = {success:true, txid:sign.hash}
    } else {
      console.error('Error sending transaction:'+res.result.meta.TransactionResult)
      retval = {error:'Error sending transaction:'+res.result.meta.TransactionResult}
      //throw `Error sending transaction: ${res.result.meta.TransactionResult}`
    }
  } catch(ex) {
    console.error('ERROR:', ex)
    retval = {error:ex.message}
  }
  client?.disconnect()
  return retval
}


module.exports = {
  mintTokenSocket
}

//mintTokenSocket('T1234567890', '650') // 650 shares