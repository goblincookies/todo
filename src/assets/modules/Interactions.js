class DragToResize {

    // RESIZE
    // SLIDE

    // const cell = 32
    // let dragging = false;
    // let resizingLeft = false;
    // let resizingRight = false;
    
    draggableItem;
    draggableTask;

    constructor() {
        this.setup();
    };
    
    createListeners() {
        let classes = "resize slide";

        classes.split(" ").forEach ( el => {
            this.reorderableItems = document.querySelectorAll( `.${ el }`);

            if (!this.reorderableItems) return;
    
            this.reorderableItems.forEach( item => {
                console.log(item);
                item.addEventListener("mousedown", this.dragStart);
                item.addEventListener("touchstart", this.dragStart);
            });
        });
    };

    update() {
        this.createListeners();
    }

    setup() {
        this.createListeners();
        document.addEventListener("mouseup", this.dragEnd );
        document.addEventListener("touchend", this.dragEnd);
    };

    // DRAG START
    dragStart = (e) => {
        console.log("DRAG START");

        if(e.currentTarget.classList.contains("resize")){
            console.log("RESIZING!!")
            let bar = e.currentTarget.parentNode;
        };

        if(e.target.classList.contains("slide")){
            console.log("SLIIIIDING!!")
        };
    };

    // let draggedBar;
    // let draggedTask;
    // let mouseOrigin = { x:0,y:0 };
    // let lastPos = {x:0, y:0 };
    // let newPos = {x:0, y:0 };
    // let offset = {x:0, y:0 };
    // let oversize = { x: 4*cell,y: 4*cell };
    // let mousePos = { x:0,y:0 };
    // let mouseDown = false;
    // let inBounds = false;
    // let today = new Date();
    // let startDate = new Date("0000-01-01");
    // let gridStartDate = 1;
    // let gridEndDate = 1;
    // // let gridCellCount = 1;
    // let allBars = [];
    
    // if (!Array.prototype.last){
    //     Array.prototype.last = function(){
    //         return this[this.length - 1];
    //     };
    // };

    // function setup(){
    //     gridStartDate = Math.round((today-startDate)/ 60000);
    //     gridEndDate = gridStartDate + Math.floor((gridSec.offsetWidth));
    //     // gridStartColumn = Math.floor( gridStartColumn / 15 );
        
    //     let section = new Task();
    //     section.isSection = true;
    //     project.writeTask( section );
    //     leftSec.appendChild( pageBuilder.getHTML_Task( section ) );
    
    //     console.log(`[grid] startDate: ${gridStartDate} endDate: ${gridEndDate} `);
    
    //     // let hourCount = Math.floor(gridCellCount/4)+1;
    //     // hourSec.style.gridTemplateColumns = `repeat( ${ hourCount } , ${ cell*4 }px )`;
    
    //     let taskStartDate = Math.round((today-startDate)/ 60000);
    //     taskStartDate = taskStartDate + 200;
    //     // let gridColumn = {start:0, span:0};
    
    //     const fakeTasks = 25;
    
    //     for (let i = 0; i < fakeTasks; i++) {
    //         let task = new Task();
    //         task.startDate = taskStartDate + Math.floor( Math.random()*200 );
    //         task.endDate = taskStartDate + 450 + Math.floor( Math.random()*200 ); // * Math.floor( Math.random()*15 );
    //         task.title = task.startDate+"";
    //         project.writeTask( task );
    
    //         leftSec.appendChild( pageBuilder.getHTML_Task( task ) );
    
    //         allBars.push( pageBuilder.getHTML_Bar( task ) );
    //         gridSec.appendChild( allBars.last() );
    
    //         allBars.last().querySelector(".grab").addEventListener("mousedown", draggingBar);
    //         allBars.last().querySelector(".grab").addEventListener("mouseup", dropBar);
    
    //         allBars.last().querySelector(".align-left").addEventListener("mousedown", resizingLeftStart);
    //         allBars.last().querySelector(".align-right").addEventListener("mousedown", resizingRightStart);
    
    //         allBars.last().querySelector(".align-left").addEventListener("mouseup", resizingLeftDone);
    //         allBars.last().querySelector(".align-right").addEventListener("mouseup", resizingRightDone);
    
    
    
    //         if ( converter.inBounds( task.startDate, task.endDate, gridStartDate, gridEndDate ) ) {
    //             pageBuilder.writeTransfomCSS( allBars.last(), task.startDate, task.endDate, gridStartDate, gridEndDate );
    //         } else {
    //             pageBuilder.hideHTML( allBars.last() );
    //         };
    
    //     };
    
    //     for (let i = 0; i < 3; i++) {
    //         dateSec.appendChild( pageBuilder.getHTML_Date( i ) );
    //     }
    
    //     // for (let i = 0; i < hourCount; i++) {
    //     //     hourSec.appendChild( pageBuilder.getHTML_Hour( gridStartColumn + (i*4) ) );
    //     // }
    
    // };

    // function draggingBar( e ) {
    //     console.log(`clicked ${e.currentTarget.id}!!!!!!!!1`);
    //     dragging = true;
    //     draggedBar = e.currentTarget.parentNode.parentNode;
    //     draggedTask = project.getTask( draggedBar.id.split("-")[1] );
    // };
    // function resizingLeftStart(e){
    //     resizingLeft = true;
    //     draggedBar = e.currentTarget.parentNode.parentNode;
    //     draggedTask = project.getTask( draggedBar.id.split("-")[1] );
    // };
    // function resizingRightStart(e){
    //     resizingRight = true;
    //     draggedBar = e.currentTarget.parentNode.parentNode;
    //     draggedTask = project.getTask( draggedBar.id.split("-")[1] );
    // };
    // function resizingLeftDone () {
    //     resizingLeft = false;
    //     draggedBar = "";
    //     draggedTask = "";
    // };
    // function resizingRightDone() {
    //     resizingRight = false;
    //     draggedBar = "";
    //     draggedTask = "";
    // };
    // function dropBar( e ) {
    //     console.log(`released ${e.currentTarget.id}!!!!!!!!1`);
    //     dragging = false;
    //     draggedBar = "";
    //     draggedTask = "";
    // };
    
    
    // // KEEP TRACK OF MOUSE FOR DOWN
    // document.body.onmousedown = function (e) {
    //     lastPos.x = e.clientX;
    //     // mouseOrigin.y = e.clientY;
    //     // lastPos.x = 0;
    //     mouseDown=true;
    // };
    // document.body.onmouseup = function () {
    //     // inBounds=false;
    //     offset = {x:0, y:0 };
    //     lastPos.x = 0;
    //     mouseDown=false;
    //     dragging = false;
    //     resizingLeft=false;
    //     resizingRight=false;
    
    // };
    // rightSec.onmouseenter = () => inBounds=true;
    // rightSec.onmouseleave = () => inBounds=false;
    
    
    // onmousemove = function(e){
    
    //     if( mouseDown && inBounds && dragging ) {
    //         console.log(`dragging ${ draggedBar.id }!!!!!!!!1`);
    
    //         mousePos.x = e.clientX;
    
    //         draggedTask.startDate -= (lastPos.x - mousePos.x);
    //         draggedTask.endDate -= (lastPos.x - mousePos.x);
    //         lastPos.x = mousePos.x;
    
    //         if( draggedBar && draggedTask ) {
    //             if ( converter.inBounds( draggedTask.startDate, draggedTask.endDate, gridStartDate, gridEndDate ) ) {
    //                 pageBuilder.writeTransfomCSS( draggedBar, draggedTask.startDate, draggedTask.endDate, gridStartDate, gridEndDate );
    //             } else {
    //                 console.log(`ts:${draggedTask.startDate}, tE:${draggedTask.endDate}, gS:${gridStartDate}, gE:${gridEndDate},`)
    
    //                 pageBuilder.hideHTML( draggedBar );
    //             };
    //         }
    //     };
    
    //     if( mouseDown && inBounds && resizingLeft ) {
    //         console.log(`resizing left! ${ draggedBar.id }!!!!!!!!1`);
    
    //         mousePos.x = e.clientX;
    
    //         draggedTask.startDate -= (lastPos.x - mousePos.x);
    //         // draggedTask.endDate -= (lastPos.x - mousePos.x);
    //         lastPos.x = mousePos.x;
    
    //         if( draggedBar && draggedTask ) {
    //             if ( converter.inBounds( draggedTask.startDate, draggedTask.endDate, gridStartDate, gridEndDate ) ) {
    //                 pageBuilder.writeTransfomCSS( draggedBar, draggedTask.startDate, draggedTask.endDate, gridStartDate, gridEndDate );
    //             } else {
    //                 console.log(`ts:${draggedTask.startDate}, tE:${draggedTask.endDate}, gS:${gridStartDate}, gE:${gridEndDate},`)
    
    //                 pageBuilder.hideHTML( draggedBar );
    //             };
    //         }
    //     };
    
    //     if( mouseDown && inBounds && resizingRight ) {
    //         console.log(`resizing Right ${ draggedBar.id }!!!!!!!!1`);
    
    //         mousePos.x = e.clientX;
    
    //         // draggedTask.startDate -= (lastPos.x - mousePos.x);
    //         draggedTask.endDate -= (lastPos.x - mousePos.x);
    //         lastPos.x = mousePos.x;
    
    //         if( draggedBar && draggedTask ) {
    //             if ( converter.inBounds( draggedTask.startDate, draggedTask.endDate, gridStartDate, gridEndDate ) ) {
    //                 pageBuilder.writeTransfomCSS( draggedBar, draggedTask.startDate, draggedTask.endDate, gridStartDate, gridEndDate );
    //             } else {
    //                 console.log(`ts:${draggedTask.startDate}, tE:${draggedTask.endDate}, gS:${gridStartDate}, gE:${gridEndDate},`)
    
    //                 pageBuilder.hideHTML( draggedBar );
    //             };
    //         }
    //     };
    
    //     if ( mouseDown && inBounds && !dragging ) {
    
    //         mousePos.x = e.clientX;
    //         gridStartDate += (lastPos.x - mousePos.x);
    //         gridEndDate += (lastPos.x - mousePos.x);
    //         // console.log(`grid -- start Date: ${gridStartDate}, end Date: ${gridEndDate}`)
    
    //         lastPos.x = mousePos.x;
    
    //         shiftBars();
    
    //     };
    // };
    
    
    
    // window.addEventListener('resize', resize);
    
    
    
    // function shiftBars() {
        
    //     allBars.forEach ( bar => {
    
    //         const task = project.getTask( bar.id.split("-")[1] );
    
    //         if ( converter.inBounds( task.startDate, task.endDate, gridStartDate, gridEndDate ) ) {
    //             pageBuilder.writeTransfomCSS( bar, task.startDate, task.endDate, gridStartDate, gridEndDate );
    //         } else {
    //             pageBuilder.hideHTML( bar );
    //         };
    
    //     });
    
    //     // let n = 0;
    
    //     // hourSec.querySelectorAll(".hour").forEach ( HTML => {
    //     //     HTML.textContent = gridStartColumn + (n * 4)
    //     //     n+=1;
    //     // });
    
    // };
    
    // function resize(e) {
    //     gridEndDate = gridStartDate + Math.floor((gridSec.offsetWidth));
    
    //     // gridCellCount = Math.floor(gridSec.offsetWidth / cell );
    //     // --cell: 32px;
    //     // grid-template-columns: repeat(36, var(--cell));
    //     // gridSec.style.gridTemplateColumns = `repeat( ${ gridCellCount } , ${ cell }px )`;
    //     // grid-template-columns: repeat( calc(36/4), calc( var(--cell) * 4) );
    //     // hourSec.style.gridTemplateColumns = `repeat( ${ Math.floor(gridCellCount/4)+1 } , ${ cell*4 }px )`;
    // };

};

