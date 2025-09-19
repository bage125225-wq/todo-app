<template>
  <div id="app">
    <h1>Todoリスト</h1>

    <!-- ツールバー -->
    <div class="toolbar">
      <button class="btn-green" @click="showFilter = true">フィルター</button>
      <button class="btn-green" @click="showModal = true">タスク追加</button>
      <button
        v-if="selectedTasks.length"
        class="btn-red"
        @click="deleteSelectedTasks"
      >
        選択タスク削除
      </button>
    </div>

    <!-- タスク一覧 -->
    <ul>
      <TaskItem
        v-for="task in pagedTasks"
        :key="task.id"
        :task="task"
        :selected="selectedTasks.includes(task)"
        @remove="removeTask"
        @edit="updateTask"
        @select="toggleTaskSelection"
      />
    </ul>

    <!-- ページネーション -->
    <div v-if="totalPages > 1" class="pagination">
      <button @click="currentPage--" :disabled="currentPage === 1">前へ</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="currentPage++" :disabled="currentPage === totalPages">次へ</button>
    </div>

    <!-- モーダル -->
    <TaskInput v-if="showModal" @add-task="addTask" @cancel="showModal = false" />
    <Filter
      v-if="showFilter"
      :tags="['仕事', '勉強', '生活']"
      @updateFilter="updateFilter"
      @cancel="showFilter = false"
    />
  </div>
</template>

<script>
import TaskInput from "./components/TaskInput.vue";
import TaskItem from "./components/TaskItem.vue";
import Filter from "./components/Filter.vue";

export default {
  components: { TaskInput, TaskItem, Filter },
  data() {
    return {
      tasks: [],
      showModal: false,
      showFilter: false,
      filter: null,
      selectedTasks: [],
      currentPage: 1,
      tasksPerPage: 4, // ✅ 1ページあたり4件に修正
    };
  },
  computed: {
    filteredTasks() {
      let result = this.tasks;
      if (this.filter) {
        result = result.filter((t) => t.tag === this.filter);
      }
      // ✅ 日付順にソート（今日に近いものが先頭）
      return result.slice().sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB; // 早い日付ほど前に
      });
    },
    totalPages() {
      return Math.ceil(this.filteredTasks.length / this.tasksPerPage);
    },
    pagedTasks() {
      const start = (this.currentPage - 1) * this.tasksPerPage;
      return this.filteredTasks.slice(start, start + this.tasksPerPage);
    },
  },
  methods: {
    addTask(task) {
      this.tasks.push(task);
      this.showModal = false;
    },
    removeTask(task) {
      this.tasks = this.tasks.filter((t) => t !== task);
    },
    updateTask(updatedTask) {
      const idx = this.tasks.findIndex((t) => t.id === updatedTask.id);
      if (idx !== -1) this.tasks[idx] = updatedTask;
    },
    updateFilter(tag) {
      this.filter = tag;
      this.showFilter = false;
    },
    toggleTaskSelection(task) {
      if (this.selectedTasks.includes(task)) {
        this.selectedTasks = this.selectedTasks.filter((t) => t !== task);
      } else {
        this.selectedTasks.push(task);
      }
    },
    deleteSelectedTasks() {
      this.tasks = this.tasks.filter((t) => !this.selectedTasks.includes(t));
      this.selectedTasks = [];
    },
  },
};
</script>

<style>
/* ===== 全体レイアウト ===== */
#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* ===== ツールバー ===== */
.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

/* ===== ツールバー ===== */
.toolbar {
  display: flex;
  gap: 10px;              /* 按钮间距 */
  justify-content: center; /* 居中排列 */
  margin-bottom: 16px;
}

/* ===== 按钮颜色 ===== */
button {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  color: #fff;
  font-weight: bold;
}

.btn-green {
  background-color: #4caf50;
}
.btn-green:hover {
  background-color: #45a049;
}

.btn-red {
  background-color: #f44336;
}
.btn-red:hover {
  background-color: #da190b;
}

/* ===== ページネーション ===== */
.pagination {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
