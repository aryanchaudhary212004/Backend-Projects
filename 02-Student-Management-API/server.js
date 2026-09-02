//Project 02 - Student Management API
//Milestone 1 - GET /students
//Milestone 2 - POST /students
//Milestone 3 - Validation for POST /students
//Milestone 4 - GET /students/:id
//Milestone 5 - PUT /students/:id



const express = require('express');
const app = express();

const students = [
    { 
        id: 1,
        name: 'Aryan',
        age: 22,
        major: 'ELCE'
    },
    {
        id: 2,
        name: 'Harshit',
        age: 21,
        major: 'AIML'
    }
]

app.get('/students', (req, res) => {
    res.json(students);
});

let nextId = 3;
app.use(express.json());
app.post('/students', (req, res) => {
    const { name, age, major} = req.body;

    if (!name || !age || !major) {
        return res.status(400).json({ 
            message: 'Name, age, and major are required fields.'
        })
    }
    const newStudent = {
        id: nextId++,
        name,
        age,
        major
    }
    students.push(newStudent);
    res.status(201).json(newStudent);
})

app.get('/students/:id', (req, res) => {
    const studentId = Number(req.params.id);
    const student = students.find(s => s.id === studentId);
    if (!student) {
        return res.status(404).json({ message: 'Student not found'});
    }
    res.json(student);
});

app.put('/students/:id', (req, res) => {
    const studentId = Number(req.params.id);
    const student = students.find(s => s.id === studentId);
    if (!student){
        return res.status(404).json({ message: 'Student not found'});
    }
    const {name, age, major} = req.body;
    if (!name || !age || !major) {
        return res.status(400).json({ message: 'Name, age, and major are required fields.'})
    }
    student.name = name;
    student.age = age;
    student.major = major;
    res.json(student);

})

app.delete('/students/:id', (req, res) => {
    const studentId = Number(req.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
        return res.status(404).json({ message: 'Student not found'});
    }
    students.splice(studentIndex, 1);
    res.status(200).json({ message: 'Student deleted successfully' });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
})