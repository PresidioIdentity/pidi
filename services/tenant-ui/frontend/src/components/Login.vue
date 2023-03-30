<template>
  <div class="traction-login grid w-screen h-screen">
    <div class="col-12 md:col-6 xl:col-6">
      <div class="px-8">
        <div class="image-header pt-6 pb-3">
          <img
            src="/img/logo/Presidio-Identity-Logo-tran.png"
            class="logo-traction"
          />
          <h1 class="pt-3">Presidio Identity</h1>
          <p class="pt-0 pb-0">VC Dashboard</p>
        </div>

        <!-- Login with APIM (dev portal) credentials -->
        <div v-if="loginMode === LOGIN_MODE.APIM_LOGIN" class="py-6">
          <ApimLoginForm />

          <div class="mt-6">
            <p>
              First time logging in?
              <a
                href="#"
                class="p-button-link login-mode"
                @click.prevent="loginMode = LOGIN_MODE.STATUS"
                >Finish Cloud Wallet Setup</a
              >
            </p>
            <p>
              Register and subscribe for access at our 
              <a
                href="https://pi-apim-development.developer.azure-api.net/"
                class="p-button-link login-mode"
                >Developer Portal</a
              >
            </p>
          </div>
        </div>

        <!-- Logging In -->
        <div v-if="loginMode === LOGIN_MODE.SIGNIN" class="py-6">
          <LoginForm />
          <div class="mt-6">
            <!-- <p>
              Don't have an account?
              <a
                href="#"
                class="p-button-link login-mode"
                @click.prevent="loginMode = LOGIN_MODE.RESERVE"
                >Create Request!</a
              >
            </p> -->

            <p>
              First time logging in?
              <a
                href="#"
                class="p-button-link login-mode"
                @click.prevent="loginMode = LOGIN_MODE.STATUS"
                >Finish Cloud Wallet Setup</a
              >
            </p>
            <p>
              Register and subscribe for access at our 
              <a
                href="https://pi-apim-development.developer.azure-api.net/"
                class="p-button-link login-mode"
                >Developer Portal</a
              >
            </p>
          </div>
        </div>

        <!-- Making Reservation -->
        <div v-else-if="loginMode === LOGIN_MODE.RESERVE" class="py-1">
          <Button
            label="Go Back to Sign-in"
            icon="pi pi-arrow-left"
            class="p-button-text"
            @click="goBack($event)"
          />
          <Reserve />
        </div>

        <!-- Checking Status -->
        <div v-else-if="loginMode === LOGIN_MODE.STATUS" class="py-6">
          <Button
            label="Go Back to Sign-in"
            icon="pi pi-arrow-left"
            class="p-button-text"
            @click="goBack($event)"
          />
          <Status />
        </div>
      </div>
    </div>

    <!-- <div class="cover-image hidden md:block col-lg-5 md:col-6 xl:col-8 p-8"> -->
    <div class="cover-image mx-auto">
      <img class="pl-8" src="/img/default-login-image.png" />
      <!-- <span v-if="config.frontend.ux.coverImageCopyright" class="copyright">
        {{ config.frontend.ux.coverImageCopyright }}
      </span> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// Vue
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// PrimeVue
import Button from 'primevue/button';
import { useConfirm } from 'primevue/useconfirm';
// Components
import ApimLoginForm from '@/components/ApimLoginForm.vue'
import LoginForm from '@/components/LoginForm.vue';
import Reserve from './reservation/Reserve.vue';
import Status from './reservation/Status.vue';
// State
import { storeToRefs } from 'pinia';
import { useConfigStore } from '@/store';
import { useReservationStore } from '@/store';
import { RESERVATION_STATUSES } from '@/helpers/constants';
const { config } = storeToRefs(useConfigStore());
const reservationStore = useReservationStore();
const { status } = storeToRefs(useReservationStore());

const route = useRoute();
const router = useRouter();

const confirm = useConfirm();

// Other login form swtiching
enum LOGIN_MODE {
  APIM_LOGIN,
  SIGNIN,
  RESERVE, // TODO: Remove this
  STATUS, // TODO: Rename modes for our flow (i.e. status is more complete-registration or similar)
}
// const loginMode = ref(LOGIN_MODE.SIGNIN);
const loginMode = ref(LOGIN_MODE.APIM_LOGIN);

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
  loginMode.value = LOGIN_MODE.SIGNIN;
  reservationStore.resetState();
  router.push('/');
};
</script>

<style scoped lang="scss">
// See layout.scss for generalized common login layout stuff
// Set the image specific to this component here though
.image-header {
  text-align: center;

  img {
    height: 10em;
    width: 10em;
    border-radius: 50%;
    border: solid 1px #000;
    box-shadow: 0px 0px 15px #00000034;
  }

  p {
    font-size: 1.25em;
  }
}

.cover-image {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 45vh;
  }
}
</style>
