<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Weather Dashboard</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md">
        <SearchForm />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import SearchForm from './components/SearchForm.vue';
</script>