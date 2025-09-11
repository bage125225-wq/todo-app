<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal">
      <h2>タスクを追加</h2>

      <div v-for="(task, index) in tasks" :key="index" class="modal-content">
        <textarea v-model="task.text" placeholder="タスクを入力..." class="task-textarea"></textarea>
        <select v-model="task.tag">
          <option disabled value="">タグを選択</option>
          <option>仕事</option>
          <option>勉強</option>
          <option>生活</option>
        </select>
        <input type="date" v-model="task.date" />
        <div v-if="task.tag" :class="['tag-preview', getTagClass(task.tag)]">{{ task.tag }}</div>

        <button v-if="index === 0" type="button" class="add-extra-task" @click="addExtraTask">
          もう一つタスクを追加
        </button>
      </div>

      <div class="modal-actions">
        <button @click="confirmAddAllTasks">タスクを一斉提出</button>
        <button @click="$emit('cancel')">キャンセル</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  emits: ["add-task", "cancel"],
  setup(_, { emit }) {
    const tasks = ref([{ text: "", tag: "", date: "" }]);

    const getTagClass = (tagName) => {
      switch (tagName) {
        case "仕事": return "tag-work";
        case "勉強": return "tag-study";
        case "生活": return "tag-life";
        default: return "";
      }
    };

    const addExtraTask = () => {
      tasks.value.push({ text: "", tag: "", date: "" });
    };

    const confirmAddAllTasks = () => {
      const validTasks = tasks.value.filter(t => t.text.trim());
      if (!validTasks.length) return;
      validTasks.forEach(task => {
        emit("add-task", {
          text: task.text,
          tag: task.tag,
          tagClass: getTagClass(task.tag),
          date: task.date,
          editing: false,
          editText: task.text,
          editTag: task.tag,
          editDate: task.date
        });
      });
      tasks.value = [{ text: "", tag: "", date: "" }];
    };

    return { tasks, getTagClass, addExtraTask, confirmAddAllTasks };
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
  max-width: 500px;
  max-height: 90%;
  overflow-y: auto;
}
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
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
.add-extra-task {
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 10px;
  cursor: pointer;
  width: fit-content;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
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
