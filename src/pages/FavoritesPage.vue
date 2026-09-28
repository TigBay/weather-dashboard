<template>
  <div class="q-pa-md">
    <h5 class="q-mt-none">Saved Favorites</h5>

    <div v-if="favorites.length === 0" class="text-center text-grey-7 q-py-lg">
      <p>No favorites saved yet.</p>
      <q-btn flat to="/">← Back to Search</q-btn>
    </div>

    <div v-else class="q-gutter-md">
      <q-card v-for="fav in favorites" :key="fav.id">
        <q-card-section class="row items-center no-wrap">
          <div class="col cursor-pointer" @click="selectFavorite(fav)">
            <div class="text-h6">{{ fav.name }}</div>
            <div class="text-subtitle2 text-grey-7">{{ fav.country }} ({{ fav.country_code }})</div>
            <div class="text-caption text-grey-6">
              {{ fav.latitude.toFixed(4) }}, {{ fav.longitude.toFixed(4) }}
            </div>
          </div>
          <q-btn
            flat
            dense
            round
            icon="delete"
            color="grey-7"
            :aria-label="`Remove ${fav.name} from favorites`"
            @click="removeFavorite(fav.id)"
          />
        </q-card-section>
      </q-card>

      <q-btn flat to="/">← Back to Search</q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useFavorites } from '@/composables/useFavorites';
import type { GeocodingResult } from '@/types/open-meteo';

const router = useRouter();
const { favorites, removeFavorite } = useFavorites();

// Hand the id to the search view, which resolves it and loads the weather.
// Keeping it in the URL makes a favorite deep-linkable.
function selectFavorite(fav: GeocodingResult): void {
  void router.push({ path: '/', query: { location: String(fav.id) } });
}
</script>
