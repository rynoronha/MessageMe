import React, { Component } from 'react';

class MessageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
        messages: [{
          username: '',
          content: '',
          sentAt: '',
          roomId: ''
        }]
    };


    this.messagesRef = this.props.firebase.database().ref('messages');

  }

  componentDidMount() {
      this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat(message) });
     });
   }


   render() {
     return (
       <section className="message-list">
        <h3>{this.props.activeRoom}</h3>
        <ul>
        {
          this.state.messages.filter( message => message.roomId === this.props.activeRoomKey).map( message =>
            <li className="message" key={message.key}>{message.content}</li>
        )}
        </ul>

       </section>
     )
   }

}

export default MessageList;
