<template>
  <div id="app">
    <h1>Todo リスト</h1>

    <!-- 添加按钮 -->
    <div class="btn-container">
      <button class="add-btn" @click="showModal = true">タスクを追加</button>
    </div>

    <!-- 模态框 -->
    <div v-if="showModal" class="modal-overlay" @click.self="cancelAddTask">
      <div class="modal">
        <h2>タスクを追加</h2>
        <div class="modal-content">
          <textarea v-model="newTask" placeholder="タスクを入力..." class="task-textarea"></textarea>
          <select v-model="newTag">
            <option disabled value="">タグを選択</option>
            <option>仕事</option>
            <option>勉強</option>
            <option>生活</option>
          </select>
          <input type="date" v-model="newDate" />
          <div v-if="newTag" :class="['tag-preview', getTagClass(newTag)]">{{ newTag }}</div>
        </div>
        <div class="modal-actions">
          <button @click="confirmAddTask">保存</button>
          <button @click="cancelAddTask">キャンセル</button>
        </div>
      </div>
    </div>

    <!-- 任务列表 -->
    <ul>
      <li v-for="(task, index) in pagedTasks" :key="index" class="task-item">
        <div class="task-content">
          <!-- 标签左上角显示 -->
          <div v-if="task.tag" :class="['tag', task.tagClass]">{{ task.tag }}</div>

          <template v-if="!task.editing">
            <div class="task-text">{{ task.text }}</div>
            <div v-if="task.date" class="date">📅 {{ task.date }}</div>
          </template>

          <template v-else>
            <textarea v-model="task.editText" rows="3" class="task-textarea"></textarea>
            <select v-model="task.editTag">
              <option disabled value="">タグを選択</option>
              <option>仕事</option>
              <option>勉強</option>
              <option>生活</option>
            </select>
            <input type="date" v-model="task.editDate" />
          </template>
        </div>
        <div class="task-actions">
          <button v-if="!task.editing" @click="startEdit(task)">編集</button>
          <button v-if="task.editing" @click="saveEdit(task)">保存</button>
          <button v-if="task.editing" @click="cancelEdit(task)">キャンセル</button>
          <button @click="removeTask(task)">削除</button>
        </div>
      </li>
    </ul>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  setup() {
    const showModal = ref(false);
    const newTask = ref("");
    const newTag = ref("");
    const newDate = ref("");
    const tasks = ref([]);

    const tasksPerPage = 4;
    const currentPage = ref(1);

    const getTagClass = (tag) => {
      switch (tag) {
        case "仕事": return "tag-work";
        case "勉強": return "tag-study";
        case "生活": return "tag-life";
        default: return "";
      }
    };

    const confirmAddTask = () => {
      if (newTask.value.trim()) {
        tasks.value.push({
          text: newTask.value,
          tag: newTag.value,
          tagClass: getTagClass(newTag.value),
          date: newDate.value,
          editing: false,
          editText: "",
          editTag: "",
          editDate: ""
        });
        resetForm();
        sortTasksByDate();
        currentPage.value = Math.ceil(tasks.value.length / tasksPerPage);
        showModal.value = false;
      }
    };

    const cancelAddTask = () => {
      resetForm();
      showModal.value = false;
    };

    const resetForm = () => {
      newTask.value = "";
      newTag.value = "";
      newDate.value = "";
    };

    const removeTask = (task) => {
      const index = tasks.value.indexOf(task);
      if (index > -1) tasks.value.splice(index, 1);
      if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
    };

    const startEdit = (task) => {
      task.editing = true;
      task.editText = task.text;
      task.editTag = task.tag;
      task.editDate = task.date;
      task.tagClass = getTagClass(task.editTag);
    };

    const saveEdit = (task) => {
      task.text = task.editText;
      task.tag = task.editTag;
      task.tagClass = getTagClass(task.editTag);
      task.date = task.editDate;
      task.editing = false;
      sortTasksByDate();
    };

    const cancelEdit = (task) => {
      task.editing = false;
      task.editText = "";
      task.editTag = "";
      task.editDate = "";
    };

    const sortTasksByDate = () => {
      tasks.value.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date) - new Date(b.date);
      });
    };

    const totalPages = computed(() => Math.ceil(tasks.value.length / tasksPerPage));
    const pagedTasks = computed(() => {
      const start = (currentPage.value - 1) * tasksPerPage;
      const end = start + tasksPerPage;
      return tasks.value.slice(start, end);
    });

    return {
      showModal,
      newTask,
      newTag,
      newDate,
      tasks,
      currentPage,
      totalPages,
      pagedTasks,
      getTagClass,
      confirmAddTask,
      cancelAddTask,
      removeTask,
      startEdit,
      saveEdit,
      cancelEdit
    };
  }
};
</script>

<style>
/* 添加按钮居中 */
.btn-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.add-btn {
  padding: 8px 16px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
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

/* 任务列表 */
ul {
  list-style: none;
  padding: 0;
}

/* 单条任务 */
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 8px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.task-content {
  flex: 1;
  min-width: 0;
  word-break: break-word;
  white-space: pre-wrap;
  position: relative;
  padding-top: 28px; /* 为悬浮标签预留空间 */
}

.task-text {
  word-break: break-word;
}

.task-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* 标签样式 */
.tag {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  font-weight: bold;
  white-space: nowrap;
}

/* 标签颜色 */
.tag-work { background-color: #e74c3c; }
.tag-study { background-color: #3498db; }
.tag-life { background-color: #42b983; }

/* 日期样式 */
.date {
  margin-left: 8px;
  font-size: 12px;
  color: #555;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  gap: 6px;
}

.pagination button {
  padding: 6px 10px;
  border: 1px solid #42b983;
  background: #fff;
  color: #42b983;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  transition: all 0.2s;
}

.pagination button:hover {
  background: #42b983;
  color: #fff;
}

.pagination button.active {
  background: #42b983;
  color: #fff;
  border-color: #42b983;
}
</style>
