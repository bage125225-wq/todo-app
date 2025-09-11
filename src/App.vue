<template>
  <div id="app">
    <h1>Todo リスト</h1>

    <!-- 筛选功能 -->
    <Filter
      :tags="['仕事','勉強','生活']"
      @updateFilter="updateFilter"
    />

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
import Filter from "./components/Filter.vue";

export default {
  components: { TaskInput, TaskItem, Filter },
  setup() {
    const showModal = ref(false);
    const tasks = ref([]);
    const tasksPerPage = 4;
    const currentPage = ref(1);

    // 筛选条件
    const filterKeyword = ref("");
    const filterTag = ref("");

    // 排序（保持不动）
    const sortTasksByDate = () => {
      const today = new Date();
      tasks.value.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        const diffA = Math.abs(new Date(a.date) - today);
        const diffB = Math.abs(new Date(b.date) - today);
        return diffA - diffB;
      });
    };

    const addTask = (task) => {
      tasks.value.push(task);
      sortTasksByDate();
      currentPage.value = 1;
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

    // 接收来自 Filter.vue 的事件
    const updateFilter = ({ keyword, tag }) => {
      filterKeyword.value = keyword;
      filterTag.value = tag;
      currentPage.value = 1; // 切换筛选条件时回到第一页
    };

    // 应用筛选条件
    const filteredTasks = computed(() => {
      return tasks.value.filter((task) => {
        const matchKeyword = filterKeyword.value
          ? task.text.includes(filterKeyword.value)
          : true;
        const matchTag = filterTag.value ? task.tag === filterTag.value : true;
        return matchKeyword && matchTag;
      });
    });

    const totalPages = computed(() =>
      Math.ceil(filteredTasks.value.length / tasksPerPage)
    );

    const pagedTasks = computed(() => {
      const start = (currentPage.value - 1) * tasksPerPage;
      return filteredTasks.value.slice(start, start + tasksPerPage);
    });

    return {
      showModal,
      tasks,
      addTask,
      removeTask,
      updateTask,
      updateFilter,
      pagedTasks,
      totalPages,
      currentPage,
    };
  },
};
</script>
<style scoped>
#app {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}

/* 标题 */
h1 {
  text-align: center;
  margin-bottom: 30px;
}

/* 筛选区 */
.filter-section {
  margin-bottom: 20px;
}

/* 添加按钮容器 */
.btn-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.add-btn {
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}
.add-btn:hover {
  background-color: #36986d;
}

/* 任务列表 */
ul {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

ul li {
  margin-bottom: 10px;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.pagination button {
  padding: 6px 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  cursor: pointer;
}

.pagination button.active {
  background: #42b983;
  color: white;
  border: none;
}
</style>
