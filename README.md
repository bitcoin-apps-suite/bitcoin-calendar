# Bitcoin Calendar - Blockchain Calendar App

A decentralized calendar application built on Bitcoin SV blockchain with HandCash authentication. Your events and schedules are encrypted and stored on the blockchain, accessible only with your HandCash login.

## Features

- 🔒 **Encrypted Storage**: All calendar events are encrypted before being stored on the blockchain
- 🔑 **HandCash Authentication**: Secure login with your HandCash wallet
- 🌐 **Access Anywhere**: Your calendar is available from any device with your HandCash login
- 💎 **Permanent Storage**: Built on Bitcoin SV for immutable event storage
- 📅 **Rich Calendar**: Full-featured calendar with event scheduling and management
- 💾 **Auto-save**: Automatic saving of your events
- 📱 **Responsive**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- A HandCash wallet and developer account
- HandCash App ID from the [HandCash Developer Dashboard](https://app.handcash.io/developers)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bitcoin-apps-suite/bitcoin-calendar.git
   cd bitcoin-calendar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your HandCash configuration:
   ```
   REACT_APP_HANDCASH_APP_ID=your_handcash_app_id_here
   REACT_APP_HANDCASH_REDIRECT_URL=http://localhost:3000/auth/handcash/callback
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `build` folder ready for deployment.

### Deployment

The app can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

For Vercel:
```bash
npm install -g vercel
vercel
```

## How It Works

1. **Authentication**: Users sign in with their HandCash wallet using OAuth2 flow
2. **Encryption**: Calendar data is encrypted using a key derived from the user's HandCash authentication
3. **Storage**: Encrypted calendar events are stored on the Bitcoin SV blockchain (currently simulated with localStorage in demo mode)
4. **Access**: Only the authenticated user can decrypt and read their calendar data

## Architecture

- **Frontend**: React with TypeScript
- **Authentication**: HandCash OAuth2 REST API
- **Encryption**: AES encryption via CryptoJS
- **Storage**: Bitcoin SV blockchain (with BSV library)
- **State Management**: React hooks and local state

## Key Components

- `HandCashAuthService`: Handles OAuth2 authentication with HandCash
- `BlockchainDocumentService`: Manages encrypted calendar data storage and retrieval
- `CalendarView`: Calendar interface with blockchain integration
- `Login`: HandCash authentication interface

## Security Features

- Calendar events are encrypted client-side before storage
- Encryption keys are derived from user authentication tokens
- No plaintext calendar data ever leaves the user's device unencrypted
- Authentication tokens are securely managed in localStorage

## Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save event
- **Ctrl/Cmd + N**: New event
- **F11**: Toggle fullscreen mode
- **Arrow Keys**: Navigate calendar

## Development

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (not recommended)

### HandCash Integration

This app integrates with HandCash using:
- HandCash Connect SDK for wallet operations
- HandCash OAuth2 REST API for authentication
- BSV library for blockchain operations

### Environment Variables

- `REACT_APP_HANDCASH_APP_ID`: Your HandCash application ID
- `REACT_APP_HANDCASH_APP_SECRET`: Your HandCash application secret (optional)
- `REACT_APP_HANDCASH_REDIRECT_URL`: OAuth callback URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the Open BSV License version 5 - see the [LICENSE](LICENSE) file for details.

Copyright © 2025 The Bitcoin Corporation LTD  
Registered in England and Wales • Company No. 16735102

## Support

For support, please contact the development team or create an issue on GitHub.

## Acknowledgments

- Built on Bitcoin SV blockchain
- Powered by HandCash for authentication
- Inspired by the need for decentralized, private calendar management 