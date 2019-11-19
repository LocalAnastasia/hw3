import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { Redirect } from 'react-router-dom'

class ItemScreen extends React.Component {

    state = {
        key: this.props.item.key,
        description: this.props.item.description,
        assigned_to: this.props.item.assigned_to,
        due_date: this.props.item.due_date,
        completed: this.props.item.completed
    }

    handleChange = e => {
        const { target } = e;
        if (target.type === 'checkbox'){
            this.setState({
                [target.id]: target.checked
            });
        }
        else{
            this.setState({
                [target.id]: target.value
            });       
        }
    }
    
    handleSubmit = e => {
        const fireStore = getFirestore();
        var newItems = JSON.parse(JSON.stringify(this.props.todoList.items));
        var newItem = {
            key: this.state.key,
            description: this.state.description,
            assigned_to: this.state.assigned_to,
            due_date: this.state.due_date,
            completed: this.state.completed
        }
        newItems[newItem.key] = newItem;
        fireStore.collection('todoLists').doc(this.props.todoListId).update({
            items: newItems
        });
        this.setState({
            exitItem: true
        })
    }

    handleCancel = e => {
        this.setState({
            exitItem: true
        })
    }

    render() { 
        if (this.state.exitItem){
            return <Redirect to={"/todoList/" + this.props.todoListId}/>
        }
        return (
            <div id="todo_item">
                <div id="item_heading">
                    <span>Item</span>
                </div>
                <div id="item_form_container">
                    <span id="item_description_prompt" className="item_prompt">Description: </span>
                    <input type="text" id="description" className="item_input" value={this.state.description} onChange={this.handleChange}/>
                    <p className="item_spacing"> </p>
                    <span id="item_assigned_to_prompt" className="item_prompt">Assigned To: </span>
                    <input type="text" id="assigned_to" className="item_input" value={this.state.assigned_to} onChange={this.handleChange}/>
                    <p className="item_spacing"> </p>
                    <span id="item_due_date_prompt" className="item_prompt">Due Date: </span>
                    <input type="date" id="due_date" className="item_input" value={this.state.due_date} onChange={this.handleChange}/>
                    <p className="item_spacing"> </p>
                    <span id="item_completed_prompt" className="item_prompt">Completed: </span>
                    <div>
                        <label>
                            <input type="checkbox" id="completed" className="item_input" checked={this.state.completed} onChange={this.handleChange}/>
                            <span></span>
                        </label>
                    </div>
                </div>
                <div id="item_buttons_container">
                    <button id="item_form_submit_button" className="item_buttons" onClick={this.handleSubmit}>Submit</button>
                    <button id="item_form_cancel_button" className="item_buttons" onClick={this.handleCancel}>Cancel</button>
                </div>
            </div>
        );
    }
}

function createNewItem(newId){
    var newItem = {
        key: newId,
        description: "",
        assigned_to: "",
        due_date: "",
        completed: false
    }

    return newItem;
}

const mapStateToProps = (state, ownProps) => {
    const todoListId = ownProps.match.params.id;
    const itemId = ownProps.match.params.itemId; 
    const { todoLists } = state.firestore.data;
    const todoList = todoLists ? todoLists[todoListId] : null;
    const item = todoList.items[itemId] ? todoList.items[itemId] : createNewItem(itemId);
  
    return {
      item: item,
      todoList: todoList,
      todoListId: todoListId,
      auth: state.firebase.auth,
    };
  };
  
  export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'todoLists' },
    ]),
  )(ItemScreen);