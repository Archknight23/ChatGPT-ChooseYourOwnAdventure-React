import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MongoClient } from 'mongodb';

const ChooseYourOwnAdventure = () => {

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