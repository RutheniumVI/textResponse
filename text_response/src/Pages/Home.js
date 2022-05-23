import React from 'react'
import InputBox from '../Components/InputBox'
import '../Styles/Home.css'
import ResponseCard from '../Components/ResponseCard'
import { Stack } from '@mui/material'
import Button from '@mui/material/Button';
import { useState } from 'react';
import NavBar from '../Components/NavBar'
import Settings from '../Components/Settings'
import Alert from '@mui/material/Alert';
import LoopIcon from '@mui/icons-material/Loop';
import Help from '../Components/Help';

function Home() {

  //states and setters
    const [loading, setLoading] = useState(false)
    const [prompt, setPrompt] = useState('')
    const [promptList, setPromptList] = useState([])
    const [responseList, setResponseList] = useState([])
    const [errorMessage, setErrorMessage] = useState(false)
    const [openHelp, setOpenHelp] = React.useState(false);
    const handleClickOpenHelp = () => {
          setOpenHelp(true);
        };  
    const handleCloseHelp = () => {
          setOpenHelp(false);
        };   
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
          setOpen(true);
        };  
    const handleClose = () => {
          setOpen(false);
        };
    const [engine, setEngine] = React.useState('text-curie-001');
    const handleEngineChange = (event) => {
          setEngine(event.target.value);
        };

    //API calls 
    const onButtonClick = () => {
        if((typeof(prompt) === 'string' || prompt instanceof String) && prompt.length > 0){
            setErrorMessage(false);
            setPromptList([prompt, ...promptList]); 
            req();
        } else {
          setErrorMessage(true)
        }
      }
        
    const req = () => { 
        setLoading(true);
        const data = {
            prompt: prompt,
            temperature: 0.8,
            max_tokens: 64,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
           }
        fetch(`https://api.openai.com/v1/engines/${engine}/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify(data),
       }).then(response => response.json())
       .then(data => {setResponseList([data.choices[0].text, ...responseList]);setLoading(false);});
      }

  return (
      //use stack
    <div id='container'>
      <NavBar handleClickOpen={handleClickOpen} handleClickOpenHelp={handleClickOpenHelp}/>
      <Stack id='stack' spacing={2}>
        <h1 id='title'>Fun With AI</h1>
        <InputBox id='textbox' input={[prompt, setPrompt]}/>
        <div id='buttons'>
          {!loading &&<Button 
            id='submitButton' 
            variant="contained"
            color='secondary'
            onClick={() => {onButtonClick();}}
          >
            Submit
          </Button>}
          {loading && <Button 
            id='loadingButton' 
            variant="contained"
            disabled={true}
          >
            Submit
            <LoopIcon/>
          </Button>}
        </div>
        {errorMessage && <Alert severity="error">Please enter a prompt</Alert>}
        <h2 id='responses'>Responses</h2>
        {responseList.length === 0 && <ResponseCard input="" reply=""></ResponseCard>}
        {promptList.map((item, index) => (
        <ResponseCard input={item} reply={responseList[index]} key={index}></ResponseCard>))}
      </Stack>
      <Settings open={open} handleClickOpen={handleClickOpen} handleClose={handleClose} engine={engine} handleEngineChange={handleEngineChange}/>
      <Help openHelp={openHelp} handleClickOpenHelp={handleClickOpenHelp} handleCloseHelp={handleCloseHelp}/>
    </div>
  )
}
export default Home