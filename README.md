# Weather Dashboard

A real-time weather application built with **Vue 3**, **TypeScript**, **Quasar**, and **Vitest**. Search for locations worldwide, view live weather data, 7-day forecasts, interactive maps, and save your favorite locations.

[![CI](https://github.com/TigBay/weather_dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/TigBay/weather_dashboard/actions/workflows/ci.yml)

## Features

- 🔍 **Location Search** – Search locations globally using the Open-Meteo Geocoding API with autocomplete support
- 🌡️ **Live Weather** – Display current temperature, weather conditions, and wind speed
- 📊 **7-Day Forecast** – View daily min/max temperatures and weather patterns
- 🗺️ **Interactive Map** – Leaflet-powered map with OpenStreetMap tiles showing location markers
- ⭐ **Favorites** – Save and manage favorite locations with persistent localStorage storage
- 📱 **Responsive Design** – Built with Quasar for mobile and desktop compatibility
- ✨ **Type-Safe** – 100% TypeScript with runtime type guards, zero `any` casts
- ✅ **Well-Tested** – Vitest unit tests with component and composable coverage

## Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **UI Framework**: Quasar 2
- **Language**: TypeScript
- **Testing**: Vitest + @vue/test-utils
- **Linting**: ESLint + Prettier
- **Maps**: Leaflet + @vue-leaflet
- **APIs**: Open-Meteo (Geocoding & Weather Forecast)

## Quick Start

### Install dependencies

```bash
npm install
```

### Development server

```bash
npm run dev
```

Open your browser at `http://localhost:9000`

### Run tests

```bash
npm run test        # Run all tests once
npm run test:watch  # Watch mode for development
npm run test:coverage  # Coverage report
```

### Lint and format

```bash
npm run lint        # Format and fix lint issues
npm run lint:check  # Check without modifying
npm run typecheck   # TypeScript type checking
```

### Build for production

```bash
npm run build
```

## Project Structure

```
src/
├── components/         # Vue components (SearchForm, WeatherMap, ForecastDetailDialog)
├── composables/        # Vue composables (useGeocoding, useWeather, useFavorites, useNotifications, useRecentSearches)
├── pages/              # Page components (FavoritesPage, ErrorNotFound)
├── layouts/            # Layout wrapper (MainLayout)
├── router/             # Vue Router configuration
├── types/              # TypeScript types and type guards
└── css/                # Global styles
```

## API Attribution

- **Weather & Geocoding Data**: [Open-Meteo](https://open-meteo.com/) – Free weather API (no API key required)
- **Maps Tiles**: [OpenStreetMap](https://www.openstreetmap.org/) – Open-source map data

## Development Notes

- Type safety: Uses runtime type guards (`isValidForecast`, `isValidGeocodingResponse`) before trusting API responses
- No external state management needed – composables + localStorage handle app state elegantly
- All pages use Vue Router for seamless navigation between Search and Favorites views
- Recent searches are auto-capped at 5 entries; favorites are manually curated

## License

MIT
