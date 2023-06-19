<template>
  <h2 class="mt-0">{{ t('trust.policy') }}</h2>
  <div class="md:px-6 lg:px-8">
    <!-- Hardware -->
    <div class="mb-3">
      <h3 class="text-700 font-bold mb-2">Hardware</h3>
      <div class="flex flex-column">
        <!-- Device ID -->
        <div class="flex flex-row align-items-center">
          <Checkbox binary="true" name="" value="false" label="" class="mr-3" />
          <h4 class="text-700 font-bold mb-3">Device ID</h4>
        </div>
        <InputNumber
          class="w-6"
          input-id="minmax"
          :min="0"
          :max="100"
          placeholder="Weighted Value ex. 1 - 100"
        />
      </div>
      <!-- Device Name -->
      <div class="flex flex-column">
        <div class="flex flex-row align-items-center">
          <Checkbox binary="true" name="" value="false" label="" class="mr-3" />
          <h4 class="text-700 font-bold mb-3">Device Name</h4>
        </div>
        <InputNumber
          class="w-6"
          input-id="minmax"
          :min="0"
          :max="100"
          placeholder="Weighted Value ex. 1 - 100"
        />
      </div>
      <!-- Operating System -->
      <div class="flex flex-column">
        <div class="flex flex-row align-items-center">
          <Checkbox binary="true" name="" value="false" label="" class="mr-3" />
          <h4 class="text-700 font-bold mb-3">Operating System</h4>
        </div>
        <InputNumber
          class="w-6"
          input-id="minmax"
          :min="0"
          :max="100"
          placeholder="Weighted Value ex. 1 - 100"
        />
      </div>
    </div>
    <!-- Network -->
    <div class="mb-3">
      <h3 class="text-700 font-bold mb-2">Network</h3>
      <!-- IP Address -->
      <div class="flex flex-column">
        <div class="flex flex-row align-items-center">
          <Checkbox binary="true" name="" value="false" label="" class="mr-3" />
          <h4 class="text-700 font-bold mb-3">IP Address</h4>
        </div>
        <InputNumber
          class="w-6"
          input-id="minmax"
          :min="0"
          :max="100"
          placeholder="Weighted Value ex. 1 - 100"
        />
      </div>
      <!-- MAC Address -->
      <div class="flex flex-column">
        <div class="flex flex-row align-items-center">
          <Checkbox binary="true" name="" value="false" label="" class="mr-3" />
          <h4 class="text-700 font-bold mb-3">MAC Address</h4>
        </div>
        <InputNumber
          class="w-6"
          input-id="minmax"
          :min="0"
          :max="100"
          placeholder="Weighted Value ex. 1 - 100"
        />
      </div>
    </div>
    <!-- Jurisdiction -->
    <div class="mb-3">
      <h3 class="text-700 font-bold mb-2">Jurisdiction</h3>
      <!-- Location -->
      <div class="flex flex-column">
        <div class="flex flex-row align-items-center">
          <Checkbox binary="true" name="" value="false" label="" class="mr-3" />
          <h4 class="text-700 font-bold mb-3">Location</h4>
        </div>
        <InputNumber
          class="w-6"
          input-id="minmax"
          :min="0"
          :max="100"
          placeholder="Weighted Value ex. 1 - 100"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';

import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
