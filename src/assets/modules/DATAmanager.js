class Task {

    colorsAll = [
        "#0000fc","#0078f8","#3cbcfc","#a4e4fc",
        "#0000bc","#0058f8","#6888fc","#b8b8f8",
        "#4428bc","#6844fc","#9878f8","#d8b8f8",
        "#940084","#d800cc","#f878f8","#f8b8f8",
        "#a80020","#e40058","#f85898","#f8a4c0",
        "#a81000","#f83800","#f87858","#f0d0b0",
        "#881400","#e45c10","#fca044","#fce0a8",
        "#503000","#ac7c00","#f8b800","#f8d878",
        "#007800","#00b800","#b8f818","#d8f878",
        "#006800","#00a800","#58d854","#b8f8b8",
        "#005800","#00a844","#58f898","#b8f8d8",
        "#004058","#008888","#00e8d8","#00fcfc"
    ];

    priorityColors = [ `#000`, '#fca044', `#e40058`];

    priorityFilter = [
        "",
        "invert(48%) sepia(55%) saturate(6280%) hue-rotate(127deg) brightness(98%) contrast(101%)",
        "invert(16%) sepia(100%) saturate(4269%) hue-rotate(327deg) brightness(85%) contrast(113%)"
    ];


    taskID = -1;
    title = "New Row Title";
    priority = 0;
    isComplete = false;
    startMin = 0;
    endMin = 0;
    displayOrder = -1;
    color = "";
    colorIndex = 0;
    class = "task";

    constructor () {
        this.colorIndex = Math.floor( Math.random() * this.colorsAll.length );
        this.color = this.colorsAll[ this.colorIndex ];
    };

    hydrate ( json ) {
        console.log("hydrating with:")
        console.log( json )
        this.taskID = json.taskID;
        this.title = json.title;
        this.priority = json.priority;
        this.isComplete = json.isComplete;
        this.startMin = json.startMin;
        this.endMin = json.endMin;
        this.displayOrder = json.displayOrder;
        this.color = json.color;
        this.colorIndex = json.colorIndex;
    };

    set id (val) { this.taskID = val; };
    get id () { return this.taskID; };

    set isComplete (val) { if ( typeof val == 'boolean' ){  this.isComplete = val; }; };
    get isComplete () { return this.isComplete; };

    set title (val) { if ( typeof val == 'string' ){  this.title = val; }; };
    get title () { return this.title; };

    set startMinute (val) { if ( typeof val == 'number' ){
        console.log(`writing start time! time is ${ val }`)
        this.startMin = val; }; };
    get startMinute () { return this.startMin; };

    set displayOrder ( val ) { this.displayOrder = val; }
    get displayOrder() { return this.displayOrder; };
    // set endMin (val) { if ( typeof val == 'number' ){ this.endMin = val; }; };
    
    set endMinute (val) {
        if ( typeof val == 'number' ){
            if ( val - this.startMin <= 0) {

                console.log( `too small, ${this.startMin} --/-- ${ val }` );
                return;
            }
            this.endMin = val;        
        };
    };
    get endMinute () { return this.endMin; };

    get duration () {
        // let sec = this.endMin - this.startMin;
        let min = Math.floor(this.endMin - this.startMin );
        return `${min}m`;
    }

    set priority (val) { if (typeof val == 'number' ){
        val = max( 0, min( val, this.priorityColors.length - 1 ) );
        this.priority = val;
    }; };
    
    get priority () { return this.priority; };

    set color (val) { if (typeof val == 'string' ){  this.color = val; }; };
    get color () { return this.color; };
    get colorIndex () { return this.colorIndex; };
    get allColors () { return this.colorsAll; };
    get priorityColor() { return this.priorityColors[ this.priority ]; };
    getFilter() { return this.priorityFilter[ this.priority ]; };

    recordTask( title, isComplete, priority ) {
        this.title = title;
        this.isComplete = isComplete;
        this.priority = priority;
    };

    increasePriority(){
        this.priority += 1
        this.priority = ( this.priority % this.priorityColors.length );        
        console.log( `changed priority, new priority is: ${ this.priority }` );
    };
};

class Project {

    taskID = -1;
    title = "New Project";
    database = [];
    class = "project";

    hydrate ( json ) {
        this.taskID = json.taskID;
        this.title = json.title;
    };

    set id (val) { this.taskID = val; };
    get id () { return this.taskID; };

    set title (val) { if ( typeof val == 'string' ){  this.title = val; }; };
    get title () { return this.title; };

    isNotTask( t ) {
        if ( t instanceof Task ) { return false; }

        console.log(`${typeof t } is not a Task Object`);
        return true;
    };

