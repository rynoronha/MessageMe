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
      activeRoom: '',
      activeRoomKey: '',
      username: null
    }

  }

  setActiveRoom(room) {
    this.setState({ activeRoom: room})
  }

  setActiveRoomKey(key) {
    this.setState({ activeRoomKey: key})
  }

  setUser(user){
    if (user === null) {
      return this.setState({ username: "Guest"})
    } else return this.setState({ username: user.displayName })
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
          <h1 className="App-title">Bloc Chat</h1>
        </header>
        <div className="room-list">
          <RoomList
            firebase={firebase}
            activeRoom={this.state.activeRoom}
            setActiveRoom={this.setActiveRoom.bind(this)}
            setActiveRoomKey={this.setActiveRoomKey.bind(this)}
          />
        </div>

        <div className="message-list">
          <MessageList
            firebase={firebase}
            activeRoom={this.state.activeRoom}
            activeRoomKey={this.state.activeRoomKey}
          />
        </div>

      </div>
    );
  }
}

export default App;
