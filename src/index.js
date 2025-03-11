import "./assets/style.css";
import { Task, Project } from "./assets/modules/DATAmanager";
import { PageBuilder } from "./assets/modules/HTMLbuilder";


// const taskBuilder = new TaskBuilder();
const pageBuilder = new PageBuilder();
let project = new Project();

const content = document.getElementById("content");
content.appendChild( pageBuilder.getHTML_ProjectPage() );

const leftSec = document.getElementById( "left" );
const dateSec = document.getElementById( "date" );
const hourSec = document.getElementById( "hour" );
const gridSec = document.getElementById( "grid" );
const cell = 32

window.addEventListener('resize', resize);

function resize(e) {
    let width = Math.floor(gridSec.offsetWidth / cell );
    // --cell: 32px;
    // grid-template-columns: repeat(36, var(--cell));
    gridSec.style.gridTemplateColumns = `repeat( ${ width } , ${ cell }px )`;
    // grid-template-columns: repeat( calc(36/4), calc( var(--cell) * 4) );
    hourSec.style.gridTemplateColumns = `repeat( ${ Math.floor(width/4)+1 } , ${ cell*4 }px )`;
};



let section = new Task();
section.isSection = true;
project.writeTask( section );
console.log(`checking task section: ${section.isSection}`);


leftSec.appendChild( pageBuilder.getHTML_Task( section ) );


for (let i = 0; i < 3; i++) {
    let task = new Task();
    project.writeTask( task );
    leftSec.appendChild( pageBuilder.getHTML_Task( task ) );
    gridSec.appendChild( pageBuilder.getHTML_Bar( task ) );

};

for (let i = 0; i < 3; i++) {
    dateSec.appendChild( pageBuilder.getHTML_Date( i ) );
}

for (let i = 0; i < 15; i++) {
    hourSec.appendChild( pageBuilder.getHTML_Hour( i ) );
}