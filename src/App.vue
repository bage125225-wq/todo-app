<template>
  <div id="app">
    <h1>Todo リスト</h1>

    <!-- 添加按钮 -->
    <div class="btn-container">
      <button class="add-btn" @click="showModal = true">タスクを追加</button>
    </div>

    <!-- 模态框 -->
    <TaskInput
      v-if="showModal"
      @add-task="addTask"
      @cancel="showModal = false"
    />

    <!-- 任务列表 -->
    <ul>
      <TaskItem
        v-for="(task, index) in pagedTasks"
        :key="index"
        :task="task"
        @remove="removeTask"
        @edit="updateTask"
      />
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
import TaskInput from "./components/TaskInput.vue";
import TaskItem from "./components/TaskItem.vue";

export default {
  components: { TaskInput, TaskItem },
  setup() {
    const showModal = ref(false);
    const tasks = ref([]);
    const tasksPerPage = 4;
    const currentPage = ref(1);

    const sortTasksByDate = () => {
      const today = new Date();
      tasks.value.sort((a, b) => {
      if (!a.date) return 1; // 无日期排在最后
      if (!b.date) return -1;
      const diffA = Math.abs(new Date(a.date) - today);
      const diffB = Math.abs(new Date(b.date) - today);
      return diffA - diffB;
     });
    };


    const addTask = (task) => {
      tasks.value.push(task);
      sortTasksByDate();
      currentPage.value = 1; // 新任务后显示第一页
      showModal.value = false;
    };

    const removeTask = (task) => {
      const index = tasks.value.indexOf(task);
      if (index > -1) tasks.value.splice(index, 1);
      if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
    };

    const updateTask = () => {
      sortTasksByDate();
    };

    const totalPages = computed(() => Math.ceil(tasks.value.length / tasksPerPage));

    const pagedTasks = computed(() => {
      const start = (currentPage.value - 1) * tasksPerPage;
      return tasks.value.slice(start, start + tasksPerPage);
    });

    return { showModal, tasks, addTask, removeTask, updateTask, pagedTasks, totalPages, currentPage };
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
