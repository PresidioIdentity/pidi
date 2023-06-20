import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

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

  // getters

  // actions

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
  };
});

export default {
  useTrustStore,
};
