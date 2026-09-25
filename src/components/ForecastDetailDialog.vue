<template>
  <q-dialog v-model="isOpen">
    <q-card style="min-width: 320px">
      <q-card-section>
        <div class="text-h6">7-Day Forecast</div>
      </q-card-section>

      <q-card-section>
        <q-list separator>
          <q-item v-for="(day, index) in dailyEntries" :key="day.date">
            <q-item-section>{{ day.date }}</q-item-section>
            <q-item-section side>
              {{ forecast.daily?.temperature_2m_min[index] }}° / {{ forecast.daily?.temperature_2m_max[index] }}°
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ForecastResponse } from '@/types/open-meteo';

const isOpen = defineModel<boolean>({ required: true });

const props = defineProps<{
  forecast: ForecastResponse;
}>();

const dailyEntries = computed(() =>
  (props.forecast.daily?.time ?? []).map((date) => ({ date }))
);
</script>