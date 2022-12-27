import React from 'react';

import { redirect } from 'react-router-dom';



function mainpage() {
  const [showSignup, setShowSignup] = UseState(false);
  const [showLogin, setShowLogin] = UseState(false);
  const [redirect, setredirect] = UseState(false);
  const [character, setCharacter] = UseState(null);




  return (
    <div>
      {/* Render the login form by default, or the signupform if showSignup is true */}
      {!showSignup && <login setShowSignup={setShowSignup} setCharacter={setCharacter} setRedirect={setredirect} />}
      {showSignup && <signup setShowSignup={setShowSignup} setCharacter={setCharacter} setRedirect={setredirect} />}
      {/* Render a button to switch between login and signup */}
      <button onClick={() => setShowSignup(!showSignup)}>
        {showSignup ? 'Already have an account? Log in' : 'Need an account? Sign up'}
      </button>
      {/* Redirect to the game if the user is logged in */}
      {redirect && < redirect to={{ pathname: './CYOA_logic', state: { character: character } }} />}
    </div>
  );
}


export default mainpage;