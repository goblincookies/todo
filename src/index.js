import "./assets/style.css";
import { Task, Project, Database, Storage } from "./assets/modules/DATAmanager";
import { PageBuilder } from "./assets/modules/HTMLbuilder";

const pageBuilder = new PageBuilder();
let database = new Database();
const storage = new Storage();

const content = document.getElementById("content");

const page = {
    UNKNOWN: 0,
    PROJECT: 1,
    TASK: 2,
};
let currentPage = page.PROJECT;

let project;
let taskList;
let gridUL;
let hourUL;
let dialog;
let inkwell;
let task;
let projects;
let header;

let reorderingTasks = true;

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
let minutePixels = 1;
let minutePixelDelta = 1;

const dayStart = 0;

let startingDisplayHour = 4
let newTaskStartingOffsetHour = 2;

let gridStartTime = 24;
let gridEndTime = 24;

let snapRes = 15;
let panning = false;

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

function writeToStorage(){
    console.log( "writing to storage");
    storage.writeAllStorage( database );
};

function pullStorage(){
    console.log( "pulling storage:");
    // console.log( storage.getAllStorage() );
    database = storage.getAllStorage();
}

function updateListeners() {
    createListeners();
};

function fillInkwell() {
    const tempTask = new Task();
    const allColors = tempTask.allColors;
    inkwell = document.getElementById( "inkwell" );
    let square;
    allColors.forEach( hex => {
        square = pageBuilder.getHTML_InkwellSquare( hex );
        square.querySelector(".inkwell-square").id = hex;
        inkwell.appendChild( square );
    });
}


function hoursToMinutes( hrs ) { return hrs * 60; };
function hoursToPixels( hrs ) { return hrs * 60 * minutePixels; }
function pixelsToHour( pxl ) { return Math.floor( pxl / 60 / minutePixels ); }

function setupHours(){
    hourUL.textContent = "";

    // let n = Math.ceil( gridUL.offsetWidth / minutePixels );
    let n = 24;
    console.log(`n hours: ${n}`)
    
    startingDisplayHour = Math.min( pixelsToHour( gridStartTime ), startingDisplayHour );
    console.log(`starting display hour: ${ startingDisplayHour }`)
    console.log(`starting grid hour: ${ gridStartTime }`)

    for( let i = 0; i < n; i++ ) {
        const hrs = i + startingDisplayHour;
        const hourHTML = pageBuilder.getHTML_Hour( hoursToPixels( hrs ), hrs );

        hourUL.appendChild( hourHTML );
        pageBuilder.writeCSS_Hour( hourHTML, hoursToPixels( hrs ), gridStartTime );
    };
};

function fillExistingTasks( id ) {

    updateMinutePixelScale();

    console.log(`filling existing tasks!`)
    let proj = database.getProject( id );
    console.log( proj );
    proj.getAll().forEach( task => {
        console.log( `existing tasks here` )
        const taskHTML = pageBuilder.getHTML_Task( task );
        const barHTML = pageBuilder.getHTML_Bar( task );
        taskList.appendChild( taskHTML );
        gridUL.appendChild( barHTML );
        
        resizeBar( barHTML.querySelector(".bar"), task );

        taskHTML.querySelector( "button.delete" ).addEventListener( 'click', deleteTask )
        taskHTML.querySelector("button.switch-color").addEventListener( "click", switchColor );
        
        const titleInput = taskHTML.querySelector("input.title");
        titleInput.addEventListener( 'blur', writeTaskTitle );
        titleInput.addEventListener( 'keydown', writeTaskTitle );

        const checkInput = taskHTML.querySelector("input.done");
        checkInput.addEventListener( 'change', toggleTaskComplete );

        const flagButton = taskHTML.querySelector("button.flag");
        flagButton.addEventListener( 'click', toggleTaskPriority );
    });

    updateListeners();
};

