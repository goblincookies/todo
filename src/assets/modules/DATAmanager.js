class Task {

    priority = {
        NON: 0,
        LOW: 1,
        MED: 2,
        HIGH:3,
        CRIT:4
    }

    #colorsAll = [
        "#0000fc",
        "#0078f8",
        "#3cbcfc",
        "#a4e4fc",
        
        "#0000bc",
        "#0058f8",
        "#6888fc",
        "#b8b8f8",

        "#4428bc",
        "#6844fc",
        "#9878f8",
        "#d8b8f8",
        
        "#940084",
        "#d800cc",
        "#f878f8",
        "#f8b8f8",

        "#a80020",
        "#e40058",
        "#f85898",
        "#f8a4c0",

        "#a81000",
        "#f83800",
        "#f87858",
        "#f0d0b0",

        "#881400",
        "#e45c10",
        "#fca044",
        "#fce0a8",

        "#503000",
        "#ac7c00",
        "#f8b800",
        "#f8d878",

        "#007800",
        "#00b800",
        "#b8f818",
        "#d8f878",

        "#006800",
        "#00a800",
        "#58d854",
        "#b8f8b8",


        "#005800",
        "#00a844",
        "#58f898",
        "#b8f8d8",

        "#004058",
        "#008888",
        "#00e8d8",
        "#00fcfc"



    ];

    #taskID = -1;
    #title = "New Row Title";
    #priority = 0;
    #isSection = false;
    #isComplete = false;
    #startMin = 0;
    #endMin = 0;
    #displayOrder = -1;
    // #startDate = 3; //1-96 >> 0-24hrs * 4
    // #endDate = 15;
    // #startDate = 0; // FORMALIZE LATER
    #color = "";
    #colorIndex = 0;
    #shift = 0;
    
    constructor () {
        this.#colorIndex = Math.floor( Math.random() * this.#colorsAll.length );
        this.#color = this.#colorsAll[ this.#colorIndex ];
    };

    set id (val) { this.#taskID = val; };
    get id () { return this.#taskID; };

    set isSection (val) { if ( typeof val == 'boolean' ){  this.#isSection = val; }; };
    get isSection () { return this.#isSection; };

    set isComplete (val) { if ( typeof val == 'boolean' ){  this.#isComplete = val; }; };
    get isComplete () { return this.#isComplete; };

    set title (val) { if ( typeof val == 'string' ){  this.#title = val; }; };
    get title () { return this.#title; };

    set startMinute (val) { if ( typeof val == 'number' ){
        console.log(`writing start time! time is ${ val }`)
        this.#startMin = val; }; };
    get startMinute () { return this.#startMin; };

    set displayOrder ( val ) { this.#displayOrder = val; }
    get displayOrder() { return this.#displayOrder; };
    // set endMin (val) { if ( typeof val == 'number' ){ this.#endMin = val; }; };
    
    set endMinute (val) {
        if ( typeof val == 'number' ){
            if ( val - this.#startMin <= 0) {

                console.log( `too small, ${this.#startMin} --/-- ${ val }` );
                return;
            }
            this.#endMin = val;        
        };
    };
    get endMinute () { return this.#endMin; };

    get duration () {
        // let sec = this.#endMin - this.#startMin;
        let min = Math.floor(this.#endMin - this.#startMin );
        return `${min}m`;
    }

    set priority (val) { if (typeof val == 'number' ){  this.#priority = val; }; };
    get priority () { return this.#priority; };

    set color (val) { if (typeof val == 'string' ){  this.#color = val; }; };
    get color () { return this.#color; };
    get colorIndex () { return this.#colorIndex; };
    get allColors () { return this.#colorsAll; };

    recordTask( title, isComplete, priority ) {
        this.#title = title;
        this.#isComplete = isComplete;
        this.#priority = priority;
    };

};

class Converter {

    clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    };

    // task.startDate, task.endDate, gridStartDate, gridEndDate
    inBounds( tS, tE, gS, gE ) {

        // PASS LEFT
        // CHECKS IF BOTH START AND END ARE BEFORE THE GRID
        let passLeft = !(( tS < gS ) && ( tE < gS));

        // PASS RIGHT
        // CHECKS IF BOTH START AND END ARE AFTER THE GRID
        let passRight = !(( tS > gE ) && ( tE > gE));

        return (passLeft && passRight);
    }

    getGridColumn (task, gridStartColumn, gridCellCount ) {
        let gridColumn = {start:0, span:0};

        gridColumn.start = task.startTime - gridStartColumn;
        gridColumn.span = ( gridColumn.start + task.duration );
        // console.log(`grid span column before clamp: ${gridColumn.span} (${gridCellCount})`);
        gridColumn.start = this.clamp( gridColumn.start, 1, gridStartColumn+ gridCellCount );
        
        gridColumn.span = this.clamp( gridColumn.span, 1, gridCellCount );
        // console.log(`grid span column after clamp: ${gridColumn.span}`);

        return gridColumn;
    };

};

class Project {

    #taskID = -1;
    #title = "New Project";
    #database = [];

    set id (val) { this.#taskID = val; };
    get id () { return this.#taskID; };

    set title (val) { if ( typeof val == 'string' ){  this.#title = val; }; };
    get title () { return this.#title; };

    isNotTask( t ) {
        if ( t instanceof Task ) { return false; }

        console.log(`${typeof t } is not a Task Object`);
        return true;
    };

    deleteTask( id ) {

        if (this.#database[id]) {
            delete this.#database[id];
            console.log( `successfully deleted task number ${ id }`);
            // RE ORDER THE TASKS
            return;
        };
        // DOESN'T EXIST
        console.log(`database can't find that task(${id}), maybe it's already deleted?`);
    }

    writeTask( task ) {
        if ( this.isNotTask(task) ) { return 0; }

        if ( task.id < 0 ) { task.id = this.#database.length; };
        if ( task.displayOrder < 0 ) { task.displayOrder = task.id; };
        
        console.log(`writing task to Project database, id ${ task.id }, ${ task.title } `);
        this.#database[ task.id ] = task;
    };

    getTask( id ) {
        if (this.#database[ id ]) { return this.#database[ id ] };
        // DOESN'T EXIST
        console.log(`database can't find task( ${id} / ( ${id} )), sending a blank task`);
        return new Task();
    };

    reOrderTask( task, newId) { task.id = newId; }

    setReorder() {
        const newOrder = [];
        this.#database.forEach( ( task ) => {
            newOrder[ task.id ] = task;
        } );
        this.#database = [];

        let n = 0;
        newOrder.forEach( ( task ) => {
            task.id = n;
            this.#database.push( task )
            n += 1;
        });
    }

    getAll() { return this.#database; }

};

class Database {

    // keeps track of a list of projects
    #projectID = -1;
    #database = [];

    isNotProject( p ) {
        if ( p instanceof Project ) { return false; }

        console.log(`${typeof p } is not a Project Object`);
        return true;
    };

    deleteProject( id ) {

        if (this.#database[id]) {
            delete this.#database[ id ];
            console.log( `successfully deleted project number ${ id }`);
            // RE ORDER THE TASKS
            return;
        };
        // DOESN'T EXIST
        console.log(`database can't find that Project(${id}), maybe it's already deleted?`);
    }

    writeProject( project ) {
        if ( this.isNotProject( project ) ) { return 0; }

        if ( project.id < 0 ) { project.id = this.#database.length; };
        console.log(`writing project to Database, id ${ project.id }, ${ project.title } `);
        this.#database[ project.id ] = project;
    };

    getProject( id ) {
        if (this.#database[ id ]) { return this.#database[ id ] };
        // DOESN'T EXIST
        console.log(`database can't find Project( ${id} / ( ${id} )), sending a blank project`);
        return new Project();
    };

    getAll() { return this.#database; }

}

// export { Row }

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

// Ribbon.getRowHTML();
export { Task, Project, Database, Converter };