const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const axios = require("axios"); // Import axios

const app = express();
const port = 3000;

app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "!@Asdzxc123",
    database: "task_manager",
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to database");
});

app.use(express.json());

// Define route to handle GET requests to /api/fetch endpoint
app.get("/api/fetch", (req, res) => {
    const sql = "SELECT * FROM tasks";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        res.json(results);
    });
});

// Define route to handle GET requests to /tasks endpoint
app.get("/tasks", (req, res) => {
    axios
        .get("http://localhost:3000/api/fetch")
        .then((data) => {
            console.log(data);
            res.json(data.data);
        })
        .catch((error) => {
            console.error("Error fetching tasks:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

app.post("/tasks", (req, res) => {
    const { title, status } = req.body;
    const sql = "INSERT INTO tasks (title, status) VALUES (?, ?)";

    db.query(sql, [title, status], (err, result) => {
        if (err) {
            console.error("Error adding task:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        res.status(200).json({
            message: "Task added successfully",
            taskId: result.insertId,
        });
    });
});

app.put("/tasks/:id", (req, res) => {
    const taskId = req.params.id;
    const { title, status } = req.body;
    const sql = "UPDATE tasks SET title = ?, status = ? WHERE id = ?";

    db.query(sql, [title, status, taskId], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.json({ message: "Task updated successfully" });
    });
});

app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM tasks WHERE id = ?";

    db.query(sql, [id], (err) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        res.status(200).json({ message: "Task deleted successfully", id });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
