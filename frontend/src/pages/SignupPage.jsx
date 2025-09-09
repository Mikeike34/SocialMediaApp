import { Box, Flex, Text, VStack, Input, Button, Link, Field } from '@chakra-ui/react';
import React,{ useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
        const navigate = useNavigate();

        
  return (
    <Flex minH = "100vh" align = "center" justify = "center" bgColor={'gray.600'}>
        <Box bg ="white" p = {8} rounded = 'md' shadow = 'lg' width = 'lg' textAlign= 'center'>
            <Text fontSize ='2xl' fontWeight ='bold' mb={6} color = {'black'}>
                Register
            </Text>
            <form>
                <VStack spacing = {4}>
                    <Field.Root required>
                        <Field.Label color ={'black'}>
                            Username 
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input 
                            type = 'text'
                            placeholder = "Create a username"
                        />
                    </Field.Root>
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
                            placeholder = "Create a password"
                        />
                    </Field.Root>
                    <Button
                        type = 'submit'
                        width = '100%'
                        bgColor = {'gray.400'}
                        color = "black"
                        _hover = {{opacity: 0.9}}    
                    >
                        Create Account
                    </Button>
                </VStack>
            </form>
            <Text mt ={6} fontSize = {'sm'} color = {'black'}>
                Already have an account?{" "}
                <Link color= 'blue.500' onClick={() => navigate("/")}>
                    Login Here
                </Link>
            </Text>
        </Box>
    </Flex>
  );
};

export default SignupPage;