import { useCallback } from 'react';
import styled from 'styled-components';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
import { useAuthState } from 'react-firebase-hooks/auth';
import StartNewChat from './StartNewChat';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db, provider } from '../firebase';
import Chat from '../components/Chat';

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
  const [chatsSnapshot, loading, error] = useCollection(userChatRef);

  const createChat = useCallback((email) => {
    db.collection('chats').add({
      users: [user.email, email],
    });
  }, [user]);



  return (
    <Container>
      <Header>
        <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>
      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chats..." />
      </Search>
      <StartNewChat user={user} create={createChat} />
      {chatsSnapshot?.docs.map((chat => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      )))}
    </Container>
  )
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: auto;
  border-right: 1px solid whitesmoke;
  -ms-overflow-style: none;
  scrollbar-width: none;

  ::-webkit-scrollbar{
    display: none;
  }
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top:0;
  background-color: #fff;
  z-index: 1;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover{
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;
