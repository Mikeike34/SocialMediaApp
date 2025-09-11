import Sidebar from '@/components/Sidebar';
import { Box, Button, Field, Flex, HStack, Text, Textarea, VStack } from '@chakra-ui/react';
import React from 'react'

const CreatePost = () => {
  return (
    <Flex minH = '100vh' bgColor = 'gray.600' w = '100%'>
        <HStack align = 'stretch' w = '100%' mr = {5}>
            <Sidebar />
            <Box bg = 'white' mt = {5} mb = {5} p ={8} borderRadius={'30px'} shadow = 'md' width = 'lg' textAlign = 'center'>
                <Text fontSize = '2xl' fontWeight = 'bold' mb = {6} color = {'black'}>
                    Write a Post
                </Text>
                <form>
                    <VStack spacing = {4}>
                        <Field.Root>
                            <Field.Label color = 'black'>Your Post:</Field.Label>
                            <Textarea color = 'black' h = '20vh' placeholder = 'Post Content Goes Here' />
                        </Field.Root>
                        <Button bgColor = '#99AFD7' w='1/3'>
                            Share
                        </Button>
                    </VStack> 
                </form>
            </Box>
        </HStack>
    </Flex>
  )
}

export default CreatePost;