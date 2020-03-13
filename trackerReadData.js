const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Employee = require("./Assets/script");
require('dotenv').config();
let sortedList;
let alphabetized;
let roles = [];
let departments = [];


const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password:  process.env.DB_PASS,
  database: "employeeTrackerDB"
});

const firstQuestion = [{
  type: "list",
  message: "What would you like to do?",
  name: "whatToDo",
  choices: ["View...", "Add...", "Remove...", "Update...", "Update Employee Manager", "View All Roles", "Remove Role", "QUIT"]
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
  roles = [];
  departments = [];
  generateAll();
  gatherRoles();
  gatherDepartments();
  // console.log(firstQuestion[0].choices);
  inquirer
  .prompt(firstQuestion).then(ans => {
    switch (ans.whatToDo) {
      case "View...":
        const viewWhatQuestion = [{
          type: "list",
          message: "What would you like to view?",
          name: "viewWhat",
          choices: ["All Employees", "All Employees By Department", "All Employees By Manager", "All Departments", "All Roles", "GO BACK"]
        }];
        inquirer.prompt(viewWhatQuestion).then(ans => {
          switch (ans.viewWhat) {
            case viewWhatQuestion[0].choices[0]:
              display(sortedList);
              init();
              break;
            case viewWhatQuestion[0].choices[1]:
              alphabetized = sortedList;
              sorter(alphabetized, "department");
              display(alphabetized);
              init();
              break;
            case viewWhatQuestion[0].choices[2]:
              alphabetized = sortedList;
              sorter(alphabetized, "manager");
              display(alphabetized);
              init();
              break;
            case viewWhatQuestion[0].choices[3]:
              alphabetized = departments;
              sorter(alphabetized, "name");
              display(alphabetized);
              init();
              break;
            case viewWhatQuestion[0].choices[4]:
              alphabetized = roles;
              sorter(alphabetized, "title");
              display(alphabetized);
              init();
              break;
            case viewWhatQuestion[0].choices[5]:
              init();
              break;
            default:
              return undefined;
          };
        });
        break;
      case "Add...":
        const addQuestions = [{
          type: "list",
          message: "What would you like to add?",
          name: "addWhich",
          choices: ["Employee", "Role", "Department", "GO BACK"]
        }];
        inquirer.prompt(addQuestions).then(ans => {
          switch (ans.addWhich) {
            case "Employee":
              const addEmployeeQuestions = [{
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
              inquirer.prompt(addEmployeeQuestions).then(ans => {
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
            case "Role":
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
                    connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${ans.newRole}", ${ans.newSalary}, ${res[0].id})`, err => {
                      if (err) throw err;
                      init();
                    });
                  });
                });
              break;
            case "Department":
              const addDepartmentQuestion = [{
                message: "What department would you like to create?",
                name: "newDepartment",
              }];
              inquirer.prompt(addDepartmentQuestion).then(ans => {
                connection.query(`INSERT INTO department (name) VALUES ("${ans.newDepartment}")`, err => {
                  if (err) throw err;
                  init();
                });
              });
              break;
            case "GO BACK":
              init();
              break;
            default:
              return undefined;
          }
        });
        break;
      case "Remove...":
        const removeQuestion = [{
          type: "list",
          message: "What do you want to remove?",
          name: "removeWhat",
          choices: ["Employee", "Role", "Department", "GO BACK"]
        }];
        inquirer.prompt(removeQuestion).then(ans => {
          // console.log(ans.removeWhich);
          // console.log(ans);
          switch (ans.removeWhat) {
            case removeQuestion[0].choices[0]:
              const removeEmpQuestion = [{
                type: "list",
                message: "Which employee do you want to remove?",
                name: "employeeToRemove",
                choices: sortedList.map(emp => {return "ID: "+emp.id+" - "+emp.first_name+" "+emp.last_name})
              }]
              inquirer.prompt(removeEmpQuestion).then(ans => {
                const split = ans.employeeToRemove.split(" ");
                connection.query(`DELETE FROM employee WHERE id = ${split[1]}`, err => {
                  if (err) throw err;
                  init();
              });
              })
              break;
            case removeQuestion[0].choices[1]:
              const removeRoleQuestion = [{
                type: "list",
                message: "Which role do you want to remove",
                name: "roleToRemove",
                choices: roles.map(role => {return role.title})
              }];
              inquirer.prompt(removeRoleQuestion).then(ans => {
                connection.query(`SELECT employee.id FROM role INNER JOIN employee ON role.id=employee.role_id AND role.title="${ans.roleToRemove}"`, (err, res) => {
                  if (err) throw err;
                  // console.log(res[0].id)
                  res.map(emp => {
                    connection.query(`UPDATE employee SET role_id=null WHERE id=${emp.id}`, err => {
                      if (err) throw err;
                    })
                  })
                  connection.query(`DELETE FROM role WHERE title = "${ans.roleToRemove}"`, err => {
                    if (err) throw err;
                    init();
                  })
                })
              });
              break;
            case removeQuestion[0].choices[2]:
              const removeDeptQuestion = [{
                type: "list",
                message: "Which department do you want to remove?",
                name: "deptToRemove",
                choices: departments.map(dept => {return dept.name})
              }];
              inquirer.prompt(removeDeptQuestion).then(ans =>{
                connection.query(`SELECT role.id FROM department INNER JOIN role ON department.id=role.department_id AND department.name="${ans.deptToRemove}"`, (err, res) => {
                  if (err) throw err;
                  // console.log(res[0].id)
                  res.map(role => {
                    connection.query(`UPDATE role SET department_id=null WHERE id=${role.id}`, err => {
                      if (err) throw err;
                    })
                  })
                  connection.query(`DELETE FROM department WHERE name = "${ans.deptToRemove}"`, err => {
                    if (err) throw err;
                    init();
                  })
                })
              })
              break;
            case "GO BACK":
              init();
              break;
            default:
              return undefined;
          }
        });
        break;
      case "Update...":
        const updateQuestion = [{
          type: "list",
          message: "What would you like to update?",
          name: "whatToUpdate",
          choices: ["Employee's Role", "Employee's Manager", "Role's Department", "GO BACK"]
        }];
        inquirer.prompt(updateQuestion).then(ans => {
          switch (ans.whatToUpdate) {
            case updateQuestion[0].choices[0]:
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
            case updateQuestion[0].choices[1]:
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
              break;
            case updateQuestion[0].choices[2]:
              const updateDepartmentQuestion = [{
                type: "list",
                message: "For which role do you want to update the department?",
                name: "DeptToUpdate",
                choices: roles.map(role => {return role.title})
              }];
              inquirer.prompt(updateDepartmentQuestion).then(ans => {
                connection.query(`SELECT department.name FROM department LEFT JOIN role ON department.id=role.department_id WHERE role.title="${ans.DeptToUpdate}"`, (err, res) => {
                  if (err) throw err;
                  // console.log("REEEEEEES: "+res[0].name);
                  const index = departments.findIndex(x => x.name === res[0].name);
                  // console.log(ans.DeptToUpdate);
                  // console.log(departments);
                  // console.log(index);
                  const removed = departments.splice(index, 1);
                  // console.log(departments);
                // connection.query(`SELECT employee.id FROM employee WHERE`)
                  const secondDepartmentQuestion = [{
                    type: "list",
                    message: "Which department do you want to switch the role into?",
                    name: "updatedDepartment",
                    choices: departments.map(dept => {return dept.name})
                  }];
                  inquirer.prompt(secondDepartmentQuestion).then(ans2 => {
                    // const split2 = ans2.newManager.split(" ");
                    connection.query(`SELECT department.id FROM department WHERE department.name="${ans2.updatedDepartment}"`, (err, res2) => {
                      if (err) throw err;
                      // console.log(res[0].id);
                      connection.query(`UPDATE role SET department_id=${res2[0].id} WHERE title="${ans.DeptToUpdate}"`, err => {
                        if (err) throw err;
                        init();
                      });
                    });                  
                  })
                });
              })
              break;
            case "GO BACK":
              init();
              break;
            default:
              return undefined;
          }
        })

        // let newManagerList = [];
        
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
      // case "View All Roles":
      //   roles.map(role => {console.log(role.title)});
      //   init();
      //   break;
      // case "Remove Role":
      //   const removeRoleQuestion = [{
      //     type: "list",
      //     message: "Which role do you want to remove",
      //     name: "roleToRemove",
      //     choices: roles.map(role => {return role.title})
      //   }];
      //   inquirer.prompt(removeRoleQuestion).then(ans => {
      //     connection.query(`SELECT employee.id FROM role INNER JOIN employee ON role.id=employee.role_id AND role.title="${ans.roleToRemove}"`, (err, res) => {
      //       if (err) throw err;
      //       // console.log(res[0].id)
      //       res.map(emp => {
      //         connection.query(`UPDATE employee SET role_id=null WHERE id=${emp.id}`, err => {
      //           if (err) throw err;
      //         })
      //       })
      //       connection.query(`DELETE FROM role WHERE title = "${ans.roleToRemove}"`, err => {
      //         if (err) throw err;
      //         init();
      //       })
      //     })
      //   });
      //   break;
      case "Add department":
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
  connection.query(`SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, role.salary, employee.manager_id FROM employee LEFT JOIN role ON employee.role_id=role.id OR employee.role_id=null`, (err, res1) => {
    if (err) throw err;
    res1.map(emp => {
      const genEmp = new Employee(emp.id, emp.first_name, emp.last_name, emp.title, null, emp.salary, null);
      connection.query(`SELECT department.name FROM role INNER JOIN department ON role.department_id=department.id AND role.id=${emp.role_id}`, (err, res2) => {
        if (err) throw err;
        // console.log(res2[0])
        // console.log("dep: "+ res2[0].name)
        if (res2[0] !== undefined) {
          genEmp.department = res2[0].name;
        // console.log(genEmp);
        };
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