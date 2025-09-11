<script>
import { ref, computed, onMounted } from "vue";
import TaskInput from "./components/TaskInput.vue";
import TaskItem from "./components/TaskItem.vue";
import Filter from "./components/Filter.vue";

// Firebase Firestore
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

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

    // 从 Firestore 获取任务
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      tasks.value = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,         // Firestore 文档 ID
        ...docSnap.data()
      }));
      sortTasksByDate();
    };

    const addTask = async (task) => {
      try {
        // 添加到 Firestore
        const docRef = await addDoc(collection(db, "tasks"), {
          text: task.text,
          tag: task.tag,
          tagClass: task.tagClass,
          date: task.date,
          createdAt: new Date()
        });

        // 添加到本地数组
        tasks.value.push({ ...task, id: docRef.id });
        sortTasksByDate();
        currentPage.value = 1;
        showModal.value = false;
      } catch (e) {
        console.error("Error adding task to Firestore:", e);
      }
    };

    const removeTask = async (task) => {
      try {
        if (task.id) {
          await deleteDoc(doc(db, "tasks", task.id));
        }
        tasks.value = tasks.value.filter(t => t !== task);
        selectedTasks.value = selectedTasks.value.filter(t => t !== task);
        if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
      } catch (e) {
        console.error("Error deleting task:", e);
      }
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

    const deleteSelectedTasks = async () => {
      for (const task of selectedTasks.value) {
        if (task.id) {
          await deleteDoc(doc(db, "tasks", task.id));
        }
      }
      tasks.value = tasks.value.filter(t => !selectedTasks.value.includes(t));
      selectedTasks.value = [];
      if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
    };

    // 页面加载时拉取 Firestore 数据
    onMounted(() => {
      fetchTasks();
    });

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
