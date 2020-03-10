const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Employee = require("./Assets/script");
let sortedList;
let alphabetized;

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password:  "Spackle123",
  database: "employeeTrackerDB"
});

const firstQuestion = [{
  type: "list",
  message: "What would you like to do?",
  name: "whatToDo",
  choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "View All Roles", "Add Role", "Remove Role", "QUIT"]
}]

connection.connect(err => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  //  here I run whatever functions I need to get going to initiate everything.
  //  need to end connection with last function. --  connection.end()
  // getThatRole();
  init();
});

function getThatRole() {
  connection.query("")
}

function sorter(sorted, sortBy) {
  sorted.sort((a, b) => {
    if (a[sortBy] !== null && b[sortBy] !== null) {
    var x = a[sortBy].toLowerCase();
    var y = b[sortBy].toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
    } else {
      return -1
    }
  });
}

function init() {
  generateAll();
  inquirer
  .prompt(firstQuestion).then(ans => {
    switch (ans.whatToDo) {
      case "View All Employees": 
        display(sortedList);
        init();
        break;
      case "View All Employees By Department":
        alphabetized = sortedList;
        sorter(alphabetized, "department");
        display(alphabetized);
        init();
        break;
      case "View All Employees By Manager":
        alphabetized = sortedList;
        sorter(alphabetized, "manager");
        display(alphabetized);
        init();
        break;
      case "Add Employee":
        break;
      case "Remove Employee":
        const removeQuestion = [{
          type: "list",
          message: "Which employee do you want to remove?",
          name: "removeWhich",
          choices: sortedList.map(emp => {return "ID: "+emp.id+" - "+emp.first_name+" "+emp.last_name})
        }];
        inquirer.prompt(removeQuestion).then(ans => {
          // console.log(ans.removeWhich);
          // console.log(ans);
          const split = ans.removeWhich.split(" ");
          connection.query(`DELETE FROM employee WHERE id = ${split[1]}`);
          init();
        });
        break;
      case "Update Employee Role":
        break;
      case "Update Employee Manager":
        break;
      case "View All Roles":
        break;
      case "Add Role":
        break;
      case "Remove Role":
        break;
      case "QUIT":
        connection.end();
        break;
     default:
      return undefined;
    }
  })
}

function display(displayed) {
  console.table(displayed);
};

function generateAll() {
  sortedList = [];
  connection.query(`SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, role.salary, employee.manager_id FROM employee INNER JOIN role ON employee.role_id=role.id`, (err, res1) => {
    if (err) throw err;
    res1.map(emp => {
      const genEmp = new Employee(emp.id, emp.first_name, emp.last_name, emp.title, null, emp.salary, null);
      connection.query(`SELECT department.name FROM role INNER JOIN department ON role.department_id=department.id AND role.id=${emp.role_id}`, (err, res2) => {
        if (err) throw err;
        // console.log("dep: "+ res2[0].name)
        genEmp.department = res2[0].name;
        // console.log(genEmp);
      });
      connection.query(`SELECT employee.first_name, employee.last_name FROM employee WHERE employee.id=${emp.manager_id}`, (err, res2) => {
        if (err) throw err;
        if (res2.length > 0) {
        // console.log(res2[0].first_name)
        genEmp.manager = res2[0].first_name+" "+res2[0].last_name;
        }
        sortedList.push(genEmp);
        if (res1.length === sortedList.length) {
          sortedList.sort((a, b) => {return a.id - b.id});
          
          // console.table(sortedList);
          };
      });
      // console.log(`${counter} || ${res1.length} `)

    });
    // console.log(res1[4].manager_id);
    // res1.map(emp => {
    //   counter++;
    //   const genEmp = new Employee(emp.id, emp.first_name, emp.last_name, emp.title, emp.salary);
    //   console.log(`counterinside0: ${counter}`);
    //   connection.query(`SELECT employee.first_name, employee.last_name FROM employee WHERE employee.id=${emp.manager_id}`, (err, res2) => {
    //     if (err) throw err;
    //     if (res2.length > 0) {
    //     // console.log(res2[0].first_name)
    //     genEmp.manager = res2[0].first_name+" "+res2[0].last_name;
    //     console.log(`counterinside1: ${counter}`);
    //     }
    //   })
    //   console.log(`counterOUTSIDE: ${counter}`);
    //   connection.query(`SELECT department.name FROM role INNER JOIN department ON role.department_id=department.id AND role.id=${emp.role_id}`, (err, res2) => {
    //     if (err) throw err;
    //     // console.log("dep: "+ res2[0].name)
    //     genEmp.department = res2[0].name;
    //     // console.log(genEmp);
    //     sortedList.push(genEmp);
    //     console.log(`counterinside2: ${counter}`);
    //   });
    //   console.log(`counter:  ${counter} | res1.length:  ${res1.length}`);
    //   if (counter === res1.length) {
    //     console.log(sortedList);
    //     };
    // });

    // console.log(res1);

    // SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id 
    // FROM employee INNER JOIN role ON employee.role_id=role.id
    
    // SELECT employee.first_name, employee.last_name FROM employee WHERE employee.id=res1[5];
    
    // SELECT department.name FROM role INNER JOIN department ON role.department_id=department.id;

    // console.log(res);
    // console.log(JSON.stringify(res[0]));
  // console.log(res.length);
  
// here I want to bring in the response, format the response to an array of objects with manager's names, salaries, departments, titles so I can use it for my table.
                      // let sortedList = [];
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
  });

}