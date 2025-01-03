import './assets/main.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
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
    NAlert,
    NPopconfirm,
    NPopover
} from 'naive-ui'

const naive = create({
    components: [NButton, NTable, NDataTable, NCard, NModal, NForm, NFormItem, NInput,
        NInputNumber, NSelect, NIcon, NDivider, NSpace, NRadioGroup, NRadio, NAlert,
        NPopconfirm, NPopover]
})
const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate))
app.use(router)
app.use(naive)

app.mount('#app')
