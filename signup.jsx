import React from 'react';
import { MongoClient } from 'mongodb';
const signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [characterName, setCharacterName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Connection to MongoDB database
    const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    //Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        await client.connect();
        const characters = client.db('test').collection('characters');
        const character = await characters.findOne({username : username });
        if (character) {
            setErrorMessage('Username already exists');
        } else {
            const newCharacter = await characters.insertOne({
                username : username,
                password : password,
                characterName : characterName,
                charisma : math.floor(math.random() * 10),
                strength : math.floor(math.random() * 10),
                intelligence : math.floor(math.random() * 10),
                currentScene : 'tutorial'
            });
            await characters.insertOne(newCharacter);
            setCharacter(newCharacter);
            setRedirect(true);
        }
    }

return (
   
    <div>
        {/* Render the signup form */}
        <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input value={username} onChange={(event) => setUsername(event.target.value)} />
        <label>Password:</label>
        <input value={password} onChange={(event) => setPassword(event.target.value)} />
        <label>Character Name:</label>
        <input value={characterName} onChange={(event) => setCharacterName(event.target.value)} />
        <button type="submit">Sign Up</button>
        </form>
        {errorMessage && <p>{errorMessage}</p>}
    </div>
    );};
export default signup;