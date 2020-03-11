const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Employee = require("./Assets/script");
let sortedList;
let alphabetized;
let roles = [];
let departments = [];


const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password:  "",
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
  connection.query(`SELECT role.title FROM role`)
}

// function getRoles() {
//   connection.query(`SELECT role.title FROM role`, (err, res) => {
//     if (err) throw err;
//     console.log(res)
//   });
// }

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

function findIndex(array, searchFor) {
  return 
}

function listManagers() {
  const managerList = [];
  managerList.push("None");
  sortedList.map(emp => {managerList.push(emp.first_name+" "+emp.last_name)})
  return managerList;
};

function init() {
  generateAll();
  gatherRoles();
  gatherDepartments();
  // console.log(firstQuestion[0].choices);
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
        const addQuestions = [{
          message: "What is the employee's first name?",
          name: "addFirst"
        },{
          message: "What is the employee's last name?",
          name: "addLast"
        },{
          type: "list",
          message: "What is the employee's role?",
          name: "addRole",
          choices: roles.map(role => {return `${role.title}`})
        },{
          type: "list",
          message: "Who is the employee's manager?",
          name: "addManager",
          choices: listManagers()
        }];
        inquirer.prompt(addQuestions).then(ans => {
          if (ans.addManager !== "None") {
            let managerSplit = ans.addManager.split(" ");
            connection.query(`SELECT role.id FROM role WHERE ?`, {"role.title":ans.addRole}, (err, res1) => {
              if (err) throw err;
              // console.log(res1[0].id);
              connection.query("SELECT employee.id FROM employee WHERE ? AND ?", [{"employee.first_name":managerSplit[0]}, {"employee.last_name":managerSplit[1]}], (err, res2) => {
                if (err) throw err;
                // console.log(res2[0].id)
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${ans.addFirst}", "${ans.addLast}", ${res1[0].id}, ${res2[0].id})`, (err, res3) => {
                  if (err) throw err;
                  init();
                });
              });
            })
          } else {
            connection.query(`SELECT role.id FROM role WHERE ?`, {"role.title":ans.addRole}, (err, res1) => {
              if (err) throw err;
              connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${ans.addFirst}", "${ans.addLast}", ${res1[0].id}, null)`, (err, res3) => {
                if (err) throw err;
                init();
              });
            });
          }
        })
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
          connection.query(`DELETE FROM employee WHERE id = ${split[1]}`, err => {
            if (err) throw err;
            init();
          });
        });
        break;
      case "Update Employee Role":
        const updateRoleQuestion = [{
          type: "list",
          message: "Which employee's role do you want to update?",
          name: "roleUpdate",
          choices: sortedList.map(emp => {return "ID: "+emp.id+" - "+emp.first_name+" "+emp.last_name})
        },{
          type: "list",
          message: "What is the new role you want to assign for the selected employee?",
          name: "updatedRole",
          choices: roles.map(role => {return role.title})
        }];
        inquirer.prompt(updateRoleQuestion).then(ans => {
          const split = ans.roleUpdate.split(" ");
          // console.log(split[1]);
          connection.query(`SELECT role.id FROM role WHERE ?`, {"title":ans.updatedRole}, (err, res1) => {
            if (err) throw err;
            // console.log(res1[0].id)
            connection.query(`UPDATE employee SET role_id=${res1[0].id} WHERE ?`, {"id":split[1]}, err => {
              if (err) throw err;
              init();
            })
          });
        })
        break;
      case "Update Employee Manager":
        // let newManagerList = [];
        const updateManagerQuestion = [{
          type: "list",
          message: "Which employee's manager do you want to update?",
          name: "managerUpdate",
          choices: sortedList.map(emp => {return "ID: "+emp.id+" - "+emp.first_name+" "+emp.last_name})
        }];
        inquirer.prompt(updateManagerQuestion).then(ans => {
          const split = ans.managerUpdate.split(" ");
          const index = sortedList.findIndex(x => x.id ===parseInt(split[1]));
          // console.log(index);
          const removed = sortedList.splice(index, 1);
          console.log(sortedList);
        // connection.query(`SELECT employee.id FROM employee WHERE`)
          const secondManagerQuestion = [{
            type: "list",
            message: "Which employee do you want to set as manager for the selected employee?",
            name: "newManager",
            choices: sortedList.map(emp => {return "ID: "+emp.id+" - "+emp.first_name+" "+emp.last_name})
          }];
          inquirer.prompt(secondManagerQuestion).then(ans2 => {
            const split2 = ans2.newManager.split(" ");
            connection.query(`UPDATE employee SET manager_id=${split2[1]} WHERE id=${split[1]}`, err => {
              if (err) throw err;
              init();
            })
          })
        });
        // inquirer.prompt(updateRoleQuestion).then(ans => {
        //   const split = ans.roleUpdate.split(" ");
        //   // console.log(split[1]);
        //   connection.query(`SELECT role.id FROM role WHERE ?`, {"title":ans.updatedRole}, (err, res1) => {
        //     if (err) throw err;
        //     // console.log(res1[0].id)
        //     connection.query(`UPDATE employee SET role_id=${res1[0].id} WHERE ?`, {"id":split[1]}, err => {
        //       if (err) throw err;
        //       init();
        //     })
        //   });
        // })
        break;
      case "View All Roles":
        roles.map(role => {console.log(role.title)});
        init();
        break;
      case "Add Role":
        // console.log(departments);
        // console.log(departments[1].name);
        const addRoleQuestion = [{
          message: "What role would you like to create?",
          name: "newRole",
        },{
          message: "What is the salary for this role?",
          name: "newSalary"
        },{
          type: "list",
          message: "In which department is this role?",
          name: "inDepartment",
          choices: departments.map(department => {return department.name})
          // ortedList.map(emp => {return "ID: "+emp.id+" - "+emp.first_name+" "+emp.last_name})
        }];
        inquirer.prompt(addRoleQuestion).then(ans => {
          connection.query(`SELECT department.id FROM department WHERE department.name="${ans.inDepartment}"`, (err, res) => {
            // console.log(res[0].id)
            let newIndex;
            connection.query(`SELECT role.id FROM role`, (err, res2) => {
              if (err) throw err;
              newIndex = res2[res2.length-1].id+1;
              connection.query(`INSERT INTO role (id, title, salary, department_id) VALUES (${newIndex}, "${ans.newRole}", ${ans.newSalary}, ${res[0].id})`, err => {
                if (err) throw err;
                init();
              });
            });
          });
        })
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

function gatherRoles() {
  connection.query(`SELECT role.title FROM role`, (err, res) => {
    if (err) throw err;
    res.map(role => {
      roles.push(role)
    })
  })
};

function gatherDepartments() {
  connection.query(`SELECT department.name FROM department`, (err, res) => {
    if (err) throw err;
    res.map(department => {
      departments.push(department)
    })
  })
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