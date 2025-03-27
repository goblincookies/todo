import "./assets/style.css";
import { Task, Project, Converter } from "./assets/modules/DATAmanager";
import { PageBuilder } from "./assets/modules/HTMLbuilder";
import { DragToReorder } from "./assets/modules/Interactions";

const pageBuilder = new PageBuilder();
const project = new Project();
const converter = new Converter();
const dragManager = new DragToReorder();

let leftSec;
let taskList;
let grid;

function setup () {
    // const taskBuilder = new TaskBuilder();
    console.log("setup")
    // dragManager.UL()
    const content = document.getElementById("content");
    content.appendChild( pageBuilder.getHTML_ProjectPage() );
    leftSec = document.getElementById( "left" );
    taskList = document.getElementById( "task-list" );
    grid = document.getElementById("grid");
    // leftSec = document.getElementById( "left" );
    const newTask = document.getElementById( "new-task" );
    
    // NOT REGISTERING FOR SOME REASON!!
    newTask.addEventListener("click", createNewTask );
}

// const dateSec = document.getElementById( "date" );
// const hourSec = document.getElementById( "hour" );
// const gridSec = document.getElementById( "grid" );
// const rightSec= document.getElementById( "right" );

function createNewTask( e ) {
    console.log("new task!")
    let today = new Date();
    let startDate = new Date("0000-01-01");

    let task = new Task();
    let taskStartDate = Math.round((today-startDate)/ 60000);
    
    task.startDate = taskStartDate + Math.floor( Math.random()*200 );
    task.endDate = taskStartDate + 450 + Math.floor( Math.random()*200 ); // * Math.floor( Math.random()*15 );
    task.title = task.startDate+"";
    project.writeTask( task );
    
    taskList.appendChild( pageBuilder.getHTML_Task( task ) );
    grid.appendChild( pageBuilder.getHTML_Bar( task ) );

    dragManager.update();

    // leftSec.appendChild( pageBuilder.getHTML_Task() );

};


setup();