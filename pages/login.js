import styled from 'styled-components';
import { Button } from '@material-ui/core'
import Head from 'next/head';
import { auth, provider } from '../firebase';

function Login() {

  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  }

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Logo
          src='https://blog.wildix.com/wp-content/uploads/2020/06/react-logo.jpg'
        />
        <Button onClick={signIn} variant='outlined' >Sign in with Google</Button>
      </LoginContainer>
    </Container>
  )
}

export default Login;


const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
`;

const Logo = styled.img`
  width: 400px;
  height: 200px;
  margin-bottom: 50px;
`;