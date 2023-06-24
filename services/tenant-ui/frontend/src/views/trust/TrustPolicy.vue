<template>
  <h2 class="mt-0">{{ t('trust.policy') }}</h2>
  <div class="md:px-6 lg:px-8">
    <form @submit.prevent="handleSubmit(!v$.$invalid)">
      <!-- Hardware -->
      <div class="mb-3">
        <h3 class="text-700 font-bold mb-2">Hardware</h3>
        <!-- Device ID -->
        <div class="h-8rem">
          <div class="flex flex-row align-items-center">
            <Checkbox
              v-model="deviceId"
              :value="deviceId"
              :binary="true"
              class="mr-3"
            />
            <h4 class="text-700 font-bold mb-3">Device ID</h4>
          </div>
          <div class="flex flex-column">
            <InputText
              v-model="v$.deviceId.$model"
              type="number"
              min="0"
              max="100"
              class="w-6"
              placeholder="Weighted Value ex. 0 - 100"
            />
            <small v-if="v$.deviceId.$invalid" class="p-error">{{
              v$.deviceId.required.$message
            }}</small>
          </div>
        </div>
        <!-- Device Name -->
        <div class="h-8rem">
          <div class="flex flex-row align-items-center">
            <Checkbox
              v-model="deviceName"
              :value="deviceName"
              :binary="true"
              class="mr-3"
            />
            <h4 class="text-700 font-bold mb-3">Device Name</h4>
          </div>
          <div class="flex flex-column">
            <InputText
              v-model="v$.deviceName.$model"
              type="number"
              min="0"
              max="100"
              class="w-6"
              placeholder="Weighted Value ex. 0 - 100"
            />
            <small v-if="v$.deviceName.$invalid" class="p-error">{{
              v$.deviceName.required.$message
            }}</small>
          </div>
        </div>
        <!-- Operating System -->
        <div class="h-8rem">
          <div class="flex flex-row align-items-center">
            <Checkbox
              v-model="operatingSystem"
              :value="operatingSystem"
              :binary="true"
              class="mr-3"
            />
            <h4 class="text-700 font-bold mb-3">Operating System</h4>
          </div>
          <div class="flex flex-column">
            <InputText
              v-model="v$.operatingSystem.$model"
              type="number"
              min="0"
              max="100"
              class="w-6"
              placeholder="Weighted Value ex. 0 - 100"
            />
            <small v-if="v$.operatingSystem.$invalid" class="p-error">{{
              v$.operatingSystem.required.$message
            }}</small>
          </div>
        </div>
      </div>
      <!-- Network -->
      <div class="mb-3">
        <h3 class="text-700 font-bold mb-2">Network</h3>
        <!-- IP Address -->
        <div class="h-8rem">
          <div class="flex flex-row align-items-center">
            <Checkbox
              v-model="ipAddress"
              :value="ipAddress"
              :binary="true"
              class="mr-3"
            />
            <h4 class="text-700 font-bold mb-3">IP Address</h4>
          </div>
          <div class="flex flex-column">
            <InputText
              v-model="v$.ipAddress.$model"
              type="number"
              min="0"
              max="100"
              class="w-6"
              placeholder="Weighted Value ex. 0 - 100"
            />
            <small v-if="v$.ipAddress.$invalid" class="p-error">{{
              v$.ipAddress.required.$message
            }}</small>
          </div>
        </div>
        <!-- MAC Address -->
        <div class="h-8rem">
          <div class="flex flex-row align-items-center">
            <Checkbox
              v-model="macAddress"
              :value="macAddress"
              :binary="true"
              class="mr-3"
            />
            <h4 class="text-700 font-bold mb-3">MAC Address</h4>
          </div>
          <div class="flex flex-column">
            <InputText
              v-model="v$.macAddress.$model"
              type="number"
              min="0"
              max="100"
              class="w-6"
              placeholder="Weighted Value ex. 0 - 100"
            />
            <small v-if="v$.macAddress.$invalid" class="p-error">{{
              v$.macAddress.required.$message
            }}</small>
          </div>
        </div>
        <!-- Jurisdiction -->
        <div class="mb-3">
          <h3 class="text-700 font-bold mb-2">Jurisdiction</h3>
          <!-- Location -->
          <div class="h-8rem">
            <div class="flex flex-row align-items-center">
              <Checkbox
                v-model="location"
                :value="location"
                :binary="true"
                class="mr-3"
              />
              <h4 class="text-700 font-bold mb-3">Location</h4>
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

          <!-- Submit Button -->
          <div class="flex flex-row align-items-center mt-5">
            <Button type="submit" label="Submit Changes" class="w-6" />
          </div>
        </div>
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
import { useToast } from 'vue-toastification';
import { helpers } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { useI18n } from 'vue-i18n';
// State
import { useTrustStore } from '../../store';
import { storeToRefs } from 'pinia';

const toast = useToast();
const { t } = useI18n();

const {
  deviceId,
  deviceName,
  operatingSystem,
  ipAddress,
  macAddress,
  location,
} = storeToRefs(useTrustStore());
const trustStore = useTrustStore();

const trustWeights = reactive({
  deviceId: '100',
  deviceName: '100',
  operatingSystem: '100',
  ipAddress: '100',
  macAddress: '100',
  location: '100',
});

const valueBetween = (value: string) =>
  !helpers.req(value) || (Number(value) >= 0 && Number(value) <= 100);
const rules = {
  deviceId: {
    required: helpers.withMessage(
      'Value must be between 0 & 100',
      valueBetween
    ),
  },
  deviceName: {
    required: helpers.withMessage(
      'Value must be between 0 & 100',
      valueBetween
    ),
  },
  operatingSystem: {
    required: helpers.withMessage(
      'Value must be between 0 & 100',
      valueBetween
    ),
  },
  ipAddress: {
    required: helpers.withMessage(
      'Value must be between 0 & 100',
      valueBetween
    ),
  },
  macAddress: {
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
      // Hardware values
      deviceId: Number(trustWeights.deviceId),
      deviceName: Number(trustWeights.deviceName),
      operatingSystem: Number(trustWeights.operatingSystem),
      // Network values
      ipAddress: Number(trustWeights.ipAddress),
      macAddress: Number(trustWeights.macAddress),
      // Jurisdicton values
      location: Number(trustWeights.location),
    });
    await trustStore.submitTrustModel();
  } catch (err) {
    console.error(err);
    toast.error(`Failure getting subscription key: ${err}`);
  }
};
</script>
