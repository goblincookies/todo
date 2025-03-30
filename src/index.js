import "./assets/style.css";
import { Task, Project, Converter } from "./assets/modules/DATAmanager";
import { PageBuilder } from "./assets/modules/HTMLbuilder";

const pageBuilder = new PageBuilder();
const project = new Project();
const converter = new Converter();
// const reorderManager = new DragToReorder();
// const resizeManager = new DragToResize();


let leftSec;
let taskList;
let gridUL;
let hourUL;

const obj = {
    TASK:0,
    BARS:1
};

let editSave = true;
let draggableList = [];
let draggableItem = [];
let resizingBar;
let resizingBarHTML="";
let resizeLeft = 0;
let resizeRight = 0;
let startTime = new Date();
let endTime = new Date();
let snapRes = 15;
let panning = false;
// let gridStartRaw = 0;
// let gridEndRaw = 1;
// let gridStart = 0;
// let gridEnd = 0;


let pointerStartX;
let pointerStartY;
let itemsGap = 0;
let items = [];


// FROM INTERACTION
function getAllItems( el ) {
    if (!items[ el ]?.length) {
        items[ el ] = Array.from( draggableList[ el ].querySelectorAll(".reorderable"))
    };
    return items[ el ];
};

function getIdleItems( el ) {   
    return getAllItems( el ).filter( (item) => item.classList.contains("is-idle"));
};

function isItemAbove( item ) {
    return item.hasAttribute( 'data-is-above');
};

function isItemToggled( item ) {
    return item.hasAttribute( 'data-is-toggled');
};

function createListeners() {
    let classes = "drag-handle resize slide pan";

    classes.split(" ").forEach ( el => {

        let reorderableItems = document.querySelectorAll(`.${ el }`);
        if (!reorderableItems) return;

        reorderableItems.forEach( item => {
            item.addEventListener("mousedown", dragStart);
            item.addEventListener("touchstart", dragStart);
        });
    });

};

function updateListeners() {
    createListeners();
};

function timeToRawHours( t ) {
    if( !( t instanceof Date ) ){
        console.log("not a date");
        return;
    };
    return Math.round( t/1000/60/60 );
};

function timeToRawMinutes( t ) {
    if( !( t instanceof Date ) ){
        console.log("not a date");
        return;
    };
    return Math.round( t/1000/60 );
};

function timeToHours( t ) {
    if( !( t instanceof Date ) ){
        console.log("not a date");
        return;
    };
    return t.getHours();
};

function getNewEndTime( start ) {
    if( !( start instanceof Date) ){
        console.log("not a date");
        return;
    };
    let time = new Date();
    let widthAsHours = Math.floor( ( gridUL.offsetWidth / 60 ) );

    time.setTime( start.getTime() + (widthAsHours*60*60*1000) )
    return time;
};

function setupHours(){
    hourUL.textContent = "";

    // let s = timeToHours( startTime );
    let n = Math.abs(startTime-endTime)/(60*60*1000)-2;
    // console.log(`n ${n}`)
    let tempTime = new Date();
    tempTime.setTime( startTime.getTime() );

    // tempTime.setTime( startTime.getTime() + ( -1*60*60*1000 ) );

    let hoursRaw;
    let hoursConv;
    let prevWidth = 0;

    for( let i = 0; i < n; i++ ) {

        hoursRaw = timeToRawMinutes( tempTime );
        hoursConv = timeToHours( tempTime )
        
        let hourHTML = pageBuilder.getHTML_Hour( hoursRaw, hoursConv )
        hourUL.appendChild( hourHTML );
        pageBuilder.writeCSS_Hour( hourHTML, hoursRaw, timeToRawMinutes( startTime ) );

        tempTime.setTime( tempTime.getTime() + ( 1*60*60*1000 ) );
    };


    // for( let i = 1; i <= n; i++ ) {
    //     tempTime.setTime( tempTime.getTime() + ( 1*60*60*1000 ) );
    //     hoursRaw = timeToRawHours( tempTime );
    //     hoursConv = timeToHours( tempTime )
    //     let hourHTML = pageBuilder.getHTML_Hour( hoursRaw, hoursConv )
    //     hourUL.appendChild( hourHTML );
    //     pageBuilder.writeCSS_Even_Hour( hourHTML, i, 60, prevWidth );
    //     prevWidth += hourHTML.getBoundingClientRect().width;
    // };

}

