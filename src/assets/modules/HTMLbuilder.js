import { Project, Task } from "./DATAmanager";
import fileClose from "../images/close.svg";
import fileFlag from "../images/flag.svg";
import fileDrag from "../images/drag.svg";
import fileCheck from "../images/check.svg";
import fileArrow from "../images/right.svg";
import dragVert from "../images/dragVert.svg";
import editSvg from "../images/edit.svg";
import deleteSvg from "../images/delete.svg";



class PageBuilder {

    priority = {
        NON: 0,
        LOW: 1,
        MED: 2,
        HIGH:3,
        CRIT:4
    };

    createElement ( type, classes, src) {
        let element = document.createElement( type );
        for(const el of classes.split(" ")) {
            if (el == " " | el == "" ) { break; }
            element.classList.add( el);
        };
        if (src) { element.src = src; }
        return element;
    };

    isNotProject( p ) {
        if ( p instanceof Project ) { return false; }

        console.log(`${typeof p } is not a Project Object`);
        return true;
    };

    isNotTask( t ) {
        if ( t instanceof Task ) { return false; }

        console.log(`${typeof t } is not a Task Object`);
        return true;
    };

    getHTML_Inkwell() {
        // <dialog class="fixed fullscreen fadeout">
        //     <div class="upper-left-corner min-size pad-1 bkggray5">
        //         <ul class="colors grid-inkwell" id="inkwell"> --- </ul>
        //     </div>
        // </dialog>
        const inkwellDialog = this.createElement("dialog", "fullscreen fadeout");
        const inkwellDiv = this.createElement("div", "mouse-relative fixed min-size pad-1 bkggray5");
        const inkwellUl = this.createElement("ul", "colors grid-inkwell")

        inkwellUl.id = "inkwell";

        inkwellDiv.appendChild( inkwellUl );
        inkwellDialog.appendChild( inkwellDiv );

        return inkwellDialog;
    };

    getHTML_check( ) {
        // <img class="svg-glow" src="./assets/images/check.svg" alt="">
        const checkImg = this.createElement( "img", "svg-glow", fileCheck );
        return checkImg;
    }

    getHTML_InkwellSquare( hex ) {
        // <li>
        //     <button class="div-button">
        //         <div class="inkwell-square">
        //             ***** <img class="svg-glow" src="./assets/images/check.svg" alt="">
        //         </div>
        //     </button>
        // </li>
        const mainLi = this.createElement( "li", "" );
        const button = this.createElement( "button", "div-button" );
        const inksquareDiv = this.createElement( "div", "inkwell-square" );
        inksquareDiv.style.backgroundColor = hex;
        // const button = this.createElement( "button", "inkwell-square" );

        button.appendChild( inksquareDiv );
        mainLi.appendChild( button );
        return mainLi;
    };

    // RENAME THIS
    // PROJECTS
    getHTML_ProjectSelect() {
        // <ul id="projects">
        //     <li class="flex-h-left">
        //         <div class="spacer-5"></div>
        //         <button class="task-button">
        //             <h3 class="text-sm upper gray0 trunc">+New Project</h3>
        //         </button>
        //     </li>
        // </ul>

        const mainUL = this.createElement("ul", "reorderable-list");
        const mainLi = this.createElement("li", "flex-h-left new-project");
        const spacerDiv = this.createElement("div", "spacer-5");
        const projButton = this.createElement("button", "task-button");
        const projH3 = this.createElement("h3", "text-sm upper gray0 trunc");

        mainUL.id = "projects";
        projButton.id = "new-project";
        projH3.textContent = "+New Project";

        // build( { mainUL, mainLi, spacerDiv, projButton, projH3 })

        projButton.appendChild( projH3 );
        mainLi.appendChild( spacerDiv );
        mainLi.appendChild( projButton );
        mainUL.appendChild( mainLi );

        return mainUL;
    }

