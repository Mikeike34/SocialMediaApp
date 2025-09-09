
import { Box, Flex, Text, VStack, Input, Button, Link, Field } from '@chakra-ui/react';
import React,{ useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    
  return (
    <Flex minH = "100vh" align = "center" justify = "center" bgColor={'gray.600'}>
        <Box bg ="white" p = {8} rounded = 'md' shadow = 'lg' width = 'lg' textAlign= 'center'>
            <Text fontSize ='2xl' fontWeight ='bold' mb={6} color = {'black'}>
                Login
            </Text>
            <form >
                <VStack spacing = {4}>
                    <Field.Root required>
                        <Field.Label color = {'black'}>
                            Email
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input 
                            type = "text"
                            placeholder ="Enter your email"
                        />
                    </Field.Root>
                    <Field.Root required>
                        <Field.Label color = {'black'}>
                            Password 
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input 
                            type = "password"
                            placeholder = "Enter your password"
                        />
                    </Field.Root>
                    <Button
                        type = 'submit'
                        width = '100%'
                        bgColor = {'gray.400'}
                        color = "black"
                        _hover = {{opacity: 0.9}}    
                    >
                        Login
                    </Button>
                </VStack>
            </form>
            <Text mt ={6} fontSize = {'sm'} color = {'black'}>
                Not a member?{" "}
                <Link color= 'blue.500' onClick={() => navigate("/signup")}>
                    Signup Now
                </Link>
            </Text>
        </Box>
    </Flex>
  );
};

export default LoginPage;