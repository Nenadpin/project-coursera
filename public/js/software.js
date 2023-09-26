const employeeList = document.getElementById("employees");
const departmentList = document.getElementById("departments");
const lista = document.getElementById("list");
const total = document.getElementById("total");
const departmentSelect = document.getElementById("departmentSelect");
const details = document.getElementsByClassName("details")[0];
const dept_details = document.getElementsByClassName("dept-details")[0];
const dept_employees = document.getElementById("dept-employees");
const dept_caption = document.getElementById("dept-caption");
const emplName = document.getElementById("name");
const emplSurname = document.getElementById("surname");
const saveEmpl = document.getElementById("saveEmpl");
const delEmpl = document.getElementById("delEmpl");
const saveDept = document.getElementById("saveDept");
const delDept = document.getElementById("delDept");
const dep_title = document.getElementById("dept-title");

let singleEmployee, singleDepartment;
const URI = `${clientConfig.SERVER_URL}`;
let allEmpl = [],
  allDepts = [];
let operation = 0;

const allEmployees = async () => {
  try {
    const data = await fetch(`${URI}/allEmployees`);
    const allData = await data.json();
    return allData;
  } catch (error) {
    console.log(error);
    alert("Server error, can't read data...");
  }
};
const allDepartments = async () => {
  try {
    const data = await fetch(`${URI}/allDepartments`);
    const allData = await data.json();
    return allData;
  } catch (error) {
    console.log(error);
    alert("Server error, can't read data...");
  }
};
const start = async () => {
  allEmpl = await allEmployees();
  allDepts = await allDepartments();
};
start();
const populate = () => {
  if (departmentSelect.childElementCount === 1) {
    allDepts.forEach((d) => {
      const option = document.createElement("option");
      option.value = d.caption;
      option.text = d.caption;
      departmentSelect.appendChild(option);
    });
  }
};

const addEmployee = async () => {
  emplName.value = "";
  emplSurname.value = "";
  departmentSelect.selectedIndex = 0;
  delEmpl.innerText = "Cancel";
  saveEmpl.innerText = "Add Employee";
  dept_details.style.height = 0;
  details.style.height = "400px";
  saveEmpl.innerText = "Add Employee";
  delEmpl.innerText = "Cancel";
};

const addDepartment = async () => {
  dept_caption.value = "";
  delEmpl.innerText = "Cancel";
  saveEmpl.innerText = "Add Department";
  details.style.height = 0;
  dept_details.style.height = "400px";
  dept_employees.innerText = "";
  dep_title.innerText = "New Department";
  saveDept.innerText = "Add Department";
  delDept.innerText = "Cancel";
};

employeeList.addEventListener("click", () => {
  if (allEmpl.length) {
    operation = 1;
    dept_details.style.height = 0;
    lista.innerHTML = "";
    allEmpl.map((empl, index) => {
      const newItem = document.createElement("li");
      newItem.textContent = `${index + 1}. ${empl.name} ${empl.surname}`;
      lista.appendChild(newItem);
      total.innerHTML = `<p>Total number of employees is ${allEmpl.length}. <span>Add employee</span></p>`;
    });
    document
      .getElementsByTagName("span")[0]
      .removeEventListener("click", addDepartment);
    document
      .getElementsByTagName("span")[0]
      .addEventListener("click", addEmployee);
    emplName.value = "";
    emplSurname.value = "";
    departmentSelect.selectedIndex = 0;
    populate();
  }
});

departmentList.addEventListener("click", () => {
  if (allDepts.length) {
    operation = 2;
    details.style.height = 0;
    lista.innerHTML = "";
    allDepts.map((dept, index) => {
      const newItem = document.createElement("li");
      newItem.textContent = `${index + 1}. ${dept.caption}`;
      lista.appendChild(newItem);
    });
    total.innerHTML = `<p>Total number of departments is ${allDepts.length}. <span>Add department</span></p>`;
    document
      .getElementsByTagName("span")[0]
      .removeEventListener("click", addEmployee);
    document
      .getElementsByTagName("span")[0]
      .addEventListener("click", addDepartment);
    dept_caption.value = "";
  }
});

lista.addEventListener("click", (e) => {
  if (operation === 1) {
    singleEmployee = allEmpl[parseInt(e.target.textContent.split(".")[0]) - 1];
    details.style.height = "400px";
    dept_details.style.height = 0;
    emplName.value = singleEmployee.name;
    emplSurname.value = singleEmployee.surname;
    departmentSelect.value = singleEmployee.dept;
    saveEmpl.innerText = "Save";
    delEmpl.innerText = "Delete";
  } else if (operation === 2) {
    singleDepartment =
      allDepts[parseInt(e.target.textContent.split(".")[0]) - 1];
    details.style.height = 0;
    dept_details.style.height = "100%";
    dep_title.innerText = "Employees in department:";
    dept_employees.innerText = "";
    allEmpl.map((emp) => {
      if (emp.dept === e.target.textContent.split(".")[1].trim()) {
        dept_employees.innerText += `- ${emp.name} ${emp.surname}\n`;
      }
      dept_caption.value = singleDepartment.caption;
    });
    saveDept.innerText = "Save";
    delDept.innerText = "Delete";
  }
});

