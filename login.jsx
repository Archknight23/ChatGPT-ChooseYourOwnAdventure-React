import React, { useState, useEffect } from 'react';
import { MongoClient } from 'mongodb';

const login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const handleLogin = async (event) => {
        event.preventDefault();
        // Fetch the user data from the database
        const users = client.db('test').collection('users');
        const user = await users.findOne({username  : username});
    }
    const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    // handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        await client.connect();
        // Fetch the user and character data from the database
        const characters = client.db('test').collection('characters');
        const character = await characters.findOne({username : user, password : password});
        if (character) {
            // If the user exists, set the character data
            setCharisma(character.charisma);
            setStrength(character.strength);
            setIntelligence(character.intelligence);
            setCurrentScene(character.currentScene);
            setMessage('Login successful');
        } else {
            // If the user doesn't exist, create a new character
            const result = await characters.insertOne({
                username : user,
                password : password,
                charisma : 0,
                strength : 0,
                intelligence : 0,
                currentScene : 'start'
            });
            if (result.insertedCount === 1) {
                setCharisma(0);
                setStrength(0);
                setIntelligence(0);
                setCurrentScene('start');
                setMessage('Login successful');
            } else {
                setMessage('Login failed');
            }
        }
}

return (
    <div>
        {/* Render the login form */}
        <form onSubmit={handleLogin}>
            <label>Username: </label>
            <input value={username} onChange={(event) => setUsername(event.target.value)} />
            <label>Password: </label>
            <input value={password} onChange={(event) => setPassword(event.target.value)} />
            <button type="submit">Login</button>
            </form>
            {/* Render the error message */}
            {errorMessage && <p>{errorMessage}</p>}
            {/* Render a button to switch to the signup page */}
            <button onClick={() => setRedirect(true)}>Sign Up</button>
            {/* Render a button to switch to the game page */}
            {redirect && <Redirect to="./cyoaplogic" />}
    </div>
);
};

export default login;