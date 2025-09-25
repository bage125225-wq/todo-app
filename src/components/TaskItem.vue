<template>
  <li class="task-item">
    <!-- 勾选框 -->
    <input
      type="checkbox"
      v-model="selected"
      @change="$emit('select-change', { task, selected })"
      class="task-checkbox"
    />

    <!-- 任务内容 -->
    <div class="task-content">
      <div class="task-header">
        <!-- 标签 -->
        <span v-if="task.tag" :class="['tag', task.tagClass]">{{ task.tag }}</span>
        <!-- 普通模式显示文字 -->
        <span v-if="!isEditing" class="task-text">{{ task.text }}</span>
        <!-- 编辑模式显示输入框 -->
        <textarea
          v-else
          v-model="editText"
          class="task-textarea"
        ></textarea>
      </div>
      <!-- 日期显示 -->
      <div v-if="task.date && !isEditing" class="date">📅 {{ task.date }}</div>
    </div>

    <!-- 操作按钮 -->
    <div class="task-actions">
      <button v-if="!isEditing" @click="toggleEdit">編集</button>
      <button v-if="isEditing" @click="saveEdit">保存</button>
      <button v-if="isEditing" @click="cancelEdit">取消</button>
      <button @click="$emit('remove-task', task)">削除</button>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'TaskItem',
  props: {
    task: { type: Object, required: true },
    modelValue: { type: Boolean, default: false } // 勾选状态
  },
  emits: ['remove-task', 'update-task', 'select-change'],
  setup(props, { emit }) {
    const isEditing = ref(false);
    const editText = ref(props.task.text);
    const selected = ref(false);

    watch(
      () => props.task.text,
      (newText) => {
        if (!isEditing.value) editText.value = newText;
      }
    );

    function toggleEdit() {
      isEditing.value = true;
      editText.value = props.task.text;
    }

    function cancelEdit() {
      isEditing.value = false;
      editText.value = props.task.text;
    }

    function saveEdit() {
      if (!editText.value.trim()) return;
      emit('update-task', { ...props.task, text: editText.value });
      isEditing.value = false;
    }

    return { isEditing, editText, toggleEdit, cancelEdit, saveEdit, selected };
  }
});
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
}

/* 勾选框 */
.task-checkbox {
  width: 20px;
  height: 20px;
  margin-top: 6px;
}

/* 任务内容 */
.task-content {
  flex: 1;
  position: relative;
  word-break: break-word;
}

/* header 保持 tag 和文字在同一行 */
.task-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* 标签样式 */
.tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  white-space: nowrap;
}

.tag-work { background-color: #e74c3c; }
.tag-study { background-color: #3498db; }
.tag-life { background-color: #42b983; }

/* 文字和编辑框 */
.task-text {
  flex: 1;
}

.task-textarea {
  width: 100%;
  min-height: 50px;
  padding: 4px 6px;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: vertical;
  font-size: 14px;
}

/* 日期样式 */
.date {
  font-size: 12px;
  color: #555;
  margin-top: 4px;
}

/* 操作按钮 */
.task-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-actions button {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #42b983;
  color: white;
  font-size: 12px;
  transition: 0.2s;
}


.task-actions button:hover {
  background-color: #369870;
}

.task-actions button:last-child {
  background-color: #e74c3c;
}

.task-actions button:last-child:hover {
  background-color: #c0392b;
}
</style>
