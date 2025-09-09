<template>
  <div class="task-input">
    <input v-model="newTask" placeholder="新タスクを追加" />
    <button @click="submitTask">添加</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'TaskInput',
  emits: ['add-task'],
  setup(_, { emit }) {
    const newTask = ref('')

    function submitTask() {
      if (newTask.value.trim() === '') return
      emit('add-task', newTask.value)
      newTask.value = ''
    }

    return { newTask, submitTask }
  }
})
</script>

<style scoped>
.task-input {
  display: flex;           
  gap: 10px;               
  margin-bottom: 20px;
  width: 100%;
}

.task-input input {
  flex: 1;                 
  padding: 8px 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.task-input button {
  padding: 8px 12px;
  border-radius: 5px;
  border: none;
  background-color: #42b983;
  color: white;
  cursor: pointer;
}

.task-input button:hover {
  background-color: #369870;
}
</style>
