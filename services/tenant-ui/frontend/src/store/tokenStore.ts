import { defineStore, storeToRefs } from 'pinia';
import { ref, shallowRef } from 'vue';
import axios from 'axios';
import { useConfigStore } from './configStore';
import jwtDecode from 'jwt-decode';
import { API_PATH } from '@/helpers/constants';

//const KEY_SECRET = import.meta.env.KEY_SECRET_128;

export const useTokenStore = defineStore('token', () => {
  // state
  const token: any = ref(null);
  // TODO: maybe remove or store and remove from localstorage
  const userEmail: any = ref('');
  const userPass: any = ref('');
  const subscriptionKey: any = ref(null);
  const wallets: any = shallowRef(null);
  const loading: any = ref(false);
  const error: any = ref(null);

  // getters

  // actions
  async function loginWithApim(email: string, password: string) {
    console.log('> tokenStore.loginWithApim');

    error.value = null;
    loading.value = true;

    // Request body
    const body = {
      email: email,
      password: password,
    };

    // Make api call to authenticate with APIM and if auth'd get reservation id to then checkIn()
    // TODO: Review if we want to make this api call separate Azure func or an aca-py plugin
    // TODO: Refactor to use axios, as in all other api calls in this project
    const response = await fetch(
      // TODO: Move api url to env var
      'https://pidi-monetization-newsub-webhook-handler.azurewebsites.net/api/authenticateApimAndGetSubKey?',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Ocp-Apim-Subscription-Key': '0b7ba83125f44e71936e2bc3cd31b083',
        },
        body: JSON.stringify(body),
      }
    );

    if (response.status === 401) {
      error.value = 'Authentication failed. Check your username and password.';
      loading.value = false;
      throw error.value;
    }

    if (response.status === 204) {
      error.value =
        'Subscription not found. Visit the PI Developer Portal to subscribe or contact info@presidioidentity.com for help.';
      loading.value = false;
      throw error.value;
    }

    if (response.status === 500) {
      error.value =
        'An error occurred. Please contact info@presidioidentity.com and let them know what happened.';
      loading.value = false;
      throw error.value;
    }

    const { subscriptions, keys } = await response.json();

    // AVIS: TODO:
    // 1. upon login, get, store, and display user's email or name or org name or other
    // 2. get and store all <ACTIVE?> subscriptions associated with the user
    // 3. if no active, link them to dev portal to go subscribe or reactivate (can technically do from dashboard honestly)
    // 4. for now, dropdown? to select the subscription/wallet to use (listed by subscription name) - to be replaced by good UI later
    // 5. then under dropdown will be where they enter wallet id and wallet key
    // 6. once working, will also get fetch the wallet id automatically (hopefully don't need to store, just use an existing api?)
    // 7. ?
    //
    // HOLDUP - for above, need to send both all subscriptions and fetch their subscription ids..?
    //      make another api call to azure func to get the sub key for the selected subscription
    //      OR
    //      do foreach in the existing call and get all?

    // AVIS: TODO: For now, just get and store 0th subscription key
    userEmail.value = email;
    userPass.value = password;
    wallets.value = subscriptions;
    subscriptionKey.value = keys[0].primaryKey;
    console.log('< tokenStore.loginWithApim');
    loading.value = false;
  }

  async function login(
    username: string,
    password: string,
  ) {
    console.log('> tokenStore.load');
    const payload = {
      wallet_key: password,
    };
    token.value = null;
    error.value = null;
    loading.value = true;

    // TODO: isolate this to something reusable when we grab an axios connection.
    const configStore = useConfigStore();
    const url = configStore.proxyPath(
      API_PATH.MULTITENANCY_WALLET_TOKEN(username)
    );
    await axios({
      method: 'post',
      url,
      data: payload,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscriptionKey.value,
      },
    })
      .then((res) => {
        token.value = res.data.token;

        // const subKey = CryptoJS.enc.Utf8.parse(subscriptionKey);
        // const secret = CryptoJS.enc.Utf8.parse(KEY_SECRET);
        // const encrypted = CryptoJS.AES.encrypt(subKey, secret, {
        //   mode: CryptoJS.mode.ECB,
        //   padding: CryptoJS.pad.ZeroPadding,
        // });
        // encrypted.ciphertext.toString(CryptoJS.enc.Hex);
        // key.value = encrypted;
      })
      .catch((err) => {
        error.value = err;
        console.log(error.value);
      })
      .finally(() => {
        loading.value = false;
      });
    console.log('< tokenStore.load');

    if (error.value != null) {
      // throw error so $onAction.onError listeners can add their own handler
      throw error.value;
    }
    // return data so $onAction.after listeners can add their own handler
    return token.value;
  }

  // TODO:
  // - functions to set the subscription token, including encrypting it
  // - function to get the subscription token after decrypting it
  // - function to

  function clearToken() {
    console.log('> clearToken');
    token.value = null;
    userEmail.value = null;
    userPass.value = null;
    subscriptionKey.value = null;
    console.log('< clearToken');
  }

  return {
    token,
    userEmail,
    userPass,
    subscriptionKey,
    wallets,
    loading,
    error,
    clearToken,
    login,
    loginWithApim,
  };
});

export default {
  useTokenStore,
};