function setup () {
    // const taskBuilder = new TaskBuilder();
    console.log("setup")
    // dragManager.UL()
    const content = document.getElementById("content");
    content.appendChild( pageBuilder.getHTML_ProjectPage() );
    leftSec = document.getElementById( "left" );
    taskList = document.getElementById( "task-list" );
    gridUL = document.getElementById("grid");
    hourUL = document.getElementById("hour");

    // startTime = new Date();
    // endTime = new Date();
    startTime.setTime( startTime.getTime() + (-3*60*60*1000) )
    endTime = getNewEndTime( startTime );
    console.log(`endTime: ${endTime} ${ endTime instanceof Date}`)
    setupHours();

    const newTask = document.getElementById( "new-task" );
    newTask.addEventListener("click", createNewTask );

    createListeners();

    document.addEventListener("mouseup", dragEnd );
    document.addEventListener("touchend", dragEnd);
    window.addEventListener('resize', resize);
};

function resize( e ) {

    endTime = getNewEndTime( startTime );
    setupHours();

    const allTasks = project.getAll();
    allTasks.forEach( task => {
        const HTML = document.getElementById( `bar-${ task.id }` );
        pageBuilder.writeCSS_Resize_Task(
            HTML,
            task.startMin, task.endMin,
            timeToRawMinutes( startTime ),
            timeToRawMinutes( endTime )
        );
    });

    // gridCellCount = Math.floor(gridSec.offsetWidth / cell );
    // --cell: 32px;
    // grid-template-columns: repeat(36, var(--cell));
    // gridSec.style.gridTemplateColumns = `repeat( ${ gridCellCount } , ${ cell }px )`;
    // grid-template-columns: repeat( calc(36/4), calc( var(--cell) * 4) );
    // hourSec.style.gridTemplateColumns = `repeat( ${ Math.floor(gridCellCount/4)+1 } , ${ cell*4 }px )`;
};

function getResizeTask( node ) {
    let bar = node.parentNode;
    let id = bar.id.split("-")[1];
    console.log( project.getTask( id ) );
    return project.getTask( id );
}

// DRAG START
const dragStart = (e) => {
    console.log("Drag Start!!");

    if (e.currentTarget.classList.contains("drag-handle")) {
        draggableItem[ obj.TASK ] = e.target.closest(".reorderable");
        let grabbedID = draggableItem[ obj.TASK ].id;
        grabbedID = grabbedID.split("-")[1];
        draggableItem[ obj.BARS ] = document.getElementById(`bar-${grabbedID}`).parentNode;

        draggableList[ obj.TASK ] = e.target.closest(".reorderable-list");
        draggableList[ obj.BARS ] = document.querySelector(".reorderable-bars");
        
        if(!draggableItem[ obj.TASK ]) return;

        pointerStartX = e.clientX || e.touches[0].clientX;
        pointerStartY = e.clientY || e.touches[0].clientY;
    
        setItemsGap();
        initItemState();
        initDraggableItem();
    };

    if (e.currentTarget.classList.contains("resize")) {
        console.log("RESIZING!!");
        resizingBarHTML = e.currentTarget.parentNode;
        resizingBar = getResizeTask( e.currentTarget );

        if(e.currentTarget.classList.contains("align-left")) {
            resizeLeft = 1;
            resizeRight = 0;
        } else {
            resizeLeft = 0;
            resizeRight = 1;
        };
        pointerStartX = e.clientX || e.touches[0].clientX;
        pointerStartY = e.clientY || e.touches[0].clientY;
    };

    if (e.currentTarget.classList.contains("slide")) {
        console.log("SLIIIIDING!!")
        resizingBarHTML = e.currentTarget.parentNode;
        resizingBar = getResizeTask( e.currentTarget );
        resizeLeft = 1;
        resizeRight = 1;
        pointerStartX = e.clientX || e.touches[0].clientX;
        pointerStartY = e.clientY || e.touches[0].clientY;
    };

    if (! resizingBar && e.currentTarget.classList.contains("pan")) {
        console.log("PANNING!!")
        panning = true;
        pointerStartX = e.clientX || e.touches[0].clientX;
        pointerStartY = e.clientY || e.touches[0].clientY;
    };

    disablePageScroll();
    document.addEventListener("mousemove", drag );
    document.addEventListener("touchmove", drag, {passive: false});
    console.log(`finished!`);
};

