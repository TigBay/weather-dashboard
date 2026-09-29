import { config } from '@vue/test-utils';
import * as quasar from 'quasar';
import { Quasar } from 'quasar';
import type { Component, Directive } from 'vue';

// Quasar's Vite plugin auto-imports components in the app build. Tests bypass
// that plugin, so register everything the components use up front.
const components: Record<string, Component> = {};
const directives: Record<string, Directive> = {};

for (const [name, value] of Object.entries(quasar)) {
  if (/^Q[A-Z]/.test(name)) {
    components[name] = value as Component;
  }
}

if ('ClosePopup' in quasar) {
  directives.ClosePopup = quasar.ClosePopup as Directive;
}

config.global.plugins = [Quasar];
config.global.components = components;
config.global.directives = directives;