class DragToReorder {
    // BUILT OFF THIS REPO
    // https://github.com/TahaSh/drag-to-reorder/blob/main/main.js

    obj = {
        TASK:0,
        BARS:1
    }

    draggableList = [];
    draggableItem = [];
    pointerStartX
    pointerStartY
    itemsGap = 0;
    items = [];

    constructor(){
        this.setup();
    };

    getAllItems( el ) {
        if (!this.items[ el ]?.length) {
            this.items[ el ] = Array.from( this.draggableList[ el ].querySelectorAll(".reorderable"))
        };
        return this.items[ el ];
    };

    getIdleItems( el ) {   
        return this.getAllItems( el ).filter( (item) => item.classList.contains("is-idle"));
    };

    isItemAbove( item ) {
        return item.hasAttribute( 'data-is-above');
    };

    isItemToggled( item ) {
        return item.hasAttribute( 'data-is-toggled');
    };

    createReorderableListeners() {
        let reorderableItems = document.querySelectorAll(".drag-handle");
        if (!reorderableItems) return;

        reorderableItems.forEach( item => {
            console.log(item);
            item.addEventListener("mousedown", this.dragStart);
            item.addEventListener("touchstart", this.dragStart);

        });
    };

    update() {
        this.createReorderableListeners();
    };