function fillExistingProjects() {
    database.getAll().forEach( proj => {

        // let project = database();
        // database.writeProject( project );

        const projectHTML = pageBuilder.getHTML_Project( proj );
        const titleButtonHTML = projectHTML.querySelector( "button.project" );
        // const titleInputHTML = projectHTML.querySelector( "input.project" );
        // const titleButton = projectHTML.querySelector( ".basic-button" );
        const id = projectHTML.id.split("-")[1] 

        let w = pageBuilder.getWidth_H3( proj.title );
        w = Math.min( w + 400, document.body.clientWidth - 15 );
        projectHTML.style.width = `${ w }px`;
        
        projects.insertBefore( projectHTML, document.getElementById("projects").lastChild );

        // inputHTML.disabled = true;
        titleButtonHTML.addEventListener( 'click', ( e ) => {
            e.preventDefault();
            let clickId = e.currentTarget.id.split("-")[1];
            console.log( `clicky clicky opening project id: ${ clickId }`)
            drawPage( page.TASK, clickId );
        });
        
        projectHTML.querySelector("button.delete").addEventListener( 'click', deleteProject );
        projectHTML.querySelector("button.edit").addEventListener( 'click', editProject );
    });
};


function editProject( e ) {
    console.log(`editing project title`);
    const id = e.currentTarget.id.split("-")[1];
    const titleButtonHTML = document.getElementById( `button-${id}` );
    const titleInputHTML = document.getElementById( `input-${id}` );
    titleButtonHTML.classList.add( "remove" );
    titleInputHTML.classList.remove( "remove" );

    titleInputHTML.focus();
    titleInputHTML.select();

    titleInputHTML.addEventListener( 'blur', writeProject );
    titleInputHTML.addEventListener( 'keydown', writeProject );
};

function drawPage( pg, id ) {
    content.textContent = "";

    switch( pg ) {
        case page.PROJECT:
            pullStorage();

            console.log("project page");
            content.append( pageBuilder.getHTML_ProjectSelect() );
            header = document.querySelector("header")
            header.classList.add("remove");
            projects = document.getElementById( "projects" );
            const newProject = document.getElementById( "new-project" );
            newProject.addEventListener( "click", createNewProject );
            fillExistingProjects();
            createListeners();
            currentPage = page.PROJECT;
            break;

        case page.TASK:
            pullStorage();

            content.appendChild( pageBuilder.getHTML_ProjectPage() );
            content.appendChild( pageBuilder.getHTML_Inkwell() );

            taskList = document.getElementById( "task-list" );
            gridUL = document.getElementById("grid");
            hourUL = document.getElementById("hour");
            
            header.classList.remove("remove");
            const titleInput = document.getElementById( "active-title" )
            titleInput.value = database.getProject( id ).title;

            updateMinutePixelScale();

            gridStartTime = startingDisplayHour;
            gridStartTime = gridStartTime - Math.max(0, ( gridUL.offsetWidth - hoursToPixels( 24 ) ));
            gridStartTime = Math.max(0, gridStartTime );
            gridEndTime = Math.min( hoursToPixels( 24 ), gridUL.offsetWidth );

            setupHours();

            dialog = document.querySelector("dialog");
            fillInkwell();

            const seeProjects = document.getElementById( "see-projects" );
            seeProjects.addEventListener( "click", ()=>{
                drawPage( page.PROJECT, -1 );
            });

            const newTask = document.getElementById( "new-task" );
            newTask.addEventListener("click", createNewTask );

            createListeners();

            titleInput.addEventListener( 'blur', writeProjectTitle );
            titleInput.addEventListener( 'keydown', writeProjectTitle );

            document.addEventListener("mouseup", dragEnd );
            document.addEventListener("touchend", dragEnd);
            window.addEventListener('resize', resize);

            project = database.getProject( id );

            fillExistingTasks( id );

            currentPage = page.TASK;
            break;
        default:
            break;
    };

};

function setup () {
    console.log("setup");
    drawPage( currentPage, -1 );
};

function updateMinutePixelScale(){
    // console.log( minutePixels );
    // let oldMinutePixels = minutePixels;
    minutePixels = 1;

    24*60
    if ( hoursToMinutes( 24 ) <= gridUL.offsetWidth ){
        // NOT ENOUGH, SCALE!
        console.log(`adjusting minute pixels and snap res`)

        // FOR EACH TASK, ALSO SCALE THE START AND END!!
        
        minutePixels = gridUL.offsetWidth / hoursToMinutes( 24 );
        gridStartTime = 0;
        gridEndTime = hoursToPixels(24);
    };

    snapRes = minutePixels * 15;
    // minutePixelDelta = minutePixels / oldMinutePixels;
    // console.log( `old min pixels: ${oldMinutePixels} new min pixels:${minutePixels}`)
    // console.log( `minute Pixels Delta: ${minutePixelDelta}` );
    console.log( `new minute pixels: ${minutePixels}, new snap Res: ${ snapRes }` );
};

