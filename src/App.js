import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';


// Initialize Firebase
var config = {
  apiKey: "AIzaSyCqoa3Tq8k8eBCDQCjNenJm33lyjQkh-ho",
  authDomain: "bloc-chat-react-65b4a.firebaseapp.com",
  databaseURL: "https://bloc-chat-react-65b4a.firebaseio.com",
  projectId: "bloc-chat-react-65b4a",
  storageBucket: "bloc-chat-react-65b4a.appspot.com",
  messagingSenderId: "845354416806"
};

  firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeRoom: null,
      activeRoomKey: null,
      username: null,
      messages: []
    }

    this.messagesRef = firebase.database().ref('messages');

  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
    const message = snapshot.val();
    message.key = snapshot.key;
    this.setState({ messages: this.state.messages.concat(message) });
   });

   this.messagesRef.on('child_changed', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      const editedMessage = {
        content: message.content,
        key: message.key,
        roomId: message.roomId,
        sentAt: message.sentAt,
        username: message.username
      };
      const messages = this.state.messages.map( (m, i) => {
        if (m.key === message.key) {
          return editedMessage;
        } else return m;
      });
      this.setState({ messages: messages })
    });
  }

  setActiveRoom(room) {
    this.setState({ activeRoom: room})
  }

  setActiveRoomKey(key) {
    this.setState({ activeRoomKey: key})
  }

  setUser(user) {
    if (user === null) {
      return this.setState({ username: "Guest"})
    } else return this.setState({ username: user.displayName })
  }

  deleteMessagesInDeletedRoom(roomKey) {
    const message = firebase.database().ref('messages').orderByChild('roomId').equalTo(roomKey);
    message.on("child_added", function(snapshot) {
      const m = firebase.database().ref('messages/' + snapshot.key);
      m.remove();
    });
  }

  updateMessages(remainMessages) {
    this.setState({messages: remainMessages });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        <div className="user">
          <User
            firebase={firebase}
            setUser={this.setUser.bind(this)}
            username={this.state.username}
          />
        </div>
          <h1 className="App-title">MessageMe</h1>
        </header>
        <div className="room-list">
          <RoomList
            firebase={firebase}
            activeRoom={this.state.activeRoom}
            setActiveRoom={this.setActiveRoom.bind(this)}
            setActiveRoomKey={this.setActiveRoomKey.bind(this)}
            deleteMessagesInDeletedRoom={this.deleteMessagesInDeletedRoom.bind(this)}
          />
        </div>

        <div className="message-list">
          <MessageList
            firebase={firebase}
            messages={this.state.messages}
            messagesRef={this.messagesRef}
            activeRoom={this.state.activeRoom}
            activeRoomKey={this.state.activeRoomKey}
            username={this.state.username}
            updateMessages={this.updateMessages.bind(this)}
          />
        </div>

      </div>
    );
  }
}

export default App;
