# Currency Converter App

A modern, feature-rich currency converter application built with React Native and Expo. Convert currencies from around the world, get real-time exchange rates, and access AI-powered help whenever you need it.

![Currency Converter App](https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=2400)

## Features

### 💱 Currency Conversion
- Real-time currency conversion between 150+ currencies
- Live exchange rates updated daily
- Visual currency selector with country flags
- Quick access to popular currencies
- Search functionality for finding specific currencies
- One-tap currency swap
- Current exchange rate display

### 🤖 AI Help Bot
- Intelligent chat assistant for currency-related queries
- Real-time responses to common questions
- Natural conversation interface
- Support for various currency-related topics:
  - Exchange rates
  - Currency information
  - App usage help
  - Conversion guidance

### ⚙️ Customizable Settings
- Dark mode support
- Notification preferences
- Auto-refresh rate options
- Favorite currencies management
- App information and support access
- Data management tools

## Technology Stack

- **Framework**: React Native
- **Platform**: Expo (SDK 52)
- **Navigation**: Expo Router 4
- **UI Components**: React Native core components
- **Icons**: Lucide React Native
- **Fonts**: Google Fonts (Inter, Poppins)
- **API**: Exchange Rate API
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/currency-converter.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=your_api_url
EXPO_PUBLIC_API_KEY=your_api_key
```

## Project Structure

```
currency-converter/
├── app/                    # Application routes
│   ├── _layout.tsx        # Root layout
│   └── (tabs)/            # Tab-based routes
│       ├── _layout.tsx    # Tab navigation layout
│       ├── index.tsx      # Currency converter screen
│       ├── help.tsx       # AI Help Bot screen
│       └── settings.tsx   # Settings screen
├── components/            # Reusable components
├── assets/               # Static assets
└── types/                # TypeScript type definitions
```

## Features in Detail

### Currency Converter
- Enter any amount to convert
- Select source and target currencies
- View real-time conversion results
- Access historical exchange rates
- Save favorite currency pairs

### Help Bot Capabilities
- Exchange rate information
- Currency details
- Conversion guidance
- App feature explanations
- General currency knowledge

### Settings & Customization
- Toggle dark/light mode
- Manage notifications
- Configure auto-refresh
- Set favorite currencies
- Access help & support
- Manage app data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Exchange rate data provided by [Exchange Rate API](https://www.exchangerate-api.com/)
- Country flags from [Flag CDN](https://flagcdn.com)
- Icons from [Lucide Icons](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## Support

For support, email support@currencyconverter.com or visit our [support page](https://currencyconverter.com/support).

---

Built with ❤️ using React Native and Expo
