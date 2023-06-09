import { API_PATH, CONNECTION_STATUSES } from '@/helpers/constants';
import {
  ConnRecord,
  UpdateConnectionRequest,
} from '@/types/acapyApi/acapyInterface';
import { defineStore } from 'pinia';
import { computed, ref, Ref } from 'vue';
import { useAcapyApi } from './acapyApi';
import {
  fetchList,
  filterByStateActive,
  filterMapSortList,
  sortByLabelAscending,
} from './utils';
import { fetchItem } from './utils/fetchItem';

export const useContactsStore = defineStore('contacts', () => {
  // state
  const contacts: Ref<any[]> = ref([]);
  const selectedContact: any = ref(null);
  const loading: Ref<boolean> = ref(false);
  const loadingItem: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  // getters
  const contactsDropdown = computed(() => {
    // Get the display list of active connections from the util
    return filterMapSortList(
      contacts.value,
      contactLabelValue,
      sortByLabelAscending,
      filterByStateActive
    );
  });

  const filteredConnections = computed(() =>
    contacts.value.filter((c) => c.state !== CONNECTION_STATUSES.INVITATION)
  );
  const filteredInvitations = computed(() =>
    contacts.value.filter((c) => c.state === CONNECTION_STATUSES.INVITATION)
  );

  // actions

  // grab the tenant api
  const acapyApi = useAcapyApi();

  async function listContacts() {
    selectedContact.value = null;
    return fetchList(API_PATH.CONNECTIONS, contacts, error, loading, {});
  }

  async function createInvitation(alias: string, multiUse: boolean) {
    console.log('> contactsStore.createInvitation');
    error.value = null;
    loading.value = true;

    let invitationData = null;
    // need the await here since the returned invitationData is not one of our stored refs...
    await acapyApi
      .postHttp(
        API_PATH.CONNECTIONS_CREATE_INVITATION,
        {},
        {
          params: { alias, multi_use: multiUse },
        }
      )
      .then((res) => {
        console.log(res);
        invitationData = res.data;
      })
      .then(() => {
        listContacts();
      })
      .catch((err) => {
        error.value = err;
        // console.log(error.value);
      })
      .finally(() => {
        loading.value = false;
      });
    console.log('< contactsStore.createInvitation');

    if (error.value != null) {
      // throw error so $onAction.onError listeners can add their own handler
      throw error.value;
    }
    // return data so $onAction.after listeners can add their own handler
    return invitationData;
  }

  async function receiveInvitation(invite: string, alias: string) {
    console.log('> contactsStore.receiveInvitation');
    error.value = null;
    loading.value = true;

    let acceptedData = null;
    const payload = JSON.parse(invite);

    await acapyApi
      .postHttp(API_PATH.CONNECTIONS_RECEIVE_INVITATION, payload, {
        params: { alias, auto_accept: true },
      })
      .then((res) => {
        console.log(res);
        // don't grab the item, there are other parts of the response data we need (invitation, invitation url)
        acceptedData = res.data;
      })
      .then(() => {
        // do we want to automatically reload? or have the caller of this to load?
        console.log(
          'invitation accepted. the store calls load automatically, but do we want this done "manually"?'
        );
        listContacts();
      })
      .catch((err) => {
        error.value = err;
        // console.log(error.value);
      })
      .finally(() => {
        loading.value = false;
      });
    console.log('< contactsStore.receiveInvitation');

    if (error.value != null) {
      // throw error so $onAction.onError listeners can add their own handler
      throw error.value;
    }
    // return data so $onAction.after listeners can add their own handler
    return acceptedData;
  }

  async function sendContactQuestion(connectionId: string) {
    console.log('> contactsStore.sendContactQuestion');

    error.value = null;
    loading.value = true;

    const body = 
    {
        "@type": "https://didcomm.org/questionanswer/1.0/question",
        "question_text": "Are you a test agent?",
        "question_detail": "Verifying that the Q&A Handler works via integration tests",
        "valid_responses": [
            { "text": "yes" },
            { "text": "no" }
        ]
    }

    let result = null;

    await acapyApi.postHttp(API_PATH.QUESTION_ANSWER_SEND_QUESTION(connectionId), body)
    .then((res) => {
        console.log('question sent');
        console.log(body);
      })
      .catch((err) => {
        error.value = err;
      })
      .finally(() => {
        loading.value = false;
      });
    console.log('< contactsStore.sendContactQuestion');

    if (error.value != null) {
      // throw error so $onAction.onError listeners can add their own handler
      throw error.value;
    }
  }

  async function sendContactAnswer(threadId: string) {
    console.log('> contactsStore.sendContactAnswer');

    error.value = null;
    loading.value = true;

    const body = 
    {
      "@type": "https://didcomm.org/questionanswer/1.0/answer",
      "@id": threadId,
      "response": "yes"
    };

    let result = null;

    await acapyApi.postHttp(API_PATH.QUESTION_ANSWER_SEND_ANSWER(threadId), body)
    .then((res) => {
        console.log('answer sent');
        console.log(body);
      })
      .catch((err) => {
        error.value = err;
      })
      .finally(() => {
        loading.value = false;
      });
    console.log('< contactsStore.sendContactAnswer');

    if (error.value != null) {
      // throw error so $onAction.onError listeners can add their own handler
      throw error.value;
    }

  }

  async function getContactQuestions() {
    console.log('> contactsStore.getContactQuestions');

    error.value = null;
    loading.value = true;

    let result = null;

    await acapyApi.getHttp(API_PATH.QUESTION_ANSWER_GET_QUESTIONS)
    .then((res) => {
        result = res.data;
    })
    .catch((err) => {
      error.value = err;
    })
    .finally(() => {
      loading.value = false;
    });
    console.log('< contactsStore.getContactQuestions');

    if (error.value != null) {
      throw error.value;
    }
    
    return result;
  }

  async function deleteContact(connectionId: string) {
    console.log('> contactsStore.deleteContact');

    error.value = null;
    loading.value = true;

    let result = null;

    await acapyApi
      .deleteHttp(API_PATH.CONNECTION(connectionId))
      .then((res) => {
        result = res.data;
      })
      .then(() => {
        listContacts(); // Refresh table
      })
      .catch((err) => {
        error.value = err;
      })
      .finally(() => {
        loading.value = false;
      });
    console.log('< contactsStore.deleteContact');

    if (error.value != null) {
      // throw error so $onAction.onError listeners can add their own handler
      throw error.value;
    }
    // return data so $onAction.after listeners can add their own handler
    return result;
  }

  async function getContact(id: string, params: any = {}) {
    loadingItem.value = true;
    return fetchItem(API_PATH.CONNECTIONS, id, error, loadingItem, params);
  }

  async function getInvitation(id: string, params: any = {}) {
    loadingItem.value = true;
    return fetchItem(
      API_PATH.CONNECTIONS_INVITATION(id),
      '',
      error,
      loadingItem,
      params
    );
  }

  // Only going to do alias right now but expand to other params if needed later
  async function updateConnection(id: string, alias: string) {
    console.log('> contactsStore.updateConnection');
    error.value = null;
    loading.value = true;

    let updatedConnection: ConnRecord | null = null;
    const payload: UpdateConnectionRequest = {
      alias,
    };
    await acapyApi
      .putHttp(API_PATH.CONNECTION(id), payload)
      .then((res) => {
        updatedConnection = res.data;
      })
      .then(() => {
        listContacts();
      })
      .catch((err) => {
        error.value = err;
      })
      .finally(() => {
        loading.value = false;
      });
    console.log('< contactsStore.updateConnection');

    if (error.value != null) {
      // throw error so $onAction.onError listeners can add their own handler
      throw error.value;
    }
    // return data so $onAction.after listeners can add their own handler
    return updatedConnection;
  }

  async function didCreateRequest(did: string, alias: string, myLabel: string) {
    console.log('> contactsStore.didCreateRequest');
    error.value = null;
    loading.value = true;

    await acapyApi
      .postHttp(
        API_PATH.DID_EXCHANGE_CREATE_REQUEST,
        {},
        {
          params: { their_public_did: did, alias, my_label: myLabel },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .then(() => {
        listContacts();
      })
      .catch((err) => {
        error.value = err;
      })
      .finally(() => {
        loading.value = false;
      });
    console.log('< contactsStore.didCreateRequest');

    if (error.value != null) {
      // throw error so $onAction.onError listeners can add their own handler
      throw error.value;
    }
  }

  // private functions
  const contactLabelValue = (item: any) => {
    let result = null;
    if (item != null) {
      // TODO: determine UX for multiuse blank alias ones
      let alias = 'unknown';
      if (item.alias) {
        alias = item.alias;
      } else if (item.their_label) {
        alias = `Multi-use (${item.their_label})`;
      }
      result = {
        label: alias,
        value: item.connection_id,
        status: item.state,
      };
    }
    return result;
  };

  return {
    contacts,
    contactsDropdown,
    selectedContact,
    loading,
    loadingItem,
    error,
    filteredConnections,
    filteredInvitations,
    listContacts,
    createInvitation,
    receiveInvitation,
    deleteContact,
    getContact,
    getInvitation,
    updateConnection,
    didCreateRequest,
    sendContactQuestion,
    getContactQuestions,
    sendContactAnswer,
  };
});

export default {
  useContactsStore,
};
