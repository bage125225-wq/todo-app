<template>
  <li :class="['task-item', { 'is-selected': selected }]">
    <input type="checkbox" class="task-checkbox" :checked="selected" @change="$emit('select', task, $event.target.checked)" />
    <div class="task-content">
      <div v-if="task.tag" :class="['tag', task.tagClass]">{{ task.tag }}</div>

      <template v-if="!task.editing">
        <div class="task-text">{{ task.text }}</div>
        <div v-if="task.date" class="date">📅 {{ task.date }}</div>
      </template>

      <template v-else>
        <textarea v-model="task.editText" rows="3" class="task-textarea"></textarea>
        <select v-model="task.editTag" class="edit-select">
          <option disabled value="">タグを選択</option>
          <option>仕事</option>
          <option>勉強</option>
          <option>生活</option>
        </select>
        <input type="date" v-model="task.editDate" />
      </template>
    </div>

    <div class="task-actions">
      <button v-if="!task.editing" class="btn-secondary" @click="startEdit">編集</button>
      <button v-if="task.editing" class="btn-primary" @click="saveEdit">保存</button>
      <button v-if="task.editing" class="btn-secondary" @click="cancelEdit">キャンセル</button>
      <button class="btn-delete" @click="$emit('remove', task)">削除</button>
    </div>
  </li>
</template>

<script>
export default {
  props: ["task", "selected"],
  emits: ["remove", "edit", "select"],
  setup(props, { emit }) {
    const getTagClass = (tag) => {
      switch (tag) {
        case "仕事": return "tag-work";
        case "勉強": return "tag-study";
        case "生活": return "tag-life";
        default: return "";
      }
    };

    const startEdit = () => {
      props.task.editing = true;
      props.task.editText = props.task.text;
      props.task.editTag = props.task.tag;
      props.task.editDate = props.task.date;
      props.task.tagClass = getTagClass(props.task.editTag);
    };

    const saveEdit = () => {
      props.task.text = props.task.editText;
      props.task.tag = props.task.editTag;
      props.task.tagClass = getTagClass(props.task.editTag);
      props.task.date = props.task.editDate;
      props.task.editing = false;
      emit("edit");
    };

    const cancelEdit = () => {
      props.task.editing = false;
      props.task.editText = "";
      props.task.editTag = "";
      props.task.editDate = "";
    };

    return { startEdit, saveEdit, cancelEdit };
  }
};
</script>

<style scoped>
.task-item {
  position: relative; /* 关键：让内部的绝对定位元素基于此 */
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px;
  border: 1px solid #ececec;
  border-radius: 8px;
  margin-bottom: 10px;
  background: #fff;
  overflow: visible;
}

/* 选中高亮 */
.task-item.is-selected { background: #f7fdf7; border-color: #d7f0d8; }

.task-checkbox { width: 18px; height: 18px; margin-top: 6px; flex-shrink: 0; }

/* 内容区：为右侧操作按钮预留空间（padding-right） */
.task-content {
  flex: 1;
  min-width: 0;
  word-break: break-word;
  white-space: pre-wrap;
  position: relative;
  padding-top: 28px;
  padding-right: 140px; /* 这里保留足够空间，避免与右侧按钮重叠 */
}

/* 标签（tag）定位在内容区左上角 */
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
  z-index: 2;
}
.tag-work { background-color: #e74c3c; }
.tag-study { background-color: #3498db; }
.tag-life { background-color: #42b983; }

.date { margin-left: 8px; font-size: 12px; color: #555; }
.task-text { word-break: break-word; }

/* 编辑用的 textarea，保证宽度计算正确，不被覆盖 */
.task-textarea {
  width: 100%;
  min-height: 60px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  box-sizing: border-box;
  z-index: 1;
}

/* 右侧操作按钮改为绝对定位，放在右上角，不会挤占内容宽度 */
.task-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  z-index: 3;
}

/* 按钮样式 */
button {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 13px;
  min-width: 72px;
}
.btn-primary { background: #28a745; color: #fff; border-color: #23863a; }
.btn-secondary { background: #f0f0f0; color: #333; border-color: #ddd; }
.btn-delete { background: #dc3545; color: #fff; border-color: #b21f2d; }

/* small select inside edit mode */
.edit-select { display: block; margin-top: 8px; }
</style>
