<template>
  <div class="traction-footer flex justify-content-between flex-wrap">
    <div>{{ t('home.greeting') }}</div>
    <div>{{ config.frontend.ux.copyright }} {{ config.frontend.ux.owner }}</div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useConfigStore } from '../../store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { config } = storeToRefs(useConfigStore());
</script>

<style>
.traction-footer {
  background-color: white !important;
  color: black !important;
  font-size: 0.7em;
  padding: 0 2em;
  border-top: 1px solid grey;
}
</style>
