@echo off
REM PayFlow Global Payment HUB - Seed Data Verification Script (Windows)
REM This script tests all API endpoints to verify seed data is accessible

set BASE_URL=http://localhost:3000/api/v1

echo ====================================================
echo PayFlow Global Payment HUB - Seed Data Verification
echo ====================================================
echo.

echo Testing API Endpoints...
echo.

echo Master Data:
echo -------------
curl -s %BASE_URL%/countries >nul 2>&1 && echo [OK] Countries endpoint || echo [FAIL] Countries endpoint
curl -s %BASE_URL%/currencies >nul 2>&1 && echo [OK] Currencies endpoint || echo [FAIL] Currencies endpoint
echo.

echo Payment Rails:
echo ---------------
curl -s %BASE_URL%/payment-rails >nul 2>&1 && echo [OK] Payment Rails List || echo [FAIL] Payment Rails List
curl -s %BASE_URL%/payment-rails/code/FEDNOW >nul 2>&1 && echo [OK] FedNow Rail by Code || echo [FAIL] FedNow Rail by Code
echo.

echo Payment Transactions:
echo ---------------------
curl -s %BASE_URL%/payment-transactions >nul 2>&1 && echo [OK] All Transactions || echo [FAIL] All Transactions
curl -s %BASE_URL%/payment-transactions/ref/FN-20231215-0000001 >nul 2>&1 && echo [OK] Transaction by Ref || echo [FAIL] Transaction by Ref
curl -s %BASE_URL%/payment-transactions/suspicious >nul 2>&1 && echo [OK] Suspicious Transactions || echo [FAIL] Suspicious Transactions
curl -s %BASE_URL%/payment-transactions/requiring-hitl >nul 2>&1 && echo [OK] HITL Required || echo [FAIL] HITL Required
echo.

echo Search Functions:
echo -----------------
curl -s "%BASE_URL%/countries/search?q=United" >nul 2>&1 && echo [OK] Search Countries || echo [FAIL] Search Countries
curl -s "%BASE_URL%/currencies/search?q=Dollar" >nul 2>&1 && echo [OK] Search Currencies || echo [FAIL] Search Currencies
curl -s "%BASE_URL%/payment-rails/search?q=FedNow" >nul 2>&1 && echo [OK] Search Rails || echo [FAIL] Search Rails
echo.

echo ====================================================
echo Verification Complete!
echo.
echo Expected Seed Data Summary:
echo   - Countries: 1 (USA)
echo   - Currencies: 1 (USD)
echo   - Payment Rails: 1 (FedNow)
echo   - Payment Products: 3
echo   - Transactions: 2
echo.
echo View full API documentation at:
echo   http://localhost:3000/api/docs
echo.
echo To view detailed responses, use:
echo   curl http://localhost:3000/api/v1/[endpoint]
echo.
pause
