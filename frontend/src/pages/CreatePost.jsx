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

  return (
    <Flex minH = '100vh' bgColor = 'gray.600' w = '100%'>
        <Sidebar />
        <Flex flex = '1' justify = 'center' align = 'flex-start' mt = {5} mb = {5}>
            <Box bg = 'white' p ={8} borderRadius={'30px'} shadow = 'md' h = '70%' w = '70%' textAlign = 'center'>
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
                        <Button bgColor = '#99AFD7' w='1/3' type = 'submit' isLoading= {loading}>
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