require("dotenv").config();
const express = require("express");
const Employee = require("./public/models/Employee");
const Department = require("./public/models/Department");
const path = require("path");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/config.js", (req, res) => {
  const clientConfig = {
    SERVER_URL: process.env.SERVER_URL,
    PORT: process.env.PORT,
  };
  res.setHeader("Content-Type", "application/javascript");
  res.send(`var clientConfig = ${JSON.stringify(clientConfig)};`);
});

app.get("/allEmployees", async (req, res) => {
  const employees = await Employee.find();
  if (!employees)
    return res.status(204).json({ message: "No employees found." });
  res.json(employees);
});
app.get("/allDepartments", async (req, res) => {
  const depts = await Department.find();
  if (!depts) return res.status(204).json({ message: "No departments found." });
  res.json(depts);
});
app.post("/new_employee", async (req, res) => {
  try {
    const newEmployee = await Employee.create({
      name: req.body.name,
      surname: req.body.surname,
      dept: req.body.dept,
    });
    res.status(201).json({ message: "success", _id: newEmployee._id });
  } catch (error) {
    console.log(error);
  }
});
app.put("/edit_employee", async (req, res) => {
  try {
    const updateResult = await Employee.updateOne(
      { _id: req.body.id },
      {
        name: req.body.name,
        surname: req.body.surname,
        dept: req.body.dept,
      }
    );
    if (updateResult.modifiedCount === 1) {
      res.status(201).json({ message: "success" });
    } else {
      res.status(404).json({ message: "Employee not updated" });
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "error" });
  }
});
app.delete("/del_employee", async (req, res) => {
  try {
    const updateResult = await Employee.deleteOne({ _id: req.body.id });
    if (updateResult.deletedCount === 1) {
      res.status(201).json({ message: "success" });
    } else {
      res.status(404).json({ message: "Employee not deleted" });
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "error" });
  }
});
app.post("/new_department", async (req, res) => {
  try {
    const newDepartment = await Department.create({
      caption: req.body.caption,
    });
    res.status(201).json({ message: "success", _id: newDepartment._id });
  } catch (error) {
    console.log(error);
  }
});
app.put("/edit_department", async (req, res) => {
  try {
    const oldData = await Department.find({ _id: req.body.id });
    const oldCaption = oldData[0].caption;
    const updateResult = await Department.updateOne(
      { _id: req.body.id },
      {
        caption: req.body.caption,
      }
    );
    if (updateResult.modifiedCount === 1) {
      await Employee.updateMany(
        { dept: oldCaption },
        { $set: { dept: req.body.caption } }
      );
      res.status(201).json({ message: "success" });
    } else {
      res.status(404).json({ message: "Department not updated" });
    }
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "error" });
  }
});
app.delete("/del_department", async (req, res) => {
  try {
    const updateResult = await Department.deleteOne({ _id: req.body.id });
    if (updateResult.deletedCount === 1) {
      res.status(201).json({ message: "success" });
    } else {
      res.status(404).json({ message: "Department not deleted" });
    }
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "error" });
  }
});

app.listen(`${PORT}`, () => {
  console.log(`server has started on port ${PORT}`);
});