    // SETUP
    setup() {
        this.createReorderableListeners();

        document.addEventListener("mouseup", this.dragEnd );
        document.addEventListener("touchend", this.dragEnd);
    };

    // DRAG START
    dragStart = (e) => {
        console.log("Drag Start!!");

        if (e.currentTarget.classList.contains("drag-handle")) {
            // console.log(`found drag-handle!`);
            this.draggableItem[ this.obj.TASK ] = e.target.closest(".reorderable");
            let grabbedID = this.draggableItem[this.obj.TASK].id;
            grabbedID = grabbedID.split("-")[1];
            this.draggableItem[ this.obj.BARS ] = document.getElementById(`bar-${grabbedID}`).parentNode;
            // console.log(this.draggableItem[this.obj.BARS])

            this.draggableList[ this.obj.TASK ] = e.target.closest(".reorderable-list");
            this.draggableList[ this.obj.BARS ] = document.querySelector(".reorderable-bars");

        };

        if(!this.draggableItem[ this.obj.TASK ]) return;

        this.pointerStartX = e.clientX || e.touches[0].clientX;
        this.pointerStartY = e.clientY || e.touches[0].clientY;

        this.setItemsGap();
        this.disablePageScroll();
        this.initItemState();
        this.initDraggableItem();

        // document.addEventListener("mousemove", this.drag.bind( this ) );
        document.addEventListener("mousemove", this.drag );

        document.addEventListener("touchmove", this.drag, {passive: false});
        console.log(`finished!`);
    };

