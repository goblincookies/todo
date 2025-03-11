class Task {

    priority = {
        NON: 0,
        LOW: 1,
        MED: 2,
        HIGH:3,
        CRIT:4
    }

    #taskID = -1;
    #priority = 0;
    #isSection = false;
    #isComplete = false;
    #title = "New Row Title";
    #startTime = 3; //1-96 >> 0-24hrs * 4
    #duration = 50;
    #startDate = 0; // FORMALIZE LATER
    #color = "#6da9bb";
    #shift = 0;
    
    constructor () {
    };

    set id (val) { this.#taskID = val; };
    get id () { return this.#taskID; };

    set isSection (val) { if ( typeof val == 'boolean' ){  this.#isSection = val; }; };
    get isSection () { return this.#isSection; };

    set isComplete (val) { if ( typeof val == 'boolean' ){  this.#isComplete = val; }; };
    get isComplete () { return this.#isComplete; };

    set title (val) { if ( typeof val == 'string' ){  this.#title = val; }; };
    get title () { return this.#title; };

    set startTime (val) { if ( typeof val == 'number' ){  this.#startTime = val; }; };
    get startTime () { return this.#startTime; };

    set duration (val) { if ( typeof val == 'number' ){  this.#duration = val; }; };
    get duration () { return this.#duration; };

    set priority (val) { if (typeof val == 'number' ){  this.#priority = val; }; };
    get priority () { return this.#priority; };

    set color (val) { if (typeof val == 'string' ){  this.#color = val; }; };
    get color () { return this.#color; };

    recordTask( title, isComplete, priority ) {
        this.#title = title;
        this.#isComplete = isComplete;
        this.#priority = priority;
    };

};

class Project {
    // keeps track of a list of tasks
    // #id = 1;
    #shift = 3
    #database = [];

    isNotTask( t ) {
        if ( t instanceof Task ) { return false; }

        console.log(`${typeof t } is not a Task Object`);
        return true;
    };

    deleteTask( id ) {

        if (this.#database[id]) {
            delete this.#database[id];

            // RE ORDER THE TASKS

            return 0;
        };
        // DOESN'T EXIST
        console.log(`database can't find that book(${id}), maybe it's already deleted?`);
    }

    writeTask( task ) {
        if ( this.isNotTask(task) ) { return 0; }

        if ( task.id < 0 ) { task.id = this.#database.length; };
        task.shift = this.#shift;
        console.log(`writing task to Project database, id ${ task.id }, ${ task.title } `);
        this.#database[ task.id ] = task;
    };

    getTask( id ) {
        if (this.#database[ id - this.#shift ]) { return this.#database[ id - this.#shift ] };
        // DOESN'T EXIST
        console.log(`database can't find task( ${id} / ( ${id - this.#shift } )), sending a blank task`);
        return new Task();
    };

}

class Database {

    // keeps track of a list of projects

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
export { Task, Project, Database };