import React from 'react';

export default function ValidationButton({ input, time, setValidationMessage }) {
  function handleClick() {
    if (!input || !time) {
      setValidationMessage('Please fill both fields');
    } else {
      setValidationMessage('');
    }
  }

  return (
    <button onClick={handleClick}>
      Validate
    </button>
  );
}
