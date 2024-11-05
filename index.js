// run with :: node index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const MONGODB_URI = 'mongodb://localhost/employeeDB';

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB.");
        seedEmployees(); // Seed the database with sample data on start
    })
    .catch((error) => console.error("Could not connect to MongoDB:", error));

// Employee Schema
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
    salary: { type: Number, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

// Function to seed the database with sample data
async function seedEmployees() {
    const count = await Employee.countDocuments();
    if (count === 0) {
        const sampleEmployees = [
            { name: "Siva1", position: "Software Engineer", department: "IT", salary: 70000 },
            { name: "Siva2", position: "Project Manager", department: "Operations", salary: 85000 },
            { name: "Siva3", position: "HR Specialist", department: "Human Resources", salary: 65000 },
            { name: "Siva4", position: "Accountant", department: "Finance", salary: 60000 },
            { name: "Siva5", position: "Marketing Manager", department: "Marketing", salary: 78000 }
        ];
        await Employee.insertMany(sampleEmployees);
        console.log("Sample employees added to the database.");
    } else {
        console.log("Database already contains employee data.");
    }
}

// Routes

// Create a new employee
app.post('/api/employees', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all employees
// http://localhost:3000/api/employees
console.log("API::\n\n http://localhost:3000/api/employees \n\n");
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single employee by ID
app.get('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an employee by ID
app.put('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.status(200).json(employee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete an employee by ID
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) return res.status(404).json({ error: 'Employee not found' });
        res.status(200).json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
