import "./assets/style.css";
import { Task } from "./assets/modules/DATAmanager";
import { PageBuilder } from "./assets/modules/HTMLbuilder";


// const taskBuilder = new TaskBuilder();
const pageBuilder = new PageBuilder();

const content = document.getElementById("content");
content.appendChild( pageBuilder.getHTML_ProjectPage() );

const leftPage = document.getElementById( "left" );

let section = new Task();
section.isSection = true;
console.log(`checking task section: ${section.isSection}`);


left.appendChild( pageBuilder.getHTML_Task( section ) );


for (let i = 0; i < 3; i++) {
    let task = new Task();
    left.appendChild( pageBuilder.getHTML_Task( task ) );
}