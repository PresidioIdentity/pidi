<template>
  <div v-if="!loading">
    <h2 class="mb-5">Active</h2>
    <h4 v-if="!approvedWallets">No Active Wallets.</h4>
    <div
      v-for="(approved, index) in approvedWallets"
      :key="index"
      class="grid mb-10"
    >
      <div
        class="col p-5 mb-5 shadow-4 border-round-md flex flex-row justify-content-between"
      >
        <h3>{{ approved.displayName }}</h3>
        <Button label="Select" />
      </div>
    </div>
    <h2 class="mb-5">Pending</h2>
    <h4 v-if="!reservation">No Pending Wallets.</h4>
    <div v-for="(res, index) in reservation" :key="index" class="grid mb-10">
      <div
        class="col p-5 mb-5 shadow-4 border-round-md flex flex-row justify-content-between"
      >
        <h3>{{ res.tenant_name }}</h3>
        <Button label="Activate" />
      </div>
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
import Button from 'primevue/button';
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
