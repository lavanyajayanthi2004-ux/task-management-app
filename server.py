#!/usr/bin/env python3
"""
Simple HTTP Server for Task Management App
Run this file to start a local server at http://localhost:8000
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Change to the directory where this script is located
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

print("=" * 60)
print("🚀 Starting Task Management App Server...")
print("=" * 60)
print(f"\n✅ Server running at: http://localhost:{PORT}")
print(f"\n📂 Serving files from: {os.getcwd()}")
print("\n💡 Open your browser and go to: http://localhost:8000")
print("\n⚠️  Press Ctrl+C to stop the server\n")

# Auto-open browser
try:
    webbrowser.open(f'http://localhost:{PORT}')
    print("🌐 Browser opening automatically...\n")
except Exception as e:
    print(f"ℹ️  Could not auto-open browser: {e}\n")

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n❌ Server stopped.")
except OSError as e:
    print(f"\n❌ Error: {e}")
    print(f"\n💡 Port {PORT} might be in use. Try a different port.")
