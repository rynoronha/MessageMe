import React, { Component } from 'react';
import { Button, Modal, FormControl} from 'react-bootstrap';

class RoomList extends Component {
  constructor(props) {
    super(props);

    this.state = {
    rooms: [],
    show: false,
    newRoomName: ''
    };


    this.roomsRef = this.props.firebase.database().ref('rooms');

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

  }

  componentDidMount() {
     this.roomsRef.on('child_added', snapshot => {
       const room = snapshot.val();
       room.key = snapshot.key;
       this.setState({ rooms: this.state.rooms.concat( room ) })
     });
     this.roomsRef.on('child_changed', snapshot => {
        const room = snapshot.val();
        room.key = snapshot.key;
        const editedRoom = { name: room.name, key: room.key};
        const rooms = this.state.rooms.map( (r, i) => {
          if (r.key === room.key) {
            return editedRoom;
          } else return r;
        });
        this.setState({ rooms: rooms })
        console.log(this.state.rooms);
      });
   }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleChange(e) {
    this.setState({ newRoomName: e.target.value })
  }

  keyPress(e) {
    if (e.keyCode === 13 ) {
      this.createRoom(e);
    }
  }

  createRoom(e) {
    e.preventDefault();
    this.roomsRef.push({name: this.state.newRoomName});
    this.setState({newRoomName: ''});
    this.setState({ show: false });
  }

  editRoomName(roomKey, e) {
    if (e.keyCode === 13 ) {
      e.preventDefault();
      var updates = {};
      updates['rooms/' + roomKey + '/' + 'name'] = e.target.innerText
      this.props.firebase.database().ref().update(updates);
    }
  }


  selectRoom(room, key) {
    this.props.setActiveRoom(room);
    this.props.setActiveRoomKey(key);
  }

  deleteRoom(roomKey) {
    const room = this.props.firebase.database().ref('rooms/' + roomKey);
    room.remove();
    const remainRooms= this.state.rooms.filter(room => room.key !== roomKey);
    this.setState({ rooms: remainRooms});
    this.selectRoom(null, null);
    this.props.deleteMessagesInDeletedRoom(roomKey);
  }

  render() {
     return (
       <section className="room-list">
        <h3 id="rooms-heading">Rooms</h3>

        <Button id="new-room" bsStyle="primary"
          onClick={this.handleShow}> + New Room
        </Button>
        <Modal
          id="new-room-modal"
          show={this.state.show}
          onHide={this.handleClose}
        >
          <Modal.Header>
            <Modal.Title>Create a New Room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormControl
              type="text"
              placeholder="enter room name"
              value={ this.state.newRoomName }
              onChange={ (e) => this.handleChange(e) }
              onKeyDown={ (e) => this.keyPress(e)}
            />
          </Modal.Body>
          <Modal.Footer>
              <Button id="modal-cancel" onClick={this.handleClose}>Cancel</Button>
              <Button id="modal-create-room" bsStyle="primary" onClick={ (e) => this.createRoom(e) }>Create Room</Button>
          </Modal.Footer>
        </Modal>

        {
            this.state.rooms.map( (room)  =>
            <div id="rooms">
              <span className="room-name"
                contenteditable="true"
                onKeyDown={ (e) => this.editRoomName(room.key, e) }
                key={room.key}
                onClick={(e) => this.selectRoom(room.name, room.key, e)}
              >
                  <p>{room.name}</p>
              </span>

              <span id="delete-room-container">
                  <button id="delete-room" onClick={() => this.deleteRoom(room.key)}>Delete</button>
              </span>
            </div>

       )}
       </section>

     );
   }
}

export default RoomList;
