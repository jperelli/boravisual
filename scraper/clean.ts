import { readFileSync } from 'fs'
const sqlite3 = require('sqlite3').verbose();
import { JSDOM } from 'jsdom';


const main = async () => {
    const db = new sqlite3.Database('./data/db.sqlite');
    const db2 = new sqlite3.Database('./data/db2.sqlite');
    db2.run("CREATE TABLE data (title TEXT, href TEXT, detail1 TEXT, detail2 TEXT, detail3 TEXT, doc TEXT, title2 TEXT, entity TEXT, subtitle TEXT, date TEXT, contentHTML TEXT, content1 TEXT, content2 TEXT, content3 TEXT)");
    let i = 0
    db.each("SELECT * FROM data", function(err, row) {
        i = i + 1
        const doc = new JSDOM(row.doc).window.document;
        const title = doc.title
        const entity = doc.querySelector('.avisoContenido article #tituloDetalleAviso h1')?.textContent
        const subtitle = doc.querySelector('.avisoContenido article #tituloDetalleAviso h2')?.textContent
        const date = doc.querySelector('.avisoContenido article .row .col-md-12 p.text-muted small')?.textContent
        const contentHTML = doc.querySelector('.avisoContenido article #cuerpoDetalleAviso')?.innerHTML
        const contents = new JSDOM('<div>'+contentHTML+'</div>').window.document.querySelectorAll('p')
        const content1 = contents[1]?.textContent
        const content2 = contents[2]?.textContent
        const content3 = contents[3]?.textContent
        const stmt = db2.prepare("INSERT INTO data VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        stmt.run(row.title, row.href, row.detail1, row.detail2, row.detail3, row.doc, title, entity, subtitle, date, contentHTML, content1, content2, content3);
        stmt.finalize();
        console.log((i/10114).toFixed(4), `(${i}/10114)`)
    });
    db.close()
}

main()
