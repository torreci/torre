const path       = require('path')
const ejs        = require('ejs')
const express    = require('express')
const uploader   = require('express-fileupload')
const bodyParser = require('body-parser')
const cookies    = require('cookie-parser')
const router     = require('./core/router.js') 
const api        = require('./core/api.js') 
const admin      = require('./core/admin.js') 
const system     = require('./core/system.js') 


async function main(){
  console.warn(new Date(), 'App is running')
  //let tmp = path.join(__dirname,'/public/uploads/tmp')
  const app = express()
  app.use(express.static(path.join(__dirname, 'public')))
  //app.use(uploader({useTempFiles:true, tempFileDir:tmp}))
  app.use(uploader())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cookies())
  app.set('views', path.join(__dirname, '/public/views'))
  app.set('view engine', 'html')
  app.engine('html', ejs.renderFile)

  //-- ROUTER
  app.get('/',          router.index)
  app.get('/login',     router.login)
  app.get('/listings',  router.listings)
  app.get('/market',    router.market)
  app.get('/portfolio', router.portfolio)
  app.get('/dashboard', router.dashboard)
  app.get('/test',      router.test)
  
  //--API
  app.get('/api/test',     api.test)
  app.get('/api/user/:id', api.getUser)
  app.get('/api/*',        api.catchAll)
  
  //-- ADMIN
  app.get('/admin',            admin.index)
  app.get('/admin/newasset',   admin.newAsset)
  app.get('/admin/torreprice', admin.torrePrice)
  app.post('/admin/saveasset', admin.saveAsset)
  app.post('/admin/mintnft',   admin.mintNFT)
  app.post('/admin/minttoken', admin.mintToken)
  app.post('/admin/selloffer', admin.sellOffer)
  app.get('/admin/faucet',     admin.faucet)
  app.post('/admin/api/faucet',admin.apiFaucet)
  app.get('/admin/*',          system.notFound)
  
  //-- SYSTEM
  app.get('/logs',      system.logsView)
  app.get('/logx',      system.logsClear)
  app.get('/notfound',  system.notFound)
  app.get('/*',         system.notFound)
  app.listen(5000)
}

main()

// END