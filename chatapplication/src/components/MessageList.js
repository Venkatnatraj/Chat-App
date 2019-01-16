import React from 'react';
import ReactDOM from 'react-dom';
import Message from './Message';

class MessageList extends React.Component {
  componentWillUpdate() {
    const node = ReactDOM.findDOMNode(this);
    this.shouldScrollToBottom = node.scrollTop + node.clientHeight + 100 >= node.scrollHeight;
  }
  componentDidUpdate() {
    if(this.shouldScrollToBottom) {
      const node = ReactDOM.findDOMNode(this);
      node.scrollTop = node.scrollHeight;
    }
  }
  render() {
    if (!this.props.roomId) {
      return (
        <div className="message-list">
          <div className="join-room">
            &larr; Join a room!
          </div>
        </div>
      );
    }
    const { messages } = this.props;
    return (
      <div className="message-list">
        { messages.map((message, i) => {
          const isMyMessage = message.senderId === this.props.currentUser;
          return <Message
            myMessage={ isMyMessage }
            key={i} 
            username={ message.senderId } 
            text={ message.text}/>;
        })}
      </div>
    );
  }
}

export default MessageList;