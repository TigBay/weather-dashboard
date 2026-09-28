<template>
  <div class="q-pa-md">
    <h5 class="q-mt-none">Saved Favorites</h5>

    <div v-if="favoritesList.length === 0" class="text-center text-grey-7 q-py-lg">
      <p>No favorites saved yet.</p>
      <q-btn flat to="/">← Back to Search</q-btn>
    </div>

    <div v-else class="q-gutter-md">
      <q-card
        v-for="fav in favoritesList"
        :key="fav.id"
        clickable
        class="cursor-pointer"
        @click="selectFavorite(fav)"
      >
        <q-card-section>
          <div class="text-h6">{{ fav.name }}</div>
          <div class="text-subtitle2 text-grey-7">
            {{ fav.country }} ({{ fav.country_code }})
          </div>
          <div class="text-caption text-grey-6">
            {{ fav.latitude.toFixed(4) }}, {{ fav.longitude.toFixed(4) }}
          </div>
        </q-card-section>
      </q-card>

      <q-btn flat to="/">← Back to Search</q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useFavorites } from '@/composables/useFavorites';
import type { GeocodingResult } from '@/types/open-meteo';

const router = useRouter();
const { favorites, addFavorite } = useFavorites();
const favoritesList = computed(() => favorites.value);

function selectFavorite(fav: GeocodingResult) {
  addFavorite(fav);
  void router.push('/');
}
</script>