function resize( e ) {

    console.log(`resizing window!`)

    updateMinutePixelScale();

    gridEndTime = gridStartTime + gridUL.offsetWidth;
    
    // TOO BIG!!
    if ( gridEndTime > hoursToPixels( 24 ) ){
        console.log(`grid end goes beyond edge`)

        gridStartTime = hoursToPixels( 24 ) - gridEndTime;
        gridEndTime = hoursToPixels( 24 );
    };

    
    // endTime = getNewEndTime( startTime );
    setupHours();
    
    // console.log( '***about to do it! tasks!')
    // console.log( `current page ${currentPage}, / ${page.TASK}`)
    
    const allTasks = project.getAll();
    allTasks.forEach( task => {
        // task.startMinute = task.startMinute * minutePixelDelta;
        // task.endMinute = task.endMinute * minutePixelDelta;
        if( currentPage === page.TASK ) {
            const HTML = document.getElementById( `bar-${ task.id }` );
            resizeBar( HTML, task );
        };
    });

    // RESIZING THE WINDOW CHANGES THE TIME OF EACH TASK!!
    // RESIZING THE WINDOW CHANGES THE TIME OF EACH TASK!!
    // RESIZING THE WINDOW CHANGES THE TIME OF EACH TASK!!
    // RESIZING THE WINDOW CHANGES THE TIME OF EACH TASK!!
    // RESIZING THE WINDOW CHANGES THE TIME OF EACH TASK!!
    // RESIZING THE WINDOW CHANGES THE TIME OF EACH TASK!!


    // if( currentPage === page.TASK ) {
    //     console.log( '----resizing all the tasks!')
    //     const allTasks = project.getAll();
    //     allTasks.forEach( task => {

    //         console.log( 'task!!');
    //         console.log( task );

    //         task.startMinute = task.startMinute * minutePixelDelta;
    //         task.endMinute = task.endMinute * minutePixelDelta;

    //         const HTML = document.getElementById( `bar-${ task.id }` );
    //         pageBuilder.writeCSS_Resize_Task(
    //             HTML,
    //             task.startMinute, task.endMinute,
    //             gridStartTime,
    //             gridEndTime
    //         );
    //     });
    // };

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

        if ( document.getElementById(`bar-${grabbedID}`) ){
            reorderingTasks = true;
            draggableItem[ obj.BARS ] = document.getElementById(`bar-${grabbedID}`).parentNode;
            draggableList[ obj.BARS ] = document.querySelector(".reorderable-bars");
        } else {
            reorderingTasks = false;
        }

        draggableList[ obj.TASK ] = e.target.closest(".reorderable-list");

        
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

    document.addEventListener("mouseleave", dragEnd );
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
    if ( reorderingTasks ) {
        Object.values( obj ).forEach( el => {
            getIdleItems( el ).forEach( (item, i) => {
                if( getAllItems( el ).indexOf( draggableItem[ el ] ) > i ) {
                    item.dataset.isAbove = '';
                };
            });
        });
    } else {
        getIdleItems( obj.TASK ).forEach( (item, i) => {
            if( getAllItems( obj.TASK ).indexOf( draggableItem[ obj.TASK ] ) > i ) {
                item.dataset.isAbove = '';
            };
        });
    }
};

function initDraggableItem() {
    draggableItem[ obj.TASK  ].classList.remove("is-idle");
    draggableItem[ obj.TASK  ].classList.add("is-dragging");


    if ( reorderingTasks ) {
        draggableItem[ obj.BARS  ].classList.remove("is-idle");
        draggableItem[ obj.BARS  ].classList.add("is-dragging");
    }
};

