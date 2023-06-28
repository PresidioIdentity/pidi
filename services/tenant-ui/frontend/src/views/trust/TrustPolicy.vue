<template>
  <h2 class="mt-0">{{ t('trust.policy') }}</h2>
  <div class="md:px-6 lg:px-8">
    <form @submit.prevent="handleSubmit(!v$.$invalid)">
      <div class="mb-3">
        <div class="h-8rem">
          <!-- Device Info -->
          <div class="flex flex-row align-items-center">
            <Checkbox
              v-model="deviceInfo"
              :value="deviceInfo"
              :binary="true"
              class="mr-3"
            />
            <h3 class="text-700 font-bold">Hardware</h3>
          </div>
          <div class="flex flex-column">
            <InputText
              v-model="v$.deviceInfo.$model"
              type="number"
              min="0"
              max="100"
              class="w-6"
              placeholder="Weighted Value ex. 0 - 100"
            />
            <small v-if="v$.deviceInfo.$invalid" class="p-error">{{
              v$.deviceInfo.required.$message
            }}</small>
          </div>
        </div>
        <!-- Hardware Tracked Attributes -->
        <Accordion class="w-6">
          <AccordionTab header="Tracked Attributes">
            <h1>Device Info Tracked Attributes</h1>
          </AccordionTab>
        </Accordion>
      </div>
      <!-- Network -->
      <div class="mb-3">
        <div class="h-8rem">
          <div class="flex flex-row align-items-center">
            <Checkbox
              v-model="network"
              :value="network"
              :binary="true"
              class="mr-3"
            />
            <h3 class="text-700 font-bold">Network</h3>
          </div>
          <div class="flex flex-column">
            <InputText
              v-model="v$.network.$model"
              type="number"
              min="0"
              max="100"
              class="w-6"
              placeholder="Weighted Value ex. 0 - 100"
            />
            <small v-if="v$.network.$invalid" class="p-error">{{
              v$.network.required.$message
            }}</small>
          </div>
        </div>
        <!-- Network Tracked Attributes -->
        <Accordion class="w-6">
          <AccordionTab header="Tracked Attributes">
            <h1>Network Tracked Attributes</h1>
          </AccordionTab>
        </Accordion>
      </div>
      <!-- Location -->
      <div class="mb-3">
        <div class="h-8rem">
          <div class="flex flex-row align-items-center">
            <Checkbox
              v-model="location"
              :value="location"
              :binary="true"
              class="mr-3"
            />
            <h3 class="text-700 font-bold">Location</h3>
          </div>
          <div class="flex flex-column">
            <InputText
              v-model="v$.location.$model"
              type="number"
              min="0"
              max="100"
              class="w-6"
              placeholder="Weighted Value ex. 0 - 100"
            />
            <small v-if="v$.location.$invalid" class="p-error">{{
              v$.location.required.$message
            }}</small>
          </div>
        </div>
        <!-- Location Tracked Attributes -->
        <Accordion class="w-6">
          <AccordionTab header="Tracked Attributes">
            <h1>Location Tracked Attributes</h1>
          </AccordionTab>
        </Accordion>
      </div>
      <div class="flex flex-row align-items-center mt-5 mb-5">
        <Button
          type="submit"
          label="Submit Changes"
          class="w-6"
          :loading="!!loading"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
// Vue
import { ref, reactive, watch } from 'vue';
// PrimeVue/Validation/etc
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import { useToast } from 'vue-toastification';
import { helpers } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { useI18n } from 'vue-i18n';
// State
import { useTrustStore } from '../../store';
import { storeToRefs } from 'pinia';

const toast = useToast();
const { t } = useI18n();

const { deviceInfo, network, location, loading, error } = storeToRefs(
  useTrustStore()
);
const trustStore = useTrustStore();

const trustWeights = reactive({
  deviceInfo: '',
  network: '',
  location: '',
});

watch(trustWeights, (newValue, oldValue) => {
  if (newValue.deviceInfo !== oldValue.deviceInfo) {
    trustWeights.deviceInfo = newValue.deviceInfo;
  }
  if (newValue.network !== oldValue.network) {
    trustWeights.network = newValue.network;
  }
  if (newValue.location !== oldValue.location) {
    trustWeights.location = newValue.location;
  }
});

const valueBetween = (value: string) =>
  !helpers.req(value) || (Number(value) >= 0 && Number(value) <= 100);
const rules = {
  deviceInfo: {
    required: helpers.withMessage(
      'Value must be between 0 & 100',
      valueBetween
    ),
  },
  network: {
    required: helpers.withMessage(
      'Value must be between 0 & 100',
      valueBetween
    ),
  },
  location: {
    required: helpers.withMessage(
      'Value must be between 0 & 100',
      valueBetween
    ),
  },
};

const v$ = useVuelidate(rules, trustWeights);

// Form submission
const submitted = ref(false);
const handleSubmit = async (isFormValid: boolean) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  }
  try {
    await trustStore.setTrustWeights({
      deviceInfo: Number(trustWeights.deviceInfo),
      network: Number(trustWeights.network),
      location: Number(trustWeights.location),
    });
    await trustStore.submitTrustModel();
    if (!error.value) toast.success('Trust Model Updated');
  } catch (err) {
    console.error(err);
    toast.error(`Failure getting subscription key: ${err}`);
  }
};
</script>
