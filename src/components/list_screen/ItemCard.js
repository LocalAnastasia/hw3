import React from 'react';
import { getFirestore } from 'redux-firestore';

class ItemCard extends React.Component {
    state = {
        goItem: false,
        itemID: null
    }

    updateItems = newItems => {
        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).update({
            items: newItems
        });
    }

    swapItems = (items, i, j) => {
        [items[i], items[j]] = [items[j], items[i]];
        //Update key and id
        items[i].id = i;
        items[i].key = i;
        items[j].id = j;
        items[j].key = j;

        return items;
    }

    handleMoveItemUp = (itemId, e) => {
        e.preventDefault();
        var items = JSON.parse(JSON.stringify(this.props.items));
        this.swapItems(items, itemId, itemId - 1);
        this.updateItems(items);
    }

    handleMoveItemDown = (itemId, e) => {
        e.preventDefault();
        let items = JSON.parse(JSON.stringify(this.props.items));
        this.swapItems(items, itemId, itemId + 1);
        this.updateItems(items);
    }

    handleDeleteItem = (itemId, e) => {
        e.preventDefault();
        var items = JSON.parse(JSON.stringify(this.props.items));
        items.splice(itemId, 1);
        for (var i = itemId; i < items.length - 1; i++) { //Update indices
            items[i].id = i;
            items[i].key = i;
        }
        this.updateItems(items);
    }

    getMoveUpClass = () => {
        return this.props.isFirst ? 'disabled list_item_card_toolbar_button btn-floating' : 'list_item_card_toolbar_button btn-floating';
    }

    getMoveDownClass = () => {
        return this.props.isLast ? 'disabled list_item_card_toolbar_button btn-floating' : 'list_item_card_toolbar_button btn-floating';
    }
 
    render() {
        const { item } = this.props;  
        return (
            <div className="list_item_card grey-text text-darken-3">
                <div className="list_item_description">
                    {item.description}
                </div>
                <div className='list_item_card_assigned_to'>
                    Assigned To: <strong>{item.assigned_to}</strong>
                </div>
                <div className='list_item_card_due_date'>
                    {item.due_date}
                </div>
                <div className='list_item_card_completed'>
                    {item.completed ? "Completed" : "Pending"}
                </div>
                <div className='list_item_card_toolbar'>
                    <div className={this.getMoveUpClass()} onClick={this.handleMoveItemUp.bind(this, item.id)}>&#11014;</div>
                    <div className={this.getMoveDownClass()} onClick={this.handleMoveItemDown.bind(this, item.id)}>&#11015;</div>
                    <div className='list_item_card_toolbar_button btn-floating' onClick={this.handleDeleteItem.bind(this, item.id)}>&#10006;</div>
                </div>
            </div>
        );
    }
}
export default ItemCard;