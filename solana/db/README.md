# DB Service

access sqlite data

## API

```
curl -X POST -H "Content-Type: application/json" \
-d '{"owner": "owner2", "publicKey": "0xpublicKey2", "secretKey": "0xsecretKey2"}' \
http://127.0.0.1:5000/wallet

{
    "message": "Wallet created successfully"
}

curl -X GET http://127.0.0.1:5000/wallet?owner="owner2"

{
    "owner": "owner2",
    "publicKey": "0xpublicKey2",
    "secretKey": "0xsecretKey2",
    "createdTime": "2024-11-23 04:23:39"
}
```
