import { useCallback, useState, useRef } from 'react';
import styled from 'styled-components';
import { Avatar, IconButton } from '@material-ui/core';
import { useAuthState } from 'react-firebase-hooks/auth';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useRouter } from 'next/router'
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import Message from '../components/Message';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import firebase from 'firebase';
import TimeAgo from 'timeago-react';
import getRecipientEmail from '../utils/getRecipientEmail';

function ChatScreen({ chat, messages }) {
  const [input, setInput] = useState('');
  const endOfMessageRef = useRef(null);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [messagesSnapshot] = useCollection(db.collection('chats')
    .doc(router.query.id)
    .collection('messages')
    .orderBy('timestamp', 'asc'));
  const recipientEmail = getRecipientEmail(chat.users, user);
  const [recipientSnapshot] = useCollection(db.collection('users')
    .where('email', '==', recipientEmail));

  const showMessage = () => {
    if (messagesSnapshot) {
      return messagesSnapshot?.docs.map(message => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ))
    } else {
      return JSON.parse(messages).map(message => (
        <Message
          key={message.id}
          user={message.user}
          message={message}
        />
      ));
    }
  };

  const ScrollToView = useCallback(() => {
    endOfMessageRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, [endOfMessageRef]);

  const handleInputChange = useCallback(({ target: { value } }) => {
    setInput(value);
  }, []);

  const sendMessage = useCallback((e) => {
    e.preventDefault();
    // Update last seen
    db.collection('users').doc(user.uid).set({
      lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    db.collection('chats').doc(router.query.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL
    });
    setInput("");
    ScrollToView();
  }, [input, user, router, ScrollToView]);

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoUrl} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>Last Active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : "A long time ago"}
            </p>
          ) : (<p>Loading...</p>)}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessage()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticonIcon />
        <Input value={input} onChange={handleInputChange} />
        <button hidden disabled={!input} type='submit' onClick={sendMessage}>Send message</button>
        <MicIcon />
      </InputContainer>
    </Container>
  )
}

export default ChatScreen;

const Container = styled.div`
`;

const InputContainer = styled.form`
 display: flex;
 align-items: center;
 padding: 10px;
 position: sticky;
 bottom: 0;
 background-color: #fff;
 z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  padding: 20px;
  background-color: whitesmoke;
  margin: 0px 15px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 100;
  padding: 11px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3{
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div`
`;

const MessageContainer = styled.div`
  padding: 30px;
  min-height: 90vh;
  background-color: #e5ded8;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;
