# Nexus Recruitment - Frontend

A modern React-based recruitment platform built with Vite and Tailwind CSS.

## Features

- **Modern Design**: Clean, professional UI with smooth animations
- **Responsive Layout**: Optimized for all device sizes
- **Interactive Components**: FAQ toggles, smooth scrolling, hover effects
- **Accessibility**: Proper semantic HTML and keyboard navigation
- **Performance**: Fast loading with Vite build system

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icon library
- **Google Fonts** - Inter font family

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx      # Navigation header
│   ├── Hero.jsx        # Hero section
│   ├── ValueProposition.jsx
│   ├── RoleSelection.jsx
│   ├── HowItWorks.jsx
│   ├── Testimonials.jsx
│   ├── TrustSecurity.jsx
│   ├── FeaturesDeepDive.jsx
│   ├── Pricing.jsx
│   ├── FAQ.jsx
│   ├── FinalCTA.jsx
│   ├── Footer.jsx
│   ├── ChatWidget.jsx
│   └── GDPRBanner.jsx
├── hooks/              # Custom React hooks
│   └── useScrollEffect.js
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Customization

### Colors
The color scheme is defined in `tailwind.config.js`:
- Primary: #146EF5 (Blue)
- Secondary: #10B981 (Green)
- Neutral: Various grays
- Error, Warning, Success: Standard colors

### Fonts
The project uses Inter font family from Google Fonts, configured in `index.html`.

## Deployment

To build for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary and confidential.



