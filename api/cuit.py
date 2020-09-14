import pandas as pd
import sqlite3

from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        print(self.path)
        print(urlparse(self.path))
        qs = parse_qs(urlparse(self.path).query)

        sqlite_connection = sqlite3.connect('api/db3.sqlite')
        data = pd.read_sql_query("SELECT * FROM data GROUP BY href", sqlite_connection)
        data_filtered = data[data.content1.str.contains('adjudic', case=False, na=False)]
        if 'search' in qs and qs['search']:
            data_filtered = data[data.content1.str.contains(qs['search'][0], case=False, na=False)]
        data_filtered['cuit'] = data_filtered.content1.str.extract('(\d\d-\d\d\d\d\d\d\d\d-\d)')
        data_filtered['amount'] = data_filtered.content1.str.extract('\$\s{0,}([\d\,\.\s]*)')
        data_filtered['amount'] = data_filtered.amount.str.split(',').str[0]
        data_filtered['amount'] = data_filtered.amount.str.replace('\s', '', regex=True)
        data_filtered['amount'] = data_filtered.amount.str.replace('\D\d\d$', '', regex=True)
        data_filtered['amount'] = data_filtered.amount.str.replace(r'\D+', '')
        # pd.set_option('display.float_format', lambda x: '{:,.2f}'.format(x))
        data_filtered['amount'] = data_filtered.amount.apply(pd.to_numeric, errors='coerce')
        data_filtered = data_filtered.fillna(0)

        info = data_filtered.sort_values('amount', ascending=False)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(info.to_json(orient="table").encode())
