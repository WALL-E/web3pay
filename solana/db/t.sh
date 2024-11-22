#!/bin/bash

# Configuration
BASE_URL="http://localhost:5000"
TEST_OWNER="test_user1"
TEST_PUBLIC_KEY="test_pubkey_123"
TEST_SECRET_KEY="test_seckey_123"

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print test result
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ Passed${NC}"
    else
        echo -e "${RED}✗ Failed${NC}"
    fi
}

# Test POST - Create Wallet
echo "Test 1: Create Wallet"
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE_URL}/wallet" \
    -H "Content-Type: application/json" \
    -d "{\"owner\":\"${TEST_OWNER}\",\"publicKey\":\"${TEST_PUBLIC_KEY}\",\"secretKey\":\"${TEST_SECRET_KEY}\"}")

if [ "$response" -eq 201 ]; then
    echo -e "${GREEN}✓ Wallet Creation Successful (HTTP 201)${NC}"
else
    echo -e "${RED}✗ Wallet Creation Failed (HTTP $response)${NC}"
fi

# Test POST - Duplicate Wallet
echo -e "\nTest 2: Create Duplicate Wallet"
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE_URL}/wallet" \
    -H "Content-Type: application/json" \
    -d "{\"owner\":\"${TEST_OWNER}\",\"publicKey\":\"${TEST_PUBLIC_KEY}\",\"secretKey\":\"${TEST_SECRET_KEY}\"}")

if [ "$response" -eq 409 ]; then
    echo -e "${GREEN}✓ Duplicate Wallet Prevented (HTTP 409)${NC}"
else
    echo -e "${RED}✗ Duplicate Wallet Test Failed (HTTP $response)${NC}"
fi

# Test GET - Retrieve Wallet
echo -e "\nTest 3: Retrieve Wallet"
response=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/wallet?owner=${TEST_OWNER}")

if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✓ Wallet Retrieval Successful (HTTP 200)${NC}"
else
    echo -e "${RED}✗ Wallet Retrieval Failed (HTTP $response)${NC}"
fi

# Test GET - Non-existent Wallet
echo -e "\nTest 4: Retrieve Non-existent Wallet"
response=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/wallet?owner=non_existent_user")

if [ "$response" -eq 404 ]; then
    echo -e "${GREEN}✓ Non-existent Wallet Handled (HTTP 404)${NC}"
else
    echo -e "${RED}✗ Non-existent Wallet Test Failed (HTTP $response)${NC}"
fi

# Test POST - Missing Fields
echo -e "\nTest 5: Create Wallet with Missing Fields"
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE_URL}/wallet" \
    -H "Content-Type: application/json" \
    -d '{"owner":"incomplete_user"}')

if [ "$response" -eq 400 ]; then
    echo -e "${GREEN}✓ Missing Fields Validation (HTTP 400)${NC}"
else
    echo -e "${RED}✗ Missing Fields Test Failed (HTTP $response)${NC}"
fi
