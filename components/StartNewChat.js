import { useState, useCallback } from 'react';
import * as EmailValidator from 'email-validator';
import styled from 'styled-components'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

function StartNewChat({ user, create }) {
  const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
  const [chatsSnapshot, loading, error] = useCollection(userChatRef);
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [popUp, setPopUp] = useState({ show: false, message: '' });


  const handlePopUp = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setPopUp({ ...popUp, show: !popUp.show });
  }, [popUp]);

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);


  const chatAlreadyExist = useCallback((receiver) => !chatsSnapshot?.docs.find(chat =>
    chat.data().users.find(user =>
      user === receiver))?.length > 0, [chatsSnapshot]);

  const handleAdd = useCallback(() => {
    console.log(chatAlreadyExist(email));
    if (!email) { setPopUp({ show: true, message: 'Email field is empty!' }); return null };
    if (!EmailValidator.validate(email)) { setPopUp({ show: true, message: 'Enter a valid email!' }); return null };
    if (user.email === email) { setPopUp({ show: true, message: 'You cant chat with yourself!' }); return null };
    if (!chatAlreadyExist(email)) { setPopUp({ show: true, message: 'Chat already exists!' }); return null };

    create(email);
    handleClose();
  }, [user, email, create, handleClose, chatAlreadyExist]);

  const handleEmailChange = useCallback((e) => {
    e.preventDefault();
    setEmail(e.target.value);
  }, []);

  return (
    <>
      <SidebarButton onClick={handleClickOpen}>Sart a new chat</SidebarButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="start-a-new-chat">
        <DialogTitle id="start-a-new-chat">Start a new chat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={handleEmailChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="default">
            Cancel
          </Button>
          <Button onClick={handleAdd} variant="contained" color="primary">
            Add chat
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={popUp.show}
        autoHideDuration={6000}
        onClose={handlePopUp}
        message={popUp.message}
        action={
          <>
            {/* <Button color="secondary" size="small" onClick={handlePopUp}>
              UNDO
            </Button> */}
            <IconButton size="small" aria-label="close" color="inherit" onClick={handlePopUp}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </>
  );
}
export default StartNewChat;

const SidebarButton = styled(Button)`
  width: 100%;

  &&&{
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;