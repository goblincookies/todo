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
let grid;

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
let gridStartDate = 0;
let gridEndDate = 1;

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
    let classes = "drag-handle resize slide";

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


function setup () {
    // const taskBuilder = new TaskBuilder();
    console.log("setup")
    // dragManager.UL()
    const content = document.getElementById("content");
    content.appendChild( pageBuilder.getHTML_ProjectPage() );
    leftSec = document.getElementById( "left" );
    taskList = document.getElementById( "task-list" );
    grid = document.getElementById("grid");

    let today = new Date();
    let startDate = new Date("0000-01-01");

    gridStartDate = Math.round((today-startDate)/ 60000);
    gridEndDate = gridStartDate + Math.floor((grid.offsetWidth));

    const newTask = document.getElementById( "new-task" );
    newTask.addEventListener("click", createNewTask );

    createListeners();

    document.addEventListener("mouseup", dragEnd );
    document.addEventListener("touchend", dragEnd);
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
    console.log(`draggggging!!`);
    
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
        // const pointerOffsetY = clientY - pointerStartY;
        resizingBar.startDate += resizeLeft * (pointerOffsetX);
        resizingBar.endDate += resizeRight * (pointerOffsetX);
        pointerStartX = clientX;
        pageBuilder.writeCSS_Resize_Task( resizingBarHTML, resizingBar.startDate, resizingBar.endDate, gridStartDate, gridEndDate)
        // draggableItem[ obj.TASK ].style.transform = `translate(${pointerOffsetX}px, ${pointerOffsetY}px)`
        // draggableItem[ obj.BARS ].style.transform = `translateY(${pointerOffsetY}px)`;
    }

};

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
    }

    if ( draggableItem[ obj.TASK ] ) {
        applyNewItemOrder();
        cleanup();
    }

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
    let today = new Date();
    let startDate = new Date("0000-01-01");

    let task = new Task();
    let taskStartDate = Math.round((today-startDate)/ 60000);
    
    task.startDate = taskStartDate + Math.floor( Math.random()*200 );
    task.endDate = taskStartDate + 450 + Math.floor( Math.random()*200 ); // * Math.floor( Math.random()*15 );
    task.title = task.startDate+"";
    project.writeTask( task );

    const taskHTML = pageBuilder.getHTML_Task( task );
    taskList.appendChild( taskHTML );
    const barHTML = pageBuilder.getHTML_Bar( task );
    grid.appendChild( barHTML );
    pageBuilder.writeCSS_Resize_Task( barHTML.querySelector(".bar"), task.startDate, task.endDate, gridStartDate, gridEndDate )

    const titleInput = taskHTML.querySelector("input.title");
    titleInput.focus();
    titleInput.select();

    // task.addEventListener('focus', editTaskTitle);
    titleInput.addEventListener( 'blur', writeTaskTitle );
    titleInput.addEventListener( 'keydown', writeTaskTitle );

    updateListeners();
    
};


setup();