    setItemsGap(){
        if( this.getIdleItems( this.obj.TASK ).length <=1) {
            this.itemsGap = 0;
            return;
        };

        const item1 = this.getIdleItems( this.obj.TASK )[0];
        const item2 = this.getIdleItems( this.obj.TASK )[1];

        const item1Rect = item1.getBoundingClientRect();
        const item2Rect = item2.getBoundingClientRect();

        this.itemsGap = Math.abs( item1Rect.bottom - item2Rect.top);
    };

    disablePageScroll(){
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        document.body.style.userSelect = 'none';

    };

    initItemState() {
        Object.values( this.obj ).forEach( el => {
            this.getIdleItems( el ).forEach( (item, i) => {
                console.log(item, i)
                if( this.getAllItems( el ).indexOf( this.draggableItem[ el ] ) > i ) {
                    item.dataset.isAbove = '';
                };
            });
        });
    };

    initDraggableItem() {
        Object.values( this.obj ).forEach( el => {
            this.draggableItem[ el ].classList.remove("is-idle");
            this.draggableItem[ el ].classList.add("is-dragging");
        });
    };

    // DRAG
    drag = (e) => {
        console.log(`draggggging!!`);
        
        if (!this.draggableItem[ this.obj.TASK ]) return;

        e.preventDefault();

        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;

        const pointerOffsetX = clientX - this.pointerStartX;
        const pointerOffsetY = clientY - this.pointerStartY;

        this.draggableItem[ this.obj.TASK ].style.transform = `translate(${pointerOffsetX}px, ${pointerOffsetY}px)`
        this.draggableItem[ this.obj.BARS ].style.transform = `translateY(${pointerOffsetY}px)`;
        
        this.updateIdleItemsStateAndPosition( );
    };

