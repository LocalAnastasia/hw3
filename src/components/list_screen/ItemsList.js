import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemCard from './ItemCard';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';

class ItemsList extends React.Component {


    render() {
        const todoList = this.props.todoList;
        const items = todoList.items;
        const isFirst = (id) => {
            return id === 0
        }
        const isLast = (id) => {
            return id >= items.length - 1
        }

        return (
            <div className="todo-lists section">
                {items && items.map(function(item) {
                    item.id = item.key;
                    return (
                        <Link to={"/todoList/" + todoList.id + "/" + item.id}>
                            <ItemCard todoList={todoList} items={items} item={item} isFirst={isFirst(item.id)} isLast={isLast(item.id)}/>
                        </Link>
                    );})
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const todoList = ownProps.todoList;
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
)(ItemsList);