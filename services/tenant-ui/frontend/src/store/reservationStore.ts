import {
  API_PATH,
  RESERVATION_STATUSES,
  RESERVATION_STATUS_ROUTE,
} from '@/helpers/constants';
import axios from 'axios';
import { defineStore, storeToRefs } from 'pinia';
import { ref, Ref } from 'vue';
import { useConfigStore } from './configStore';

export const useReservationStore = defineStore('reservation', () => {
  const { config } = storeToRefs(useConfigStore());
  // A raw api call without using the interceptors from the acapyApiStore
  // Needed for the open call to reservation at this point
  const api = axios.create({
    baseURL: config.value.frontend.tenantProxyPath,
    headers: {
      'Ocp-Apim-Subscription-Key': '0b7ba83125f44e71936e2bc3cd31b083',
    }
  });

  // A different axios instance with a basepath just of the tenant UI backend
  const backendApi = axios.create({
    baseURL: config.value.frontend.apiPath,
  });

  // state
  const loading: any = ref(false);
  const error: any = ref(null);
  const reservation: any = ref(null);
  const reservationDetails: any = ref(null);
  const reservationId: any = ref(''); // TODO: Verify this isn't the same as 'const reservation' in line above
  const reservationNames: any = ref(null);
  const status: Ref<string> = ref('');
  const walletId: Ref<string> = ref('');
  const walletKey: Ref<string> = ref('');

  // actions
  function resetState() {
    reservation.value = null;
    reservationId.value = '';
    status.value = '';
    walletId.value = '';
    walletKey.value = '';
  }

  // TODO: Remove this functionality
  async function makeReservation(payload: any = {}) {
    console.log('> reservationStore.makeReservation');
    error.value = null;
    loading.value = true;
    reservation.value = null;

    // Send the request to the API to create the reservation
    await api
      .post(API_PATH.MULTITENANCY_RESERVATIONS, payload)
      .then((res) => {
        console.log('res from creating a res', res);
        reservation.value = res.data;
      })
      .catch((err) => {
        error.value = err;
        console.log(error.value);
      })
      .finally(() => {
        loading.value = false;
      });

    if (error.value != null) {
      // throw error so $onAction.onError listeners can add their own handler
      throw error.value;
    }

    const trimUrl = window.location.origin;

    // Separately dispatch a non-blocking call to send the contact emails
    // If these fail we won't raise any error to the UI
    const emailPayload = {
      contactEmail: payload.contact_email,
      contactName: payload.contact_name,
      reservationId: reservation.value.reservation_id,
      serverUrl: trimUrl,
      serverUrlStatusRoute: `${trimUrl}/${RESERVATION_STATUS_ROUTE}`,
    };
    backendApi
      .post(API_PATH.EMAIL_CONFIRMATION, emailPayload)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(`Error while trying to send confirmation email: ${err}`);
      });

    console.log('< reservationStore.makeReservation');

    // return data so $onAction.after listeners can add their own handler
    return reservation.value;
  }

  // TODO: Review if we still need this functionality
  async function checkReservation(reservationId: string, email: string) {
    console.log('> reservationStore.checkReservation');
    resetState();
    error.value = null;
    loading.value = true;

    await api
      .get(API_PATH.MULTITENANCY_RESERVATION(reservationId))
      .then((res) => {
        if (res.data) {
          // The API doesn't check email address against res ID but we can do it on the front end at least
          if (res.data.contact_email.toLowerCase() !== email.toLowerCase()) {
            status.value = RESERVATION_STATUSES.NOT_FOUND;
          } else {
            reservation.value = res.data;
            status.value = RESERVATION_STATUSES.APPROVED;
          }
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          // Handle not founds for this as a status not an exception
          status.value = RESERVATION_STATUSES.NOT_FOUND;
        } else {
          error.value = err;
          console.log(error.value);
        }
      })
      .finally(() => {
        loading.value = false;
      });
    console.log('< reservationStore.checkReservation');

    if (error.value != null) {
      // throw error so $onAction.onError listeners can add their own handler
      throw error.value;
    }
    // return data so $onAction.after listeners can add their own handler
    return status.value;
  }

  async function authenticateAndGetReservationId(email: string, password: string) {
    console.log('> reservationStore.authenticateAndGetReservationId');
    error.value = null;
    loading.value = true;

    // Request body
    const body = {
      email: email,
      password: password
    };

    // Make api call to authenticate with APIM and if auth'd get reservation id to then checkIn()
    // TODO: Review if we want to make this api call separate Azure func or an aca-py plugin
    // TODO: Refactor to use axios, as in all other api calls in this project
    const response = await fetch(
        // TODO: Move api url to env var
        "https://pidi-monetization-newsub-webhook-handler.azurewebsites.net/api/authenticateNewPidiWallet?",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                "Ocp-Apim-Subscription-Key": "0b7ba83125f44e71936e2bc3cd31b083",
            },
            body: JSON.stringify(body),
        }
    );

    if(response.status === 401) {
      error.value = "Authentication failed. Check your username and password.";
      loading.value = false;
      throw error.value;
    }

    if(response.status === 204) {
      error.value = "New wallet subscription not found";
      loading.value = false;
      throw error.value;
    }

    if(response.status === 500) {
      error.value = "An error occurred. Please contact info@presidioidentity.com and let them know what happened.";
      loading.value = false;
      throw error.value;
    }

    const data = await response.json();

    console.log("response, data");
    console.log(response);
    console.log(data);

    const tenantNames = [];
    for (let i = 0; i < data.pending_reservations.length; i++)
      tenantNames.push(data.pending_reservations[i].tenant_name);

    // If we have a reservation ID, then reservation status is 'APPROVED'
    reservationId.value = data.reservation_id;
    reservation.value = data.pending_reservations;
    reservationNames.value = tenantNames;
    status.value = RESERVATION_STATUSES.APPROVED;
    loading.value = false;
  }

  async function getReservationDetails(reservationName: string) {
    const reservations = reservation.value;
    const foundReservation = reservations.find(
      (r: any) => r.tenant_name === reservationName
    );

    reservationId.value = foundReservation.reservation_id;
  }

  async function checkIn(reservationId: string, password: string) {
    console.log('> reservationStore.checkIn', reservationId);
    error.value = null;
    loading.value = true;
    await api
      .post(API_PATH.MULTITENANCY_RESERVATION_CHECK_IN(reservationId), {
        reservation_pwd: password,
      })
      .then((res) => {
        // A successful check in, set the status and display the returned wallet key and ID
        status.value = RESERVATION_STATUSES.SHOW_WALLET;
        walletId.value = res.data.wallet_id;
        walletKey.value = res.data.wallet_key;
      })
      .catch((err) => {
        error.value = err;
        console.log(error.value);
      })
      .finally(() => {
        loading.value = false;
      });
    console.log('< reservationStore.checkIn');

    if (error.value != null) {
      // throw error so $onAction.onError listeners can add their own handler
      throw error.value;
    }
  }

  return {
    reservation,
    reservationId,
    reservationNames,
    loading,
    error,
    status,
    walletId,
    walletKey,
    resetState,
    makeReservation, // TODO: Remove
    authenticateAndGetReservationId,
    checkReservation, // TODO: Remove
    getReservationDetails,
    checkIn, // TODO: Remove
  };
});

export default {
  useReservationStore,
};
