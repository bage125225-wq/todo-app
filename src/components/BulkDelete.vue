<template>
  <button
    class="delete-selected-btn"
    :disabled="selectedTasks.length === 0"
    @click="confirmDelete"
  >
    選択したタスクを削除
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BatchDelete',
  props: {
    selectedTasks: { type: Array, required: true }
  },
  emits: ['delete-selected'],
  setup(props, { emit }) {
    const confirmDelete = () => {
      if (props.selectedTasks.length === 0) return;
      if (confirm(`確認: ${props.selectedTasks.length} 件のタスクを削除しますか？`)) {
        emit('delete-selected');
      }
    };

    return { confirmDelete };
  }
});
</script>

<style scoped>
.delete-selected-btn {
  padding: 8px 16px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.delete-selected-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
