<script setup lang="jsx">
import DetailTable from './DetailTable/DetailTable.vue'
const emit = defineEmits(['handleClose'])
const props = defineProps({
    modalMode: String,
    formData: Object
})
</script>

<template>
    <n-card closable @close="emit('handleClose')" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <DetailTable v-bind="props" />
    </n-card>
</template>
