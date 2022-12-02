
const Notification = (props) => {
  const { notification, setNotification } = props

  const clearNotification = () => {
    setNotification(null)
  }

  if (notification) {
    return <div style={{
      textAlign: "center",
      backgroundColor: "lightgreen",
      color: "black",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center"
    }}>
             <div style={{ margin: "auto" }}>
               {notification}
             </div>
             <button onClick={clearNotification}>Close</button>
           </div>
  } else {
    return <div>
           </div>
  }
}

export default Notification
