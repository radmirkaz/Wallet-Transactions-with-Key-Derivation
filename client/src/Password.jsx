import server from "./server";
import { useState, useEffect } from "react";

function Password({ address }) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Reset the form whenever the address changes
        setIsSubmitted(false);
        setMessage('');
      }, [address]);
    
    async function handleSubmit(evt) {
      evt.preventDefault();
      setIsSubmitted(true);
      const password = evt.target.elements.password.value;
      
      const response = await server.post('verifyPassword', { address, password });
  
      const isValid = response.data.isValid;
      if (isValid) {
        setMessage('Your password is correct, your transactions will be signed automatically');
      } else {
        setMessage('Your password is not correct, please reload the page and try again');
      }
    }
  
    return (
        <form className="container password" onSubmit={handleSubmit}>
            <h1>Your Password</h1>
    
            <label>
            Password
            <input name="password" type="password" placeholder="Type your password" disabled={isSubmitted}></input>
            </label>
    
            <input type="submit" className="button" value="Check" disabled={isSubmitted} />
            
            {/* The message is displayed here */}
            <p>{message}</p>
        </form>
    );
  }
  
  export default Password;