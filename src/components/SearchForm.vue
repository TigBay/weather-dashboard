<template>
  <div class="search-form q-gutter-md">
    <q-input v-model="searchTerm" label="Ort suchen" filled clearable @keyup.enter="onSearch">
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
      Kein Ort gefunden für "{{ searchTerm }}"
    </div>

    <q-list v-if="geocoding.hasResults.value" bordered separator class="q-mt-md">
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

    <div v-if="weather.forecast.value" class="q-mt-md">
      <div v-if="selectedLocation" class="row items-center no-wrap">
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
      <div class="text-h6">{{ weather.forecast.value.current?.temperature_2m }}°C</div>
    </div>
  </div>

  <q-btn
    v-if="weather.forecast.value"
    label="7-day forecast"
    flat
    @click="showDetailDialog = true"
  />

  <ForecastDetailDialog
    v-if="weather.forecast.value"
    v-model="showDetailDialog"
    :forecast="weather.forecast.value"
  />

  <WeatherMap
    v-if="selectedLocation"
    :latitude="selectedLocation.latitude"
    :longitude="selectedLocation.longitude"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useGeocoding } from '@/composables/useGeocoding';
import { useWeather } from '@/composables/useWeather';
import { useFavorites } from '@/composables/useFavorites';
import WeatherMap from '@/components/WeatherMap.vue';
import ForecastDetailDialog from '@/components/ForecastDetailDialog.vue';
import { useRecentSearches } from '@/composables/useRecentSearches';
import type { GeocodingResult } from '@/types/open-meteo';

const route = useRoute();
const searchTerm = ref('');
const geocoding = useGeocoding();
const weather = useWeather();
const favorites = useFavorites();
const selectedLocation = ref<GeocodingResult | null>(null);
const showDetailDialog = ref(false);

const { recentSearches, addSearch } = useRecentSearches();

function onSearch(): void {
  if (!searchTerm.value.trim()) return;
  void geocoding.searchLocation(searchTerm.value);
}

function onSelectLocation(location: GeocodingResult): void {
  void weather.loadWeather(location.latitude, location.longitude);
  selectedLocation.value = location;
  addSearch(location);
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
