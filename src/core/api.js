const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const utils = require('./utils.js')
const xrpl  = require('./ripple.js')
const db    = require('./database.js')


function log(...args){ 
  console.warn(...args)
}

function hit(req, ...args){ 
  console.warn(new Date().toJSON().substr(5,14).replace('T',' '), req.path, ...args) 
  //console.warn('MEM', process.memoryUsage())
}

//---- API

async function test(req, res){ 
  hit(req)
  let test = await xrpl.getOrderbook()
  log(test)
  res.end('{"success":true}')
}

async function getUser(req, res){ 
  let id = req.params.id
  hit(req, id)
  let user = await db.getUser(id)
  if(!user || user.error){
    user = await db.newUser(id)
    user.account = id
  }
  let out = JSON.stringify({success:true, user})
  res.end(out)
}

async function catchAll(req, res){ 
  hit(req, 'not found')
  res.status(404).end('{"error":"Resource not found"}')
}


module.exports = {
  test,
  getUser,
  catchAll
}
