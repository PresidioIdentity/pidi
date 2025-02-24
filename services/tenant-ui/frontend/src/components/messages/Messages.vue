<template>
  <h3 class="mt-0">{{ t('messages.messages') }}</h3>
  <DataTable
    v-model:expandedRows="expandedRows"
    v-model:selection="selectedMessage"
    v-model:filters="filter"
    :loading="loading"
    :paginator="true"
    :rows="TABLE_OPT.ROWS_DEFAULT"
    :rows-per-page-options="TABLE_OPT.ROWS_OPTIONS"
    :value="messages"
    :global-filter-fields="['content']"
    selection-mode="single"
    data-key="message_id"
  >
    <template #header>
      <div class="flex justify-content-between">
        <div class="flex justify-content-start">
          <CreateMessage @success="loadTable" />
        </div>
        <div class="flex justify-content-end">
          <span class="p-input-icon-left message-search">
            <i class="pi pi-search" />
            <InputText
              v-model="filter.content.value"
              placeholder="Search Messages"
            />
          </span>
          <Button
            icon="pi pi-refresh"
            class="p-button-rounded p-button-outlined"
            title="Refresh Table"
            @click="loadTable"
          ></Button>
        </div>
      </div>
    </template>
    <template #empty> No records found. </template>
    <template #loading> Loading data. Please wait... </template>
    <Column :sortable="true" field="connection_id" header="Contact">
      <template #body="{ data }">
        {{ findConnectionName(data.connection_id) }}
      </template>
    </Column>
    <Column :sortable="true" field="state" header="State" />
    <Column :sortable="true" field="content" header="Content" />
    <Column :sortable="true" field="sent_time" header="Sent">
      <template #body="{ data }">
        {{ formatDateLong(data.created_at) }}
      </template>
    </Column>
  </DataTable>
</template>
<script setup lang="ts">
// Vue
import { onMounted, ref } from 'vue';
// PrimeVue
import Button from 'primevue/button';
import Column from 'primevue/column';
import DataTable, { DataTableFilterMetaData } from 'primevue/datatable';
import InputText from 'primevue/inputtext';
import { useToast } from 'vue-toastification';
import { FilterMatchMode } from 'primevue/api';
// State
import { useMessageStore, useContactsStore } from '@/store';
import { storeToRefs } from 'pinia';
// Other components
import { TABLE_OPT } from '@/helpers/constants';
import { formatDateLong } from '@/helpers';
import CreateMessage from './createMessage/CreateMessage.vue';
import { useI18n } from 'vue-i18n';

const toast = useToast();
const { t } = useI18n();

const messageStore = useMessageStore();
const contactsStore = useContactsStore();

const { loading, messages, selectedMessage } = storeToRefs(useMessageStore());
const { contacts } = storeToRefs(useContactsStore());

// Find the connection alias for an ID
const findConnectionName = (connectionId: string) => {
  const connection = contacts.value?.find((c: any) => {
    return c.connection_id === connectionId;
  });
  return connection ? connection.alias : '...';
};

const loadTable = async () => {
  // should return latest message first
  messageStore.listMessages().catch((err: any) => {
    toast.error(`Failure: ${err}`);
  });
  // Load contacts if not already there for display
  if (!contacts.value || !contacts.value.length) {
    contactsStore.listContacts().catch((err) => {
      console.error(err);
      toast.error(`Failure: ${err}`);
    });
  }
};
const expandedRows = ref([]);

const filter = ref({
  content: {
    value: null,
    matchMode: FilterMatchMode.CONTAINS,
  } as DataTableFilterMetaData,
});

onMounted(() => {
  loadTable();
});
</script>

<style>
.message-search {
  margin-right: 1.5rem;
}
.message-search input {
  padding-left: 3rem !important;
}
</style>
