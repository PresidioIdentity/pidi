<template>
  <form @submit.prevent="handleSubmit(!v$.$invalid)">
    <div class="field mt-5 w-full">
      <!-- ID -->
      <label
        for="wallet-id"
        :class="{ 'p-error': v$.walletId.$invalid && submitted }"
        >Wallet ID
      </label>
      <InputText
        id="wallet-id"
        v-model="v$.walletId.$model"
        type="text"
        option-label="label"
        autocomplete="username"
        name="username"
        autofocus
        class="w-full"
      />
      <small v-if="v$.walletId.$invalid && submitted" class="p-error">{{
        v$.walletId.required.$message
      }}</small>
    </div>

    <div class="field mt-5 w-full">
      <!-- Secret -->
      <label
        for="wallet-id"
        :class="{ 'p-error': v$.walletSecret.$invalid && submitted }"
        >Wallet Secret
      </label>
      <InputText
        id="wallet-secret"
        v-model="v$.walletSecret.$model"
        type="password"
        autocomplete="current-password"
        name="walletsecret"
        class="w-full"
      />
      <small v-if="v$.walletSecret.$invalid && submitted" class="p-error">{{
        v$.walletSecret.required.$message
      }}</small>
    </div>

    <div class="field mt-5 w-full">
      <!-- Key -->
      <label
        for="subscription-key"
        :class="{ 'p-error': v$.subscriptionKey.$invalid && submitted }"
        >Subscription Key
      </label>
      <InputText
        id="subscription-key"
        v-model="v$.subscriptionKey.$model"
        type="text"
        autocomplete="current-password"
        name="subscriptionkey"
        class="w-full"
        readonly
      />
      <small v-if="v$.subscriptionKey.$invalid && submitted" class="p-error">{{
        v$.subscriptionKey.required.$message
      }}</small>

      <Button
        type="submit"
        class="w-full mt-5"
        label="Sign In"
        :disabled="!!loading"
        :loading="!!loading"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
//Vue
import { ref, reactive } from 'vue';
// PrimeVue/Validation/etc
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { useToast } from 'vue-toastification';
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
// State
import { useTenantStore, useTokenStore } from '../store';
import { storeToRefs } from 'pinia';
// Dependecies
import ls from 'localstorage-slim';

const toast = useToast();

// State setup
const tokenStore = useTokenStore();
// use the loading state from the store to disable the button...
const { loading, subscriptionKey, token } = storeToRefs(useTokenStore());
const tenantStore = useTenantStore();
const { tenant } = storeToRefs(useTenantStore());

// Login Form and validation
const formFields = reactive({
  walletId: '',
  walletSecret: '',
});
const rules = {
  walletId: { required },
  walletSecret: { required },
};
const v$ = useVuelidate(rules, formFields);

// Form submission
const submitted = ref(false);
const handleSubmit = async (isFormValid: boolean) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  }
  try {
    await tokenStore.login(
      formFields.walletId,
      formFields.walletSecret,
      subscriptionKey.value
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
</script>