    // RENAME THIS, IT"S CONFUSING
    // VIEW??
    getHTML_ProjectPage() {

        // <div class="chart" id="chart">
        //     <div class="flex-h-left-bottom">
        //         <div class="left border-right" id="left">
        //              <ul id = "task-list"> --- </ul>
        //          </div>
        //         <div class="right " id="right">
        //             <ul class="flex-h date" id="date"> --- </ul>
        //             <ul class="flex-h hour" id="hour"> --- </ul>
        //             <ul class="grid pan" id="grid"> --- </ul>
        //         </div>
        //     </div>

        //     <div class="flex-h-left-bottom">
        //         <div class="left">
        //             <div class="flex-h-center">
        //                 <button class="task-button" id="new-task">
        //                     <h3 class="text-sm upper gray0 trunc">+New Task</h3>
        //                 </button>
        //             </div>
        //         </div>
        //         <div class="blank right"></div>
        //     </div>
        // </div>

        
        
        const mainDiv = this.createElement("div", "chart");
        const firstDiv = this.createElement("div", "flex-h-left-bottom");
        const leftDiv = this.createElement("div", "left");
        const taskListUl = this.createElement("ul", "reorderable-list");
        const rightDiv = this.createElement("div", "right");
        // const dateUl = this.createElement("ul", "date flex-h");
        const hourUl = this.createElement("ul", "hour flex-h");
        const gridUl = this.createElement("ul", "grid pan reorderable-bars");
        const secDiv = this.createElement("div", "flex-h-left-bottom");
        const secLeftDiv = this.createElement("div", "left");
        const buttonHolderDiv = this.createElement("div", "flex-h-center");
        const secRightDiv = this.createElement("div", "right blank");
        const newTaskButton = this.createElement("button", "task-button");
        const newTaskH3 = this.createElement("h3", "text-sm upper gray0 trun");

        mainDiv.id = "chart";
        leftDiv.id = "left";
        taskListUl.id = "task-list";
        rightDiv.id = "right";
        // dateUl.id = "date";
        hourUl.id = "hour";
        gridUl.id = "grid";
        newTaskButton.id = "new-task";


        newTaskH3.textContent = "+ new task";
        newTaskButton.appendChild( newTaskH3 );
        buttonHolderDiv.appendChild( newTaskButton );
        secLeftDiv.appendChild( buttonHolderDiv );
        secDiv.appendChild( secLeftDiv );
        secDiv.appendChild( secRightDiv );

        // rightDiv.appendChild( dateUl );
        rightDiv.appendChild( hourUl );
        rightDiv.appendChild( gridUl );
        leftDiv.appendChild( taskListUl );
        firstDiv.appendChild( leftDiv );
        firstDiv.appendChild( rightDiv );

        mainDiv.appendChild( firstDiv );
        mainDiv.appendChild( secDiv );

        return mainDiv;
    };

    getHTML_Date( dateText ) {
        // <h3 class="text-sm">MAR 8</h3>
        const mainDiv = this.createElement("h3", "text-sm");
        mainDiv.textContent = dateText;
        return mainDiv;
    }

    getHTML_Hour( rawTime, convertedTime ) {
        // <li class="text-sm" id="1004236">21</li>
        
        const mainDiv = this.createElement("li", "hour text-sm border-left");
        mainDiv.id = rawTime;
        mainDiv.textContent = convertedTime;
        return mainDiv;
    }

    getHTML_Bar( task ) {
        if ( this.isNotTask( task ) ) { return 0; }
        

        // <li class="flex-h">
        //     <div class="bar flex-h-spread" id="bar-1">
        //         <span class="resize align-left"></span>
        //         <span class="resize align-right"></span>
        //     </div>
        // </li>


        // <div class="bar" id="bar-1">
        //      <div class="gizmos">
        //          <span class="resize align-left"></span>
        //          <span class="grab align-full"></span>
        //          <span class="resize align-right"></span>
        //      </div>
        // </div>

        const mainDiv = this.createElement("li", "flex-h reorderable is-idle");
        const barDiv = this.createElement("div", "bar flex-h-spread");
        barDiv.id = "bar-" + task.id;
        const leftSpan = this.createElement("span", "resize align-left");
        const centerSpan = this.createElement("span", "slide grab align-full");
        const rightSpan = this.createElement("span", "resize align-right");

        barDiv.appendChild(leftSpan);
        barDiv.appendChild(centerSpan);
        barDiv.appendChild(rightSpan);
        mainDiv.appendChild(barDiv);

        if( task.isComplete ) {
            this.writeCSS_barCompleted( barDiv );
        } else {
            this.writeCSS_barNotCompleted( barDiv, task.color );
            // barDiv.style.backgroundColor = task.color;
        }
        return mainDiv;
    };

    // updateHTML_Bar( HTML, start, span ) {
    //     // <div class="bar" id="bar-1"></div>
    //     // grid-row: 3;
    //     // grid-column: 2 / span 1;
    //     HTML.style.gridColumn = `${start} / ${span}`;
    //     HTML.classList.remove("hidden");
    // };

    hideHTML( HTML ) {
        HTML.classList.add("hidden");
    };

    writeCSS_barCompleted( HTML ){
        HTML.style.backgroundColor = `#696969`;
    };

    writeCSS_barNotCompleted( HTML, HEX ){
        HTML.style.backgroundColor = HEX;
    };