// DRAG
const drag = ( e ) => {
    console.log(`draggggging!!`);
    // console.log( e.buttons );
    
    // PROTECTS AGAINST 'STICKY' DRAGS
    if ( e.buttons < 1 ) {
        dragEnd();
        return;
    }

    // CHECK IF OUTSIDE THE BOUNDS OF THE WINDOW
    if ( !e.clientX || !e.clientY ) {
        dragEnd();
        return;
    };

    if( draggableItem[ obj.TASK ]) {
        e.preventDefault();
        
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
    
        const pointerOffsetX = clientX - pointerStartX;
        const pointerOffsetY = clientY - pointerStartY;
    
        draggableItem[ obj.TASK ].style.transform = `translate(${pointerOffsetX}px, ${pointerOffsetY}px)`
        if( reorderingTasks ) {
            draggableItem[ obj.BARS ].style.transform = `translateY(${pointerOffsetY}px)`;
        }
        
        updateIdleItemsStateAndPosition( );
    };

    if( resizingBar ){

        e.preventDefault();
    
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        const pointerOffsetX = clientX - pointerStartX;
        // console.log( `pointeroffset: ${ pointerOffsetX }` )
        const snap = Math.sign( pointerOffsetX ) * Math.floor( Math.abs( pointerOffsetX )/ snapRes )* snapRes;
        const snapMin = Math.sign( pointerOffsetX ) * 15;
        
        if ( Math.abs( snap ) > 0 ) {
            console.log( `snap!! ${ snap }`)
            resizingBar.startMinute += resizeLeft * ( snapMin );
            resizingBar.endMinute += resizeRight * ( snapMin );

            if ( resizingBar.endMinute - resizingBar.startMinute <= 0 ) {
                resizingBar.startMinute -= resizeLeft * ( snapMin );
                resizingBar.endMinute -= resizeRight * ( snapMin );
            };

            if ( resizingBar.startMinute < 0 ) {
                console.log( `NEW TIME: clamping at 0`)
                const dif = resizingBar.startMinute;
                resizingBar.startMinute = 0;
                resizingBar.endMinute -=  resizeRight * dif;
            };

            console.log( `NEW TIME: upperbound: ${hoursToMinutes( 24 )}`);


            if ( resizingBar.endMinute >= hoursToMinutes( 24 ) ) {
                console.log( `NEW TIME: clamping at ${ hoursToMinutes( 24 )}`)

                const dif = resizingBar.endMinute - hoursToMinutes( 24 );
                resizingBar.startMinute -= resizeLeft * dif;
                resizingBar.endMinute = hoursToMinutes( 24 );
            };

            console.log( `NEW TIME: startingMin: ${resizingBar.startMinute} endingMin: ${resizingBar.endMinute}`)

            pointerStartX = clientX;
            
            resizeBar( resizingBarHTML, resizingBar );
            updateDuration( resizingBar );
            writeToStorage();
        };

    };

    // TRIGGERS WHEN PANNING THE GRID OF TASKS
    if ( panning ){
        const clientX = e.clientX || e.touches[0].clientX;

        const pointerOffsetX = clientX - pointerStartX;
        
        if ( gridStartTime - pointerOffsetX <= 0 ) {
            // let t = abs( gridStartTime - pointerOffsetX )
            gridEndTime -= Math.abs( gridStartTime );
            gridStartTime = 0;
        } else if ( gridEndTime-pointerOffsetX >= hoursToPixels(24) ) {
            let t = Math.abs( hoursToPixels(24) - gridEndTime);
            gridStartTime += t;
            gridEndTime = hoursToPixels(24);
        } else {
            gridStartTime -= pointerOffsetX;
            gridEndTime -= pointerOffsetX;
        };
        
        pointerStartX = clientX;
        const allTasks = project.getAll();

        allTasks.forEach( task => {
            const HTML = document.getElementById( `bar-${ task.id }` );
            resizeBar( HTML, task );
        });

        const allHours = hourUL.querySelectorAll("li");

        allHours.forEach( hr => {
            pageBuilder.writeCSS_Hour( hr, hr.id, gridStartTime )
        });
    };
};

// UPDATES THE VISUAL DURATION OF A TASK
function updateDuration( task ) {
    const HTML = document.getElementById( `task-${task.id}` );
    HTML.querySelector( ".time" ).textContent = task.duration;
};

