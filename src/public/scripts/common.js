var session = {
  theme: 'lite',
  xummkey: 'f3124c80-1213-46fa-8bf4-e6e6741eb325',
  account: '',
}


function $(id){ return document.getElementById(id) }

function log(...args){ console.log(...args) }

function warn(...args){ console.error(...args) }

function message(text, warn){ 
  let msg = $('message')
  if(!msg){ log('No message control'); return }
  if(warn){ text = `<warn>${text}</warn>` }
  msg.innerHTML = text
}

function disable(id, text){ 
  let obj = $(id)
  if(!obj){ log('Control not found:', id); return }
  if(text){ obj.innerHTML = text }
  obj.disabled = true
}

function enable(id, text){ 
  let obj = $(id)
  if(!obj){ log('Control not found:', id); return }
  if(text){ obj.innerHTML = text }
  obj.disabled = false
}

function setCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  let path = '; path=/';
  document.cookie = `${name}=${value}${expires}${path}`;
  //document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getCookie(name) {
  let value = null;
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') { c = c.substring(1, c.length); }
    if (c.indexOf(nameEQ) == 0) { value = c.substring(nameEQ.length, c.length); break; }
  }
  return value;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function() {
    console.log('Copying to clipboard was successful!');
  }, function(err) {
    console.error('Could not copy to clipboard:', err);
  });
}

function tomorrow() {
  let now = new Date()
  let tomorrow = new Date(now.setDate(now.getDate() + 1))
  return tomorrow.toJSON()
}

async function sign(tx, userToken) {
  console.log('SIGN TX', tx)
  try {
    let {XummSdkJwt} = require('xumm-sdk')
    if(!XummSdkJwt){ return {success:false, error:'XUMM wallet not found'} }
    let xumm = new XummSdkJwt(userToken)
    if(!xumm){ return {success:false, error:'Login with XUMM wallet first'} }
    let {created, resolved} = await xumm.payload.createAndSubscribe(tx, function (payloadEvent) {
      if(typeof payloadEvent.data.signed !== 'undefined') {
        console.log('EVENT>', payloadEvent)
        console.log('DATA>', payloadEvent.data)
        return payloadEvent.data  // Resolved value of the `resolved` property
      }
      console.log('DATA?', payloadEvent.data) // check progress
    })
    //console.log('C', created)
    //console.log('R', resolved)
    let payloadId = created?.uuid
    console.log('PAYLOADID', payloadId)
    if(payloadId){ 
      let outcome = await resolved
      console.log('OUTCOME', outcome)
      console.log('SIGNED', outcome?.signed)
      if(outcome.signed){
        console.log('TXID', outcome?.txid)
        return {success:true, payloadId:payloadId, transactionId:outcome?.txid}
      } else {
        return {success:false, error:'User declined signature'}
      }
    } else {
      console.error('NO PAYLOAD ID')
      return {success:false, error:'Error signing transaction'}
    }
  } catch(ex) {
    console.error('ERROR:', ex)
    return {success:false, error:ex.message}
  }
}

async function apiGet(url){
  try {
    let resp = await fetch(url)
    let info = await resp.json()
    return info
  } catch(ex) {
    console.error(ex)
    return {success:false, error:ex.message}
  }
}

async function apiPost(url, data){
  try {
    let options = {
      method: 'POST', 
      headers: {'content-type':'application/json'}, 
      body: JSON.stringify(data)
    }
    let resp = await fetch(url, options)
    let info = await resp.json()
    return info
  } catch(ex) {
    console.error(ex)
    return {success:false, error:ex.message}
  }
}



// END