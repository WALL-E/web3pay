# Web3Pay

Web3 User Pay Service

## Pay Biz

1. /getAccount
   ```
   curl -X 'POST' \
    'http://127.0.0.1:3000/getAccount' \
    -H 'Content-Type: application/json' \
    -d '{
      "address": "5oNDL3swdJJF1g9DzJiZ4ynHXgszjAEpUkxVYejchzrY"
    }'

    {
        "result":"4FHTRksmGQJj4VGsvUewjCfidHqJtNxwhyKkhCdftBrf"
    }
   ```
2. /getBalance
   ```
   curl -X 'POST' \
    'http://127.0.0.1:3000/getBalance' \
    -H 'Content-Type: application/json' \
    -d '{
      "address": "7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV"
    }'

    {
        "result":5589950000
    }
   ```
3. /checkUserToken
   ```
   curl -X 'POST' \
    'http://127.0.0.1:3000/checkUserToken' \
    -H 'Content-Type: application/json' \
    -d '{
      "token": "bec012cc4eeefe921fb5e944d851efa19a768638d1d6ec6620ed1a07f4067b026b773f616226fb3822618292597c27b6d6bcf8e0c7d542f5e8e288aec067c448"
    }'

   {
     "result":{
       "address":"7iCzEsN1xrV9gZoWMvUaWKhAhy1Cqm9iAeVAmJVThCqV",
       "uid":"c9fe7bf01a33e35c"
     }
   }
   ```
