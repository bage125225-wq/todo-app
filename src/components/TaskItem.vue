<template>
  <li>
    
    <div v-if="!isEditing">{{ task.title }}</div>
    <input
      v-else
      v-model="editText"
      @keyup.enter="saveEdit"
      placeholder="编辑任务"
    />

    
    <div>
      <button v-if="!isEditing" @click="toggleEdit">編集</button>
      <button v-if="isEditing" @click="saveEdit">完成</button>
      <button v-if="isEditing" @click="cancelEdit">取消</button>
      <button v-if="!isEditing" @click="$emit('remove-task', task.id)">削除</button>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'TaskItem',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  emits: ['remove-task', 'update-task'],
  setup(props, { emit }) {
    const isEditing = ref(false)
    const editText = ref(props.task.title)

    
    watch(
      () => props.task.title,
      (newTitle) => {
        if (!isEditing.value) editText.value = newTitle
      }
    )

    function toggleEdit() {
      isEditing.value = true
      editText.value = props.task.title
    }

    function cancelEdit() {
      isEditing.value = false
      editText.value = props.task.title
    }

    function saveEdit() {
      if (editText.value.trim() === '') return
      emit('update-task', { id: props.task.id, title: editText.value })
      isEditing.value = false
    }

    return { isEditing, editText, toggleEdit, cancelEdit, saveEdit }
  }
})
</script>

<style scoped>
li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 5px;
  background-color: #f0f0f0;
}

li input {
  flex: 1;
  margin-right: 8px;
  padding: 4px 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

li button {
  margin-left: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #42b983;
  color: white;
  transition: background-color 0.2s;
}

li button:hover {
  background-color: #369870;
}
</style>
