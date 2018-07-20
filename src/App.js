import React, { Component } from 'react';
// import './App.css';
import 'bulma/css/bulma.css'

class App extends Component {
  constructor(){
    super();
    this.state={
      tasks: [],
      doneTasks: [],
      favTasks: [],
      
      modalTaskForm: false,
      modalTaskForm_Toggle: '',
      
      tittle: '',
      detail: '',
      time: '',
      fav: false,
      
      act: 0,
      index: 0,
      renderTasks: 1,
      navActive: 'tasks'
    }
  }

  // make uniq id for every task
  uniqueId=()=>{
    return 'id-' + Math.random().toString(36).substr(2, 16);
  };

//   TASKS
  modalTaskForm=(modal)=>{
    if(modal){
        this.setState({modalTaskForm_Toggle: 'is-active', modalTaskForm: modal});
    }else{
        this.setState({modalTaskForm_Toggle: '', modalTaskForm: modal});
    }
  }

  submitTask=(e)=>{
    e.preventDefault();
    // console.log('tes');
    let {tasks, tittle, detail, time, fav, act, index} = this.state;

    if(act === 0){              //NEW
        let task = {
            tittle, detail, time, fav, id: this.uniqueId()
        };
        tasks.push(task);
    }else{                      //UPDATE
        tasks[index].tittle = tittle;
        tasks[index].detail = detail;
        tasks[index].time = time;
    } 

    this.setState({
        tasks,
        modalTaskForm_Toggle: '', 
        modalTaskForm: false,
        // reset
        tittle: '',
        detail: '',
        time: '',
        fav: false,
        act: 0
    });

  }

  inputChange=(e)=>{
    let {name, value} = e.target;
    this.setState({
        [name]: value
    });
  }

  fRemove = (i) => {
    let { tasks } = this.state;
    tasks.splice(i,1);
    this.setState({
      tasks,
      // reset
      tittle: '',
      detail: '',
      time: '',
      fav: false
    });

  }

  fEdit = (i) => {
    let task = this.state.tasks[i];

    this.setState({
        tittle: task.tittle,
        detail: task.detail,
        time: task.time,

        modalTaskForm_Toggle: 'is-active', 
        modalTaskForm: true,

        act: 1,
        index: i
    });

  }

  // setting for dateTime view 
  viewDateTime=(dt)=>{
    dt = dt.split("T");
    
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var d = new Date(dt[0]);
    var n = d.toLocaleDateString(['en-US'],options);

    return `${n} @${dt[1]}`
  }

//   TASKS DONE
  taskDone=(i)=>{
    let {doneTasks,tasks} = this.state;
    // insert done task
    doneTasks.push(tasks[i]);
    // delete task from tasks
    tasks.splice(i,1);
    
    this.setState({
        doneTasks,
        tasks
    });
  }

  removeDone=(i)=>{
    let {doneTasks} = this.state;
    // delete doneTasks
    doneTasks.splice(i,1);
    this.setState({
      doneTasks,
    });
  }

  unDone=(i)=>{
    let {doneTasks, tasks} = this.state;
    // insert in tasks
    tasks.push(doneTasks[i]);

    // remove in doneTasks
    this.removeDone(i);
  }

//   TASKS FAVOURITE
  tasksToFav=(i,id)=>{
    let {tasks, favTasks} = this.state;

    if(tasks[i].fav === false){
        // update task
        tasks[i].fav = true;
        // insert fav task
        favTasks.push(tasks[i]);
    }else{
        // update task
        tasks[i].fav = false;
        // delete fav task
        favTasks.splice(favTasks.findIndex(e => e.id === id),1);
    }
    
    this.setState({
        favTasks,
        tasks
    });
  }

  doneToFav=(i,id)=>{
    let {doneTasks, favTasks} = this.state;

    if(doneTasks[i].fav === false){
        // update task
        doneTasks[i].fav = true;
        // insert fav task
        favTasks.push(doneTasks[i]);
    }else{
        // update task
        doneTasks[i].fav = false;
        // delete fav task
        favTasks.splice(favTasks.findIndex(e => e.id === id),1);
    }
    
    this.setState({
        favTasks,
        doneTasks
    });
  }

