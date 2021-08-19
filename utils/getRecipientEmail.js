const get = (users, loggedIn) => (
  users?.find(userToFilter => userToFilter !== loggedIn?.email)
);
export default get;