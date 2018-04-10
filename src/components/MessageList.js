import React, { Component } from 'react';

class MessageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
        messages: []
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

   formatTime(date) {
     var date = new Date(date);
     var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
     var year = date.getFullYear();
     var month = months[date.getMonth()];
     var day = date.getDate();
     var hours = date.getHours();
     var minutes = date.getMinutes();
     var ampm = hours >= 12 ? 'pm' : 'am';
     hours = hours % 12;
     hours = hours ? hours : 12; // the hour '0' should be '12'
     minutes = minutes < 10 ? '0'+ minutes : minutes;
     var strTime = month + '/' + day + '/' + year + ' @ ' + hours + ':' + minutes + ' ' + ampm;
     return strTime;

  }

   render() {
     console.log(this.state.messages);
     return (
       <section className="message-list">
        <h2 className="active-room">{this.props.activeRoom}</h2>
        <div className="message-container">
        {
          this.state.messages.filter( message => message.roomId == this.props.activeRoomKey).map( message =>
            <div className="message" key={message.key}>
              <p className="message-username">{message.username}</p>
              <p className="message-content">{message.content}</p>
              <p className="message-time">{this.formatTime(message.sentAt)}</p>
            </div>
        )}
        </div>



       </section>
     )
   }

}

export default MessageList;
