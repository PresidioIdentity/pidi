import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

interface TrustWeights {
  deviceInfo: number;
  network: number;
  location: number;
}

export const useTrustStore = defineStore('trust', () => {
  // state
  const loading: any = ref(false);
  const error: any = ref(null);

  // DeviceInfo values
  const deviceInfo: any = ref(false);
  const deviceInfoWeight: any = ref(100);
  // Network values
  const network: any = ref(false);
  const networkWeight: any = ref(100);
  // Location values
  const location: any = ref(false);
  const locationWeight: any = ref(100);

  const trustWeightArray: any = ref([]);

  // actions
  async function loadTrustProfiles() {
    console.log('> trustStore.getTrustWeight');
  }

  async function setTrustWeights(weights: TrustWeights) {
    console.log('> trustStore.setTrustWeight');

    deviceInfoWeight.value = (weights.deviceInfo * 0.01).toString();
    networkWeight.value = (weights.network * 0.01).toString();
    locationWeight.value = (weights.location * 0.01).toString();
  }

  async function generateTrustObject() {
    console.log('> trustStore.generateTrustObject');

    // DeviceInfo
    if (deviceInfo.value == true) {
      const attributes: object = {
        attributeName: 'Device Info',
        weight: deviceInfoWeight.value,
        evalMethod: 'Exact',
      };
      trustWeightArray.value.push(attributes);
    }
    // Network
    if (network.value == true) {
      const attributes: object = {
        attributeName: 'Network Info',
        weight: networkWeight.value,
        evalMethod: 'Exact',
      };
      trustWeightArray.value.push(attributes);
    }
    // Location
    if (location.value == true) {
      const attributes: object = {
        attributeName: 'Location Info',
        weight: locationWeight.value,
      };
      trustWeightArray.value.push(attributes);
    }
    return trustWeightArray.value;
  }

  async function submitTrustModel() {
    console.log('> trustStore.sumbitTrustModel');
    loading.value = true;

    await generateTrustObject();
    const data = { weights: trustWeightArray.value };
    await fetch('https://pi-trust-function-app.azurewebsites.net/api/trust/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const res = await response.json();
        localStorage.setItem('trustScore', res);
        loading.value = false;
      })
      .catch((error) => {
        console.log(error);
        loading.value = false;
        throw error.value;
      });
  }

  // TODO: (GET) if user has trust score get values and set as the default
  // TODO: (PUT) if user has trust score update values
  // TODO: (DELETE) user wants to reset their trust values

  return {
    loading,
    error,
    deviceInfo,
    network,
    location,
    loadTrustProfiles,
    setTrustWeights,
    submitTrustModel,
  };
});

export default {
  useTrustStore,
};
