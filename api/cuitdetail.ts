import sqlite3 from 'sqlite3'
import { NowRequest, NowResponse } from '@vercel/node'
const db = new (sqlite3.verbose().Database)('api/db3.sqlite')
db.on('trace', (sql, time) => console.log(sql, time))

export default function (req: NowRequest, res: NowResponse) {
  const { search = '' } = req.query
  const ret = []
  const sql = `SELECT content1 FROM data WHERE content1 LIKE $adjudicado and content1 LIKE $search`
  const sqlparams = { $adjudicado: '%adjudic%', $search: `%${search}%` }
  const statement = db.prepare(sql, sqlparams, function (err) {
    if (err) {
      console.log('prepare err')
      throw err
    }
  })
  statement.all(function (err, rows) {
    if (err) {
      console.log('stmt err')
      throw err
    }
    console.log(rows)
    res.setHeader('Content-type', 'application/json')
    res.send(JSON.stringify(rows))
  })
}
