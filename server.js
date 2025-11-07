const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 3000;

app.use(express.json());

const db = new sqlite3.Database("./database/courses.db");

app.listen(port, () => {
    console.log(`Course API server running at http://localhost:${port}`);
});

// Endpoints
app.get("/api/courses", (req, res) => {
    db.all("SELECT * FROM courses", (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.get("/api/courses/:id", (req, res) => {
    const id = req.params.id;
    db.all("SELECT * FROM courses WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        } else {
            res.json(row);
        }
    });
});

app.post("/api/courses", (req, res) => {
    const { courseCode, title, credits, description, semester } = req.body;
    db.run(
        ` 
        INSERT INTO courses (courseCode, title, credits, description, semester) 
        VALUES (?, ?, ?, ?, ?) 
        `,
        [courseCode, title, credits, description, semester],
        err => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID });
            }
        }
    );
});

app.put("/api/courses/:id", (req, res) => {
    const id = req.params.id;
    const { courseCode, title, credits, description, semester } = req.body;
    db.run(
        ` UPDATE courses SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ? WHERE id = ? 
        `,
        [courseCode, title, credits, description, semester, id],
        err => {
            if (err) {
                console.log(err);
                res.status(500).json({ error: err.message });
            } else {
                res.json({ message: `Updated course with id ${id}` });
            }
        }
    );
});

app.delete("/api/courses/:id", (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM courses WHERE id = ?", [id], err => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ message: `Deleted course with id ${id}` });
        }
    });
});
