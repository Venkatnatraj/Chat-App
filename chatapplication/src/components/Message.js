import React from 'react';

const Message = (props) => {
  const { username, text } = props;
  const myMessageClass = props.myMessage ? 'message-mine' : '';
  return (
    <div className={ 'message ' + myMessageClass }>
      <div className='message-username'>{ username }</div>
      <div className='message-text'>{ text }</div>
    </div>
  );
};

export default Message;