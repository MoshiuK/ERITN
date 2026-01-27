#!/bin/bash
# Remove source maps from production deployment
# Run this script before deploying to production to reduce bundle size by ~6MB

echo "Removing JavaScript source maps..."
find . -name "*.js.map" -type f -delete
JS_COUNT=$(find . -name "*.js.map" -type f 2>/dev/null | wc -l)

echo "Removing CSS source maps..."
find . -name "*.css.map" -type f -delete
CSS_COUNT=$(find . -name "*.css.map" -type f 2>/dev/null | wc -l)

echo ""
echo "Done! Source maps removed."
echo "This reduces deployment size by approximately 6MB."
echo ""
echo "Note: Keep source maps in your development environment for debugging."
