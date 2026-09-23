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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGeocoding } from '@/composables/useGeocoding';
import { useWeather } from '@/composables/useWeather';
import type { GeocodingResult } from '@/types/open-meteo';

const searchTerm = ref('');
const geocoding = useGeocoding();
const weather = useWeather();

function onSearch(): void {
  if (!searchTerm.value.trim()) return;
  void geocoding.searchLocation(searchTerm.value);
}

function onSelectLocation(location: GeocodingResult): void {
  weather.loadWeather(location.latitude, location.longitude);
}

defineExpose({ weather });
</script>