function setItemsGap(){
    if( getIdleItems( obj.TASK ).length <=1) {
        itemsGap = 0;
        return;
    };

    const item1 = getIdleItems( obj.TASK )[0];
    const item2 = getIdleItems( obj.TASK )[1];

    const item1Rect = item1.getBoundingClientRect();
    const item2Rect = item2.getBoundingClientRect();

    itemsGap = Math.abs( item1Rect.bottom - item2Rect.top);
};

function disablePageScroll(){
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.style.userSelect = 'none';
};

function initItemState() {
    Object.values( obj ).forEach( el => {
        getIdleItems( el ).forEach( (item, i) => {
            if( getAllItems( el ).indexOf( draggableItem[ el ] ) > i ) {
                item.dataset.isAbove = '';
            };
        });
    });
};

function initDraggableItem() {
    Object.values( obj ).forEach( el => {
        draggableItem[ el ].classList.remove("is-idle");
        draggableItem[ el ].classList.add("is-dragging");
    });
};

// DRAG
const drag = (e) => {
    // console.log(`draggggging!!`);
    
    if( draggableItem[ obj.TASK ]) {
        e.preventDefault();
    
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
    
        const pointerOffsetX = clientX - pointerStartX;
        const pointerOffsetY = clientY - pointerStartY;
    
        draggableItem[ obj.TASK ].style.transform = `translate(${pointerOffsetX}px, ${pointerOffsetY}px)`
        draggableItem[ obj.BARS ].style.transform = `translateY(${pointerOffsetY}px)`;
        
        updateIdleItemsStateAndPosition( );
    };
    if( resizingBar ){

        e.preventDefault();
    
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        const pointerOffsetX = clientX - pointerStartX;
        let snap = Math.sign( pointerOffsetX ) * Math.floor( Math.abs(pointerOffsetX)/snapRes)*15;
        // console.log( `snapPos: ${ snap }` );

        // const pointerOffsetX = Math.floor( (clientX - pointerStartX)/snapRes) * snapRes;
        if ( Math.abs( snap) > 0 ) {
            // resizingBar.startMin += resizeLeft * (pointerOffsetX);
            // resizingBar.endMin += resizeRight * (pointerOffsetX);
            resizingBar.startMin += resizeLeft * ( snap );
            resizingBar.endMin += resizeRight * ( snap );
            pointerStartX = clientX;
            pageBuilder.writeCSS_Resize_Task(
                resizingBarHTML,
                resizingBar.startMin, resizingBar.endMin,
                timeToRawMinutes( startTime ),
                timeToRawMinutes( endTime )
            );
            
            updateDuration( resizingBar );
        };
        // draggableItem[ obj.TASK ].style.transform = `translate(${pointerOffsetX}px, ${pointerOffsetY}px)`
        // draggableItem[ obj.BARS ].style.transform = `translateY(${pointerOffsetY}px)`;
    };

    if ( panning ){
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        const pointerOffsetX = clientX - pointerStartX;
        startTime.setTime( startTime.getTime() + ( -pointerOffsetX*60*1000 ) );
        endTime = getNewEndTime( startTime, endTime );
        
        pointerStartX = clientX;
        const allTasks = project.getAll();

        allTasks.forEach( task => {
            const HTML = document.getElementById( `bar-${ task.id }` );
            pageBuilder.writeCSS_Resize_Task(
                HTML,
                task.startMin, task.endMin,
                timeToRawMinutes( startTime ),
                timeToRawMinutes( endTime )
            );
        });

        const allHours = hourUL.querySelectorAll("li");
        const firstID = parseInt( allHours[0].id );
        const firstHr = parseInt( allHours[0].textContent );
        const lastID = parseInt( allHours[ allHours.length - 1 ].id );
        const lastHr = parseInt( allHours[ allHours.length - 1 ].textContent );


        console.log(`checking against ${timeToRawMinutes(startTime)} // ${timeToRawMinutes(endTime)}`)
        allHours.forEach( hr => {
            //hr.id == time
            // console.log(`HOUR id: ${} startTime: ${startTime}`)
            
            if( parseInt(hr.id) > timeToRawMinutes( endTime ) ) {
                //put in front!
                console.log( `moving to front ${hr.id}` );
                // hr.id = parseInt(allHours[0].id) - 60;
                hr.id = firstID - 60;
                
                let newHour = firstHr - 1;
                if( newHour < 0 ) { newHour = 23; };
                hr.textContent = newHour;

                console.log( `new id ${hr.id}` );
                hourUL.prepend( hr );
            } else  if( parseInt( hr.id ) < timeToRawMinutes( startTime ) ) {
                // put to end!!
                console.log( `moving to back ${ hr.id }` );
                console.log( hr );
                
                // console.log( allHours[ allHours.length - 1 ] )

                hr.id = lastID + 60;
                
                let newHour = lastHr + 1;
                if( newHour > 23 ) { newHour = 0; };
                hr.textContent = newHour;

                console.log( `new id ${hr.id}` );
                hourUL.appendChild( hr );
            };

            pageBuilder.writeCSS_Hour( hr, hr.id, timeToRawMinutes(startTime) )

        });
    };



};

