import styled from 'styled-components';
import Head from 'next/head';
import { useAuthState } from 'react-firebase-hooks/auth';
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import { auth, db } from '../../firebase';
import getRecipientEmail from '../../utils/getRecipientEmail';

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  )
}
export default Chat;

// This serverside function gives you result data inside the component props like chat, messages here
export async function getServerSideProps(context) {
  const ref = db.collection('chats').doc(context.query.id);
  //Prepair messages on server
  const messagesRes = await ref.collection('messages').orderBy('timestamp', 'asc').get();
  const messages = messagesRes.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })).map(messages => ({
    ...messages,
    timestamp: messages.timestamp.toDate().getTime(),
  }));

  // Prepair the chats
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data()
  }

  return {
    props: {
      messages: JSON.stringify(messages),
      chat,
    }
  }
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  height: 100vh;
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar{
    display: none;
  }
`;
