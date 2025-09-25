<template>
  <div id="app">
    <h1>Todo リスト</h1>

    <div class="btn-container">
      <Filter @filter="applyFilter" />
      <BulkDelete
   v-if="selectedTasks.length > 0"
  :selected-tasks="selectedTasks"
  @delete-selected="removeSelectedTasks"
   />
      <TaskInput @add-tasks="addTasks" />
    </div>

    <ul>
      <TaskItem
        v-for="task in pagedTasks"
        :key="task.id"
        :task="task"
        :selected="selectedTasks.includes(task)"
        @select-change="onSelectChange"
        @update-task="updateTask"
        @remove-task="removeTask"
      />
    </ul>

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
import { ref, computed, onMounted } from "vue";
import TaskInput from "./components/TaskInput.vue";
import TaskItem from "./components/TaskItem.vue";
import Filter from "./components/Filter.vue";
import BulkDelete from "./components/BulkDelete.vue";

export default {
  components: { TaskInput, TaskItem, Filter, BulkDelete },
  setup() {
    const tasks = ref([]);
    const selectedTasks = ref([]);
    const tasksPerPage = 4;
    const currentPage = ref(1);

    const STORAGE_KEY = "todo-app-tasks";

    // 初始化读取 localStorage
    onMounted(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) tasks.value = JSON.parse(saved);
    });

    const saveToLocal = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value));
    };

    const addTasks = (newTasks) => {
      newTasks.forEach(task => tasks.value.push(task));
      saveToLocal();
      currentPage.value = Math.ceil(tasks.value.length / tasksPerPage);
    };

    const removeTask = (task) => {
      tasks.value = tasks.value.filter(t => t.id !== task.id);
      selectedTasks.value = selectedTasks.value.filter(t => t.id !== task.id);
      saveToLocal();
    };

    const updateTask = (updated) => {
      const task = tasks.value.find(t => t.id === updated.id);
      if (task) Object.assign(task, updated);
      saveToLocal();
    };

    const removeSelectedTasks = () => {
      tasks.value = tasks.value.filter(t => !selectedTasks.value.includes(t));
      selectedTasks.value = [];
      saveToLocal();
    };

    const onSelectChange = ({ task, selected }) => {
      if (selected) {
        if (!selectedTasks.value.includes(task)) selectedTasks.value.push(task);
      } else {
        selectedTasks.value = selectedTasks.value.filter(t => t.id !== task.id);
      }
    };

    const applyFilter = (filter) => {
      // 简单筛选逻辑：tag + keyword
      if (filter.tag || filter.keyword) {
        tasks.value.forEach(task => {
          task.hidden = false;
          if (filter.tag && task.tag !== filter.tag) task.hidden = true;
          if (filter.keyword && !task.text.includes(filter.keyword)) task.hidden = true;
        });
      } else {
        tasks.value.forEach(task => task.hidden = false);
      }
    };

    const totalPages = computed(() => {
      return Math.ceil(tasks.value.filter(t => !t.hidden).length / tasksPerPage);
    });

    const pagedTasks = computed(() => {
      const visibleTasks = tasks.value.filter(t => !t.hidden);
      const start = (currentPage.value - 1) * tasksPerPage;
      return visibleTasks.slice(start, start + tasksPerPage);
    });
    

    return {
      tasks,
      selectedTasks,
      currentPage,
      totalPages,
      pagedTasks,
      addTasks,
      removeTask,
      updateTask,
      removeSelectedTasks,
      onSelectChange,
      applyFilter
    };
    
  }
};
</script>

<style>
.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
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
}
.pagination button.active {
  background: #42b983;
  color: #fff;
}
</style>
