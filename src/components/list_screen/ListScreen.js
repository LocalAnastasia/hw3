import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';

class ListScreen extends Component {
    state = {
        name: '',
        owner: '',
        taskSortToggle: true,
        dueDateSortToggle: true,
        completedSortToggle: true
    }

    handleChange = (e) => {
        const { target } = e;
        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).update({
            [target.id]: target.value
        });
        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
    }

    handleCreateNewItem = e => {
        this.handleGoItem(this.props.todoList.items.length);
    }
    
    updateItems = newItems => {
        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).update({
            items: newItems
        });
    }

    handleSortByTask = e => {
        var items = JSON.parse(JSON.stringify(this.props.todoList.items));
        items.sort(this.compareByTask);
        this.updateItems(items);
        this.setState({
            taskSortToggle: !this.state.taskSortToggle
        });
    }

    handleSortByDueDate = e => {
        var items = JSON.parse(JSON.stringify(this.props.todoList.items));
        items.sort(this.compareByDueDate);
        this.updateItems(items);
        this.setState({
            dueDateSortToggle: !this.state.dueDateSortToggle
        });
    }

    handleSortByCompleted = e => {
        var items = JSON.parse(JSON.stringify(this.props.todoList.items));
        items.sort(this.compareByCompleted);
        this.updateItems(items);
        this.setState({
            completedSortToggle: !this.state.completedSortToggle
        });
    }

    compareByTask = (a, b) => {
        var res;
        if(this.state.taskSortToggle) {
            res = a.description > b.description ? 1 : -1;
        }
        else {
            res = a.description > b.description ? -1 : 1;
        }
        return res;
    }

    compareByDueDate = (a, b) => {
        var res;
        if(this.state.dueDateSortToggle) {
            res = a.due_date > b.due_date ? 1 : -1;
        }
        else {
            res = a.due_date > b.due_date ? -1 : 1;
        }
        return res;
    }

    compareByCompleted = (a, b) => {
        var res;
        if(this.state.completedSortToggle) {
            res = a.completed > b.completed ? 1 : -1;
        }
        else {
            res = a.completed > b.completed ? -1 : 1;
        }
        return res;
    }

    render() {
        const auth = this.props.auth;
        const todoList = this.props.todoList;
        if (!auth.uid) {
            return <Redirect to="/" />;
        } 
        return (
            <div className="container white">
                <h5 className="grey-text text-darken-3">Todo List</h5>
                <div className="input-field">
                    <label htmlFor="email">Name</label>
                    <input className="active" type="text" name="name" id="name" onChange={this.handleChange} value={todoList.name} />
                </div>
                <div className="input-field">
                    <label htmlFor="password">Owner</label>
                    <input className="active" type="text" name="owner" id="owner" onChange={this.handleChange} value={todoList.owner} />
                </div>
                <div className="list_item_header_card">
                    <div className="list_item_task_header" onClick={this.handleSortByTask}>Task</div>
                    <div className="list_item_due_date_header" onClick={this.handleSortByDueDate}>Due Date</div>
                    <div className="list_item_status_header" onClick={this.handleSortByCompleted}>Status</div>
                </div>
                <ItemsList todoList={todoList}/>
                <div className='list_item_add_card' onClick={this.handleCreateNewItem}>&#10133;</div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[id] : null;
  todoList.id = id;

  return {
    todoList,
    auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'todoLists' },
  ]),
)(ListScreen);