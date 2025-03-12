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
const rightSec= document.getElementById( "right" );
const cell = 32
let dragging = false;
let mouseOrigin = { x:0,y:0 };
let lastPos = {x:0, y:0 };
let newPos = {x:0, y:0 };

let mousePos = { x:0,y:0 };
let mouseDown = false;
let inBounds = false;

// KEEP TRACK OF MOUSE FOR DOWN
document.body.onmousedown = function (e) {
    mouseOrigin.x = e.clientX;
    mouseOrigin.y = e.clientY;
    mouseDown=true;
};
document.body.onmouseup = function () {
    // inBounds=false;
    lastPos.x = newPos.x
    mouseDown=false;
};
rightSec.onmouseenter = () => inBounds=true;
rightSec.onmouseleave = () => inBounds=false;



onmousemove = function(e){

    if ( mouseDown && inBounds ) {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;

        newPos.x = mousePos.x - mouseOrigin.x + lastPos.x

        gridSec.style.transform = `translateX( ${ newPos.x  }px )`;
        hourSec.style.transform = `translateX( ${ newPos.x  }px )`;
        dateSec.style.transform = `translateX( ${ newPos.x  }px )`;

        console.log("mouse location:", e.clientX, e.clientY);
        console.log(`mouse deltaX: ${ mouseOrigin.x - mousePos.x }`);
        console.log(`mouse pos: ${ mousePos.x }`);

    };
};


// rightSec.addEventListener("mouseenter", gridDrag );
// gridSec.addEventListener("mouseenter", gridDrag );


window.addEventListener('resize', resize);

// function mouseHandleMove(e) {
//     if (dragging) {
        // console.log(`mouse positiom: x:${e.pageX} y:${e.pageY}`)
//     }
// }

function gridDrag(e) {

    console.log("grid drag!!!11!");
    console.log(`dragging@! ${e.currentTarget.id}` );
    inBounds = true;
};

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