    deleteTask( id ) {

        if (this.database[id]) {
            delete this.database[id];
            console.log( `successfully deleted task number ${ id }`);
            // RE ORDER THE TASKS
            return;
        };
        // DOESN'T EXIST
        console.log(`database can't find that task(${id}), maybe it's already deleted?`);
    }

    writeTask( task ) {
        if ( this.isNotTask(task) ) { return 0; }

        if ( task.id < 0 ) { task.id = this.database.length; };
        if ( task.displayOrder < 0 ) { task.displayOrder = task.id; };
        
        console.log(`writing task to Project database, id ${ task.id }, ${ task.title } `);
        this.database[ task.id ] = task;
    };

    getTask( id ) {
        if (this.database[ id ]) { return this.database[ id ] };
        // DOESN'T EXIST
        console.log(`database can't find task( ${id} / ( ${id} )), sending a blank task`);
        return new Task();
    };

    reOrderTask( task, newId) { task.id = newId; }

    setReorder() {
        const newOrder = [];
        this.database.forEach( ( task ) => {
            newOrder[ task.id ] = task;
        } );
        this.database = [];

        let n = 0;
        newOrder.forEach( ( task ) => {
            task.id = n;
            this.database.push( task )
            n += 1;
        });
    }

    getAll() { return this.database; }

};

class Database {

    // keeps track of a list of projects
    projectID = -1;
    database = [];
    class = "database";

    isNotProject( p ) {
        if ( p instanceof Project ) { return false; }

        console.log(`${typeof p } is not a Project Object`);
        return true;
    };

    deleteProject( id ) {

        if (this.database[id]) {
            delete this.database[ id ];
            console.log( `successfully deleted project number ${ id }`);
            // RE ORDER THE TASKS
            return;
        };
        // DOESN'T EXIST
        console.log(`database can't find that Project(${id}), maybe it's already deleted?`);
    }

    writeProject( project ) {
        if ( this.isNotProject( project ) ) { return 0; }

        if ( project.id < 0 ) { project.id = this.database.length; };
        console.log(`writing project to Database, id ${ project.id }, ${ project.title } `);
        this.database[ project.id ] = project;
    };

    getProject( id ) {
        if (this.database[ id ]) { return this.database[ id ] };
        // DOESN'T EXIST
        console.log(`database can't find Project( ${id} / ( ${id} )), sending a blank project`);
        return new Project();
    };

    getAll() { return this.database; }
    
    // writeAll( db ) {
    //     if( db < 0 ){
    //         this.database = [];
    //         return;
    //     }
    //     if( db ) {
    //         this.database = db;
    //     };
    //     this.database = [];
    // };

    reOrderTask( proj, newId) {
        console.log( `updating proj ${proj.title} from id ${proj.id} to ${newId} `)
        proj.id = newId; }

    setReorder() {
        const newOrder = [];
        this.database.forEach( ( proj ) => {
            newOrder[ proj.id ] = proj;
        } );
        this.database = [];

        let n = 0;
        newOrder.forEach( ( proj ) => {
            console.log( `writing project ${proj.title} to id ${proj.id}` )

            proj.id = n;
            this.database.push( proj )
            n += 1;
        });
    };

}

class Storage {
    DB_NAME = "mainDB";
    // localDB;

    writeAllStorage( data ){
        console.log( data );
        localStorage.setItem("mainDB", JSON.stringify( data ));
        // let pulled = localStorage.getItem( "mainDB" )
        // pulled = JSON.parse( pulled );
    };

    hydrate( json ) {
        // >DB
        // .>PROJ
        // ..>TASK
        // ..>TASK
        // .>PROJ
        // ..>TASK
        // ..>TASK

        let data = new Database();

        if( json.database?.length && json.class == "database") {
            json.database.forEach( proj => {

                let project = new Project();
                project.hydrate( proj )

                if( proj.database?.length && proj.class == "project" ) {
                    proj.database.forEach( tsk => {

                        let task = new Task();
                        task.hydrate( tsk );
                        project.writeTask( task );
                    });
                };

                data.writeProject( project );

            });
        };

        return data;
    };

    getAllStorage(){
        // localStorage.clear();
        let storedData = localStorage.getItem( this.DB_NAME );
        storedData = JSON.parse( storedData );

        if ( storedData ) {
            storedData = this.hydrate( storedData );
            console.log( "returning data:" );
            console.log( storedData );
            return storedData;
        } else{
            console.log( "no local storage data found" );
        };
        return new Database();
    };
};

export { Task, Project, Database, Storage };