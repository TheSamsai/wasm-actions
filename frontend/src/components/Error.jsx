

const Error = (props) => {
  const { error, setError } = props

  const clearError = () => {
    setError(null)
  }

  if (error) {
    return <div style={{
      textAlign: "center",
      backgroundColor: "red",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center"
    }}>
             <div style={{ margin: "auto" }}>
               {error}
             </div>
             <button onClick={clearError}>Close</button>
           </div>
  } else {
    return <div>
           </div>
  }
}

export default Error
