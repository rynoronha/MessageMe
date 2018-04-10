import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class User extends Component {
  constructor(props) {
    super(props);

  }

    signIn() {
      const provider = new this.props.firebase.auth.GoogleAuthProvider();
      this.props.firebase.auth().signInWithPopup( provider );
    }

    signOut() {
      this.props.firebase.auth().signOut();
    }

    componentDidMount() {
      this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user);
      });
    }

  render() {
    console.log(this.props.username);
    return(
      <section className="user">
        <h3 className="welcome-user">Hello {this.props.username}</h3>
        <Button id="user-sign-in" bsStyle="primary" onClick={this.signIn()}>Sign-In</Button>
        <Button id="user-sign-out" bsStyle="danger" onClick={this.signOut()}>Sign-Out</Button>
      </section>
    )
  }
}

export default User;
