import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signedOn: false
    };

    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);


  }

    signIn() {
      const provider = new this.props.firebase.auth.GoogleAuthProvider();
      this.props.firebase.auth().signInWithPopup( provider );
      this.setState({ signedOn: true});
    }

    signOut() {
      this.props.firebase.auth().signOut();
      this.props.setUser(null);
      this.setState({ signedOn: false});
    }

    componentDidMount() {
      this.props.firebase.auth().onAuthStateChanged( user => {
      this.props.setUser(user);
      });
    }

    buttonDisplay() {
      if (this.state.signedOn === false) {
        return <Button id="user-sign-in" bsStyle="success" onClick={this.signIn}>Sign-In</Button>
      } else
        return <Button id="user-sign-out" bsStyle="danger" onClick={this.signOut}>Sign-Out</Button>
    }

  render() {
    return(
      <section className="user">
        <h3 className="welcome-user">Hello {this.props.username}</h3>
        <div id="button-display">{this.buttonDisplay()}</div>
      </section>
    )
  }
}

export default User;
