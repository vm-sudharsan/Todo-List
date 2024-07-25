import React from 'react';
import PropTypes from 'prop-types';

function ValidationButton({ input, time, setValidationMessage }) {
  function handleClick() {
    if (!input || !time) {
      setValidationMessage('Please fill both fields ....');
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

ValidationButton.propTypes = {
  input: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  setValidationMessage: PropTypes.func.isRequired,
};

export default ValidationButton;
