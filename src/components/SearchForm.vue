<template>
  <div class="search-form q-gutter-md">
    <q-input
      v-model="searchTerm"
      label="Ort suchen"
      filled
      clearable
      @keyup.enter="onSearch"
    >
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
      </q-item>
    </q-list>

    <q-inner-loading :showing="weather.isLoading.value" />

    <div v-if="weather.forecast.value" class="q-mt-md">
      <div v-if="selectedLocation" class="text-h6">
        {{ selectedLocation.name }}
      </div>
      <div class="text-h6">
        {{ weather.forecast.value.current?.temperature_2m }}°C
      </div>
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
import { ref } from 'vue';
import { useGeocoding } from '@/composables/useGeocoding';
import { useWeather } from '@/composables/useWeather';
import WeatherMap from '@/components/WeatherMap.vue';
import ForecastDetailDialog from '@/components/ForecastDetailDialog.vue';
import { useRecentSearches } from '@/composables/useRecentSearches';
import type { GeocodingResult } from '@/types/open-meteo';

const searchTerm = ref('');
const geocoding = useGeocoding();
const weather = useWeather();
const selectedLocation = ref<GeocodingResult | null>(null);
const showDetailDialog = ref(false);

const {recentSearches, addSearch } = useRecentSearches();

function onSearch(): void {
  if (!searchTerm.value.trim()) return;
  void geocoding.searchLocation(searchTerm.value);
}

function onSelectLocation(location: GeocodingResult): void {
  void weather.loadWeather(location.latitude, location.longitude);
  selectedLocation.value = location;
  addSearch(location);
}

defineExpose({ weather, selectedLocation });
</script>