const submitAddDepartment = async () => {
  if (dept_caption.value) {
    const newDepartment = {
      caption: dept_caption.value,
    };
    const result = await fetch(`${URI}/new_department`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDepartment),
    });
    const retsultData = await result.json();
    if (retsultData.message === "success") {
      newDepartment._id = retsultData._id;
      allDepts.push(newDepartment);
      while (departmentSelect.options.length > 1) {
        departmentSelect.remove(1);
      }
      populate();
      alert("New department added!");
      departmentList.click();
    } else alert("error creating new record...");
  }
};

const submitUpdateDepartment = async () => {
  if (singleDepartment._id) {
    const newDepartment = {
      id: singleDepartment._id,
      caption: dept_caption.value,
    };
    const oldCaption = singleDepartment.caption;
    const result = await fetch(`${URI}/edit_department`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDepartment),
    });
    const retsultData = await result.json();
    if (retsultData.message === "success") {
      alert("Successfull update!");
      allDepts.map((d) => {
        if (d._id === singleDepartment._id) d.caption = newDepartment.caption;
      });
      while (departmentSelect.options.length > 1) {
        departmentSelect.remove(1);
      }
      populate();
      allEmpl.map((e) => {
        if (e.dept === oldCaption) e.dept = dept_caption.value;
      });
      departmentList.click();
    } else alert(retsultData.message);
  }
};
const submitDeleteDepartment = async () => {
  if (singleDepartment._id) {
    const result = await fetch(`${URI}/del_department`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: singleDepartment._id }),
    });
    const retsultData = await result.json();
    if (retsultData.message === "success") {
      allDepts = allDepts.filter((e) => e._id !== singleDepartment._id);
      alert("Department deleted!");
      while (departmentSelect.options.length > 1) {
        departmentSelect.remove(1);
      }
      populate();
      dept_caption.value = "";
      departmentList.click();
    } else alert(retsultData.message);
  }
};
const submitAddEmployee = async () => {
  if (
    emplName.value &&
    emplSurname.value &&
    departmentSelect.selectedIndex !== 0
  ) {
    const newEmployee = {
      name: emplName.value,
      surname: emplSurname.value,
      dept: departmentSelect.value,
    };
    const result = await fetch(`${URI}/new_employee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEmployee),
    });
    const retsultData = await result.json();
    if (retsultData.message === "success") {
      newEmployee._id = retsultData._id;
      allEmpl.push(newEmployee);
      alert("New employee added!");
      employeeList.click();
    } else alert("error creating new record...");
  }
};

const submitUpdateEmployee = async () => {
  if (singleEmployee._id) {
    const newEmployee = {
      id: singleEmployee._id,
      name: emplName.value,
      surname: emplSurname.value,
      dept: departmentSelect.value,
    };
    const result = await fetch(`${URI}/edit_employee`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEmployee),
    });
    const retsultData = await result.json();
    if (retsultData.message === "success") {
      alert("Successfull update!");
      allEmpl.map((e) => {
        if (e._id === singleEmployee._id) {
          e.name = emplName.value;
          e.surname = emplSurname.value;
          e.dept = departmentSelect.value;
        }
      });
      employeeList.click();
    } else alert(retsultData.message);
  }
};
const submitDeleteEmployee = async () => {
  if (singleEmployee._id) {
    const result = await fetch(`${URI}/del_employee`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: singleEmployee._id }),
    });
    const retsultData = await result.json();
    if (retsultData.message === "success") {
      allEmpl = allEmpl.filter((e) => e._id !== singleEmployee._id);
      alert("Employee deleted!");
      emplName.value = "";
      emplSurname.value = "";
      departmentSelect.selectedIndex = 0;
      employeeList.click();
    } else alert(retsultData.message);
  }
};
const save_add_empl = () => {
  if (saveEmpl.innerText === "Add Employee") submitAddEmployee();
  else if (saveEmpl.innerText === "Save") submitUpdateEmployee();
};
const delete_cancel_empl = () => {
  if (delEmpl.innerText === "Cancel") {
    emplName.value = "";
    emplSurname.value = "";
    departmentSelect.selectedIndex = 0;
  } else if (delEmpl.innerText === "Delete") submitDeleteEmployee();
};
const save_add_dept = () => {
  if (saveDept.innerText === "Add Department") submitAddDepartment();
  else if (saveDept.innerText === "Save") submitUpdateDepartment();
};
const delete_cancel_dept = () => {
  if (delDept.innerText === "Cancel") {
    dept_caption.value = "";
  } else if (delDept.innerText === "Delete") submitDeleteDepartment();
};
