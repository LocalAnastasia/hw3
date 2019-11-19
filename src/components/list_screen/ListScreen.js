import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import M from 'materialize-css';

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
    
    updateItems = newItems => {
        const fireStore = getFirestore();
        for (var i = 0; i < newItems.length; i++) {
            newItems[i].key = i;
            newItems[i].id = i;
        }
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

    handleShowModal = (e) => {
        const elem = document.getElementById('list_delete_modal');
        const instance = M.Modal.init(elem, {dismissible: false});
        instance.open();
    }

    handleHideModal = (e) => {
        const elem = document.getElementById('list_delete_modal');
        const instance = M.Modal.init(elem, {dismissible: false});
        instance.destroy();
    }

    handleDeleteListAndGoHome = (todoListid, e) => {
        this.handleHideModal(e);
        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(todoListid).delete();
    }

    render() {
        const auth = this.props.auth;
        const todoList = this.props.todoList;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        return (
            <div>
                <div className="container white list_container">
                    <h4 className="grey-text text-darken-3 section">Todo List</h4>
                    <div className="input-field list_inputs">
                        <input className="validate" type="text" name="name" id="name"  required="" aria-required="true" onChange={this.handleChange} value={todoList.name} />
                        <label className="active" htmlFor="name">Name</label>
                    </div>
                    <div className="input-field list_inputs">
                        <input className="validate" type="text" name="owner" id="owner" required="" aria-required="true" onChange={this.handleChange} value={todoList.owner} />
                        <label className="active" htmlFor="owner">Owner</label>
                    </div>
                    <div className="list_item_header_card">
                        <div className="list_item_task_header" onClick={this.handleSortByTask}>Task</div>
                        <div className="list_item_due_date_header" onClick={this.handleSortByDueDate}>Due Date</div>
                        <div className="list_item_status_header" onClick={this.handleSortByCompleted}>Status</div>
                    </div>
                    <ItemsList todoList={todoList}/>
                    <Link to={"/todoList/" + todoList.id + "/" + todoList.items.length}>
                        <div className="list_item_add_card grey-text text-darken-3">
                            <i className="material-icons small">add</i>
                        </div>
                    </Link>
                </div>
                <div className="fixed-action-btn" onClick={this.handleShowModal}>
                    <div className="btn-floating btn-large list_trash">
                        <i className="large material-icons">delete_forever</i>
                    </div>
                </div>
                <div id="list_delete_modal" className="modal">
                    <div className="modal-content">
                        <h4>Delete List</h4>
                        <p>Are you sure you want to delete this list?</p>
                    </div>
                    <div className="modal-footer">
                        <Link to="/" className="modal-close waves-effect waves-green btn-flat" onClick={this.handleDeleteListAndGoHome.bind(this, todoList.id)}>Delete</Link>
                        <div className="modal-close waves-effect waves-green btn-flat" onClick={this.handleHideModal}>Cancel</div>
                    </div>
                </div>
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