    updateIdleItemsStateAndPosition(){
        const draggableItemRect = this.draggableItem[ this.obj.TASK ].getBoundingClientRect();
        const draggableItemY = draggableItemRect.top + draggableItemRect.height / 2;

        Object.values( this.obj ).forEach( el => {
            // UPDATE STATE
            this.getIdleItems( el ).forEach( (item) => {
                const itemRect = item.getBoundingClientRect();
                const itemY = itemRect.top + itemRect.height/2;
                if ( this.isItemAbove(item)) {
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
            this.getIdleItems( el).forEach( (item) => {
                if (this.isItemToggled( item )) {
                    const direction = this.isItemAbove(item) ? 1 : -1;
                    item.style.transform = `translateY( ${ direction * (draggableItemRect.height + this.itemsGap)}px)`;
                } else {
                    item.style.transform = '';
                };
            });

        });
        

        // UPDATE POSITIONS
        this.getIdleItems( this.obj.TASK ).forEach( (item) => {
            if (this.isItemToggled( item )) {
                const direction = this.isItemAbove(item) ? 1 : -1;
                item.style.transform = `translateY( ${ direction * (draggableItemRect.height + this.itemsGap)}px)`;
            } else {
                item.style.transform = '';
            };
        });
    };

    // DRAG END
    dragEnd = () => {
        console.log("Drag END");
        if (!this.draggableItem[ this.obj.TASK ]) return;

        this.applyNewItemOrder();
        this.cleanup();

        // document.addEventListener("mousemove", this.drag.bind( this ) );
        document.removeEventListener("mousemove", this.drag );
        document.removeEventListener("touchmove", this.drag);
    };

    applyNewItemOrder() {
        Object.values( this.obj ).forEach( el => {

            const reorderedItems = [];

            this.getAllItems( el ).forEach( (item, index) => {
                if ( item === this.draggableItem[ el ]) {
                    return;
                };
                if( !this.isItemToggled(item)) {
                    reorderedItems[index] = item;
                    return;
                };
                const newIndex = this.isItemAbove(item) ? index + 1 : index -1;
                reorderedItems[newIndex] = item;
            } );

            for (let index = 0; index < this.getAllItems( el ).length; index++) {
                const item = reorderedItems[index];
                if(typeof item === 'undefined') {
                    reorderedItems[index] = this.draggableItem[ el ];
                };
            };

            reorderedItems.forEach( (item) => {
                this.draggableList[ el ].appendChild( item );
            });
        });
    };

    cleanup() {
        this.itemsGap = 0;
        this.unsetItemState();
        this.unsetDraggable();
        this.enablePageScroll();
        this.items = [];
        this.draggableList = [];
        
        document.removeEventListener("mousemove", this.drag);
        document.removeEventListener("touchmove", this.drag);
    };

    unsetDraggable() {
        Object.values( this.obj ).forEach( el => {
            this.draggableItem[ el ].style = null;
            this.draggableItem[ el ].classList.remove("is-dragging");
            this.draggableItem[ el ].classList.add("is-idle");
            this.draggableItem[ el ] = null;
        });
    };

    unsetItemState() {
        Object.values( this.obj ).forEach( el => {
            this.getIdleItems( el ).forEach( (item, i)=> {
                delete item.dataset.isAbove;
                delete item.dataset.isToggled;
                item.style.transform = '';
            });
        });
    };

    enablePageScroll() {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.body.style.userSelect = '';
    };

};

export { DragToReorder, DragToResize };