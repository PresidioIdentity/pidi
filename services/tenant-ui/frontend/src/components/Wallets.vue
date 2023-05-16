<template>
  <div>
    <Button
      label="Refresh"
      class="w-full mb-3"
      :loading="!!activateWalletLoading"
      @click="goBack"
    />
  </div>
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
  <ConfirmDialog id="confirm" />
  <Dialog
    :visible="visible"
    modal
    :header="isActive ? 'Enter Wallet Details' : 'Activate Wallet'"
    :style="{ width: '50vw' }"
    @update:visible="goBack($event)"
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
    <Status v-if="isPending" />
  </Dialog>
  <div v-if="activateWalletLoading" class="card flex justify-content-center">
    <ProgressSpinner />
  </div>
</template>

<script setup lang="ts">
// Vue
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
// PrimeVue/Validation/etc
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'vue-toastification';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
// Components
import Status from './reservation/Status.vue';
// State
import { useReservationStore, useTokenStore, useTenantStore } from '@/store';
import { storeToRefs } from 'pinia';
import { RESERVATION_STATUSES } from '@/helpers/constants';

const reservationStore = useReservationStore();
const tokenStore = useTokenStore();
const tenantStore = useTenantStore();
const {
  approvedWallets,
  reservation,
  reservationDetails,
  loading: loadingRes,
  reservationId,
  status,
} = storeToRefs(useReservationStore());
const {
  userEmail,
  userPass,
  wallets,
  loading: loadingToken,
  token,
} = storeToRefs(useTokenStore());
const { tenant } = storeToRefs(useTenantStore());

const showError = ref(false);
const errorMessage = ref('An error occurred');

const toast = useToast();
const confirm = useConfirm();
const router = useRouter();

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
      activeFormFields.subscriptionKey
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

const refresh = async () => {
  activateWalletLoading.value = true;
  await reservationStore.authenticateAndGetReservationId(
    userEmail.value,
    userPass.value
  );

  await tokenStore.loginWithApim(userEmail.value, userPass.value);

  await reservationStore.getApprovedWallets(wallets.value);
  activateWalletLoading.value = false;
};

const goBack = (event: any) => {
  if (status.value === RESERVATION_STATUSES.SHOW_WALLET) {
    confirm.require({
      target: event.currentTarget,
      message:
        'Are you sure you want to leave this page? You will not be able to retrieve these details again.',
      header: 'Have you saved your Wallet ID and Key Somewhere?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        doGoBack();
      },
    });
  } else {
    doGoBack();
  }
};

const doGoBack = () => {
  visible.value = false;
  reservationStore.resetState();
  refresh();
};
</script>

<style scoped lang="scss">
// See layout.scss for generalized common login layout stuff
</style>
