# CryptoMining App

**A comprehensive MERN stack application** that enables crypto mining operations with OKX wallet authentication. Monitor your mining performance, track earnings, and manage your crypto assets all in one place. <br/>
![MERN Stack](https://img.shields.io/badge/Stack-MERN-61DAFB?logo=react&logoColor=white)
![OKX Wallet](https://img.shields.io/badge/Auth-OKX_Wallet-052BFF?logo=okx)
![License](https://img.shields.io/badge/License-MIT-green)

**Next-gen cryptocurrency mining platform** with OKX Wallet integration, real-time analytics, and multi-coin support. Mine smarter, not harder.



## 🌟 Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **OKX Wallet Auth** | Secure Web3 authentication with OKX Wallet |
| ⚡ **Real-time Monitoring** | Live hashrate, temperature, and earnings tracking |
| 💎 **Multi-Coin Mining** | Automatic switching between most profitable coins |
| 📊 **Advanced Analytics** | Historical performance charts and ROI calculators |
| 💸 **Instant Withdrawals** | Direct to your OKX wallet with low fees |

## 🛠 Tech Stack

**Frontend**  
![React](https://img.shields.io/badge/React-18.2-%2361DAFB) ![Redux](https://img.shields.io/badge/Redux-4.2-%23764ABC) ![Tailwind](https://img.shields.io/badge/Tailwind-3.3-%2306B6D4)

**Backend**  
![Node.js](https://img.shields.io/badge/Node.js-20-%23339933) ![Express](https://img.shields.io/badge/Express-4.18-%23000000)

**Database**  
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-%2347A248)


## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.x or higher)
- npm or yarn
- MongoDB (local or Atlas connection)
- OKX Wallet browser extension

## Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/Hafiz-Tanzeel-Shamshad/crypto-mining-app.git
cd cryptominer-pro
```

### Environment Variables

Create the following environment files:

**Backend (.env in backend folder)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cryptominer
JWT_SECRET=your_jwt_secret_key
OKX_API_KEY=your_okx_api_key
OKX_API_SECRET=your_okx_api_secret
OKX_PASSPHRASE=your_okx_passphrase
```

**Frontend (.env in frontend folder)**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_OKX_APP_ID=your_okx_app_id
```

### Backend Setup

```bash
cd backend
npm install
npm run dev  # For development with nodemon
# OR
npm start    # For production
```

The backend server will start at http://localhost:5000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev  # For development
# OR
npm run build  # For production build
```

The development server will start at http://localhost:3000

## Application Structure

### Backend

```
backend/
├── config/             # Configuration files
├── controllers/        # Request handlers
├── middleware/         # Custom middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── .env                # Environment variables
├── package.json        # Dependencies
└── server.js           # Entry point
```

### Frontend

```
frontend/
├── public/             # Static files
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── App.js          # App component
│   └── index.js        # Entry point
├── .env                # Environment variables
└── package.json        # Dependencies
```

## OKX Wallet Integration

### Setting Up OKX Authentication

1. Register as a developer on the [OKX Developer Portal](https://www.okx.com/developers)
2. Create a new application to get your App ID
3. Configure the callback URLs to include your application domain
4. Implement the authentication flow using OKX Web3 SDK

### Authentication Flow

```javascript
// Example authentication code
import { OKXWalletSDK } from '@okx/wallet-sdk';

const connectWallet = async () => {
  try {
    const okxWallet = new OKXWalletSDK();
    await okxWallet.init();
    
    const accounts = await okxWallet.connectWallet();
    const address = accounts[0];
    
    // Request signature for authentication
    const message = `Sign this message to authenticate with CryptoMiner Pro: ${Date.now()}`;
    const signature = await okxWallet.signMessage(message, address);
    
    // Send to backend for verification
    const response = await api.authenticate({
      address,
      message,
      signature
    });
    
    // Handle successful authentication
    if (response.token) {
      localStorage.setItem('token', response.token);
      // Redirect to dashboard
    }
  } catch (error) {
    console.error('Authentication failed:', error);
  }
};
```

## Mining Configuration

The mining engine is configured through the dashboard. Users can select:

- Target cryptocurrency
- Mining pool
- Hardware allocation (CPU/GPU percentage)
- Automatic switching based on profitability

## API Endpoints

### Authentication

- `POST /api/auth/connect` - Connect OKX wallet
- `POST /api/auth/verify` - Verify wallet signature
- `GET /api/auth/user` - Get current user data

### Mining

- `GET /api/mining/status` - Get current mining status
- `POST /api/mining/start` - Start mining operation
- `POST /api/mining/stop` - Stop mining operation
- `GET /api/mining/statistics` - Get mining statistics



## Deployment

### Backend Deployment

```bash
# Install PM2 globally
npm install -g pm2

# Start the application with PM2
cd backend
pm2 start server.js --name cryptominer-backend

# Save PM2 configuration
pm2 save
```

### Frontend Deployment

```bash
# Build the React application
cd frontend
npm run build

# Serve using Nginx or similar web server
# Example Nginx configuration:
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/cryptominer-pro/frontend/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Considerations

- All API requests should be secured with JWT authentication
- Implement rate limiting to prevent abuse
- Use HTTPS in production
- Store sensitive information in environment variables
- Never expose your OKX API keys

## Monitoring & Maintenance

- Use PM2 for process management
- Set up logging with Winston or similar
- Monitor server health with tools like Prometheus
- Set up alerts for critical events


## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See LICENSE for details.

## Support

For support, email hafiztanzeel.pk@gmail.com or open an issue in the GitHub repository.