    writeCSS_MouseRelative( HTML, posX, posY ){
        const rect = HTML.getBoundingClientRect();
        HTML.style.transform =  `translate(${posX - rect.width/2}px, ${posY - rect.height/2 }px)`
    };

    writeCSS_NewBackgroundColor( HTML, hex ) {
        HTML.style.backgroundColor = hex;
    };

    writeCSS_Even_Hour( HTML, i, w, p ) {
        // const rect = HTML.getBoundingClientRect();
        // console.log(rect.width)
        HTML.style.transform = `translateX( ${ (i*w)-p }px)`;
        // HTML.style.transform = `translateX( ${ (i*w)}px)`;
    };

    writeCSS_Hour( HTML, tS, gS ) {
        HTML.style.left = `${ tS-gS }px`;
    };

    // allBars[-1], task.startDate, task.endDate, gridStartDate, gridEndDate
    writeCSS_Resize_Task( HTML, tS, tE, gS, gE ) {
        console.log(`ts:${tS}, tE:${tE}, gS:${gS}, gE:${gE},`)

        // let css = "";
        // let start = Math.max( tS, gS );
        // let end = Math.min( gE, tE );
        // console.log(`HTML: ${HTML},`);
        HTML.style.width = `${ tE-tS }px`;
        // console.log(`transform should be: translateX( ${tS-gS}px)`);
        HTML.style.transform = `translateX( ${ tS-gS }px)`;
        HTML.classList.remove("hidden");
        return;
    };

    getHTML_Project( project ) {
        if ( this.isNotProject( project ) ) { return 0; }
        console.log( project );

        // <li class="flex-h-left gap-1 reveal fade-in pad-sides min-size debugA" id="project-1">
        //     <img src="./assets/images/dragVert.svg" alt="" class="icon-md hidden grab">

        //     <button class="basic-button flex-h-left pad-wide-right" id = "button-1">
        //         <input disabled type="text" class="project text-lg ital heavy upper trunc" value="Project Title Is Long">
        //     </button>

        //     <div class="overlays remove">
        //         <div class="flex-right">
        //             <button class="circle square-md stroke clear">
        //                 <img src="./assets/images/edit.svg" alt="" class="icon-md">
        //             </button>
        //             <button class="circle square-md stroke clear">
        //                 <img src="./assets/images/delete.svg" alt="" class="icon-md">
        //             </button>
        //         </div>
        //     </div>
        // </li>

        console.log("new!")

        // <li class="flex-h-left gap-1 reveal fade-in pad-sides min-size debugB" id="project-1">
        //     <img src="./assets/images/dragVert.svg" alt="" class="icon-md hidden grab">

        //     <button class="project basic-button flex-h-left pad-wide-right text-lg ital heavy upper trunc">New Solution</button>
        //     <input disabled type="text" class="project text-lg ital heavy upper trunc remove" value="New Solution">

        //     <div class="overlays hidden-none">
        //         <div class="flex-right">
        //             <button class="edit circle square-md stroke clear">
        //                 <img src="./assets/images/edit.svg" alt="" class="icon-md">
        //             </button>
        //             <button class="delete circle square-md stroke clear">
        //                 <img src="./assets/images/delete.svg" alt="" class="icon-md">
        //             </button>
        //         </div>
        //     </div>
        // </li>

        const mainLi = this.createElement( "li", "flex-h-left gap-1 reveal fade-in pad-sides min-size reorderable is-idle" );
        const grabImg = this.createElement( "img", "icon-md hidden grab drag-handle no-select", dragVert );
        
        const titleButton = this.createElement( "button", "project basic-button flex-h-left pad-wide-right text-lg ital heavy upper trunc" );
        const titleInput = this.createElement( "input", "project text-lg ital heavy upper trunc remove" );

        const overlayDiv = this.createElement( "div", "overlays hidden-none" );
        const flexDiv = this.createElement( "div", "flex-right" );
        const editButton = this.createElement( "button", "edit circle square-md stroke clear" );
        const editImg = this.createElement( "img", "icon-md", editSvg );

        const deleteButton = this.createElement( "button", "delete circle square-md stroke clear" );
        const deleteImg = this.createElement( "img", "icon-md", deleteSvg );

        // 
        // 
        // 
        console.log( `project Title: ${project.title}` );

        titleInput.value = project.title;
        titleInput.type = "text";
        titleButton.textContent = project.title;

        // titleInput.disabled = true;

        mainLi.id = `project-${project.id}`;
        titleButton.id = `button-${project.id}`;
        titleInput.id = `input-${project.id}`;
        editButton.id = `edit-${project.id}`;
        deleteButton.id = `delete-${project.id}`;

        editButton.appendChild( editImg );
        deleteButton.appendChild( deleteImg );
        
        // titleButton.appendChild( titleInput );

        flexDiv.appendChild( editButton );
        flexDiv.appendChild( deleteButton );
        overlayDiv.appendChild( flexDiv );

        mainLi.appendChild( grabImg );
        mainLi.appendChild( titleButton );
        mainLi.appendChild( titleInput );
        mainLi.appendChild( overlayDiv );

        return mainLi;
    };

