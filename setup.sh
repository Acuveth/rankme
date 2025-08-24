#!/bin/bash

echo "Setting up RankMe application..."

echo ""
echo "1. Installing dependencies..."
npm install

echo ""
echo "2. Generating Prisma client..."
npx prisma generate

echo ""
echo "3. Setting up database..."
npx prisma db push

echo ""
echo "4. Creating directories..."
mkdir -p public/shares

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env.local"
echo "2. Fill in your Stripe API keys in .env.local"
echo "3. Run 'npm run dev' to start the development server"
echo ""