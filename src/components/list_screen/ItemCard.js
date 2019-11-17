import React from 'react';

class ItemCard extends React.Component {
    state = {
        goItem: false,
        itemID: null
    }

    handleEditItem = (id, e) => {
        this.setState({
            goItem: true,
            itemID: id
        })
        this.props.handleGoItem(id);
    }

    handleShowToolbar = e => {

    }

    handleHideToolbar = e => {

    }

    render() {
        const { item } = this.props;  
        return (
            <div className="list_item_card">
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
                <div className='list_item_card_toolbar' onMouseEnter={this.handleShowToolbar} onMouseLeave={this.handleHideToolbar}></div>
            </div>
        );
    }
}
export default ItemCard;