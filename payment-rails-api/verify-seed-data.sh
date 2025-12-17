#!/bin/bash

# PayFlow Global Payment HUB - Seed Data Verification Script
# This script tests all API endpoints to verify seed data is accessible

BASE_URL="http://localhost:3000/api/v1"

echo "🔍 PayFlow Global Payment HUB - Seed Data Verification"
echo "======================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local name=$1
    local endpoint=$2
    local expected_count=$3

    echo -n "Testing $name... "
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    if [ "$http_code" = "200" ]; then
        if [ -n "$expected_count" ]; then
            actual_count=$(echo "$body" | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
            if [ "$actual_count" = "$expected_count" ]; then
                echo -e "${GREEN}✓ PASS${NC} (Found $actual_count items)"
            else
                echo -e "${YELLOW}⚠ WARNING${NC} (Expected $expected_count, found $actual_count)"
            fi
        else
            echo -e "${GREEN}✓ PASS${NC}"
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $http_code)"
    fi
}

# Test endpoints
echo "📍 Master Data:"
test_endpoint "Countries" "/countries" "1"
test_endpoint "Currencies" "/currencies" "1"
echo ""

echo "🚄 Payment Rails:"
test_endpoint "Payment Rails List" "/payment-rails" "1"
test_endpoint "FedNow Rail by Code" "/payment-rails/code/FEDNOW" ""
echo ""

echo "💳 Payment Transactions:"
test_endpoint "All Transactions" "/payment-transactions" "2"
test_endpoint "Transaction by Ref" "/payment-transactions/ref/FN-20231215-0000001" ""
test_endpoint "Suspicious Transactions" "/payment-transactions/suspicious" "0"
test_endpoint "HITL Required Transactions" "/payment-transactions/requiring-hitl" "0"
echo ""

echo "🔍 Search Functions:"
test_endpoint "Search Countries" "/countries/search?q=United" ""
test_endpoint "Search Currencies" "/currencies/search?q=Dollar" ""
test_endpoint "Search Payment Rails" "/payment-rails/search?q=FedNow" ""
echo ""

echo "======================================================"
echo "✅ Verification Complete!"
echo ""
echo "📊 Expected Seed Data Summary:"
echo "  - Countries: 1 (USA)"
echo "  - Currencies: 1 (USD)"
echo "  - Payment Rails: 1 (FedNow)"
echo "  - Payment Products: 3"
echo "  - Transactions: 2"
echo ""
echo "📚 View full API documentation at:"
echo "   http://localhost:3000/api/docs"
echo ""
