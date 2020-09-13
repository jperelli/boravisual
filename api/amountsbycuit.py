import pandas as pd
import sqlite3

from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):

    def do_GET(self):
        sqlite_connection = sqlite3.connect('api/db3.sqlite')
        data = pd.read_sql_query("SELECT * FROM data", sqlite_connection)
        data_filtered = data[data.content1.str.contains('adjudic', case=False, na=False)]
        data_filtered['cuit'] = data_filtered.content1.str.extract('(\d\d-\d\d\d\d\d\d\d\d-\d)')
        data_filtered['amount'] = data_filtered.content1.str.extract('\$\s([\d\.\s]*)')
        data_filtered['amount'] = data_filtered.amount.str.split(',').str[0]
        data_filtered['amount'] = data_filtered.amount.str.replace(r'\D+', '')
        pd.set_option('display.float_format', lambda x: '{:,.2f}'.format(x))
        data_filtered['amount'] = data_filtered.amount.apply(pd.to_numeric, errors='coerce')
        data_filtered = data_filtered.fillna(0)
        data_values = data_filtered[['cuit', 'amount']]
        data_values.head()
        info = data_values.groupby(['cuit']).sum()
        info = info.sort_values('amount', ascending=False)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(info.to_json(orient="table").encode())
