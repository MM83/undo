/**
Redo will NOT work without custom handlers!

**/

function UndoManager(maxStackSize){

    var stack = [];
    var cursor = 0;
    var handlers = {};
    
    maxStackSize = (maxStackSize === undefined) ? 20 : maxStackSize;

    this.addHandler = function(type, handler){
        handlers[type] = handler;
    };

    this.addState = function(type, data){
       
        //Any states which happened after current cursor position are now unreachable:
        stack.splice(cursor); 
        
        //If stack size is going to exceed maximum, remove the first element:
        if((stack.length) >= maxStackSize)
            stack.shift();
        else
            ++cursor;
        
        stack.push({
            data : data,
            type : type
        });

    };
    
    this.getStack = function(){
        return stack;
    };

    this.undo = function(){

        if(stack.length < 1 || --cursor < 0){
            cursor = 0;
            return;
        }

        var state = stack.splice(cursor, 1)[0];
        var handler = handlers[state.type] || empty;

        stack.splice(cursor, 0, handler(state.data, cursor));

        return state;
        
    };
    
    function empty(){};

    this.redo = function(){
        
        if(stack.length < 1 || (cursor + 1) > stack.length)
            return;
        
        var state = stack.splice(cursor, 1)[0];
        var handler = handlers[state.type] || empty;

        stack.splice(cursor, 0, handler(state.data, cursor));
        ++cursor;  
        
        return state;
        
    };

    this.clear = function(){
        stack = [];
        cursor = -1;
    };
    
    this.getCursorIndex = function(){
        return cursor;
    };
    
};