function updateIdleItemsStateAndPosition(){
    const draggableItemRect = draggableItem[ obj.TASK ].getBoundingClientRect();
    const draggableItemY = draggableItemRect.top + draggableItemRect.height / 2;

    Object.values( obj ).forEach( el => {

        if( el === obj.TASK || (el=== obj.BARS && reorderingTasks )){
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
        };
    });

};

// DRAG END
const dragEnd = () => {
    console.log("Drag END");
    if ( resizingBar ){
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
    document.removeEventListener("mouseleave", dragEnd );

};

function applyNewItemOrder() {

    Object.values( obj ).forEach( el => {

        if( el === obj.TASK || (el=== obj.BARS && reorderingTasks )){
        
            const reorderedItems = [];
            const reorderedTasks = [];

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

            if( reorderingTasks ) {
                // THIS SAVES TASKS, BUT NOT PROJECTS
                reorderedItems.forEach( ( item ) => {
                    reorderedTasks.push( project.getTask( item.id.split("-")[1] ) )
                } );
                
                let n = 0;
                reorderedItems.forEach( ( item ) => {

                    draggableList[ el ].appendChild( item );
                    if( el === obj.TASK){
                        item.id = `task-${ n }`;
                        item.querySelector(".delete").id=`delete-${ n }`;
                        item.querySelector(".title").id=`title-${ n }`;
                        item.querySelector(".switch-color").id=`color-${ n }`;

                    } else {
                        item.querySelector(".bar").id = `bar-${ n }`;
                    }
    
                    project.reOrderTask( reorderedTasks[ n ], n);
                    n++;
                });
                project.setReorder();

            } else {

                reorderedItems.forEach( ( item ) => {
                    reorderedTasks.push( database.getProject( item.id.split("-")[1] ) )
                } );
                
                let n = 0;
                reorderedItems.forEach( ( item ) => {
                    draggableList[ el ].appendChild( item );
                    item.id = `project-${ n }`;
                    item.querySelector("button").id = `button-${ n }`;
                    item.querySelector("input").id = `input-${ n }`;
                    item.querySelector("button.edit").id = `edit-${ n }`;
                    item.querySelector("button.delete").id = `delete-${ n }`;
    
                    database.reOrderTask( reorderedTasks[ n ], n);
                    n++;
                });
                database.setReorder();
            }

        };
    });

    // MAKE SURE THE BUTTON IS LAST
    if ( !reorderingTasks ){
        const button = document.querySelector( ".new-project" );
        draggableList[ obj.TASK ].appendChild( button );
    };

    writeToStorage();
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
        if( el === obj.TASK || (el=== obj.BARS && reorderingTasks )){
            draggableItem[ el ].style.transform = null;
            draggableItem[ el ].classList.remove("is-dragging");
            draggableItem[ el ].classList.add("is-idle");
            draggableItem[ el ] = null;
        };
    });
};

