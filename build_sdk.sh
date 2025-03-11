#!/bin/bash

# Set variables
OPENAPI_SPEC="apps/docs/openapi.json"
OUTPUT_DIR_NODE="./generated-sdk-node"
OUTPUT_DIR_PYTHON="./generated-sdk-python"

# Generate Node.js SDK
openapi-generator-cli generate -i $OPENAPI_SPEC -g typescript-fetch -o $OUTPUT_DIR_NODE

# Navigate to Node.js SDK directory
cd $OUTPUT_DIR_NODE

# Initialize npm package
npm init -y

# Build the SDK (if using TypeScript)
npm install
npm run build

# Publish to npm
npm publish

# Navigate back to root
cd ..

# Generate Python SDK
openapi-generator-cli generate -i $OPENAPI_SPEC -g python -o $OUTPUT_DIR_PYTHON

# Navigate to Python SDK directory
cd $OUTPUT_DIR_PYTHON

# Build and publish Python package
python setup.py sdist bdist_wheel
twine upload dist/*

# Navigate back to root
cd ..