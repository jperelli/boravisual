import { readFileSync } from 'fs'
import * as cheerio from 'cheerio'
import axios from 'axios'
const sqlite3 = require('sqlite3').verbose();

const main = async () => {
    const db = new sqlite3.Database('./data/db.sqlite');
    // db.run("CREATE TABLE data (title TEXT, href TEXT, detail1 TEXT, detail2 TEXT, detail3 TEXT, doc TEXT)");
    const $ = cheerio.load(readFileSync('./data/BORA_RAW.html' , 'utf8'));
    console.log('loading...')
    const items = $('div.col-md-12')
    console.log(items.length)
    let i = 0
    for (const it of items) {
        i = i + 1
        const $it = $(it)
        const details = $it.find('.item-detalle small')
        if (details.length == 3) {
            // tupla valida
            const href = $it.find('a').attr('href')
            const title = $it.find('.item').text()
            const doc = (await axios.get(href)).data
            const stmt = db.prepare("INSERT INTO data VALUES (?, ?, ?, ?, ?, ?)");
            stmt.run(title, href, $(details[0]).text(), $(details[1]).text(), $(details[2]).text(), doc);
            stmt.finalize();
            console.log((i*100/items.length).toFixed(4), `(${i}/${items.length})`)
        }
    }
    db.close()
}

main()
