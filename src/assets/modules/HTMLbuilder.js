import { Task } from "./DATAmanager";
import fileClose from "../images/flag.svg";
import fileFlag from "../images/flag.svg";
import fileDrag from "../images/drag.svg";


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

    isNotTask( t ) {
        if ( t instanceof Task ) { return false; }

        console.log(`${typeof t } is not a Task Object`);
        return true;
    }

    getHTML_ProjectPage() {

         // <div class="flex-h-left-top debugB" id="block">
        //     <div class="left" id="left"> --- </div>
        //     <div class="right" id="right">
        //         <div class="date" id="date"> --- </div>
        //         <div class="hour" id="hour"> --- </div>
        //         <div class="grid pan" id="grid"> --- </div>
        //     </div>
        // </div>

        const mainDiv = this.createElement("div", "flex-h-left-top");
        const leftDiv = this.createElement("div", "left debugB");
        const rightDiv = this.createElement("div", "right debugC");
        const dateDiv = this.createElement("div", "date");
        const hourDiv = this.createElement("div", "hour");
        const gridDiv = this.createElement("div", "grid pan");

        leftDiv.id = "left";
        rightDiv.id = "right";
        dateDiv.id = "date";
        hourDiv.id = "hour";
        gridDiv.id = "grid";

        rightDiv.appendChild( dateDiv );
        rightDiv.appendChild( hourDiv );
        rightDiv.appendChild( gridDiv );
        mainDiv.appendChild( leftDiv );
        mainDiv.appendChild( rightDiv );

        return mainDiv;
    };

    getHTML_Date( dateText ) {
        // <h3 class="text-sm">MAR 8</h3>
        const mainDiv = this.createElement("h3", "text-sm");
        mainDiv.textContent = dateText;
        return mainDiv;
    }

    getHTML_Hour( hourText ) {
        // <h3 class="text-sm">21</h3>
        const mainDiv = this.createElement("h3", "text-sm");
        mainDiv.textContent = hourText;
        return mainDiv;
    }

    getHTML_Bar( task ) {
        if ( this.isNotTask( task ) ) { return 0; }
        
        // <div class="blank" id="bar-1"></div>
        const mainDiv = this.createElement("div", "bar");
        mainDiv.id = "bar-" + task.id;

        // grid-row: 3;
        // grid-column: 2 / span 1;
        mainDiv.style.gridRow = (task.id + task.shift) - 2; // -1 hours, -2 dates
        mainDiv.style.gridColumn = task.startTime + "/" + (task.startTime + task.duration);
        mainDiv.style.backgroundColor = task.color;


        return mainDiv;
    }

    getHTML_Task( task ) {
        if ( this.isNotTask( task ) ) { return 0; }

        // <!-- SECTION -->
        // <div class="row flex-h-spread">

        //     <button class="circle-button redbkg hidden">
        //         <img src="./assets/images/close.svg" alt="">
        //     </button>

        //     <div class="section flex-h-right ribbon pad">
        //         <button class="img-button hidden grab">
        //             <img src="./assets/images/drag.svg" alt="">
        //         </button>

        //         <h3 class="text-sm upper">Today</h3>
        //         <p class="time text-sm bold">14h 15m</p>
        //         <div class="color hidden-x"></div>
        //     </div>
        // </div>

        // <!-- TASK -->
        // <div class="row flex-h-spread">
        //     <button class="circle-button redbkg hidden">
        //         <img src="./assets/images/close.svg" alt="">
        //     </button>

        //     <div class="task flex-h-right ribbon pad">
        //         <button class="img-button hidden grab">
        //             <img src="./assets/images/drag.svg" alt="">
        //         </button>

        //         <button class="img-button">
        //             <img src="./assets/images/flag.svg" alt="">
        //         </button>

        //         <input type="checkbox" name="" id="">
        //         <h3 class="text-sm bold">buy a new amp!!!</h3>
        //         <p class="time text-sm">41h 15m</p>
        //         <button class="div-button">
        //             <div class="color hidden"></div>
        //         </button>
        //     </div>

        // </div>

        const mainDiv = this.createElement("div", "row flex-h-spread");
        mainDiv.style.gridRow = task.id + task.shift;
        const delButton = this.createElement("button", "circle-button redbkg hidden");
        const delImg = this.createElement("img", "", fileClose);
        delButton.appendChild( delImg );

        const taskDiv = this.createElement("div", "flex-h-right ribbon pad");
        console.log(`checking task section: ${task.isSection}`);
        taskDiv.classList.add( ( (task.isSection) ? "section" : "task" ) );

        const dragButton = this.createElement("button", "img-button hidden grab");
        const dragImg = this.createElement("img", "", fileDrag);
        dragButton.appendChild( dragImg );
        taskDiv.appendChild( dragButton );

        if ( !task.isSection) {
            const flagButton = this.createElement("button", "img-button");
            const flagImg = this.createElement("img", "", fileFlag );
            flagButton.appendChild(flagImg);
            const completedCheck = this.createElement("input", "");
            completedCheck.type = "checkbox";

            taskDiv.appendChild( flagButton );
            taskDiv.appendChild( completedCheck );
        };

        
        const titleH3 = this.createElement("h3", "text-sm bold trunc");
        if (task.isSection) { titleH3.classList.add("upper") };

        titleH3.textContent = task.title;
        const durationP = this.createElement("p", "time text-sm");
        durationP.textContent = task.duration;
        const colorButton = this.createElement("button", "div-button");
        const colorDiv = this.createElement("div", "color");
        
        colorDiv.classList.add( ( (task.isSection) ? "hidden-x" : "hidden" ) );

        colorDiv.style.backgroundColor = task.color;
        colorButton.appendChild(colorDiv);

        taskDiv.appendChild( titleH3 );
        taskDiv.appendChild( durationP );
        taskDiv.appendChild( colorButton );
        
        mainDiv.appendChild( delButton );
        mainDiv.appendChild( taskDiv );

        return mainDiv;
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