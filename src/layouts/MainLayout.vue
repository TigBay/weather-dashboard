<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>Weather Dashboard</q-toolbar-title>
        <q-btn flat dense round icon="favorite" aria-label="Favorites" to="/favorites" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="q-pa-md">
        <div class="page-container">
          <router-view />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
.page-container {
  max-width: 860px;
  margin: 0 auto;
}
</style>
