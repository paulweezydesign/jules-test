import React, { useState }from 'react';

function MyReactComponent() {
  const [message, setMessage] = useState('Hello from React!');
  return (
    <div>
      <h1>{message}</h1>
      <button onClick={() => setMessage('Button clicked!')}>Click Me</button>
    </div>
  );
}

export default MyReactComponent;