function updateDuration( task ) {
    const HTML = document.getElementById( `task-${task.id}` );
    HTML.querySelector( ".time" ).textContent = task.duration;
}

function updateIdleItemsStateAndPosition(){
    const draggableItemRect = draggableItem[ obj.TASK ].getBoundingClientRect();
    const draggableItemY = draggableItemRect.top + draggableItemRect.height / 2;

    Object.values( obj ).forEach( el => {
        // UPDATE STATE
        getIdleItems( el ).forEach( (item) => {
            const itemRect = item.getBoundingClientRect();
            const itemY = itemRect.top + itemRect.height/2;
            if ( isItemAbove(item)) {
                if( draggableItemY <= itemY) {
                    item.dataset.isToggled = '';
                } else {
                    delete item.dataset.isToggled;
                }
            } else {
                if( draggableItemY >= itemY) {
                    item.dataset.isToggled = '';
                } else {
                    delete item.dataset.isToggled;
                };
            };
        });

        // UPDATE POSITIONS
        getIdleItems( el ).forEach( (item) => {
            if( isItemToggled( item ) ) {
                const direction = isItemAbove( item ) ? 1 : -1;
                item.style.transform = `translateY( ${ direction * (draggableItemRect.height + itemsGap)}px)`;
            } else {
                item.style.transform = '';
            };
        });
    });
    
    // DUPLICATE??? vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    // // UPDATE POSITIONS
    // getIdleItems( obj.TASK ).forEach( (item) => {
    //     if( isItemToggled( item ) ) {
    //         const direction = isItemAbove(item) ? 1 : -1;
    //         item.style.transform = `translateY( ${ direction * (draggableItemRect.height + itemsGap)}px)`;
    //     } else {
    //         item.style.transform = '';
    //     };
    // });
};

// DRAG END
const dragEnd = () => {
    console.log("Drag END");
    if (resizingBar){
        resizeLeft = 0;
        resizeRight = 0;
        resizingBar = null;
        resizingBarHTML = "";
    };

    if ( draggableItem[ obj.TASK ] ) {
        applyNewItemOrder();
        cleanup();
    };

    panning = false;

    document.removeEventListener("mousemove", drag );
    document.removeEventListener("touchmove", drag );
};

