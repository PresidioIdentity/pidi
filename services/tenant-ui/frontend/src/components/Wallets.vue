<template>
  <div class="block">
    <h2>Approved</h2>
    <div class="grid mb-10">
      <div class="col-2 p-5 mr-5 bg-blue-500">1</div>
      <div class="col-2 p-5 mr-5 bg-blue-500">2</div>
      <div class="col-2 p-5 mr-5 bg-blue-500">3</div>
    </div>
    <h2>Pending</h2>
    <h4 v-if="!reservation">No Pending Wallets.</h4>
    <div v-for="(res, index) in reservation" :key="index" class="grid">
      <div class="col-2 p-5 mr-5 bg-yellow-500">{{ res.tenant_name }}</div>
    </div>
  </div>
  <!-- <div v-for="(wallet, index) in wallets" :key="index" class="grid">
    {
        wallet.map(walletInfo => {
            
        })
    }    
  </div> -->
</template>

<script setup lang="ts">
// Vue
import { ref } from 'vue';

// State
import { useReservationStore } from '@/store';
import { storeToRefs } from 'pinia';
const reservationStore = useReservationStore();
const { wallets, reservation } = storeToRefs(useReservationStore());
</script>

<style scoped lang="scss">
// See layout.scss for generalized common login layout stuff
</style>
