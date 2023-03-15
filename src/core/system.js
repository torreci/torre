const fetch    = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const fs       = require('fs')
const path     = require('path')
const crypto   = require('crypto')
const utils    = require('./utils.js')

function log(...args){ 
  console.warn(...args)
}

function hit(req, ...args){ 
  console.warn(new Date().toJSON().substr(5,14).replace('T',' '), req.path, ...args) 
  //console.warn('MEM', process.memoryUsage())
}

async function logsView(req, res){ 
  let fhn = path.join(__dirname, '../stderr.log')
  let txt = fs.readFileSync(fhn, {encoding: 'utf8'})
  res.end('<body style="padding:20px;color:#AFA;background-color:#111;font-size:130%;"><pre>'+txt+'</pre></body>')
}

async function logsClear(req, res){ 
  let fn = path.join(__dirname, '../stderr.log')
  let ok = fs.writeFileSync(fn, '----\n')
  res.end('<body style="padding:20px;color:#AFA;background-color:#111;font-size:130%;"><pre>Logs cleared</pre></body>')
}

async function notFound(req, res){ 
  hit(req, 'not found')
  res.status(404).render('notfound')
}

module.exports = {
  logsView,
  logsClear,
  notFound
}

// END