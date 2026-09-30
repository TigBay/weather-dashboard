<template>
  <div class="search-form q-gutter-md">
    <q-input v-model="searchTerm" label="Search location" filled clearable @keyup.enter="onSearch">
      <template #append>
        <q-icon name="search" class="cursor-pointer" @click="onSearch" />
      </template>
    </q-input>

    <q-select
      v-if="recentSearches.length > 0"
      :model-value="null"
      :options="recentSearches"
      option-label="name"
      label="Recent searches"
      filled
      emit-value
      @update:model-value="onSelectLocation"
    />

    <div v-if="geocoding.noResult.value" class="text-warning">
      No location found for "{{ searchTerm }}"
    </div>

    <div v-if="showIntro" class="text-center text-grey-7 q-py-xl">
      <q-icon name="wb_sunny" size="56px" class="text-grey-5" />
      <div class="text-h6 text-grey-8 q-mt-sm">Check the weather anywhere</div>
      <p class="q-mt-sm">
        Search for a city to see current conditions, a 7-day forecast and its position on the map.
      </p>
      <div class="q-gutter-sm q-mt-md">
        <q-chip
          v-for="city in suggestions"
          :key="city"
          clickable
          color="primary"
          text-color="white"
          @click="quickSearch(city)"
        >
          {{ city }}
        </q-chip>
      </div>
    </div>

    <q-list v-if="showResults" bordered separator class="q-mt-md">
      <q-item
        v-for="result in geocoding.results.value"
        :key="result.id"
        clickable
        @click="onSelectLocation(result)"
      >
        <q-item-section>
          <q-item-label>{{ result.name }}</q-item-label>
          <q-item-label caption>{{ result.country }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            dense
            round
            :icon="favorites.isFavorite(result.id) ? 'favorite' : 'favorite_border'"
            :color="favorites.isFavorite(result.id) ? 'red' : 'grey-6'"
            :aria-label="favoriteLabel(result)"
            @click.stop="toggleFavorite(result)"
          />
        </q-item-section>
      </q-item>
    </q-list>

    <q-inner-loading :showing="weather.isLoading.value" />

    <q-card v-if="weather.forecast.value && selectedLocation" flat bordered class="q-mt-md">
      <q-card-section class="row items-center no-wrap">
        <div class="col">
          <div class="row items-center no-wrap">
            <div class="text-h6">{{ selectedLocation.name }}</div>
            <q-btn
              flat
              dense
              round
              class="q-ml-sm"
              :icon="favorites.isFavorite(selectedLocation.id) ? 'favorite' : 'favorite_border'"
              :color="favorites.isFavorite(selectedLocation.id) ? 'red' : 'grey-6'"
              :aria-label="favoriteLabel(selectedLocation)"
              @click="toggleFavorite(selectedLocation)"
            />
          </div>
          <div class="text-caption text-grey-7">
            {{ selectedLocation.country }}
          </div>

          <div class="text-h3 text-weight-light q-mt-sm">{{ temperature }}°C</div>
          <div class="text-subtitle1 text-grey-8">{{ condition.label }}</div>
          <div class="text-caption text-grey-7 q-mt-xs">
            <q-icon name="air" size="16px" /> {{ windSpeed }} km/h wind
          </div>
        </div>

        <q-icon :name="condition.icon" size="88px" color="primary" class="q-ml-md" />
      </q-card-section>
    </q-card>
    <q-btn
      v-if="weather.forecast.value"
      label="7-day forecast"
      icon="calendar_month"
      color="primary"
      outline
      no-caps
      @click="showDetailDialog = true"
    />

    <WeatherMap
      v-if="selectedLocation"
      :latitude="selectedLocation.latitude"
      :longitude="selectedLocation.longitude"
    />
  </div>

  <ForecastDetailDialog
    v-if="weather.forecast.value"
    v-model="showDetailDialog"
    :forecast="weather.forecast.value"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGeocoding } from '@/composables/useGeocoding';
import { useWeather } from '@/composables/useWeather';
import { useFavorites } from '@/composables/useFavorites';
import WeatherMap from '@/components/WeatherMap.vue';
import ForecastDetailDialog from '@/components/ForecastDetailDialog.vue';
import { useRecentSearches } from '@/composables/useRecentSearches';
import type { GeocodingResult } from '@/types/open-meteo';
import { describeWeatherCode } from '@/utils/weather-code';

const route = useRoute();
const searchTerm = ref('');
const geocoding = useGeocoding();
const weather = useWeather();
const favorites = useFavorites();
const selectedLocation = ref<GeocodingResult | null>(null);
const showDetailDialog = ref(false);
const showResults = ref(false);

const suggestions = ['Berlin', 'Hamburg', 'Munich'];

const temperature = computed(() => weather.forecast.value?.current?.temperature_2m ?? '--');
const windSpeed = computed(() => Math.round(weather.forecast.value?.current?.wind_speed_10m ?? 0));
const condition = computed(() =>
  describeWeatherCode(weather.forecast.value?.current?.weather_code),
);

// The landing state: nothing searched, nothing picked, nothing loading.
const showIntro = computed(
  () =>
    !showResults.value &&
    !selectedLocation.value &&
    !geocoding.isLoading.value &&
    !geocoding.noResult.value,
);

const { recentSearches, addSearch } = useRecentSearches();

function onSearch(): void {
  if (!searchTerm.value.trim()) return;
  showResults.value = true;
  void geocoding.searchLocation(searchTerm.value);
}

function quickSearch(city: string): void {
  searchTerm.value = city;
  onSearch();
}

function onSelectLocation(location: GeocodingResult): void {
  void weather.loadWeather(location.latitude, location.longitude);
  selectedLocation.value = location;
  addSearch(location);
  // Collapse the result list once a location is picked.
  showResults.value = false;
}

function favoriteLabel(location: GeocodingResult): string {
  return favorites.isFavorite(location.id)
    ? `Remove ${location.name} from favorites`
    : `Add ${location.name} to favorites`;
}

function toggleFavorite(location: GeocodingResult): void {
  if (favorites.isFavorite(location.id)) {
    favorites.removeFavorite(location.id);
  } else {
    favorites.addFavorite(location);
  }
}

// Supports ?location=<id> so a favorite (or a shared link) loads straight away.
function loadLocationFromQuery(): void {
  const raw = route.query.location;
  if (typeof raw !== 'string') return;

  const match = favorites.findFavorite(Number(raw));
  if (match) onSelectLocation(match);
}

onMounted(loadLocationFromQuery);
watch(() => route.query.location, loadLocationFromQuery);

defineExpose({ weather, selectedLocation });
</script>
