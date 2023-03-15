// LOGIN

var xumm = null

async function xummHandler(state){
  message('XUMM wallet connected')
  console.log('STATE', state)
  let connected = false
  if(state.me.account){
    let account = state.me.account
    let network = state.me.networkType
    let usertoken = state.jwt
    //console.log('usertoken', usertoken)
    let user = await apiGet('/api/user/'+account)
    console.log('USER', user)
    console.log('account',  account)
    console.log('network',  network)
    $('menuLogin').innerHTML = 'Logout'
    setCookie('account',   account)
    setCookie('network',   network)
    setCookie('usertoken', usertoken)
    setCookie('expires',   tomorrow())
    connected = true
  }
  if(connected){
    console.log('Connected')
    window.location.href = window.location.origin+'/portfolio'
  }
}

async function onConnect(){
  console.log('Connect...')
  await xummStart()
  let state = await xumm.authorize()
  xummHandler(state)
}

async function onLogout(){
  console.log('Logout...')
  xummLogout()
  app.utils.setCookie('account',   '')
  app.utils.setCookie('avatar',    '')
  app.utils.setCookie('userid',    '')
  app.utils.setCookie('username',  '')
  app.utils.setCookie('usertoken', '')
  app.utils.setCookie('expires',   '')
}

async function xummLogout(){
  let xumm = new XummPkce(session.xummkey)
  xumm.logout()
  message('XUMM wallet disconnected')
  console.log('Disconnected')
}

async function xummStart(url, chk=false){
  console.log('XUMM start...')
  try {
    if(!url){ url = window.location.origin+'/login?authorized=true' }
    let opts = {implicit:true, redirectUrl:url, rememberJwt:chk}
    xumm = new XummPkce(session.xummkey, opts)
    //xumm.logout()
    xumm.on('error', async (ex) => {
      console.log('XUMM error', ex)
    })
    xumm.on('success', async () => {
      console.log('XUMM started')
      let state = await xumm.state()
      xummHandler(state)
    })
    xumm.on('retrieved', async () => {
      console.log('XUMM retrieved')
      let state = await xumm.state()
      xummHandler(state)
    })
  } catch(ex) {
    console.error(ex)
  }
}

/*
async function start(){
  console.log('Login...')
  console.log('Query', window.location.search)
  let url, chk = null
  let query = new URL(window.location.href)
  if(query.searchParams.has('authorized')){
    console.log('Authorized')
    url = window.location.origin+'/portfolio'
    chk = true
  } else {
    url = window.location.origin+'/login?authorized=true'
    chk = true
  }
  xummStart(url, chk)
}
*/

//window.onload = start


// END