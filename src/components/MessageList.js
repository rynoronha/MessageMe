import React, { Component } from 'react';
import { Button, Form, FormControl} from 'react-bootstrap';

class MessageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
        currentMessage: ''
    };
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  formatTime(currentDate) {
    var date = new Date(currentDate);
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

  handleChange(e) {
    this.setState({ currentMessage: e.target.value })
  }

  keyPress(e) {
    if (e.keyCode === 13 ) {
      this.sendMessage(e);
    } else return <p>{this.props.username} is typing ...</p>
  }

  sendMessage(e) {
    e.preventDefault();
    this.props.messagesRef.push({
      content: this.state.currentMessage,
      username: this.props.username,
      roomId: this.props.activeRoomKey,
      sentAt: this.props.firebase.database.ServerValue.TIMESTAMP
    });
    this.setState({currentMessage: ''});
    this.setState({ show: false });
  }

  deleteMessage(messageKey) {
    const message = this.props.firebase.database().ref('messages/' + messageKey);
    message.remove();
    const remainMessages= this.props.messages.filter(message => message.key !== messageKey);
    this.props.updateMessages(remainMessages);
  }

  showNewMessageform() {
    if (this.props.activeRoom !== null) {
      return <Form inline id="new-message-form">
        <FormControl
          id="new-message-text"
          type="text"
          placeholder="type message"
          value={ this.state.currentMessage }
          onChange={ (e) => this.handleChange(e) }
          onKeyDown={ (e) => this.keyPress(e)}
        />
        <Button id="send-message" bsStyle="success" onClick={ (e) => this.sendMessage(e) }>Send</Button>
      </Form>
    }
  }

  editMessage(messageKey, e) {
    if (e.keyCode === 13 ) {
      e.preventDefault();
      var updates = {};
      updates['messages/' + messageKey + '/' + 'content'] = e.target.innerText
      alert("Your message has been edited");
      this.props.firebase.database().ref().update(updates);
    }
  }

  showTyping(e) {
    console.log(e.keyCode);
    return <p>{this.props.username} is typing ...</p>
  }

   render() {
     return (
       <section className="message-list">
        <h2 className="active-room">{this.props.activeRoom}</h2>
        <div className="message-container">
        {
          this.props.messages.filter( message => message.roomId == this.props.activeRoomKey).map( message =>

            <div className="message" key={message.key}>
              <p className="message-username">{message.username}</p>
              <p className="message-content"
                contenteditable="true"
                onKeyDown={ (e) => this.editMessage(message.key, e) }>{message.content}
              </p>
              <p className="message-time">{this.formatTime(message.sentAt)}</p>
              <Button id="delete-message"
                bsStyle="danger"
                bsSize="xsmall"
                onClick={() => this.deleteMessage(message.key)}>x
              </Button>
            </div>

        )}
        </div>

        <div className='footer'>
          <footer id="new-message-footer">
            {this.showNewMessageform()}
          </footer>
        </div>

        <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
        </div>

       </section>
     )
   }

}

export default MessageList;
