<template>
  <form @submit.prevent="handleSubmit(!v$.$invalid)">
    <div class="field mt-5 w-full">
      <!-- ID -->
      <label
        for="email"
        :class="{ 'p-error': v$.email.$invalid && submitted }"
        >Email
      </label>
      <InputText
        id="email"
        v-model="v$.email.$model"
        type="text"
        option-label="label"
        autocomplete="username"
        name="username"
        autofocus
        class="w-full"
      />
      <small v-if="v$.email.$invalid && submitted" class="p-error">{{
        v$.email.required.$message
      }}</small>
    </div>

    <div class="field mt-5 w-full">
      <!-- Secret -->
      <label
        for="password"
        :class="{ 'p-error': v$.password.$invalid && submitted }"
        >Password
      </label>
      <InputText
        id="password"
        v-model="v$.password.$model"
        type="password"
        autocomplete="current-password"
        name="password"
        class="w-full"
      />
      <small v-if="v$.password.$invalid && submitted" class="p-error">{{
        v$.password.required.$message
      }}</small>
    </div>

    <div class="field mt-5 w-full">
      <Button
        type="submit"
        class="w-full mt-5"
        label="Sign In"
        :disabled="!!loadingToken || !!loadingReservation"
        :loading="!!loadingToken || !!loadingReservation"
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
import { useTenantStore, useTokenStore, useReservationStore } from '../store';
import { storeToRefs } from 'pinia';

const toast = useToast();

// Login Form and validation
const formFields = reactive({
  email: '',
  password: ''
});
const rules = {
  email: { required },
  password: { required }
};
const v$ = useVuelidate(rules, formFields);

// State setup
const tokenStore = useTokenStore();
const reservationStore = useReservationStore();

// use the loading state from the store to disable the button...
const { loading: loadingToken, subscriptionKey } = storeToRefs(useTokenStore());
const tenantStore = useTenantStore();
const { tenant } = storeToRefs(useTenantStore());
const { reservationId, loading: loadingReservation } = storeToRefs(
  useReservationStore()
);

// Props
const props = defineProps<{
  select: Function;
}>();

// Form submission
const submitted = ref(false);
const handleSubmit = async (isFormValid: boolean) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  }
  try {
    await reservationStore.authenticateAndGetReservationId(
      formFields.email,
      formFields.password
    );

    await tokenStore.loginWithApim(
      formFields.email,
      formFields.password
    );
    props.select();
  } catch (err) {
    console.error(err);
    toast.error(`Failure getting subscription key: ${err}`);
  }
};
</script>
