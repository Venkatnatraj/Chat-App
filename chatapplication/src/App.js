/* eslint no-console: ["error", { allow: ["error"] }] */

import React from 'react';
import Chatkit from '@pusher/chatkit';

// Components
import MessageList from './components/MessageList';
import SendMessageForm from './components/SendMessageForm';
import RoomList from './components/RoomList';
import NewRoomForm from './components/NewRoomForm';

// Libraries
import './styles.css';
import { tokenUrl, instanceLocator, userName } from './config';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: []
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.getRooms = this.getRooms.bind(this);
    this.subscribeToRoom = this.subscribeToRoom.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }
  componentDidMount() {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId: userName,
      tokenProvider: new Chatkit.TokenProvider({
        url: tokenUrl
      })
    });

    chatManager.connect()
      .then(currentUser => {
        this.currentUser = currentUser;
        this.getRooms();
        // this.subscribeToRoom();
      }).catch(err => console.error('Error on connecting: ', err));
  }
  getRooms() {
    this.currentUser.getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
        });
      }).catch(err => console.error('Error on fetching joinable rooms: ', err));
  }
  subscribeToRoom(roomId) {
    this.setState({
      messages: []
    });
    this.currentUser.subscribeToRoom({
      roomId,
      hooks: {
        onNewMessage: message => {
          this.setState({
            messages: [...this.state.messages, message]
          });
        }
      }
    }).then(room => {
      this.setState({
        roomId: room.id
      });
      this.getRooms();
    }).catch(err => console.error('Error on subscribing to rooms: ', err));
  }
  sendMessage (text) {
    this.currentUser.sendMessage({
      text,
      roomId: this.state.roomId
    });
  }
  createRoom(name) {
    this.currentUser.createRoom({
      name
    }).then(room => this.subscribeToRoom(room.id))
      .catch(err => console.error('Error on creating new room: ', err));
  }
  render() {
    const rooms = [...this.state.joinableRooms, ...this.state.joinedRooms];
    return (
      <div className='app'>
        <RoomList
          rooms={rooms} 
          subscribeToRoom={ this.subscribeToRoom }
          roomId={ this.state.roomId } />
        <MessageList
          currentUser={ userName }
          roomId={ this.state.roomId }
          messages={ this.state.messages }/>
        <SendMessageForm 
          disabled={ !this.state.roomId }
          sendMessage={ this.sendMessage } />
        <NewRoomForm createRoom={ this.createRoom }/>
      </div>
    );
  }
}

export default App;