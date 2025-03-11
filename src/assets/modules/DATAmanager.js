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
    #duration = 15;
    
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

    set duration (val) { if ( typeof val == 'number' ){  this.#duration = val; }; };
    get duration () { return this.#duration; };

    set priority (val) { if (typeof val == 'number' ){  this.#priority = val; }; };
    get priority () { return this.#priority; };

    recordTask( title, isComplete, priority ) {
        this.#title = title;
        this.#isComplete = isComplete;
        this.#priority = priority;
    };

};

class Project {
    // keeps track of a list of tasks
    #id = 0;
    #database = {};

    isNotTask( t ) {
        if ( t instanceof Task ) { return false; }

        console.log(`${typeof t } is not a Task Object`);
        return true;
    }
    writeTask( task ) {
        if ( this.isNotTask(task) ) { return 0; }
        if ( task.id < 0 ) {
            this.#id += 1;
            task.id = this.#id;
        };

        console.log(`writing task to Project database, id ${ task.id }, ${ task.title } `);
        this.#database[ task.id ] = task;
    }
    getTask( id ) {
        if (this.#database[id]) { return this.#database[id] };
        // DOESN'T EXIST
        console.log(`database can't find task( ${id} ), sending a blank task`);
        return new Task();
    }
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