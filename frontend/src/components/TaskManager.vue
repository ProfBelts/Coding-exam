<template>
    <div>
        <h1>Task Manager</h1>

        <!-- Task form -->
        <form @submit.prevent="addTask">
            <label for="title">Task Title:</label>
            <input type="text" id="title" v-model="newTask.title" required />

            <label for="status">Task Status:</label>
            <input type="text" id="status" v-model="newTask.status" required />

            <button type="submit">Add Task</button>
        </form>

        <!-- Task list -->
        <div class="tasks">
            <div class="task-description" v-for="task in tasks" :key="task.id">
                <div v-if="!task.editing">
                    <p>
                        Task Title:
                        <span>{{ task.title }}</span>
                    </p>
                    <p>Task Status: {{ task.status }}</p>
                    <button @click="editTask(task)">Edit</button>
                    <button @click="deleteTask(task)">Delete</button>
                    <!-- Add delete button -->
                </div>
                <div v-else>
                    <label for="editTitle">Task Title:</label>
                    <input
                        type="text"
                        id="editTitle"
                        v-model="task.updatedTitle"
                        required
                    />

                    <label for="editStatus">Task Status:</label>
                    <input
                        type="text"
                        id="editStatus"
                        v-model="task.updatedStatus"
                        required
                    />

                    <button @click="updateTask(task)">Update</button>
                    <button @click="cancelEdit(task)">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            tasks: [],
            newTask: { title: "", status: "" },
        };
    },
    created() {
        this.fetchTasks();
    },
    methods: {
        async fetchTasks() {
            try {
                const response = await axios.get("http://localhost:3000/tasks");
                this.tasks = response.data.map((task) => ({
                    ...task,
                    editing: false,
                    updatedTitle: task.title,
                    updatedStatus: task.status,
                }));
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        },
        async addTask() {
            try {
                const response = await axios.post(
                    "http://localhost:3000/tasks",
                    this.newTask
                );
                console.log("Task added successfully:", response.data);
                this.newTask = { title: "", status: "" };
                this.fetchTasks();
            } catch (error) {
                console.error("Error adding task:", error);
            }
        },
        editTask(task) {
            task.editing = true;
        },
        async updateTask(task) {
            try {
                const { id, updatedTitle, updatedStatus } = task;
                await axios.put(`http://localhost:3000/tasks/${id}`, {
                    title: updatedTitle,
                    status: updatedStatus,
                });
                task.title = updatedTitle;
                task.status = updatedStatus;
                task.editing = false;
            } catch (error) {
                console.error("Error updating task:", error);
            }
        },
        cancelEdit(task) {
            task.editing = false;
            task.updatedTitle = task.title;
            task.updatedStatus = task.status;
        },
        async deleteTask(task) {
            try {
                await axios.delete(`http://localhost:3000/tasks/${task.id}`);
                this.fetchTasks(); // Fetch tasks again after deletion
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        },
    },
};
</script>

<style scoped>
.tasks {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 20px;
    margin-top: 20px;
}

.task-description {
    background-color: #ffffff;
    border: 1px solid #cccccc;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
}

.task-description p {
    margin: 0;
}

.task-description input[type="text"] {
    width: calc(100% - 40px); /* Adjust width to fit button */
    margin-right: 10px;
    padding: 8px;
    border: 1px solid #cccccc;
    border-radius: 4px;
}

.task-description button {
    background-color: #007bff;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 8px 15px;
    cursor: pointer;
}

button {
    margin-right: 10px;
    margin-top: 10px;
}

.task-description button:hover {
    background-color: #0056b3;
}
</style>
