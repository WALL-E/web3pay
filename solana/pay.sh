#!/bin/bash

curl -X 'POST' \
  'http://127.0.0.1:3000/pay' \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV",
  "amount": 5000
}'

echo ""
echo ""

curl -X 'POST' \
  'http://127.0.0.1:3000/pay' \
  -H 'Content-Type: application/json' \
  -d '{
  "address2": "7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV",
  "amount": 5000
}'

echo ""
echo ""

curl -X 'POST' \
  'http://127.0.0.1:3000/pay' \
  -H 'Content-Type: application/json' \
  -d '{
  "address": "7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV",
  "amount2": 5000
}'

echo ""
echo ""
