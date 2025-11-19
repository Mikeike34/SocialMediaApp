import Sidebar from '@/components/Sidebar';
import { Box, Button, Field, Flex, HStack, Text, Textarea, VStack } from '@chakra-ui/react';
import { toaster } from "@/components/ui/toaster";
import React, { useState } from 'react'

const CreatePost = () => {

    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    
    const userID = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!text.trim()){
            toaster.create({
                title: 'Post content is empty',
                type: 'warning',
                duration: 3000,
                closable: true,
            });
            return;
        }

        setLoading(true);

        try{
            const res = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({text}),
            });

            const data = await res.json();

            if(res.ok){
                toaster.create({
                    title: 'Post Created Successfully!',
                    type: 'success',
                    duration: 3000,
                    closable: true,
                });
                setText(''); //clear text area
            }else{
                toaster.create({
                    title: 'Error Creating Post',
                    description: data.error,
                    type: 'error',
                    duration: 3000,
                    closable: true,
                });
            }
        }catch(err){
            console.error(err);
            toaster.create({
                title: 'Network Error',
                type: 'error',
                duration: 3000,
                closable: true,
            });
        }finally{
            setLoading(false);
        }
    };

//colors
  const backgroundYellow = '#fdfce8';
  const green = '#1f574f';
  const accentYellow = '#f6f8b5';
  const pink = '#ee98e0';
  const purple = '#a78dfc';
  const orange = '#f08853';

  return (
    <Flex
        minH = '100vh'
        bg = {green}
        p = {{base: 2, md: 4, lg: 6}}
    >
        <Sidebar />
        <Flex 
            flex = '1' 
            justify = 'center' 
            align = 'center'
            mt = {{base: '0'}} 
            mb = {{base: '100px'}}
        >
            <Box 
                bg = {backgroundYellow} 
                p ={8} 
                borderRadius={'30px'} 
                shadow = 'md' 
                h = {{base: '50vh', md: '40vh', xl: '50vh'}}
                w = {{base: '85vw', md: '75vw', lg: '80vw', xl: '50vw'}} 
                textAlign = 'center'
            >
                <Text fontSize = '2xl' fontWeight = 'bold' mb = {6} color = {'black'}>
                    Write a Post
                </Text>
                <form onSubmit = {handleSubmit}>
                    <VStack spacing = {4}>
                        <Field.Root>
                            <Field.Label color = 'black'>Your Post:</Field.Label>
                            <Textarea 
                                value = {text}
                                onChange = {(e) => setText(e.target.value)}
                                color = 'black' 
                                h = '20vh' 
                                placeholder = 'Post Content Goes Here' 
                            />
                        </Field.Root>
                        <Button 
                            bg = '#99AFD7' 
                            w ='1/3' 
                            type = 'submit' 
                            isLoading = {loading}
                            _hover={{bg: accentYellow, shadow: 'xs'}}
                            _active ={{bg: accentYellow}}
                            transition = 'all 0.1s ease-in-out'
                        >
                            Share
                        </Button>
                    </VStack> 
                </form>
            </Box>
        </Flex>
        
    </Flex>
  )
}

export default CreatePost;