@echo off
echo Setting up RankMe application...

echo.
echo 1. Installing dependencies...
call npm install

echo.
echo 2. Generating Prisma client...
call npx prisma generate

echo.
echo 3. Setting up database...
call npx prisma db push

echo.
echo 4. Creating directories...
mkdir public\shares 2>nul

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Copy .env.example to .env.local
echo 2. Fill in your Stripe API keys in .env.local
echo 3. Run 'npm run dev' to start the development server
echo.
pause