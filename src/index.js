import "./assets/style.css";
import { Task, Project, Converter } from "./assets/modules/DATAmanager";
import { PageBuilder } from "./assets/modules/HTMLbuilder";


// const taskBuilder = new TaskBuilder();
const pageBuilder = new PageBuilder();
let project = new Project();
const converter = new Converter();

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
let offset = {x:0, y:0 };
let oversize = { x: 4*cell,y: 4*cell };
let mousePos = { x:0,y:0 };
let mouseDown = false;
let inBounds = false;
let today = new Date();
let startDate = new Date("0000-01-01");
let gridStartDate = 1;
let gridEndDate = 1;
// let gridCellCount = 1;
let allBars = [];

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

function setup(){
    gridStartDate = Math.round((today-startDate)/ 60000);
    gridEndDate = gridStartDate + Math.floor((gridSec.offsetWidth));
    // gridStartColumn = Math.floor( gridStartColumn / 15 );
    
    let section = new Task();
    section.isSection = true;
    project.writeTask( section );
    leftSec.appendChild( pageBuilder.getHTML_Task( section ) );

    console.log(`[grid] startDate: ${gridStartDate} endDate: ${gridEndDate} `);

    // let hourCount = Math.floor(gridCellCount/4)+1;
    // hourSec.style.gridTemplateColumns = `repeat( ${ hourCount } , ${ cell*4 }px )`;

    let taskStartDate = Math.round((today-startDate)/ 60000);
    taskStartDate = taskStartDate + 500;
    // let gridColumn = {start:0, span:0};

    const fakeTasks = 25;

    for (let i = 0; i < fakeTasks; i++) {
        let task = new Task();
        task.startDate = taskStartDate + Math.floor( Math.random()*200 );
        task.endDate = taskStartDate + 450 + Math.floor( Math.random()*200 ); // * Math.floor( Math.random()*15 );
        task.title = task.startDate+"";
        project.writeTask( task );

        leftSec.appendChild( pageBuilder.getHTML_Task( task ) );

        allBars.push( pageBuilder.getHTML_Bar( task ) );
        gridSec.appendChild( allBars.last() );

        if ( converter.inBounds( task.startDate, task.endDate, gridStartDate, gridEndDate ) ) {
            pageBuilder.writeTransfomCSS( allBars.last(), task.startDate, task.endDate, gridStartDate, gridEndDate );
        } else {
            pageBuilder.hideHTML( allBars.last() );
        };

    };

    for (let i = 0; i < 3; i++) {
        dateSec.appendChild( pageBuilder.getHTML_Date( i ) );
    }

    // for (let i = 0; i < hourCount; i++) {
    //     hourSec.appendChild( pageBuilder.getHTML_Hour( gridStartColumn + (i*4) ) );
    // }

};

// KEEP TRACK OF MOUSE FOR DOWN
document.body.onmousedown = function (e) {
    lastPos.x = e.clientX;
    // mouseOrigin.y = e.clientY;
    // lastPos.x = 0;
    mouseDown=true;
};
document.body.onmouseup = function () {
    // inBounds=false;
    offset = {x:0, y:0 };
    lastPos.x = 0;
    mouseDown=false;
};
rightSec.onmouseenter = () => inBounds=true;
rightSec.onmouseleave = () => inBounds=false;

// function drawBars() {
//     gridSec.style.transform = `translateX( ${ newPos.x  }px )`;
//     hourSec.style.transform = `translateX( ${ newPos.x  }px )`;
//     dateSec.style.transform = `translateX( ${ newPos.x  }px )`;
//     HTMLUPDATE.forEach ( chunk => {
//         // chunk = [HTML, gridColumn.start, gridColumn.span]
//         pageBuilder.updateHTML_Bar( chunk[0], chunk[1], chunk[2] );
//     });
//     HTMLUPDATE = [];
// }

onmousemove = function(e){

    if ( mouseDown && inBounds ) {

        mousePos.x = e.clientX;
        // mousePos.y = e.clientY;
        // newPos.x = (mousePos.x - mouseOrigin.x); // + lastPos.x + offset.x - oversize.x;
        // console.log(`mouse delta-- lastPos: ${lastPos.x}, newPos: ${mousePos.x}`)
        gridStartDate += (lastPos.x - mousePos.x);
        gridEndDate += (lastPos.x - mousePos.x);
        console.log(`grid -- start Date: ${gridStartDate}, end Date: ${gridEndDate}`)

        lastPos.x = mousePos.x;

        shiftBars();

        

        // if ( Math.abs(newPos.x + oversize.x ) > ( oversize.x ) ) {
        //     const direction = Math.sign(newPos.x)
        //     offset.x -= direction * ( oversize.x );
        //     gridStartColumn -= direction * ( 4 );
        //     requestAnimationFrame( drawBars );

        // } else {
        //     requestAnimationFrame( drawBars );
        //     // // console.log( `starting column: ${ gridStartColumn} `);
        //     // gridSec.style.transform = `translateX( ${ newPos.x  }px )`;
        //     // hourSec.style.transform = `translateX( ${ newPos.x  }px )`;
        //     // dateSec.style.transform = `translateX( ${ newPos.x  }px )`;

        // }

    };
};



window.addEventListener('resize', resize);



function shiftBars() {
    
    allBars.forEach ( bar => {

        const task = project.getTask( bar.id.split("-")[1] );

        if ( converter.inBounds( task.startDate, task.endDate, gridStartDate, gridEndDate ) ) {
            pageBuilder.writeTransfomCSS( bar, task.startDate, task.endDate, gridStartDate, gridEndDate );
        } else {
            pageBuilder.hideHTML( bar );
        };

    });

    // let n = 0;

    // hourSec.querySelectorAll(".hour").forEach ( HTML => {
    //     HTML.textContent = gridStartColumn + (n * 4)
    //     n+=1;
    // });

};

function resize(e) {
    gridEndDate = gridStartDate + Math.floor((gridSec.offsetWidth));

    // gridCellCount = Math.floor(gridSec.offsetWidth / cell );
    // --cell: 32px;
    // grid-template-columns: repeat(36, var(--cell));
    // gridSec.style.gridTemplateColumns = `repeat( ${ gridCellCount } , ${ cell }px )`;
    // grid-template-columns: repeat( calc(36/4), calc( var(--cell) * 4) );
    // hourSec.style.gridTemplateColumns = `repeat( ${ Math.floor(gridCellCount/4)+1 } , ${ cell*4 }px )`;
};




setup();