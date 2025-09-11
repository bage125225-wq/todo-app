<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal">
      <h2>フィルター</h2>
      <input v-model="keyword" placeholder="キーワードで検索" @keyup.enter="applyFilter" />
      <select v-model="selectedTag">
        <option value="">全てのタグ</option>
        <option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</option>
      </select>
      <div class="modal-actions">
        <button @click="applyFilter">検索</button>
        <button @click="$emit('cancel')">キャンセル</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  props: ["tags"],
  emits: ["updateFilter", "cancel"],
  setup(props, { emit }) {
    const keyword = ref("");
    const selectedTag = ref("");

    const applyFilter = () => {
      emit("updateFilter", { keyword: keyword.value, tag: selectedTag.value });
    };

    return { keyword, selectedTag, applyFilter };
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
  max-width: 400px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}
</style>
