const app = Vue.createApp({
  data() {
    return {
      appName: 'Vue<strong class="text-green-500">Tracker</strong>',
      logoSource: 'ressources/images/vue.svg',
      blockquote: '"A Task Tracker using Vue JS."',
      timestampFormatter: Intl.DateTimeFormat('fr', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      tasks: [],
      taskID: 0,
      taskname: '',
      isTaskInProgress: false,
      taskStartTime: null,
      nowTime: null,
      intervalEverySecond: null,
      errorMessage: null,
    };
  },
  computed: {
    currentDuration() {
      if (this.taskStartTime && this.nowTime) {
        return this.durationBetweenTimestamps(this.taskStartTime, this.nowTime);
      } else {
        return '00-00-00';
      }
    },
  },
  watch: {
    isTaskInProgress(isInProgress) {
      if (isInProgress) {
        this.intervalEverySecond = setInterval(() => {
          this.nowTime = Date.now();
        }, 1000);
      } else {
        clearInterval(this.intervalEverySecond);
      }
    },
  },
  methods: {
    startTask() {
      if (this.taskname.length === 0) {
        this.errorMessage =
          "⚠ A task name can't be empty, please enter a Task.";
        return;
      } else if (this.isTaskInProgress) {
        this.errorMessage = '⚠ A task is already running... ';
        return;
      } else {
        this.errorMessage = null;
      }
      this.isTaskInProgress = true;
      this.taskStartTime = Date.now();
      this.nowTime = Date.now();
    },
    stopTask() {
      if (!this.isTaskInProgress) {
        errorMessage = 'No task in progress';
      }

      this.tasks.unshift({
        id: this.getAnID(),
        name: this.taskname,
        start: this.taskStartTime,
        end: Date.now(),
      });

      this.isTaskInProgress = false;
      this.nowTime = null;
      this.errorMessage = null;
      this.taskname = '';
    },
    toggleTask() {
      if (this.isTaskInProgress) {
        this.stopTask();
      } else {
        this.startTask();
      }
    },
    deleteTask(taskID) {
      let taskIndex = null;
      this.tasks.forEach((task, index) => {
        if (task.id === taskID) {
          taskIndex = index;
        }
      });

      this.tasks.splice(taskIndex, 1);
    },
    restartTask(oldTaskID) {
      if (this.isTaskInProgress) {
        this.stopTask();
      }

      let newTaskName = null;
      this.tasks.forEach((task) => {
        if (task.id === oldTaskID) {
          newTaskName = task.name;
        }
      });

      //restart task
      this.$nextTick(function () {
        this.taskname = newTaskName;
        this.startTask();
      });
    },
    getAnID() {
      this.taskID++;
      return this.taskID;
    },
    formatTimestamp(timestamp) {
      return this.timestampFormatter.format(timestamp);
    },
    durationBetweenTimestamps(start, end) {
      let seconds = Math.floor(end / 1000 - start / 1000);
      let minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      seconds %= 60;
      minutes %= 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0'
      )}:${String(seconds).padStart(2, '0')}`;
    },
  },
});

app.component('task-actions', {
  template: `
    <button 
            @click="sendRestart"
            type="button"
            class="
            block
            bg-gray-500
            ring-1
            ring-offset-1
            ring-gray-500
            text-white
            text-medium
            px-2
            py-2
            mr-2
            rounded
            transition
            duration-500
            ease
            hover:bg-gray-300
            hover:ring-gray-300
            "
            
    >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
    </button>
    
    <button type="button"
      @click="sendDelete"
      class="
            block
            bg-red-500
            ring-1 
            ring-offset-1
            ring-red-500 
            text-white 
            text-medium 
            px-2
            py-2
            rounded
            
            transition
            duration-500
            ease
            hover:bg-red-300
            hover:ring-red-300
    ">
      <svg xmlns="http://www.w3.org/2000/svg" 
      class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </button>
  
  `,
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  emits: ['restart', 'delete'],
  methods: {
    sendDelete() {
      this.$emit('delete', this.id);
    },
    sendRestart() {
      this.$emit('restart', this.id);
    },
  },
});

app.mount('#app');
