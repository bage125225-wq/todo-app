<template>
  <div class="filter">
    <button class="filter-btn" @click="toggleFilter">フィルター</button>

    <!-- モーダルウィンドウ -->
    <div v-if="showFilter" class="modal-overlay" @click.self="closeFilter">
      <div class="modal-content">
        <h3>フィルター設定</h3>
        <input v-model="keyword" placeholder="キーワード検索..." />
        <select v-model="selectedTag">
          <option value="">タグを選択</option>
          <option>仕事</option>
          <option>勉強</option>
          <option>生活</option>
        </select>
        <div class="btn-group">
          <button @click="applyFilter">適用</button>
          <button @click="resetFilter">リセット</button>
          <button class="close-btn" @click="closeFilter">閉じる</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Filter",
  emits: ["filter"],
  setup(_, { emit }) {
    const showFilter = ref(false);
    const keyword = ref("");
    const selectedTag = ref("");

    const toggleFilter = () => {
      showFilter.value = true;
    };

    const closeFilter = () => {
      showFilter.value = false;
    };

    const applyFilter = () => {
      emit("filter", { keyword: keyword.value, tag: selectedTag.value });
      closeFilter();
    };

    const resetFilter = () => {
      keyword.value = "";
      selectedTag.value = "";
      emit("filter", { keyword: "", tag: "" });
    };

    return {
      showFilter,
      keyword,
      selectedTag,
      toggleFilter,
      closeFilter,
      applyFilter,
      resetFilter,
    };
  },
};
</script>

<style scoped>
.filter-btn {
  background-color: #42b983;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* モーダル背景 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* モーダル本体 */
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}

.btn-group {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.close-btn {
  background: #ccc;
}
</style>
