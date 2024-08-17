import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import {
    // create naive ui
    create,
    // component
    NButton,
    NDataTable,
    NTable,
    NCard,
    NModal,
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NSelect,
    NIcon,
    NDivider,
    NSpace,
    NRadioGroup,
    NRadio,
    NAlert
} from 'naive-ui'

const naive = create({
    components: [NButton, NTable, NDataTable, NCard, NModal, NForm, NFormItem, NInput,
        NInputNumber, NSelect, NIcon, NDivider, NSpace, NRadioGroup, NRadio, NAlert]
})
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naive)

app.mount('#app')
