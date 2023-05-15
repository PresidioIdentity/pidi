<template>
  <div v-if="!loading">
    <!-- Active Wallets -->
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
        <Button class="w-2" label="Select" @click="showActive" />
      </div>
    </div>
    <!-- Pending Wallets -->
    <h2 class="mb-5">Pending</h2>
    <h4 v-if="!reservation">No Pending Wallets.</h4>
    <div v-for="(res, index) in reservation" :key="index" class="grid mb-10">
      <div
        class="col p-5 mb-5 shadow-4 border-round-md flex flex-row justify-content-between"
      >
        <h3>{{ res.tenant_name }}</h3>
        <Button class="w-2" label="Activate" @click="showPending" />
      </div>
    </div>
  </div>
  <!-- Input Form -->
  <Dialog
    v-model:visible="visible"
    modal
    header="Enter Wallet Details"
    :style="{ width: '50vw' }"
  >
    <!-- Active Input -->
    <form v-if="isActive" @submit.prevent="handleActive(!vActive$.$invalid)">
      <div class="field">
        <label
          for="wallet_secret"
          :class="{ 'p-error': vActive$.walletSecret.$invalid && submitted }"
          >Wallet Secret
        </label>
        <InputText
          v-if="isActive"
          id="wallet_secret"
          v-model="vActive$.walletSecret.$model"
          type="password"
          option-label="label"
          name="wallet_secret"
          autofocus
          class="w-full"
        />
        <Button
          type="submit"
          label="Enter Wallet"
          class="w-full mt-3"
          :loading="loading"
        />
      </div>
    </form>

    <!-- Pending Input  -->
    <form v-if="isPending" @submit.prevent="handlePending(!vPending$.$invalid)">
      <div class="field">
        <label
          for="password"
          :class="{ 'p-error': vPending$.password.$invalid && submitted }"
          >One Time Password
        </label>
        <InputText
          id="password"
          v-model="vPending$.password.$model"
          type="password"
          option-label="label"
          name="password"
          autofocus
          class="w-full"
        />
        <Button
          type="submit"
          label="Activate Wallet"
          class="w-full mt-3"
          :loading="loading"
        />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
// Vue
import { ref, reactive } from 'vue';
// PrimeVue/Validation/etc
import ProgressSpinner from 'primevue/button';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { useToast } from 'vue-toastification';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
// State
import { useReservationStore, useTokenStore } from '@/store';
import { storeToRefs } from 'pinia';
const { approvedWallets, reservation, loading } = storeToRefs(
  useReservationStore()
);

const showError = ref(false);

const toast = useToast();

// Form and validation
const activeFormFields = reactive({
  walletSecret: '',
});
const activeRules = {
  walletSecret: { required },
};
const vActive$ = useVuelidate(activeRules, activeFormFields);

const pendingFormFeilds = reactive({
  password: '',
});
const pendingRules = {
  password: { required },
};
const vPending$ = useVuelidate(pendingRules, pendingFormFeilds);

// Open Dialog
const visible = ref(false);
const isActive = ref(false);
const isPending = ref(false);

const showActive = () => {
  isActive.value = true;
  isPending.value = false;
  visible.value = true;
};

const showPending = () => {
  isActive.value = false;
  isPending.value = true;
  visible.value = true;
};

// Form Submission
const submitted = ref(false);
const handleActive = async (isFormValid: boolean) => {};
const handlePending = async (isFormValid: boolean) => {};
</script>

<style scoped lang="scss">
// See layout.scss for generalized common login layout stuff
</style>