  removeFav=(i,id)=>{
    let {favTasks, tasks, doneTasks} = this.state;
    // delete in favTasks
    favTasks.splice(i,1);
    
    // update tasks
    try {
        tasks[tasks.findIndex(e => e.id === id)].fav = false;
    } catch (error) {
        console.log('not found in tasks');
    }

    // update tasksDone
    try {
        doneTasks[doneTasks.findIndex(e => e.id === id)].fav = false;
    } catch (error) {
        console.log('not found in tasksDone');
    }

    this.setState({
      favTasks,
      tasks,
      doneTasks
    });
  }

  render() {
    let {
        modalTaskForm, modalTaskForm_Toggle, tasks,
        tittle, detail, time,
        doneTasks, favTasks, renderTasks, navActive
    } = this.state;
    
    return (
    //   hold the app  
      <div className="App" style={{paddingTop:20}}>     
        {/* container */}
        <div className="container">
            {/* Top Button */}
            <div className="columns" style={{position:'fixed'}}>
                <div className="column is-12">

                    <div className="field has-addons">
                        <p className="control">
                            <a className="button is-link is-rounded"
                                onClick={()=>this.modalTaskForm(!modalTaskForm)}
                            >
                                <span className="icon">
                                    <i className="fa fa-plus" />
                                </span>
                                <span>New</span>
                            </a>
                        </p>
                        <p className="control">
                            <a className={`button is-link ${navActive==='tasks'?'is-outlined':''}`}
                                onClick={()=>{
                                    this.setState({
                                        renderTasks:1,
                                        navActive: 'tasks'
                                    });
                                }}
                            >
                                <span className="icon">
                                    <i className="fa fa-tasks" />
                                </span>
                                <span>Tasks ( {tasks.length} )</span>
                            </a>
                        </p>
                        <p className="control">
                            <a className={`button is-link ${navActive==='done'?'is-outlined':''}`}
                                onClick={()=>{
                                    this.setState({
                                        renderTasks: 2,
                                        navActive: 'done'
                                    });
                                }}
                            >
                                <span className="icon">
                                    <i className="fa fa-check" />
                                </span>
                                <span>Done ( {doneTasks.length} )</span>
                            </a>
                        </p>
                        <p className="control">
                            <a className={`button is-link is-rounded ${navActive==='fav'?'is-outlined':''}`}
                                onClick={()=>{
                                    this.setState({
                                        renderTasks:3,
                                        navActive: 'fav'
                                    });
                                }}
                            >
                                <span className="icon">
                                    <i className="fa fa-heart" />
                                </span>
                                <span>Favourite ( {favTasks.length} )</span>
                            </a>
                        </p>
                    </div>

                </div>
            </div>

            {/* TODO LIST */}
            <div style={{paddingTop:60}}>

                {   renderTasks===1 &&
                        tasks.map((data, i) =>
                            <div className="columns" key={i}>
                                <div className="column is-12">
                                    <article className="media">
                                        <div className="media-content">
                                            <div className="content">
                                            <p>
                                                <strong>{data.tittle}</strong>
                                                <br/>
                                                <small>{this.viewDateTime(data.time)}</small>
                                                <br/>
                                                {data.detail}
                                            </p>
                                            </div>
                                            <nav className="level is-mobile">
                                                <div className="level-left">
                                                    <a className="level-item"
                                                        onClick={()=>this.taskDone(i)}
                                                    >
                                                        <span className="icon"><i className="fa fa-lg fa-check"></i></span>
                                                    </a>
                                                    <a className="level-item"
                                                        onClick={()=>this.tasksToFav(i, data.id)}
                                                    >
                                                        <span className={`icon ${data.fav===true?'has-text-danger':''}`}><i className="far fa-lg fa-heart"></i></span>
                                                    </a>
                                                    <a className="level-item"
                                                        onClick={()=>this.fEdit(i)}
                                                    >
                                                        <span className="icon"><i className="fa fa-lg fa-pencil-alt"></i></span>
                                                    </a>
                                                </div>
                                            </nav>
                                        </div>
                                        <div className="media-right">
                                            <button className="delete"
                                                onClick={()=>this.fRemove(i)}
                                            ></button>
                                        </div>
                                    </article>
                                </div>
                            </div>                        
                        )
                }

                {   renderTasks===2 &&
                        doneTasks.map((data, i) =>
                            <div className="columns" key={i}>
                                <div className="column is-12">
                                    <article className="media">
                                        <div className="media-content">
                                            <div className="content">
                                            <p>
                                                <strong>{data.tittle}</strong>
                                                <br/>
                                                <small>{this.viewDateTime(data.time)}</small>
                                                <br/>
                                                {data.detail}
                                            </p>
                                            </div>
                                            <nav className="level is-mobile">
                                                <div className="level-left">
                                                    <a className="level-item"
                                                        onClick={()=>this.unDone(i)}
                                                    >
                                                        <span className="icon"><i className="fa fa-lg fa-undo"></i></span>
                                                    </a>
                                                    <a className="level-item"
                                                        onClick={()=>this.doneToFav(i, data.id)}
                                                    >
                                                        <span className={`icon ${data.fav===true?'has-text-danger':''}`}><i className="far fa-lg fa-heart"></i></span>
                                                    </a>
                                                    
                                                </div>
                                            </nav>
                                        </div>
                                        <div className="media-right">
                                            <button className="delete"
                                                onClick={()=>this.removeDone(i)}
                                            ></button>
                                        </div>
                                    </article>
                                </div>
                            </div>                        
                        )
                }

                {   renderTasks===3 &&
                        favTasks.map((data, i) =>
                            <div className="columns" key={i}>
                                <div className="column is-12">
                                    <article className="media">
                                        <div className="media-content">
                                            <div className="content">
                                            <p>
                                                <strong>{data.tittle}</strong>
                                                <br/>
                                                <small>{this.viewDateTime(data.time)}</small>
                                                <br/>
                                                {data.detail}
                                            </p>
                                            </div>
                                            
                                        </div>
                                        <div className="media-right">
                                            <button className="delete"
                                                onClick={()=>this.removeFav(i, data.id)}
                                            ></button>
                                        </div>
                                    </article>
                                </div>
                            </div>                        
                        )
                }

            </div>
    
        </div>

        {/* MODAL - TASK FORM */}
        <div className={`modal ${modalTaskForm_Toggle}`}>
            <div className="modal-background" onClick={()=>this.modalTaskForm(!modalTaskForm)}></div>
            <div className="modal-content">
                <form ref="myForm" className="myForm">
                    <div className="field">
                        <div className="control">
                            <label className="label" style={{color:'#fff'}}>Tittle</label>
                            <input className="input is-info" type="text" name='tittle' value={tittle} 
                                onChange={(e)=>this.inputChange(e)}/>
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <label className="label" style={{color:'#fff'}}>Detail</label>
                            <textarea className="textarea is-info" type="text" placeholder="Info textarea"
                                name='detail'
                                value={detail}
                                onChange={(e)=>this.inputChange(e)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="field">
                        <div className="control">
                            <label className="label" style={{color:'#fff'}}>Time</label>
                            <input className="input is-info" type="datetime-local" name='time' value={time} 
                                onChange={(e)=>this.inputChange(e)}/>
                        </div>
                    </div>
                    <button className="button is-info"
                        onClick={(e)=>this.submitTask(e)}
                    >Save</button>
                </form>

            </div>
            <button className="modal-close is-large" aria-label="close"
                onClick={()=>this.modalTaskForm(!modalTaskForm)}
            ></button>
        </div>
      </div>
    );
  }
}

export default App;
