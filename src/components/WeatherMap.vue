<template>
  <div class="weather-map">
    <LMap
      ref="mapRef"
      :zoom="10"
      :center="[latitude, longitude]"
      style="height: 400px"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LMarker :lat-lng="[latitude, longitude]" />
    </LMap>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import type L from 'leaflet';

const props = defineProps<{
  latitude: number;
  longitude: number;
}>();

const mapRef = ref<{ leafletObject: L.Map } | null>(null);

watch(
  () => [props.latitude, props.longitude] as const,
  ([newLat, newLng]) => {
    mapRef.value?.leafletObject.setView([newLat, newLng], 10);
  }
);
</script>