    getHTML_Task( task ) {
        if ( this.isNotTask( task ) ) { return 0; }

        console.log( task )
        // <li class="row flex-h-spread reorderable isIdle" id = "task-1">
        //     <button class="circle-button redbkg hidden">
        //         <img src="./assets/images/close.svg" alt="">
        //     </button>

        //     <div class="task flex-h-right ribbon pad">
        //         <button class="img-button hidden grab drag-handle">
        //             <img src="./assets/images/drag.svg" alt="">
        //         </button>

        //         <button class="img-button">
        //             <img src="./assets/images/flag.svg" alt="">
        //         </button>

        //         <input type="checkbox" name="" id="" class="done">
        //         <input class="title text-sm bold trunc" type="text" value="buy a new amp!!!">
        //         **<h3 class="text-sm bold trunc">buy a new amp!!!</h3>**
        //         <p class="time text-sm">41h 15m</p>
        //         <button class="switch-color div-button">
        //             <div class="color hidden"></div>
        //         </button>
        //     </div>
        // </li>

        const mainDiv = this.createElement("li", "row flex-h-spread reorderable is-idle");
        mainDiv.id = `task-${task.id}`;
        const delButton = this.createElement("button", "delete circle-button redbkg hidden");
        delButton.id = `del-${task.id}`;
        const delImg = this.createElement("img", "", fileClose);
        delButton.appendChild( delImg );

        const taskDiv = this.createElement("div", "flex-h-right ribbon pad");
        // console.log(`checking task section: ${task.isSection}`);
        taskDiv.classList.add( ( (task.isSection) ? "section" : "task" ) );

        const dragButton = this.createElement("div", "img-button hidden grab drag-handle debugA");
        // const dragImg = this.createElement("img", "no-select", fileDrag);
        const dragImg = this.createElement("img", "no-select", dragVert);

        dragButton.appendChild( dragImg );
        taskDiv.appendChild( dragButton );

        const flagButton = this.createElement("button", "img-button");
        const flagImg = this.createElement("img", "", fileFlag );
        flagButton.appendChild(flagImg);
        const completedCheck = this.createElement("input", "done");
        completedCheck.type = "checkbox";
        completedCheck.checked = task.isComplete;

        taskDiv.appendChild( flagButton );
        taskDiv.appendChild( completedCheck );
        
        const titleH3 = this.createElement("h3", "text-sm bold trunc");
        const titleInput = this.createElement("Input", "title text-sm bold trunc");
        titleInput.id = `input-${task.id}`;

        titleH3.textContent = task.title;
        titleInput.value = task.title;

        const durationP = this.createElement("p", "time text-sm");
        durationP.textContent = task.duration;
        const colorButton = this.createElement("button", "div-button switch-color");
        colorButton.id = `color-${ task.id }`;
        const colorDiv = this.createElement("div", "color");
        
        colorDiv.classList.add("hidden");   

        colorDiv.style.backgroundColor = task.color;
        colorButton.appendChild(colorDiv);

        taskDiv.appendChild( titleInput );
        taskDiv.appendChild( durationP );
        taskDiv.appendChild( colorButton );
        
        mainDiv.appendChild( delButton );
        mainDiv.appendChild( taskDiv );

        return mainDiv;
    };

    getWidth_H3 ( text ) {
        const mainDiv = this.createElement( "h3", "project text-lg ital heavy upper" );
        mainDiv.style.width = "fit-content";
        mainDiv.textContent = text;
        // mainDiv.style.width = "fit-content"
        document.getElementById( "content" ).appendChild( mainDiv );
        const w = mainDiv.getBoundingClientRect().width;
        console.log( `---calculated w: ${ w }`);
        mainDiv.remove();
        return w;
    };

};


// row = new Row( "Today" );
// row.setTitle ( "Title" );
// row.setPriority ( priority.High );
// row.isComplete ( false );
// row.isComplete ( false );
// row.getTitle() => "Title";
// row.getDurration() => "41h 15m";
// row.getColor() => "#fff";
// row.getStart() =>
// row.getCell_XY() => 
// row.getRow() => 3
// row.getHTML_all();
// row.getHTML_color();
// row.getHTML_flag();




export { PageBuilder };