function unsetItemState() {
    Object.values( obj ).forEach( el => {
        if( el === obj.TASK || (el=== obj.BARS && reorderingTasks )){
        
            getIdleItems( el ).forEach( (item, i)=> {
                delete item.dataset.isAbove;
                delete item.dataset.isToggled;
                item.style.transform = '';
            });
        };
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

    let n = 0;

    project.getAll().forEach( item => {
        const HTML = document.getElementById( `task-${ item.id }`);
        const BAR = document.getElementById( `bar-${item.id}` );

        HTML.id = `task-${ n }`;
        HTML.querySelector(".delete").id=`delete-${ n }`;
        HTML.querySelector(".title").id=`title-${ n }`;
        HTML.querySelector(".switch-color").id=`color-${ n }`;
        BAR.id = `bar-${ n }`;

        project.reOrderTask( item, n);
        n++;
    });
    project.setReorder();    

    writeToStorage();
};

function deleteProject( e ) {
    const id = e.currentTarget.id.split("-")[1];
    const projectHTML = document.getElementById(`project-${id}`);
    database.deleteProject( id );
    projectHTML.remove();
        
    let n = 0;
    const list = document.getElementById( "projects" );
    console.log( list )
    database.getAll().forEach( item => {
        const HTML = document.getElementById( `project-${ item.id }`);
        // list.appendChild( HTML );
        HTML.id = `project-${ n }`;
        HTML.querySelector("button").id = `button-${ n }`;
        HTML.querySelector("input").id = `input-${ n }`;
        HTML.querySelector("button.edit").id = `edit-${ n }`;
        HTML.querySelector("button.delete").id = `delete-${ n }`;
        database.reOrderTask( item, n);
        n++;
    });

    // list.append( document.querySelector("li.new-project"));
    database.setReorder();
    writeToStorage();
};

function changedColor( e ) {
    // console.log( e.key )
    if( e.key || e.target === dialog ) {
        console.log("cancel!!")
    };

    if( e.currentTarget.nodeName == "BUTTON" ) {
        console.log( "new color!" );
        task.color = e.target.closest(".inkwell-square").id;
        const taskColorBox = document.getElementById( `color-${ task.id }` ).children[0];
        const taskBar = document.getElementById( `bar-${ task.id }` );
        if( !task.isComplete ){
            pageBuilder.writeCSS_NewBackgroundColor( taskColorBox, task.color );
            pageBuilder.writeCSS_NewBackgroundColor( taskBar, task.color );
        }

        writeToStorage();
    };

    // ADD LISTENERS TO ALL THE BUTTONS
    Array.from(inkwell.children).forEach( li => {
        li.querySelector("button").removeEventListener("click", changedColor );
    });

    dialog.removeEventListener("click", changedColor );
    dialog.removeEventListener( 'keydown', changedColor );

    dialog.close();
};

function switchColor( e ) {
    dialog.showModal();

    pointerStartX = e.clientX || e.touches[0].clientX;
    pointerStartY = e.clientY || e.touches[0].clientY;

    const inkBox = dialog.querySelector(".mouse-relative");

    pageBuilder.writeCSS_MouseRelative( inkBox, pointerStartX, pointerStartY );
    
    const id = e.currentTarget.id.split("-")[1];
    task = project.getTask( id ); 
    
    // ADD LISTENERS TO ALL THE BUTTONS
    Array.from(inkwell.children).forEach( li => {
        if( li.querySelector("img") ) { li.querySelector("img").remove(); }
        li.querySelector("button").addEventListener("click", changedColor );
    });

    // ADD A CHECK TO DIALOG
    // console.log( task.color );
    console.log( task.color );
    const inkwellSquare = document.getElementById( task.color );
    inkwellSquare.appendChild( pageBuilder.getHTML_check() );
    
    // ADD LISTENER TO CLICK AWAY
    dialog.addEventListener("click", changedColor );

    // ADD LISTENER FOR ENTER/ESCAPE
    dialog.addEventListener( 'keydown', changedColor );

};

function writeProject( e ) {
    // console.log("writing project")
    if (e.key === 'Enter') {
        console.log("enter");

        // editSave = true;
        e.target.blur();
        return;
    };

    if (e.key === 'Escape') {
        console.log("escape");

        const id = e.currentTarget.id.split("-")[1];
        const proj = database.getProject( id );
        e.currentTarget.value = proj.title;

        editSave = false;
        e.target.blur();
        return;
    };

    if( e.type == "blur" ) {
        let id = -1;

        if( editSave ) {
            console.log('saving to database');
            id = e.currentTarget.id.split("-")[1];
            const proj = database.getProject( id );
            proj.title = e.currentTarget.value;
            database.writeProject( proj );
        };

        editSave = true;
        writeToStorage();
        drawPage( page.TASK, id );
        return
    };

};

function writeProjectTitle( e ) {
    if (e.key === 'Enter') {
        console.log("enter");

        e.target.blur();
        return;
    };

    if (e.key === 'Escape') {
        console.log("escape");

        e.currentTarget.value = project.title;

        editSave = false;
        e.target.blur();
        return;
    };

    if( e.type == "blur" ) {

        if( editSave ) {
            console.log('saving to database');

            project.title = e.currentTarget.value;
            database.writeProject( project );
            writeToStorage();
        };
        editSave = true;
        return
    };
}

function toggleTaskComplete( e ) {
    // TRIGGERS WHEN TASK CHECKBOX IS CLICKED
    const id = e.currentTarget.closest("li").id.split("-")[1];
    const task = project.getTask( id );
    task.isComplete = e.currentTarget.checked;
    console.log(`toggeling checkbox: ${task.title}, id: ${task.id}, isComplete: ${task.isComplete}`);

    if( task.isComplete ) {
        console.log( `gray it out!` );
        pageBuilder.writeCSS_barCompleted( document.getElementById( `bar-${id}`));
    } else {
        console.log( `full color!` );
        pageBuilder.writeCSS_barNotCompleted( document.getElementById( `bar-${id}`), task.color);
    };
    writeToStorage();
};

function toggleTaskPriority( e ) {
    console.log( `toggling priority` );
    const id = e.currentTarget.closest("li").id.split("-")[1];
    const task = project.getTask( id );
    task.increasePriority();

    pageBuilder.writeCSS_priority( e.currentTarget.querySelector("img"), task );
    writeToStorage();
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
            writeToStorage();
        };
        editSave = true;
        return
    };
};

