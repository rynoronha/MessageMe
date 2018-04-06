import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';

class RoomList extends Component {
  constructor(props) {
    super(props);

    this.state = {
    rooms: [],
    show: false
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
   }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
     return (
       <section className="room-list">
        <h3>Rooms</h3>

        <Button id="new-room" bsStyle="primary" onClick={this.handleShow}>New Room</Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header>
            <Modal.Title>Create New Room</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Enter a room name</p>
          </Modal.Body>
          <Modal.Footer>
            <Button id="modal-cancel" onClick={this.handleClose}>Cancel</Button>
            <Button id="modal-create-room" bsStyle="primary">Create Room</Button>
          </Modal.Footer>
        </Modal>


        {
            this.state.rooms.map( (room)  =>
              <span className="room-name" key={room.key}>
                <p>{room.name}</p>
              </span>
       )}
       </section>

     );
   }
}

export default RoomList;
