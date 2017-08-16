import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';

class ListMessages extends Component {

    render() {

        if (this.props.messages && Array.isArray(this.props.messages)) {

            let listItems = this.props.messages.map(function (item) {
                return (<ListItem>{item}</ListItem>)
            });

            return (
                <List>
                    {listItems}
                </List>);
        } else {
            return (<span/>);
        }
    }
}

export default ListMessages;
