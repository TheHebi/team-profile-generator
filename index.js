const inquirer = require("inquirer")
const jest = require("jest")
const fs = require("fs")

// link to page creation
const generateHTML = require('./util/generateHtml');
const generateCss = require("./util/generateCss")

// team profiles
const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
let team = [];



function newMember(){
    inquirer.prompt([
        {
        type: "input",
        message: "Enter team member's Name",
        name: "name"
        },
        {
        type: "list",
        message: "Team member's role?",
        choices: ["manager","engineer", "intern"],
        name: "role"
        },
        {
            type: "input",
            message: "Team member's email?",
            name: "email"
            },
        {
        type: "input",
        message: "What is the members ID number?",
        name: "id",
        validate: function(data){
            if (isNaN(parseInt(data))){
                return "Must be number"
            }
            return true
        }
        }
    ])
    .then(function({name, role, id, email}) {
        let roleInfo = "";
        if (role === "engineer") {
            roleInfo = "GitHub username";
        } else if (role === "intern") {
            roleInfo = "school name";
        } else {
            roleInfo = "office number";
        }
        inquirer.prompt([
            {
            type:"input",
            message: `Enter team member's ${roleInfo}`,
            name: "roleInfo",
            validate: function(data){
                if(role === "manager"){
                    if(isNaN(parseInt(data))){
                        return "Must be number"
                    }
                    return true
                }
                return true
            }
            },
            {
            type: "confirm",
            message: "Would you like to add more team members?",
            name: "more"
            }
        ])
        .then(function({roleInfo, more}) {
            let teamMember;
                if(role === "manager"){
                    teamMember = new Manager(name, id, email, roleInfo)
                }else if(role === "engineer"){
                    teamMember = new Engineer(name, id, email, roleInfo)
                }else{
                    teamMember = new Intern(name, id, email, roleInfo)
                }
                team.push(teamMember)
                if(more === true){
                    newMember()
                }else{
                    let str = generateHTML(team)
                    makeHtml(str)
                }
        })
    })
}

function makeHtml(str){
    fs.writeFile('index.html', str, err=>{
       if(err) throw err
       console.log("File Written")
    })
}


function init(){
    newMember()
}

init()