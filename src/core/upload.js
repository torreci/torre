let sdk = require('@lighthouse-web3/sdk')

async function buffer(buf, mime){
  try {
    let key = process.env.LIGHTHOUSE
    let res = await sdk.uploadBuffer(buf, key, mime)
    console.warn('Buffer uploaded', res)
    return {success:true, cid:res?.data?.Hash}
  } catch(ex) {
    console.error(ex)
    return {error:ex.message}
  }
}

async function file(path){
  try {
    let key = process.env.LIGHTHOUSE
    let res = await sdk.upload(path, key)
    console.warn('File uploaded', res)
    return {success:true, cid:res?.data?.Hash}
  } catch(ex) {
    console.error(ex)
    return {error:ex.message}
  }
}

async function text(str){
  try {
    let key = process.env.LIGHTHOUSE
    let res = await sdk.uploadText(str, key)
    console.warn('Text uploaded', res)
    return {success:true, cid:res?.data?.Hash}
  } catch(ex) {
    console.error(ex)
    return {error:ex.message}
  }
}

module.exports = {
  buffer,
  file,
  text
}