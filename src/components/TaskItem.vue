<template>
  <li class="task-item">
    <div class="task-content">
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
      <button v-if="!task.editing" @click="startEdit">編集</button>
      <button v-if="task.editing" @click="saveEdit">保存</button>
      <button v-if="task.editing" @click="cancelEdit">キャンセル</button>
      <button @click="$emit('remove', task)">削除</button>
    </div>
  </li>
</template>

<script>
export default {
  props: ["task"],
  emits: ["remove", "edit"],
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

<style>
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
  padding-top: 28px;
}

.task-text {
  word-break: break-word;
}

.task-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

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

.tag-work { background-color: #e74c3c; }
.tag-study { background-color: #3498db; }
.tag-life { background-color: #42b983; }

.date {
  margin-left: 8px;
  font-size: 12px;
  color: #555;
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
</style>
