window.onload = function(){
    view.addDivsOnLoad();
}

let addTask = function(){
    controller.addTask();
}

let model = function(){

    let that = {};
    
    let incompleteTasksList = [];
    let completeTasksList = [];
    
    that.addTask = function(addedTask){
        if(addedTask){
            incompleteTasksList.push(addedTask);
        }
    };

    that.taskDone = function(id){
        completeTasksList.push((incompleteTasksList.splice(id, 1))[0]);
    };

    that.deleteTask = function(id, boolComplete){
        if(boolComplete)
            completeTasksList.splice(id, 1);
        else
            incompleteTasksList.splice(id,1);
    };

    that.removeIncompleteTasks = function(){
        incompleteTasksList.splice(0, incompleteTasksList.length);
    };

    that.markAllTasksAsDone = function(){
        completeTasksList = completeTasksList.concat(incompleteTasksList.splice(0, incompleteTasksList.length));
    };

    that.removeCompletedTasks = function(){
        completeTasksList.splice(0, completeTasksList.length);
    };

    that.removeAllTasks = function(){
        incompleteTasksList.splice(0, incompleteTasksList.length);
        completeTasksList.splice(0, completeTasksList.length);
    };

    that.getListOfIncompleteTasks = function(){
        return incompleteTasksList;
    };

    that.getListOfCompleteTasks = function(){
        return completeTasksList;
    };

    return that;
}();


let view = function(){
    let that = {};
    let incompleteTasksDiv;
    let completedTasksDiv;
    let removeAllTasksDiv;

    that.addDivsOnLoad = function(){
        incompleteTasksDiv = addNewDiv("incompleteTasksDiv");
        completedTasksDiv = addNewDiv("completedTasksDiv");
        removeAllTasksDiv = addNewDiv("removeAllTasksDiv");
    }

    that.render = function(){
        let completeTasks = model.getListOfCompleteTasks();
        let incompleteTasks = model.getListOfIncompleteTasks();
        
        incompleteTasksDiv.innerHTML = "";
        if(incompleteTasks.length > 0){
            displayDiv(incompleteTasksDiv, incompleteTasks);
        }

        completedTasksDiv.innerHTML = "";
        if(completeTasks.length > 0)
        {
            displayDiv(completedTasksDiv, completeTasks)
        }

        removeAllTasksDiv.innerHTML = "";
        if(incompleteTasks.length > 0 && completeTasks.length > 0){
            removeAllTasksDiv.append(getNewButton("Remove All Tasks", controller.removeAllTasks))
        }
    };


    let displayDiv = function(divClass, dispArray){
        if(divClass === completedTasksDiv){
            divClass.innerHTML = "<br>---Completed Tasks---<br>";
        }
        dispArray.forEach((item, i) => {
            displayEachTask(item, i, (divClass === completedTasksDiv))
        });
        if(divClass === incompleteTasksDiv){
            divClass.append(getNewButton("Remove Incomplete Tasks", controller.removeIncompleteTasks))
            divClass.append(getNewButton("Mark All tasks as Done", controller.markAllTasksAsDone))
        }
        else {
            divClass.append(getNewButton("Remove Completed Tasks", controller.removeCompletedTasks))
        }
    }

    let displayEachTask = function(task, index, boolComplete){
        let taskNode = document.createTextNode(task);
        let divClass = completedTasksDiv;

        if(boolComplete === false)
        {
            divClass = incompleteTasksDiv;
            let doneButton = getNewButton("&#10004", function(){ controller.taskDone(index); });
            appendNodeInSameLine(divClass, doneButton);
        }
        let deleteButton = getNewButton("&#10008", function(){ controller.deleteTask(index, boolComplete); });
        appendNodeInSameLine(divClass, taskNode)
        appendNodeInSameLine(divClass, deleteButton)
        divClass.append(document.createElement("br"));
    }

    let getNewButton = function(displayText, funcToCall){
        let button = document.createElement("button")
        button.innerHTML = displayText
        button.addEventListener("click", funcToCall)
        return button
    }

    let appendNodeInSameLine = function(divClass, node){
        let x = document.createElement("span")
        x.appendChild(node)
        divClass.append(x)
    }

    function addNewDiv(divClass){
        let newDiv = document.createElement("div")
        newDiv.setAttribute("class", divClass)
        document.body.appendChild(newDiv)
        return newDiv;
    }
    return that;
}();

let controller = function(){
    let that = {};

    that.addTask = function(){
        let newTask = getInput('taskInput');
        if(newTask){
            model.addTask(newTask)
        }
        view.render();
    }

    that.taskDone = function(index){
        model.taskDone(index);
        view.render();
    }

    that.deleteTask = function(index, boolComplete){
        model.deleteTask(index, boolComplete);
        view.render()
    }

    that.removeIncompleteTasks = function(){
        model.removeIncompleteTasks();
        view.render()
    }

    that.markAllTasksAsDone = function(){
        model.markAllTasksAsDone();
        view.render()
    }

    that.removeCompletedTasks = function(){
        model.removeCompletedTasks();
        view.render()
    }

    that.removeAllTasks = function(){
        model.removeAllTasks();
        view.render()
    }

    let getInput = function(id){
        let inp = document.getElementById(id).value;
        document.getElementById(id).value = '';
        return inp;
    }

    return that;
}();