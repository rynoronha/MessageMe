import React, { Component } from 'react';

class MessageList extends Component {
  constructor(props) {
    super(props);


    this.roomsRef = this.props.firebase.database().ref('rooms');

  }

  componentDidMount() {
     this.roomsRef.on('child_added', snapshot => {
       console.log(snapshot);
       /*const room = snapshot.val();
       room.key = snapshot.key;
       this.setState({ rooms: this.state.rooms.concat( room ) })*/
     });
   }

   render() {
     return (
       <section className="message-list">
        <h3>{this.props.activeRoom}</h3>
       </section>
     )
   }

}

export default MessageList;
