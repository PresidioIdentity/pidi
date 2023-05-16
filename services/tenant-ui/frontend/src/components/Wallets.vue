<template>
  <div v-if="!activateWalletLoading">
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
        <Button class="w-2" label="Select" @click="showActive(approved.name)" />
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
        <Button
          class="w-2"
          label="Activate"
          @click="showPending(res.tenant_name)"
        />
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
          for="wallet_id"
          :class="{ 'p-error': vActive$.walletId.$invalid && submitted }"
          >Wallet ID
        </label>
        <InputText
          v-if="isActive"
          id="wallet_id"
          v-model="vActive$.walletId.$model"
          type="text"
          option-label="label"
          name="wallet_id"
          autofocus
          class="w-full mb-3"
        />
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
          class="w-full mb-3"
        />
        <label
          for="subscription_key"
          :class="{ 'p-error': vActive$.subscriptionKey.$invalid && submitted }"
          >Subscription ID
        </label>
        <InputText
          v-if="isActive"
          id="subscription_key"
          v-model="vActive$.subscriptionKey.$model"
          type="text"
          disabled="true"
          option-label="label"
          name="subscription_key"
          class="w-full"
        />
        <Button
          type="submit"
          label="Enter Wallet"
          class="w-full mt-3"
          :loading="!!loadingRes || !!loadingToken"
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
          :loading="!!loadingRes || !!loadingToken"
        />
      </div>
    </form>
  </Dialog>
  <div v-if="activateWalletLoading" class="card flex justify-content-center">
    <ProgressSpinner />
  </div>
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
import { useReservationStore, useTokenStore, useTenantStore } from '@/store';
import { storeToRefs } from 'pinia';

const reservationStore = useReservationStore();
const tokenStore = useTokenStore();
const tenantStore = useTenantStore();
const {
  approvedWallets,
  reservation,
  loading: loadingRes,
  reservationId,
} = storeToRefs(useReservationStore());
const {
  userEmail,
  userPass,
  wallets,
  subscriptionKey,
  loading: loadingToken,
  token,
} = storeToRefs(useTokenStore());
const { tenant } = storeToRefs(useTenantStore());

const showError = ref(false);
const errorMessage = ref('An error occurred');

const toast = useToast();

// Form and validation
const activeFormFields = reactive({
  walletSecret: '',
  walletId: '',
  subscriptionKey: '',
});
const activeRules = {
  walletSecret: { required },
  walletId: { required },
  subscriptionKey: { required },
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

const showActive = async (walletId: string) => {
  activeFormFields.subscriptionKey = walletId;

  isActive.value = true;
  isPending.value = false;
  visible.value = true;
};

const showPending = async (subscriptionName: string) => {
  await reservationStore.getReservationDetails(subscriptionName);

  isActive.value = false;
  isPending.value = true;
  visible.value = true;
};

// Form Submission
const submitted = ref(false);
const activateWalletLoading = ref(false);
const handleActive = async (isFormValid: boolean) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  }

  try {
    await tokenStore.login(
      activeFormFields.walletId,
      activeFormFields.walletSecret,
      activeFormFields.subscriptionKey, 
    );
    console.log(token.value);
  } catch (err) {
    console.error(err);
    toast.error(`Failure getting token: ${err}`);
  }
  if (token.value) {
    try {
      // token is loaded, now go fetch the global data about the tenant
      await tenantStore.getSelf();
      console.log(tenant.value);

      // TODO: once we get response statuses working correctly again can re-configure this
      // Don't throw errors since not-found and stuff is fine for non-issuers
      try {
        // Find out issuer status when logging in
        await Promise.all([
          tenantStore.getEndorserConnection(),
          tenantStore.getPublicDid(),
        ]);
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failure getting tenant: ${err}`);
    } finally {
      submitted.value = false;
    }
  }
};
const handlePending = async (isFormValid: boolean) => {
  activateWalletLoading.value = true;

  if (!isFormValid) {
    loadingRes.value = false;
    loadingToken.value = false;
    return;
  }
  try {
    await reservationStore.checkIn(
      reservationId.value,
      pendingFormFeilds.password
    );
    await tokenStore.loginWithApim(userEmail.value, userPass.value);
    await reservationStore.getApprovedWallets(wallets.value);
  } catch (error: any) {
    /**
     * If error is 401, check if the reservation is expired.
     * If not expired, show the incorrect password error.
     * Otherwise send the error to Toast
     */
    const resp = error.response;
    const exp = resp.data.match(/expired/i);
    if (resp.status === 401 && exp) {
      errorMessage.value = 'Reservation has expired.';
      showError.value = true;
    } else if (resp.status === 401) {
      errorMessage.value = 'Incorrect password. Please try again.';
      showError.value = true;
    } else {
      toast.error(resp.data);
    }
  } finally {
    visible.value = false;
    activateWalletLoading.value = false;
    submitted.value = false;
    loadingRes.value = false;
    loadingToken.value = false;
  }
};
</script>

<style scoped lang="scss">
// See layout.scss for generalized common login layout stuff
</style>
