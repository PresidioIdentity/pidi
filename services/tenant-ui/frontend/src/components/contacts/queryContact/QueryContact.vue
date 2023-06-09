<template>
    <div>
        <button @click="openModal">QA</button>
    <Dialog
        v-model:visible="displayModal"
        :style="{ minWidth: '500px' }"
        header="Edit Connection"
        :modal="true"
        @update:visible="handleClose"
      >
        <h3>Question Answer Plugin</h3>
        <!-- <p>Connection ID: {{ connectionId }}</p> -->
        <button @click="sendQuestion">Send Question</button>
        <label for="threadId">Thread ID:</label>
        <input type="text" id="threadId" v-model="threadId"/>
        <button @click="sendAnswer">Send Answer</button>
        <button @click="getQuestions">Get Questions</button>
        <button @click="handleClose">Close</button>
    </Dialog>
    </div>
</template>

<script setup lang="ts">

// Vue
import { ref, PropType } from 'vue';
// PrimeVue
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { useToast } from 'vue-toastification';
// State
import { useContactsStore } from '@/store';
import toastOptions from '@/plugins/toasts/vueToastification';

const contactsStore = useContactsStore();
const toast = useToast();

const threadId = ref('');

// Props
const props = defineProps({
    connectionId: {
        type: String as PropType<string>,
        required: true,
    }
});

const displayModal = ref(false);
const openModal = async () => {
    displayModal.value = true;
};
const handleClose = async () => {
    displayModal.value = false;
};

const sendQuestion = () => {
    contactsStore.sendContactQuestion(props.connectionId)
      .then(() => {
        toast.success(`Successfully sent question`);
      })
    // // Perform the HTTP call to send a question using the connectionId
    // axios.post(`https://api.example.com/connection/${this.connectionId}/question`, 
    // { text: 'Your question' })
    //     .then(response => {
    //         // Handle the response
    //         console.log(response.data);
    //     })
    //     .catch(error => {
    //         // Handle the error
    //         console.error(error);
    //     });
};

const sendAnswer = () => {
    contactsStore.sendContactAnswer(threadId.value)
        .then(() => {
            toast.success(`Successfully sent answer`);
            console.log(`thread id was ${threadId.value}`);
        })
    // // Perform the HTTP call to send an answer using the connectionId
    // axios.post(`https://api.example.com/connection/${this.connectionId}/answer`, { text: 'Your answer' })
    //     .then(response => {
    //         // Handle the response
    //         console.log(response.data);
    //     })
    //     .catch(error => {
    //         // Handle the error
    //         console.error(error);
    //     });
};

const getQuestions = () => {
    contactsStore.getContactQuestions()
        .then((res) => {
            toast.success(`Successfully got contact questions`);
            console.log(res);
        })
        .catch((err) => {
            console.error(err);
            toast.error(`Failure: ${err}`);
        });
    // // Perform the HTTP call to get questions using the connectionId
    // axios.get(`https://api.example.com/connection/${this.connectionId}/questions`)
    //     .then(response => {
    //         // Handle the response
    //         console.log(response.data);
    //     })
    //     .catch(error => {
    //         // Handle the error
    //         console.error(error);
    //     });
};

</script>
