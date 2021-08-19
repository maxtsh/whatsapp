import CircularProgress from '@material-ui/core/CircularProgress';

function Loading() {
  return (
    <center style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <img src="https://blog.wildix.com/wp-content/uploads/2020/06/react-logo.jpg" alt='loading' width={400} height={200} style={{ marginBottom: '10px' }} />
        <CircularProgress />
      </div>
    </center>
  )
}
export default Loading;