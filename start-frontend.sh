#!/bin/bash

# Simple script to serve the frontend HTML file

echo "🚀 Starting Frontend Server..."
echo ""
echo "Serving index-standalone-complete.html on http://localhost:8000"
echo ""
echo "✅ Open in browser: http://localhost:8000/index-standalone-complete.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000
elif command -v php &> /dev/null; then
    php -S localhost:8000
else
    echo "❌ Error: No HTTP server found!"
    echo "Please install Python 3, or use: npx serve ."
    exit 1
fi

