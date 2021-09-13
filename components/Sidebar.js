import { useCallback } from 'react';
import styled from 'styled-components';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { RiListSettingsFill } from 'react-icons/ri';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { VscHubot } from 'react-icons/vsc';
import { IoPersonOutline } from 'react-icons/io5';
import { FiSettings } from 'react-icons/fi';
import { RiMoonLine } from 'react-icons/ri';
import ChatIcon from '@material-ui/icons/Chat';
import HamMenuIcon from '@material-ui/icons/Menu';
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
      <ToolbarWrapper>
        <ToobarHeader>
          <IconButton>
            <HamMenuIcon />
          </IconButton>
        </ToobarHeader>
        <ToolbarIcons>
          <IconButton>
            <HiOutlineChatAlt2 size={30} />
          </IconButton>
          <IconTitle>All chats</IconTitle>
          <IconButton>
            <IoChatboxEllipsesOutline size={30} />
          </IconButton>
          <IconTitle>Unread</IconTitle>
          <IconButton>
            <IoPersonOutline size={30} />
          </IconButton>
          <IconTitle>Personal</IconTitle>
          <IconButton>
            <VscHubot size={30} />
          </IconButton>
          <IconTitle>Bots</IconTitle>
          <IconButton>
            <RiListSettingsFill size={30} />
          </IconButton>
          <IconTitle>Edit</IconTitle>
          <IconButton>
            <FiSettings size={30} />
          </IconButton>
          <IconTitle>Edit</IconTitle>
          <IconButton>
            <RiMoonLine size={30} />
          </IconButton>
          <IconTitle>Night</IconTitle>
        </ToolbarIcons>
      </ToolbarWrapper>
      <ChatWrapper>
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
      </ChatWrapper>
    </Container>
  )
}

export default Sidebar;

const Container = styled.div`
  display: flex;
  flex: 0.45;
  height: 100vh;
  min-width: 350px;
  max-width: 400px;
  overflow-y: auto;
  border-right: 1px solid whitesmoke;
  -ms-overflow-style: none;
  scrollbar-width: none;

  /* background-color: #edd6e4;
    background-image: 
        radial-gradient(at 47% 33%, hsl(353.57, 57.99999999999999%, 91%) 0, transparent 59%), 
        radial-gradient(at 82% 65%, hsl(347.27, 65%, 90%) 0, transparent 55%); */

  ::-webkit-scrollbar{
    display: none;
  }
`;

export const Wrapper = styled.div`
  /* backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%); */
  background-color: rgba(255, 255, 255, 1);
`;

const ToolbarWrapper = styled(Wrapper)`
  flex: 0.3;
`;

const ChatWrapper = styled(Wrapper)`
  flex: 1;
`;

const ToolbarIcons = styled.div`
  text-align: center;
  flex: 1;
  padding: 15px;
`;

const IconTitle = styled.p`
  font-size: 12px;
  font-weight: 400;
  margin: 0 0 30px 0;
  text-align: center;
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
  /* background-color: #fff; */
  z-index: 1;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const ToobarHeader = styled(Header)`
  justify-content: center;
  flex: 1;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover{
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;
