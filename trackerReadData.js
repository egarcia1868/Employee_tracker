const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Employee = require("./Assets/script")

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password:  "",
  database: "employeeTrackerDB"
});

connection.connect(err => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  //  here I run whatever functions I need to get going to initiate everything.
  //  need to end connection with last function. --  connection.end()
  // getThatRole();
  displayAll();
});

function getThatRole() {
  connection.query("")
}

function displayAll() {
  let formattedRes = [];
  connection.query(`SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, role.salary, employee.manager_id FROM employee INNER JOIN role ON employee.role_id=role.id`, (err, res1) => {
    if (err) throw err;
    // console.log(res1[4].manager_id);
    res1.map(emp => {
      const genEmp = new Employee(emp.id, emp.first_name, emp.last_name, emp.title, emp.salary);
      connection.query(`SELECT employee.first_name, employee.last_name FROM employee WHERE employee.id=${emp.manager_id}`, (err, res2) => {
        if (err) throw err;
        if (res2.length > 0) {
        // console.log(res2[0].first_name)
        genEmp.manager = res2[0].first_name+" "+res2[0].last_name;
        }
      })
      connection.query(`SELECT department.name FROM role INNER JOIN department ON role.department_id=department.id AND role.id=${emp.role_id}`, (err, res2) => {
        if (err) throw err;
        // console.log("dep: "+ res2[0].name)
        genEmp.department = res2[0].name;
        console.log(genEmp);
      })
      formattedRes.push(genEmp);
    })
    console.log(formattedRes);  
    // console.log(res1);

    // SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id 
    // FROM employee INNER JOIN role ON employee.role_id=role.id
    
    // SELECT employee.first_name, employee.last_name FROM employee WHERE employee.id=res1[5];
    
    // SELECT department.name FROM role INNER JOIN department ON role.department_id=department.id;

    // console.log(res);
    // console.log(JSON.stringify(res[0]));
  // console.log(res.length);
  
// here I want to bring in the response, format the response to an array of objects with manager's names, salaries, departments, titles so I can use it for my table.
                      // let formattedRes = [];
                      // res.map(emp => {
                      //   const genEmp = new Employee(emp.id, emp.first_name, emp.last_name);
                      //   connection.query("SELECT * FROM employee", (err, res) => {
                      //     if (err) throw err;
                          
                      // });
    // for (let i=0;i<res.length;i++) {
    //   function emp
    // }
    // console.table([
    //   {
    //     id: 'temp',

    //   }
    // ]);
  connection.end();
  });
}