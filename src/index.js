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
let gridStartColumn = 1;
let gridCellCount = 1;
let HTMLUPDATE = [];


function setup(){
    gridStartColumn = Math.round((today-startDate)/ 60000);
    gridStartColumn = Math.floor( gridStartColumn / 15 );
    // columnDisplay = gridStartColumn;
    // console.log( `start column: ${ gridStartColumn }` );

    let section = new Task();
    section.isSection = true;
    project.writeTask( section );
    leftSec.appendChild( pageBuilder.getHTML_Task( section ) );

    gridCellCount = Math.floor((gridSec.offsetWidth)/ cell)+13;
    // console.log(`grid cell count: ${gridCellCount}`)
    // --cell: 32px;
    // grid-template-columns: repeat(36, var(--cell));
    gridSec.style.gridTemplateColumns = `repeat( ${ gridCellCount } , ${ cell }px )`;
    // grid-template-columns: repeat( calc(36/4), calc( var(--cell) * 4) );
    let hourCount = Math.floor(gridCellCount/4)+1;

    hourSec.style.gridTemplateColumns = `repeat( ${ hourCount } , ${ cell*4 }px )`;


    let startTime = Math.round((today-startDate)/ 60000);
    startTime = Math.floor( startTime / 15 );
    // let gridColumn = {start:0, span:0};

    const fakeTasks = 25;

    for (let i = 0; i < fakeTasks; i++) {
        let task = new Task();
        task.startTime = startTime + Math.floor( Math.random()*15 );
        task.duration = 4 * Math.floor( Math.random()*15 );
        task.title = task.startTime+"";
        project.writeTask( task );

        if (converter.inBounds( task, gridStartColumn, gridCellCount) ){
            // // gridColumn = {start:0, span:0};
            let gridColumn = converter.getGridColumn( task, gridStartColumn, gridCellCount );
            // console.log(`gridColumnL ${gridColumn.start} / ${gridColumn.span}`)
            leftSec.appendChild( pageBuilder.getHTML_Task( task ) );
            gridSec.appendChild( pageBuilder.getHTML_Bar( task, gridColumn.start, gridColumn.span ) );
            // console.log(`good to go!`);
        } else {
            console.log(`SORRY :(`);

            pageBuilder.hideHTML( HTML );
        };



    };

    for (let i = 0; i < 3; i++) {
        dateSec.appendChild( pageBuilder.getHTML_Date( i ) );
    }

    for (let i = 0; i < hourCount; i++) {
        hourSec.appendChild( pageBuilder.getHTML_Hour( gridStartColumn + (i*4) ) );
    }

};

// KEEP TRACK OF MOUSE FOR DOWN
document.body.onmousedown = function (e) {
    mouseOrigin.x = e.clientX;
    mouseOrigin.y = e.clientY;
    // lastPos.x = 0;
    mouseDown=true;
};
document.body.onmouseup = function () {
    // inBounds=false;
    offset = {x:0, y:0 };
    lastPos.x = newPos.x + oversize.x;
    mouseDown=false;
};
rightSec.onmouseenter = () => inBounds=true;
rightSec.onmouseleave = () => inBounds=false;

function drawBars() {
    gridSec.style.transform = `translateX( ${ newPos.x  }px )`;
    hourSec.style.transform = `translateX( ${ newPos.x  }px )`;
    dateSec.style.transform = `translateX( ${ newPos.x  }px )`;
    HTMLUPDATE.forEach ( chunk => {
        // chunk = [HTML, gridColumn.start, gridColumn.span]
        pageBuilder.updateHTML_Bar( chunk[0], chunk[1], chunk[2] );
    });
    HTMLUPDATE = [];
}

onmousemove = function(e){

    if ( mouseDown && inBounds ) {

        mousePos.x = e.clientX;
        mousePos.y = e.clientY;

        newPos.x = (mousePos.x - mouseOrigin.x) + lastPos.x + offset.x - oversize.x;
        
        

        if ( Math.abs(newPos.x + oversize.x ) > ( oversize.x ) ) {
            const direction = Math.sign(newPos.x)
            offset.x -= direction * ( oversize.x );
            gridStartColumn -= direction * ( 4 );
            shiftBars();
            requestAnimationFrame( drawBars );

        } else {
            requestAnimationFrame( drawBars );
            // // console.log( `starting column: ${ gridStartColumn} `);
            // gridSec.style.transform = `translateX( ${ newPos.x  }px )`;
            // hourSec.style.transform = `translateX( ${ newPos.x  }px )`;
            // dateSec.style.transform = `translateX( ${ newPos.x  }px )`;

        }


    };
};



window.addEventListener('resize', resize);



function shiftBars() {
    
    gridSec.querySelectorAll(".bar").forEach ( HTML => {

        const task = project.getTask( HTML.id.split("-")[1] );

        if (converter.inBounds( task, gridStartColumn, gridCellCount) ){
            // let gridColumn = {start:0, span:0};
            let gridColumn = converter.getGridColumn( task, gridStartColumn, gridCellCount );
            // console.log(`new grid Column after shift -- start: ${gridColumn.start} end: ${gridColumn.span}`);

            // PULLING THIS OUT!
            // pageBuilder.updateHTML_Bar( HTML, gridColumn.start, gridColumn.span );
            HTMLUPDATE.push([HTML, gridColumn.start, gridColumn.span]);
        } else {
            pageBuilder.hideHTML( HTML );
        };

    });

    let n = 0;

    hourSec.querySelectorAll(".hour").forEach ( HTML => {
        HTML.textContent = gridStartColumn + (n * 4)
        n+=1;
    });

};

function resize(e) {
    gridCellCount = Math.floor(gridSec.offsetWidth / cell );
    // --cell: 32px;
    // grid-template-columns: repeat(36, var(--cell));
    gridSec.style.gridTemplateColumns = `repeat( ${ gridCellCount } , ${ cell }px )`;
    // grid-template-columns: repeat( calc(36/4), calc( var(--cell) * 4) );
    hourSec.style.gridTemplateColumns = `repeat( ${ Math.floor(gridCellCount/4)+1 } , ${ cell*4 }px )`;
};




setup();