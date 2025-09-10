<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal">
      <h2>タスクを追加</h2>
      <div class="modal-content">
        <textarea v-model="text" placeholder="タスクを入力..." class="task-textarea"></textarea>
        <select v-model="tag">
          <option disabled value="">タグを選択</option>
          <option>仕事</option>
          <option>勉強</option>
          <option>生活</option>
        </select>
        <input type="date" v-model="date" />
        <div v-if="tag" :class="['tag-preview', getTagClass(tag)]">{{ tag }}</div>
      </div>
      <div class="modal-actions">
        <button @click="confirmAddTask">保存</button>
        <button @click="$emit('cancel')">キャンセル</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup(_, { emit }) {
    const text = ref("");
    const tag = ref("");
    const date = ref("");

    const getTagClass = (tagName) => {
      switch (tagName) {
        case "仕事": return "tag-work";
        case "勉強": return "tag-study";
        case "生活": return "tag-life";
        default: return "";
      }
    };

    const confirmAddTask = () => {
      if (!text.value.trim()) return;
      emit("add-task", {
        text: text.value,
        tag: tag.value,
        tagClass: getTagClass(tag.value),
        date: date.value,
        editing: false,
        editText: text.value,
        editTag: tag.value,
        editDate: date.value
      });
      text.value = "";
      tag.value = "";
      date.value = "";
    };

    return { text, tag, date, getTagClass, confirmAddTask };
  }
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  margin-top: 20px; 
}


.modal-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}

.task-textarea {
  width: 100%;
  min-height: 60px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: both;
  font-size: 14px;
}

.modal-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.tag-preview {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  font-weight: bold;
  width: fit-content;
}

.tag-work { background-color: #e74c3c; }
.tag-study { background-color: #3498db; }
.tag-life { background-color: #42b983; }
</style>
