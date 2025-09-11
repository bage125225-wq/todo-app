<template>
  <div class="filter-container">
    <!-- 打开模态框的按钮 -->
    <button class="filter-btn" @click="showModal = true">フィルタ</button>

    <!-- 模态框 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>タスクをフィルタ</h2>

        <!-- 关键词搜索 -->
        <input
          v-model="keyword"
          type="text"
          placeholder="キーワードで検索"
          @keyup.enter="applyFilter"
        />

        <!-- 标签选择 -->
        <select v-model="selectedTag">
          <option value="">全てのタグ</option>
          <option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</option>
        </select>

        <!-- 按钮组 -->
        <div class="actions">
          <button @click="applyFilter">適用</button>
          <button @click="clearFilter">クリア</button>
          <button @click="showModal = false">閉じる</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["updateFilter"],
  setup(props, { emit }) {
    const keyword = ref("");
    const selectedTag = ref("");
    const showModal = ref(false);

    const applyFilter = () => {
      emit("updateFilter", { keyword: keyword.value, tag: selectedTag.value });
      showModal.value = false; // 应用后关闭模态框
    };

    const clearFilter = () => {
      keyword.value = "";
      selectedTag.value = "";
      emit("updateFilter", { keyword: "", tag: "" });
      showModal.value = false;
    };

    return { keyword, selectedTag, showModal, applyFilter, clearFilter };
  },
};
</script>

<style scoped>
.filter-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.filter-btn {
  padding: 8px 16px;
  background: #2c3e50;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
</style>
