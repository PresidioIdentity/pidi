<template>
  <div class="traction-sidebar">
    <h1 class="sidebar-app-title">
      <ProgressSpinner v-if="loading" />
      <span v-if="tenant">{{ tenant.tenant_name }}</span>
    </h1>
    <h1 class="sidebar-app-title small">T</h1>
    <PanelMenu :model="items" class="mt-5" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PanelMenu from 'primevue/panelmenu';
import ProgressSpinner from 'primevue/progressspinner';
import { storeToRefs } from 'pinia';
import { useTenantStore } from '../../store';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// tenant should be loaded by login...
const { tenant, loading } = storeToRefs(useTenantStore());

const items = ref([
  {
    label: () => t('home.dashboard'),
    icon: 'pi pi-fw pi-chart-bar',
    to: { name: 'Dashboard' },
  },
  {
    label: () => t('connect.connections'),
    icon: 'pi pi-fw pi-users',
    items: [
      {
        // Icons are manadatory for mobile layout
        label: () => t('connect.connections'),
        icon: 'pi pi-fw pi-users',
        to: { name: 'MyContacts' },
      },
      {
        label: () => t('connect.invitations.invitations'),
        icon: 'pi pi-fw pi-send',
        to: { name: 'MyInvitations' },
      },
    ],
  },

  {
    label: () => t('issue.issuance'),
    icon: 'pi pi-fw pi-credit-card',
    to: { name: 'MyIssuedCredentials' },
  },

  // {
  //   label: () => t('verify.verification'),
  //   icon: 'pi pi-fw pi-check-square',
  //   to: { name: 'MyPresentations' },
  // },

  {
    label: () => t('holder.credentials'),
    icon: 'pi pi-fw pi-wallet',
    to: { name: 'MyHeldCredentials' },
  },

  {
    label: () => t('configuration.configuration'),
    icon: 'pi pi-fw pi-file',
    items: [
      {
        // label: () => t('configuration.schemasCreds.schemas'),
        label: 'Schema Storage',
        icon: 'pi pi-fw pi-book',
        to: { name: 'Schemas' },
      },
      {
        // label: () => t('configuration.schemasCreds.schemas'),
        label: 'Cred Def Storage',
        icon: 'pi pi-fw pi-id-card',
        to: { name: 'CredentialDefinitions' },
      },
      {
        // label: () => t('configuration.oca.oca'),
        label: 'OCA',
        icon: 'pi pi-fw pi-compass',
        to: { name: 'OCA' },
      },
      // {
      //   label: () => t('configuration.presentationTemplates.templates'),
      //   to: { name: 'PresentationTemplates' },
      // },
    ],
  },

  {
    label: () => t('messages.messages'),
    icon: 'pi pi-fw pi-envelope',
    to: { name: 'MyMessages' },
  },

  {
    label: () => t('about.about'),
    icon: 'pi pi-fw pi-question-circle',
    to: { name: 'About' },
  },
]);
</script>