function applyNewItemOrder() {

    Object.values( obj ).forEach( el => {

        const reorderedItems = [];

        getAllItems( el ).forEach( (item, index) => {
            if ( item === draggableItem[ el ]) {
                return;
            };
            if( !isItemToggled( item )) {
                reorderedItems[ index ] = item;
                return;
            };
            const newIndex = isItemAbove( item ) ? index + 1 : index -1;
            reorderedItems[newIndex] = item;
        } );

        for (let index = 0; index < getAllItems( el ).length; index++) {
            const item = reorderedItems[ index ];
            if( typeof item === 'undefined' ) {
                reorderedItems[index] = draggableItem[ el ];
            };
        };

        reorderedItems.forEach( ( item ) => {
            draggableList[ el ].appendChild( item );
        });
    });
};

function cleanup() {
    itemsGap = 0;
    unsetItemState();
    unsetDraggable();
    enablePageScroll();
    items = [];
    draggableList = [];
    resizeLeft = 0;
    resizeRight = 0;
    resizingBar = null;
    resizingBarHTML = "";
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("touchmove", drag);
};

function unsetDraggable() {
    Object.values( obj ).forEach( el => {
        draggableItem[ el ].style = null;
        draggableItem[ el ].classList.remove("is-dragging");
        draggableItem[ el ].classList.add("is-idle");
        draggableItem[ el ] = null;
    });
};

function unsetItemState() {
    Object.values( obj ).forEach( el => {
        getIdleItems( el ).forEach( (item, i)=> {
            delete item.dataset.isAbove;
            delete item.dataset.isToggled;
            item.style.transform = '';
        });
    });
};

function enablePageScroll() {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    document.body.style.userSelect = '';
};

function deleteTask( e ) {
    const id = e.currentTarget.id.split("-")[1];
    const parentNode = e.currentTarget.parentNode;
    let barNode = document.getElementById( `bar-${id}` ).parentNode;

    project.deleteTask( id );
    parentNode.remove();
    barNode.remove();

};

function writeTaskTitle( e ) {
    if (e.key === 'Enter') {
        console.log("enter");

        e.target.blur();
        return;
    };

    if (e.key === 'Escape') {
        console.log("escape");

        const id = e.currentTarget.id.split("-")[1];
        const task = project.getTask( id );
        e.currentTarget.value = task.title;

        editSave = false;
        e.target.blur();
        return;
    };

    if( e.type == "blur" ) {

        if( editSave ) {
            console.log('saving to database');
            const id = e.currentTarget.id.split("-")[1];
            const task = project.getTask( id );
            task.title = e.currentTarget.value;
            project.writeTask( task );
        };
        editSave = true;
        return
    };

}

function createNewTask( e ) {
    console.log("new task!")
    console.log( `startTime ${ startTime instanceof Date}` )
    console.log( `endTime ${ endTime instanceof Date}` )

    let now = new Date();
    var minRound = 1000*60*5;
    now.setTime( Math.round( now.getTime() / minRound ) * minRound ); 
    // let startDate = new Date("0000-01-01");

    let task = new Task();
    // now.setTime( now.getTime() + ((1 + Math.floor(Math.random()*3))*60*60*1000) )
    task.startMin = timeToRawMinutes( now );

    now.setTime( now.getTime() + ((1 + Math.floor(Math.random()*6))*60*60*1000) )
    task.endMin = timeToRawMinutes( now );

    task.title = task.startMin+"";
    project.writeTask( task );

    const taskHTML = pageBuilder.getHTML_Task( task );
    taskList.appendChild( taskHTML );
    const barHTML = pageBuilder.getHTML_Bar( task );
    gridUL.appendChild( barHTML );

    console.log("time here:")
    

    pageBuilder.writeCSS_Resize_Task(
        barHTML.querySelector(".bar"),
        task.startMin, task.endMin,
        timeToRawMinutes( startTime ),
        timeToRawMinutes( endTime )
    );
 
    const titleInput = taskHTML.querySelector("input.title");
    titleInput.focus();
    titleInput.select();

    taskHTML.querySelector( "button.delete" ).addEventListener( 'click', deleteTask )
    // task.addEventListener('focus', editTaskTitle);
    titleInput.addEventListener( 'blur', writeTaskTitle );
    titleInput.addEventListener( 'keydown', writeTaskTitle );

    updateListeners();
    
};


setup();