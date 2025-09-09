<template>
  <div id="app">
    <h1>TODO 列表</h1>

    <!-- 添加任务组件 -->
    <TaskInput @add-task="addTask" />

    <!-- 任务列表 -->
    <ul>
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @remove-task="removeTask"
        @update-task="updateTask"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import TaskInput from './components/TaskInput.vue'
import TaskItem from './components/TaskItem.vue'

interface Task {
  id: number
  title: string
  completed: boolean
}

export default defineComponent({
  name: 'App',
  components: { TaskInput, TaskItem },
  setup() {
    const tasks = reactive<Task[]>([])
    let nextId = 1

    // 新增任务
    function addTask(title: string) {
      tasks.push({ id: nextId++, title, completed: false })
    }

    // 删除任务
    function removeTask(id: number) {
      const index = tasks.findIndex(t => t.id === id)
      if (index !== -1) tasks.splice(index, 1)
    }

    // 编辑任务
    function updateTask(updated: { id: number; title: string }) {
      const task = tasks.find(t => t.id === updated.id)
      if (task) task.title = updated.title
    }

    return { tasks, addTask, removeTask, updateTask }
  }
})
</script>
