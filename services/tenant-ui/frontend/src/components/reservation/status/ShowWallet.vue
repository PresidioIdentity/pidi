<template>
  <div>
    <!-- <template #title>
      <i class="pi pi-check-circle info-card-icon"></i> <br />
      VALIDATED!
    </template> -->
    <!-- <template #content> -->
    <div class="text_container">
      <i class="pi pi-check-circle" :style="{ fontSize: '3em' }"></i> <br />
      <h1 :style="{ margin: 0, padding: 0 }">Activated!</h1>
    </div>
    <div>
      <!-- If the user has just completed their password validation, to show the wallet details -->
      Your wallet has been activated successfully. <br />
      Here is your new Wallet ID and Wallet Key associated with the email
      address mentioned while registering.

      <div class="field mt-5 w-full">
        <label for="wallet-id">Wallet ID</label>
        <div class="p-inputgroup">
          <InputText
            id="wallet-id"
            readonly
            :value="walletId"
            name="wallet-id"
            class="w-full"
          />
          <Button
            icon="pi pi-copy"
            title="Copy to clipboard"
            class="p-button-secondary"
            @click="copyWalletId"
          />
        </div>
      </div>

      <div class="field">
        <label for="wallet-key">Wallet Key</label>
        <div class="p-inputgroup">
          <Password
            id="wallet-key"
            v-model="walletKey"
            readonly
            class="w-full"
            input-class="w-full"
            toggle-mask
            :feedback="false"
            placeholder="Password"
          />
          <Button
            icon="pi pi-copy"
            title="Copy to clipboard"
            class="p-button-secondary"
            @click="copyWalletKey"
          />
        </div>
      </div>
    </div>
    <!-- </template> -->
    <!-- <template #footer> -->
    <div>
      <Divider />
      Please save your newly generated Wallet ID and Wallet Key in a secure
      location. You will loose the data once this window is closed or you go
      back to sign-in. We will never share these information over the email nor
      do we re-issue upon request.
      <Divider />
      <div class="text_container">
        <h2>You can safely close this screen.</h2>
      </div>
      <!-- </template> -->
    </div>
  </div>
  <!-- </Card> -->
</template>

<script setup lang="ts">
// PrimeVue/Validation/etc
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Password from 'primevue/password';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
// State
import { useReservationStore } from '@/store';
import { storeToRefs } from 'pinia';

// Notifications
import { useToast } from 'vue-toastification';
const toast = useToast();

const { walletId, walletKey } = storeToRefs(useReservationStore());

/**
 * Copy wallet ID to clipboard
 */
const copyWalletId = () => {
  navigator.clipboard.writeText(walletId.value);
  toast.info('Copied wallet ID to clipboard!');
};
/**
 * Copy wallet key to clipboard
 */
const copyWalletKey = () => {
  navigator.clipboard.writeText(walletKey.value);
  toast.info('Copied Wallet Key to clipboard!');
};
</script>

<style scoped lang="scss">
.text_container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
