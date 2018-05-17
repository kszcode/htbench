'use strict'

const fs = require('fs')

const cli = require('cli')
const fetch = require('isomorphic-fetch')
const _ = require('lodash')
const csvWriter = require('csv-write-stream')

/**
 * Make a large number of requests to a destination URL
 * Please note that maxRate below refers to the maximum number of concurrent requests, not requests per second
 * @return {Promise.<void>}
 */
const main = async () => {

  let params = (cli.parse({
    url: ['u', 'The URL to hit', 'string', 'http://127.0.0.1:8080'],
    maxRate: ['r', 'Number of maximum concurrent connections', 'number', 100],
    hits: ['h', 'The total number of requests', 'number', 20000],
    log: ['l', 'The log file (JSON)', 'file', 'hits.csv'],
    report: ['r', 'Generate report', 'boolean', true],
  }))

  let {url, maxRate, hits, log, report} = params

  let startTime = Date.now()
  let currentTimeBlock = 1000 // 1000 ms = 1s

  let hitsThisSecond = 0
  let totalHits = 0
  let goodHits = 0

  let writer = csvWriter()
  writer.pipe(fs.createWriteStream(log))

  let currentRate = 1

  let recordHit = (success) => {
    const deltaTime = Date.now() - startTime
    totalHits++
    hitsThisSecond++

    if (success) {
      goodHits++
    }

    if (deltaTime > currentTimeBlock) {
      // Flush this second's data
      writer.write({
        time: currentTimeBlock / 1000,
        concurrency: currentRate,
        hitsThisSecond,
        goodHits,
        badHits: hitsThisSecond - goodHits,
        totalHits,
      })
      currentTimeBlock += 1000 // Move to next second
      goodHits = 0 // Reset good hits
      hitsThisSecond = 0
    }
  }

  for (let processed = 0; 
       processed < hits; 
       processed += currentRate, currentRate++,
       currentRate = Math.min(currentRate, maxRate)) {
    await Promise.all(_.range(0, currentRate).map(async () => {
      let response = await fetch(url)
      let success = response.status < 400
      recordHit(success)
    }))
  }

  // Close the log file
  writer.end()

}

main().catch(console.log)
