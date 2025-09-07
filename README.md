# BendApp - React Native with Expo SDK 53 + NativeWind

A React Native application built with Expo SDK 53 and styled using NativeWind v4 (Tailwind CSS for React Native).

## 🚀 Features

- **Expo SDK 53**: Latest Expo SDK with React Native 0.79.6
- **NativeWind v4**: Utility-first CSS framework for React Native
- **TypeScript**: Full TypeScript support
- **Modern UI**: Beautiful, responsive components using Tailwind CSS classes

## 📱 Screenshots

The app includes:

- Welcome screen with app branding
- Feature showcase with icons and descriptions
- Modern card-based UI design
- Responsive layout using NativeWind classes

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation Steps

1. **Clone and navigate to the project:**

   ```bash
   cd BendApp
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

4. **Run on your preferred platform:**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## 🎨 NativeWind Usage

This project demonstrates NativeWind v4 capabilities:

### Basic Styling

```tsx
<View className='flex-1 bg-white items-center justify-center'>
  <Text className='text-xl text-gray-800 font-semibold'>Hello NativeWind!</Text>
</View>
```

### Responsive Design

```tsx
<View className='px-4 py-6 bg-blue-50 rounded-xl'>
  <Text className='text-center text-blue-800'>Responsive content</Text>
</View>
```

### Component Styling

The `WelcomeCard` component showcases:

- Card layouts with shadows
- Icon integration
- Typography hierarchy
- Interactive elements
- Spacing and layout utilities

## 📁 Project Structure

```
BendApp/
├── App.tsx                 # Main application component
├── components/             # Reusable UI components
│   └── WelcomeCard.tsx    # Welcome screen component
├── tailwind.config.js     # Tailwind CSS configuration
├── nativewind-env.d.ts    # NativeWind TypeScript types
├── package.json           # Project dependencies
└── tsconfig.json         # TypeScript configuration
```

## 🔧 Configuration Files

### Tailwind Config (`tailwind.config.js`)

- Content paths for React Native components
- Extensible theme configuration
- Plugin support

### TypeScript Config (`tsconfig.json`)

- Extends Expo base configuration
- Strict type checking enabled
- NativeWind type support

## 🎯 Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser

## 🌟 NativeWind Benefits

- **Consistent Styling**: Same Tailwind classes across platforms
- **Developer Experience**: Familiar CSS utility classes
- **Performance**: Optimized for React Native
- **Type Safety**: Full TypeScript support
- **Hot Reload**: Instant style updates during development

## 📚 Resources

- [NativeWind Documentation](https://www.nativewind.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

## 🤝 Contributing

Feel free to contribute to this project by:

- Adding new components
- Improving existing styles
- Enhancing the UI/UX
- Adding new features

## 📄 License

This project is open source and available under the MIT License.
