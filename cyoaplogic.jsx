import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MongoClient } from 'mongodb';

const CYOA_logic = () => {

    const[charisma, setCharisma] = useState(0);
    const[strength, setStrength] = useState(0);
    const[ intelligence, setIntelligence] = useState(0);
    const[ currentScene, setCurrentScene] = useState('');

    const [history, setHistory] = useState([]);
    const [npcMessage, setNpcMessage] = useState('');
    const [message, setMessage] = useState('');

    //connect to MongoDB Atlas Cluster

    const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    //Send ChatGPT API message to receive response

    const sendMessage = async ( apiKey, message, history) => {
        const response = await axios.post('https://api.chatgpt3.com/v1/chatbot', {
           prompt: message,
           history: history,
           max_tokens: 256
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });
        return response.data.response;
    }

    // Function to handle user input from scenes
    const goToScene = async (scene) => {
        //fetch scene data from MongoDB Atlas Cluster
        const scenes = client.db('test').collection('scenes');
        const currentScene = await scenes.findOne({name: CharacterData.currentScene});
        // Find the choice that matches the scene
        const choice = currentScene.choices.find(choice => choice.scene === scene);
        // Check if character traits are high enough to make the choice
        if (charisma < choice.charismaRequirement || strength < choice.strengthRequirement || intelligence < choice.intelligenceRequirement) {
            setNpcMessage(choice.failureMessage);
            return;
        };
        // Update character's current scene in the database
        const characters = client.db('test').collection('characters');
        
        // Fetch the updated character data
        const character = await characters.findOne({userId: user._id});
        setCharisma(character.charisma);
        setStrength(character.strength);
        setIntelligence(character.intelligence);
        setCurrentScene(character.currentScene);
    }

    // Function to handle submitting a message to the chatbot
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Send the message to the chatbot
        const response = await sendMessage(process.env.CHATGPT3_API_KEY, message, history);
        // Update the history
        setHistory([...history, message, response]);
        // creates a new message
        setMessage('');
        setNpcMessage(response);
    }
    useEffect(() => {
        const fetchData = async () => {
            await client.connect();
            //Fetch the character data from MongoDB Atlas Cluster
            const characters = client.db('test').collection('characters');
            const character = await characters.findOne({userId: user._id});
            setCharisma(character.charisma);
            setStrength(character.strength);
            setIntelligence(character.intelligence);
            setCurrentScene(character.currentScene);
            // Fetch the scene data from MongoDB Atlas Cluster
            const scenes = client.db('test').collection('scenes');
            const scene = await scenes.findOne({name: character.currentScene});
            if (scene.NPCs.length > 0) {
                const npc = scene.NPCs[0];
                setNpcMessage(npc.message);
                const response = await sendMessage(process.env.REACT_APP_CHATGPT3_API_KEY, npc.message, history);
                setHistory([...history, npc.message, response]);
                setNpcMessage(response);
            }
        };
        fetchData();
    }, []);
    // Use the useEffect hook to fetch the character data from MongoDB Atlas Cluster and close the connection when the component unmounts
    useEffect(() => {
        return () => {
            client.close();
        };
    }, []);
    return (
        <div>
            {/* Render the character's traits and current scene */}
            <p>Charisma: {charisma}</p>
            <p>Strength: {strength}</p>
            <p>Intelligence: {intelligence}</p>
            <p>Current Scene: {currentScene}</p>
            {/* Render the NPC's message */}
            <div>
                {history.map(message, index)} =&gt; {
                    <p key={index}>{message}</p>
                })&rbrace;
                <form onSubmit={handleSubmit}>
                    <input value={message} onChange={event => setMessage(event.target.value)} />
                    <button type="submit">Send</button>
                    </form>
            </div>
            {/* Render the choices */}
            {currentScene.choices.map(choice => (
                <button key={choice.scene} onClick={() => goToScene(choice.scene)}>
                    {choice.text}
                </button>
            ))}
        </div>
    );
};

export default CYOA_logic;
