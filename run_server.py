#!/usr/bin/env python3
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os, webbrowser
ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)
class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, '.webmanifest': 'application/manifest+json', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8'}
server = ThreadingHTTPServer(('127.0.0.1', 8000), Handler)
print('مطبوع يعمل على http://localhost:8000 — لإيقافه اضغط Ctrl+C')
try:
    webbrowser.open('http://localhost:8000')
    server.serve_forever()
except KeyboardInterrupt:
    print('\nتم إيقاف الخادم.')
finally:
    server.server_close()
