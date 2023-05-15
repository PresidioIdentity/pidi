<template>
  <div v-if="!loading" class="block">
    <h2>Approved</h2>
    <div
      v-for="(approved, index) in approvedWallets"
      :key="index"
      class="grid mb-10"
    >
      <div class="col-2 p-5 mr-5 bg-blue-500">{{ approved.displayName }}</div>
    </div>
    <h2>Pending</h2>
    <h4 v-if="!reservation">No Pending Wallets.</h4>
    <div v-for="(res, index) in reservation" :key="index" class="grid">
      <div class="col-2 p-5 mr-5 bg-yellow-500">{{ res.tenant_name }}</div>
    </div>
  </div>
  <div v-if="loading" flex align-items-center justify-content-center>
    <ProgressSpinner />
  </div>
</template>

<script setup lang="ts">
// Vue
import { ref, onMounted } from 'vue';
// PrimeVue/Validation/etc
import ProgressSpinner from 'primevue/button';
// State
import { useReservationStore, useTokenStore } from '@/store';
import { storeToRefs } from 'pinia';
const { approvedWallets, reservation, loading } = storeToRefs(
  useReservationStore()
);
</script>

<style scoped lang="scss">
// See layout.scss for generalized common login layout stuff
</style>
