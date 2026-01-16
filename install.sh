# #!/bin/bash

# # Blog Platform - Installation Script
# # This script installs all dependencies for both backend and frontend

# echo "======================================"
# echo "Blog Platform - Installation Script"
# echo "======================================"
# echo ""

# # Check if Node.js is installed
# if ! command -v node &> /dev/null
# then
#     echo "❌ Node.js is not installed. Please install Node.js first."
#     echo "Download from: https://nodejs.org/"
#     exit 1
# fi

# echo "✅ Node.js version: $(node --version)"
# echo "✅ npm version: $(npm --version)"
# echo ""

# # Check if PostgreSQL is installed
# if ! command -v psql &> /dev/null
# then
#     echo "⚠️  PostgreSQL is not installed or not in PATH."
#     echo "Please install PostgreSQL from: https://www.postgresql.org/download/"
#     echo ""
# fi

# # Install Backend Dependencies
# echo "======================================"
# echo "Installing Backend Dependencies..."
# echo "======================================"
# cd backend
# npm install
# if [ $? -eq 0 ]; then
#     echo "✅ Backend dependencies installed successfully!"
# else
#     echo "❌ Failed to install backend dependencies"
#     exit 1
# fi
# cd ..
# echo ""

# # Install Frontend Dependencies
# echo "======================================"
# echo "Installing Frontend Dependencies..."
# echo "======================================"
# cd frontend
# npm install
# if [ $? -eq 0 ]; then
#     echo "✅ Frontend dependencies installed successfully!"
# else
#     echo "❌ Failed to install frontend dependencies"
#     exit 1
# fi
# cd ..
# echo ""

# # Check for Angular CLI
# if ! command -v ng &> /dev/null
# then
#     echo "======================================"
#     echo "Installing Angular CLI..."
#     echo "======================================"
#     npm install -g @angular/cli@13
#     if [ $? -eq 0 ]; then
#         echo "✅ Angular CLI installed successfully!"
#     else
#         echo "❌ Failed to install Angular CLI"
#         exit 1
#     fi
#     echo ""
# fi

# # Setup environment file
# echo "======================================"
# echo "Setting up Environment File..."
# echo "======================================"
# if [ ! -f backend/.env ]; then
#     cp backend/.env.example backend/.env
#     echo "✅ Created backend/.env file"
#     echo "⚠️  Please edit backend/.env with your database credentials"
# else
#     echo "ℹ️  backend/.env already exists"
# fi
# echo ""

# echo "======================================"
# echo "✅ Installation Complete!"
# echo "======================================"
# echo ""
# echo "Next Steps:"
# echo "1. Setup PostgreSQL database:"
# echo "   psql -U postgres -f database/setup.sql"
# echo ""
# echo "2. Edit backend/.env with your database credentials"
# echo ""
# echo "3. Start the backend server:"
# echo "   cd backend && npm run dev"
# echo ""
# echo "4. In a new terminal, start the frontend:"
# echo "   cd frontend && npm start"
# echo ""
# echo "5. Open http://localhost:4200 in your browser"
# echo ""
# echo "For more details, see README.md or QUICKSTART.md"
# echo "======================================"

