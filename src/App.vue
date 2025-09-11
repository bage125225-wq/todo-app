<template>
  <div id="app">
    <h1>Todo リスト</h1>

    <!-- 按钮区域 -->
    <div class="btn-container">
      <button class="filter-btn" @click="showFilter = true">フィルター</button>
      <button class="add-btn" @click="showModal = true">タスクを追加</button>
      <button class="delete-btn" @click="deleteSelectedTasks" :disabled="!selectedTasks.length">一斉削除</button>
    </div>

    <!-- 筛选模态 -->
    <Filter
      v-if="showFilter"
      :tags="['仕事','勉強','生活']"
      @updateFilter="updateFilter"
      @cancel="showFilter = false"
    />

    <!-- 添加任务模态 -->
    <TaskInput
      v-if="showModal"
      @add-task="addTask"
      @cancel="showModal = false"
    />

    <!-- 任务列表 -->
    <ul class="task-list">
      <TaskItem
        v-for="(task, index) in pagedTasks"
        :key="index"
        :task="task"
        :selected="selectedTasks.includes(task)"
        @remove="removeTask"
        @edit="updateTask"
        @select="toggleTaskSelection"
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
import Filter from "./components/Filter.vue";

export default {
  components: { TaskInput, TaskItem, Filter },
  setup() {
    const showModal = ref(false);
    const showFilter = ref(false);
    const tasks = ref([]);
    const tasksPerPage = 4;
    const currentPage = ref(1);

    const filterKeyword = ref("");
    const filterTag = ref("");
    const selectedTasks = ref([]);

    const sortTasksByDate = () => {
      const today = new Date();
      tasks.value.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return Math.abs(new Date(a.date) - today) - Math.abs(new Date(b.date) - today);
      });
    };

    const addTask = (task) => {
      tasks.value.push(task);
      sortTasksByDate();
      currentPage.value = 1;
      showModal.value = false;
    };

    const removeTask = (task) => {
      tasks.value = tasks.value.filter(t => t !== task);
      selectedTasks.value = selectedTasks.value.filter(t => t !== task);
      if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
    };

    const updateTask = () => sortTasksByDate();

    const updateFilter = ({ keyword, tag }) => {
      filterKeyword.value = keyword;
      filterTag.value = tag;
      currentPage.value = 1;
      showFilter.value = false;
    };

    const filteredTasks = computed(() => {
      return tasks.value.filter(task => {
        const matchKeyword = filterKeyword.value ? task.text.includes(filterKeyword.value) : true;
        const matchTag = filterTag.value ? task.tag === filterTag.value : true;
        return matchKeyword && matchTag;
      });
    });

    const pagedTasks = computed(() => {
      const start = (currentPage.value - 1) * tasksPerPage;
      return filteredTasks.value.slice(start, start + tasksPerPage);
    });

    const totalPages = computed(() => Math.ceil(filteredTasks.value.length / tasksPerPage));

    const toggleTaskSelection = (task, checked) => {
      if (checked) {
        if (!selectedTasks.value.includes(task)) selectedTasks.value.push(task);
      } else {
        selectedTasks.value = selectedTasks.value.filter(t => t !== task);
      }
    };

    const deleteSelectedTasks = () => {
      if (!selectedTasks.value.length) return;
      tasks.value = tasks.value.filter(t => !selectedTasks.value.includes(t));
      selectedTasks.value = [];
      if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
    };

    return {
      showModal,
      showFilter,
      tasks,
      addTask,
      removeTask,
      updateTask,
      updateFilter,
      pagedTasks,
      totalPages,
      currentPage,
      selectedTasks,
      toggleTaskSelection,
      deleteSelectedTasks
    };
  }
};
</script>

<style>
#app {
  max-width: 600px;
  margin: 30px auto;
  padding: 0 16px;
  font-family: "Noto Sans JP", sans-serif;
}
h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
.btn-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}
.add-btn, .filter-btn, .delete-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}
.add-btn { background: #42b983; color: #fff; }
.filter-btn { background: #3498db; color: #fff; }
.delete-btn { background: #e74c3c; color: #fff; }
.add-btn:hover { background: #369b72; }
.filter-btn:hover { background: #2b7bbd; }
.delete-btn:hover { background: #c0392b; }

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
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
