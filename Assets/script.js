//  need a require thing here to bring in the table info for manager info

class Employee {
  constructor(id, first_name, last_name, title, salary) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.title = title;
    this.department;
    this.salary = salary;
    this.manager;

  }
//   getFirstName() {
//     return this.first_name;
//   }
//   getLastName() {
//     return this.last_name;
//   }
//   getFullName() {
//     return `${this.first_name} ${this.last_name}`
//   }
//   getId() {
//     return this.id;
//   }
//   getRole() {
//     const role = this.role_id;
//     //  Here I need to find out which role id matches role, then return role.title
// // SELECT * FROM employeeTrackerDB WHERE role.id = role

//     // switch (role) {
//     //  case 1: 
//     //   return "Sales Lead";  
//     //  case 2: 
//     //   return "Salesperson";
//     //  case 3: 
//     //   return "Lead Engineer";
//     //  case 4:
//     //   return "Software Engineer";
//     //  case 5:
//     //   return "Accountant";
//     //  case 6:
//     //   return "Legal Team Lead";
//     //  case 7:
//     //   return "Lawyer";
//     //  default:
//     //   return undefined;
//     // }
//   }
//   getManager() {
//         const manager = this.manager_id;

// //  Here I need to find out which employee's id matches manager, then return manager.getFullName
// // SELECT * FROM employeeTrackerDB WHERE employee.id = manager

//         // for (let i =0; i < TACO.length; i++) {  //  TACO here needs to be replaced with a reference from the tables to the length of employee ids.
//         // if (manager === null) {
//         //   return null
//         // } else if (manager === TACO ) { //TUESDAY here needs to be replaced with a reference to the name of the employee who's id matches
//         //   return TUESDAY 
//         // }}
//   }
}

module.exports = Employee// This is where I enter objects for exporting