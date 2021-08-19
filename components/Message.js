import styled from 'styled-components';

function Message({ user, message }) {
  return (
    <Container>
      {message}
    </Container>
  )
}

export default Message;

const Container = styled.div`

`;