function createNewProject( e ) {
    console.log("new Project!");

    document.getElementById("new-project").classList.add("remove");

    let proj = new Project();
    database.writeProject( proj );
    console.log( database )

    const projectHTML = pageBuilder.getHTML_Project( proj );
    projectHTML.querySelector(".overlays").remove();
    projectHTML.querySelector(".grab").classList.remove( "hidden" );
    projectHTML.querySelector(".grab").classList.add( "hidden-x" );

    const titleButtonHTML = projectHTML.querySelector("button.project");
    const titleInputHTML = projectHTML.querySelector("input.project");
    
    titleButtonHTML.classList.add( "remove" );
    titleInputHTML.classList.remove( "remove" );
    
    console.log( titleButtonHTML )
    console.log( titleInputHTML )

    let w = pageBuilder.getWidth_H3( proj.title );
    w = Math.min( w + 400 , document.body.clientWidth - 15 );
    projectHTML.style.width = `${ w }px`;
    
    projects.insertBefore( projectHTML, document.getElementById("projects").lastChild );
    titleInputHTML.focus();
    titleInputHTML.select();

    titleInputHTML.addEventListener( 'blur', writeProject );
    titleInputHTML.addEventListener( 'keydown', writeProject );

    writeToStorage();
};

function resizeBar( HTML, task ) {
    
    pageBuilder.writeCSS_Resize_Task(
        HTML,
        task.startMinute * minutePixels,
        task.endMinute * minutePixels,
        gridStartTime,
        gridEndTime
    );
};

function createNewTask( e ) {
    const startMinute = gridStartTime + hoursToMinutes( newTaskStartingOffsetHour);
    const endMinute = startMinute + hoursToMinutes( 1 + Math.floor(Math.random() * 3 ) );

    console.log( `task--startMinute: ${ startMinute } endMinute: ${ endMinute }` );
    let task = new Task();

    task.startMinute = startMinute;
    task.endMinute = endMinute;

    task.title = "New Task";
    project.writeTask( task );

    const taskHTML = pageBuilder.getHTML_Task( task );
    taskList.appendChild( taskHTML );

    const barHTML = pageBuilder.getHTML_Bar( task );

    gridUL.appendChild( barHTML );

    resizeBar( barHTML.querySelector(".bar"), task );
    
    const checkInput = taskHTML.querySelector("input.done");
    checkInput.addEventListener( 'change', toggleTaskComplete );

    const flagButton = taskHTML.querySelector("button.flag");
    flagButton.addEventListener( 'click', toggleTaskPriority );
    
    const titleInput = taskHTML.querySelector("input.title");
    titleInput.focus();
    titleInput.select();
    
    taskHTML.querySelector( "button.delete" ).addEventListener( 'click', deleteTask )
    taskHTML.querySelector("button.switch-color").addEventListener( "click", switchColor );
    // task.addEventListener('focus', editTaskTitle);
    titleInput.addEventListener( 'blur', writeTaskTitle );
    titleInput.addEventListener( 'keydown', writeTaskTitle );


    updateListeners();
    writeToStorage();    
};


setup();