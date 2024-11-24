#!/bin/bash

curl -X 'POST' \
  'http://127.0.0.1:3000/pay' \
  -H 'Content-Type: application/json' \
  -d '{
  "from": "7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV",
  "to": "7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV",
  "amount": 5000
}'

echo ""
echo ""

curl -X 'POST' \
  'http://127.0.0.1:3000/pay' \
  -H 'Content-Type: application/json' \
  -d '{
  "from": "7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV",
  "to": "7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV",
  "amount": 1
}'

echo ""
echo ""

curl -X 'POST' \
  'http://127.0.0.1:3000/pay' \
  -H 'Content-Type: application/json' \
  -d '{
  "from": "7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV",
  "to": "7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV",
  "amount": 100000000000000
}'

echo ""
echo ""




curl -X 'POST' \
  'http://127.0.0.1:3000/pay' \
  -H 'Content-Type: application/json' \
  -d '{
  "from": "7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV",
  "amount": 5000
}'

echo ""
echo ""

curl -X 'POST' \
  'http://127.0.0.1:3000/pay' \
  -H 'Content-Type: application/json' \
  -d '{
  "to": "7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV",
  "amount": 5000
}'

echo ""
echo ""
curl -X 'POST' \
  'http://127.0.0.1:3000/pay' \
  -H 'Content-Type: application/json' \
  -d '{
  "from": "7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV",
  "to": "7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV"
}'

echo ""
echo ""
