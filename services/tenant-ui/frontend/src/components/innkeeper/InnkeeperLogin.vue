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

        <div class="py-8">
          <InnkeeperLoginForm v-if="config.frontend.showInnkeeperAdminLogin" />
          <div v-if="config.frontend.oidc.active" class="oidc-login">
            <div
              v-if="config.frontend.showInnkeeperAdminLogin"
              class="oidc-choice"
            >
              <hr />
              <span class="mb-0">Or Sign-In with</span>
            </div>
            <InnkeeperLoginOidc class="mt-0" />
          </div>
        </div>
      </div>
    </div>

    <div class="cover-image mx-auto">
      <img class="pl-8" src="/img/default-login-image.png" />
      <!-- <span v-if="config.frontend.ux.coverImageCopyright" class="copyright">
        {{ config.frontend.ux.coverImageCopyright }}
      </span> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import InnkeeperLoginForm from '@/components/innkeeper/InnkeeperLoginForm.vue';
import InnkeeperLoginOidc from '@/components/innkeeper/InnkeeperLoginOidc.vue';
// State
import { storeToRefs } from 'pinia';
import { useConfigStore } from '@/store';
const { config } = storeToRefs(useConfigStore());
</script>

<style scoped lang="scss">
// See layout.scss for generalized common login layout stuff
// Set the image specific to this component here though
.cover-image {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 45vh;
  }
}

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
.oidc-login {
  margin-top: 2em;
  hr {
    height: 1px;
    background-color: rgb(186, 186, 186);
    border: 0;
  }
  span {
    display: block;
    text-align: center;
  }
}
</style>
