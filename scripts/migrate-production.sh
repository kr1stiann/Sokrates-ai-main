#!/bin/bash

# ANSI color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Production Database Migration Tool ===${NC}"
echo "This script will help you apply the database schema to your production environment."
echo ""
echo -e "${GREEN}Step 1:${NC} Retrieve your POSTGRES_URL from your Vercel/Neon/Supabase dashboard."
echo "It should look like: postgres://user:password@host:5432/dbname?sslmode=require"
echo ""
read -p "Paste your Production POSTGRES_URL here: " PROD_URL

if [ -z "$PROD_URL" ]; then
    echo -e "${RED}Error: No URL provided.${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Running migrations against production database...${NC}"
echo "(This may take a few seconds)"
echo ""

# Run the migration script with the provided env var
export POSTGRES_URL="$PROD_URL"
npx tsx lib/db/migrate.ts

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Migrations successfully applied to production!${NC}"
    echo "Your application should now work correctly."
else
    echo ""
    echo -e "${RED}❌ Migration failed.${NC}"
    echo "Please check the error message above and verify your connection string."
fi
