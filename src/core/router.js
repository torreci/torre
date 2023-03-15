const fetch    = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const fs       = require('fs')
const path     = require('path')
const crypto   = require('crypto')
//const api      = require('./api.js')
const db       = require('./database.js')
//const uploader = require('./uploader.js')
const utils    = require('./utils.js')


function log(...args){ 
  console.warn(...args)
}

function hit(req, ...args){ 
  console.warn(new Date().toJSON().substr(5,14).replace('T',' '), req.path, ...args) 
  //console.warn('MEM', process.memoryUsage())
}

async function index(req, res){ 
  hit(req)
  try {
    let session = utils.getSession(req)
    res.render('index', {session})
  } catch(ex) {
    console.error(new Date(), 'Server error', ex.message)
    return res.status(500).render('servererror')
  }
}

async function login(req, res){
  hit(req)
  let session = utils.getSession(req)
  res.render('login', {session})
}

async function listings(req, res){
  hit(req)
  let session = utils.getSession(req)
  let data = require('./listings.json')
  //log(data)
  res.render('listings', {session, data, utils})
}

async function market(req, res){
  hit(req)
  let session = utils.getSession(req)
  log(session)
  let data = require('./market.json')
  //let data = await db.getTickers()
  //log(data)
  res.render('market', {session, data, utils})
}

async function portfolio(req, res){
  hit(req)
  let session = utils.getSession(req)
  log(session)
  if(!session.account){
    return res.redirect('login')
  }
  let data = require('./portfolio.json')
  //let data = await db.getShares(session.account)
  //log(data)
  res.render('portfolio', {session, data, utils})
}

async function dashboard(req, res){
  hit(req)
  let session = utils.getSession(req)
  res.render('dashboard', {session})
}

async function test(req, res){
  hit(req)
  res.end('TEST OK')
}

async function notFound(req, res){ 
  hit(req, 'not found')
  let session = utils.getSession(req)
  res.status(404).render('notfound', {session})
}

module.exports = {
  index,
  login,
  listings,
  market,
  portfolio,
  dashboard,
  test,
  notFound
}

// END