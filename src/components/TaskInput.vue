<template>
  <div>
    <button class="add-btn" @click="showModal = true">タスクを追加</button>

    <div v-if="showModal" class="modal-overlay" @click.self="cancel">
      <div class="modal">
        <h2>タスクを追加</h2>

        <div v-for="(task, index) in newTasks" :key="index" class="task-entry">
          <textarea v-model="task.text" placeholder="タスクを入力..." rows="2"></textarea>
          <select v-model="task.tag">
            <option disabled value="">タグを選択</option>
            <option>仕事</option>
            <option>勉強</option>
            <option>生活</option>
          </select>
          <input type="date" v-model="task.date" />
        </div>

        <button @click="addAnother">追加のタスク</button>

        <div class="modal-actions">
          <button @click="confirm">保存</button>
          <button @click="cancel">キャンセル</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  emits: ["add-tasks"],
  setup(_, { emit }) {
    const showModal = ref(false);
    const newTasks = ref([{ text: "", tag: "", date: "" }]);

    // 仅用于生成颜色class；其余逻辑不变
    const getTagClass = (tag) => {
      switch (tag) {
        case "仕事": return "tag-work";
        case "勉強": return "tag-study";
        case "生活": return "tag-life";
        default: return "";
      }
    };

    const addAnother = () => {
      newTasks.value.push({ text: "", tag: "", date: "" });
    };

    const confirm = () => {
      const tasksToAdd = newTasks.value
        .filter(t => t.text && t.text.trim())
        .map(t => ({
          id: Date.now() + Math.random(),
          text: t.text,
          tag: t.tag,
          tagClass: getTagClass(t.tag), // ★ 关键：补上颜色class
          date: t.date,
          hidden: false
        }));
      if (tasksToAdd.length) emit("add-tasks", tasksToAdd);
      newTasks.value = [{ text: "", tag: "", date: "" }];
      showModal.value = false;
    };

    const cancel = () => {
      newTasks.value = [{ text: "", tag: "", date: "" }];
      showModal.value = false;
    };

    return { showModal, newTasks, addAnother, confirm, cancel };
  }
};
</script>

<style>
.add-btn {
  padding: 8px 16px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}
.task-entry {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}
.task-entry textarea {
  resize: none;
  width: 100%;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
</style>
