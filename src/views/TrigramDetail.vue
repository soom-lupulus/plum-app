<script setup lang="jsx">
import { ref, unref, h, onMounted, computed, nextTick, watch } from 'vue'

const props = defineProps({
  modalMode: String,
  formData: Object
})
</script>

<template>
  <n-card style="width: 600px" :bordered="false" size="huge" role="dialog" aria-modal="true">
    <table class="d-table">
      <tbody>
        <tr>
          <th scope="row">事项</th>
          <td colspan="4">我想知道他在干嘛呢？</td>
        </tr>
        <tr>
          <th scope="row">日期</th>
          <td colspan="4">Web accessibility</td>
        </tr>
        <tr>
          <th scope="row">卦式</th>
          <td colspan="4">未知卦式</td>
        </tr>
        <tr>
          <th scope="row">节气</th>
          <td colspan="4">未知节气</td>
        </tr>
        <tr>
          <th scope="row">干支</th>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
        </tr>
        <tr>
          <th scope="row">空亡</th>
          <td>1</td>
          <td>1</td>
          <td>1</td>
          <td>1</td>
        </tr>
        <tr>
          <th scope="row">策轨</th>
          <td colspan="2">策数：6 7 3 8</td>
          <td colspan="2">轨数：6 9 9 5 3</td>
        </tr>
        <tr>
          <th scope="row">神煞</th>
          <td colspan="4">HTML tables</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5">
            这里放卦
          </td>
        </tr>
      </tfoot>
    </table>
  </n-card>
</template>

<style scoped lang="less">
.d-table {
  border-collapse: collapse;
  border: 2px solid rgb(140 140 140);
  font-family: sans-serif;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

caption {
  caption-side: bottom;
  padding: 10px;
  font-weight: bold;
}

thead,
tfoot {
  background-color: rgb(228 240 245);
}

th,
td {
  border: 1px solid rgb(160 160 160);
  padding: 8px 10px;
}

td:last-of-type {
  text-align: center;
}

tbody > tr:nth-of-type(even) {
  background-color: rgb(237 238 242);
}

tfoot th {
  text-align: right;
}

tfoot td {
  font-weight: bold;
}
</style>
