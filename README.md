# 📞 PhoneClick

**PhoneClick** is a Chrome browser extension that automatically detects phone numbers on web pages and adds clickable call buttons (📞) next to them. Enable/disable per website with a simple icon click.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?style=for-the-badge&logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## ✨ Features

- 🔍 **Automatic Detection** - Finds phone numbers in various formats
- 📱 **Click-to-Call** - Adds clickable 📞 buttons next to phone numbers
- 🌐 **Per-Site Control** - Enable/disable on specific websites
- 💾 **Persistent Settings** - Remembers your preferences per domain
- 🔒 **Privacy-First** - No data collection, all local storage
- ⚡ **Lightweight** - Minimal permissions and resources

## 📱 Supported Phone Formats

- Standard: `555-123-4567`
- With parentheses: `(555) 123-4567`
- With dots: `555.123.4567`
- With spaces: `555 123 4567`
- Toll-free: `1-800-555-0199`
- International: `+1 555 123 4567`
- UK format: `+44 20 7123 4567`
- Emergency: `911`

## 🚀 Installation

### From Chrome Web Store
*Coming soon - extension will be available on the Chrome Web Store*

### Manual Installation (Development)

1. **Clone this repository:**
   ```bash
   git clone https://github.com/yourusername/phoneclick.git
   cd phoneclick
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the extension:**
   ```bash
   npm run build
   ```

4. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `build` folder

## 🛠️ Development

### Prerequisites
- Node.js >= 14.18.0
- npm or yarn

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Format code
npm run fmt

# Create distribution zip
npm run zip
```

### Development Mode

1. **Run development server:**
   ```bash
   npm run dev
   ```

2. **Load extension in Chrome:**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `build` folder

3. **Test the extension:**
   - Open `demo.html` in your browser
   - Click the PhoneClick icon to enable
   - See phone numbers get clickable call buttons

## 📖 How It Works

1. **Visit any website** with phone numbers
2. **Click the PhoneClick icon** in your browser toolbar
3. **Phone numbers instantly become clickable** with 📞 buttons
4. **Click any 📞 button** to call that number
5. **Click the icon again** to disable on that website

## 🎯 Use Cases

- **Business directories** - Quick calling from listings
- **Contact pages** - Easy access to phone numbers
- **Real estate listings** - Call agents directly
- **Service websites** - Contact support instantly
- **Any website** with phone numbers

## 🔒 Privacy & Security

PhoneClick is designed with privacy in mind:

- ✅ **No data collection** - We don't collect any personal information
- ✅ **Local storage only** - All settings stored locally on your device
- ✅ **No tracking** - We don't track your browsing behavior
- ✅ **No external servers** - All functionality runs locally
- ✅ **Minimal permissions** - Only what's necessary to function

[Read our full Privacy Policy](https://your-privacy-policy-url.com)

## 🏗️ Technical Details

- **Built with:** TypeScript, Vite, Chrome Extensions Manifest V3
- **Permissions:** `storage`, `activeTab`, `scripting`
- **Architecture:** Content script with dynamic injection
- **Storage:** Chrome local storage API
- **Compatibility:** Chrome 88+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please [open an issue](https://github.com/yourusername/phoneclick/issues) and let us know!

## 📸 Screenshots

*Add screenshots of your extension in action*

## 🏆 Acknowledgments

- Built with [create-chrome-ext](https://github.com/guocaoyi/create-chrome-ext)
- Chrome Extensions Manifest V3
- TypeScript and Vite for development

---

**Made with ❤️ for easier phone calling on the web**
