import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

interface TrustWeights {
  deviceId: number;
  deviceName: number;
  operatingSystem: number;
  ipAddress: number;
  macAddress: number;
  location: number;
}

export const useTrustStore = defineStore('trust', () => {
  // state
  // Hardware values
  const deviceId: any = ref(false);
  const deviceIdWeight: any = ref(100);
  const deviceName: any = ref(false);
  const deviceNameWeight: any = ref(100);
  const operatingSystem: any = ref(false);
  const operatingSystemWeight: any = ref(100);
  // Network values
  const ipAddress: any = ref(false);
  const ipAddressWeight: any = ref(100);
  const macAddress: any = ref(false);
  const macAddressWeight: any = ref(100);
  // Jurisdicton values
  const location: any = ref(false);
  const locationWeight: any = ref(100);

  const trustWeightArray: any = ref([]);

  // actions
  async function setTrustWeights(weights: TrustWeights) {
    console.log('> trustStore.setTrustWeight');
    // Hardware values
    deviceIdWeight.value = (weights.deviceId * 0.01).toString();
    deviceNameWeight.value = (weights.deviceName * 0.01).toString();
    operatingSystemWeight.value = (weights.operatingSystem * 0.01).toString();
    // Network values
    ipAddressWeight.value = (weights.ipAddress * 0.01).toString();
    macAddressWeight.value = (weights.macAddress * 0.01).toString();
    // Jurisdicton values
    locationWeight.value = (weights.location * 0.01).toString();
  }

  async function generateTrustObject() {
    console.log('> trustStore.generateTrustObject');
    const attributes: any = {
      attributeName: '',
      weight: '',
      evalMethod: '',
    };
    // Hardware values
    if (deviceId.value == true) {
      const attributes: object = {
        attributeName: 'Device ID',
        weight: deviceIdWeight.value,
        evalMethod: 'Exact',
      };
      trustWeightArray.value.push(attributes);
    }
    if (deviceName.value == true) {
      const attributes: object = {
        attributeName: 'Device Name',
        weight: deviceNameWeight.value,
        evalMethod: 'Exact',
      };
      trustWeightArray.value.push(attributes);
    }
    if (operatingSystem.value == true) {
      const attributes: object = {
        attributeName: 'Operating System',
        weight: operatingSystemWeight.value,
        evalMethod: 'Exact',
      };
      trustWeightArray.value.push(attributes);
    }
    // Network values
    if (ipAddress.value == true) {
      const attributes: object = {
        attributeName: 'IP Address',
        weight: ipAddressWeight.value,
        evalMethod: 'Exact',
      };
      trustWeightArray.value.push(attributes);
    }
    if (macAddress.value == true) {
      const attributes: object = {
        attributeName: 'MAC Address',
        weight: ipAddressWeight.value,
        evalMethod: 'Exact',
      };
      trustWeightArray.value.push(attributes);
    }
    // Jurisdicton values
    if (location.value == true) {
      const attributes: object = {
        attributeName: 'Location',
        weight: locationWeight.value,
        evalMethod: '',
      };
      trustWeightArray.value.push(attributes);
    }
    console.log(trustWeightArray.value);
    return trustWeightArray.value;
  }

  async function submitTrustModel() {
    console.log('> trustStore.sumbitTrustModel');

    await generateTrustObject();
    const data = { weights: trustWeightArray.value };
    await fetch('https://pi-trust-function-app.azurewebsites.net/api/trust/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  return {
    deviceId,
    deviceIdWeight,
    deviceName,
    deviceNameWeight,
    operatingSystem,
    operatingSystemWeight,
    ipAddress,
    ipAddressWeight,
    macAddress,
    macAddressWeight,
    location,
    locationWeight,
    setTrustWeights,
    submitTrustModel,
  };
});

export default {
  useTrustStore,
};
