import { Box, Flex, Text, VStack, Input, Button, Link, Field } from '@chakra-ui/react';
import React,{ useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
        const navigate = useNavigate();
        const [username, setUsername] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');

        //handle for submission
        const handleSignup = async (e) => {
            e.preventDefault();
            setError('');

            try{
                const res = await fetch('http://localhost:5000/api/users/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({username, email, password}),
                });

                const data = await res.json();

                if(!res.ok){
                    setError(data.error || 'Signup Failed');
                    return;
                }

                navigate('/');
            }catch(err){
                setError('Network Error');
            }
        };

        
  return (
    <Flex minH = "100vh" align = "center" justify = "center" bgColor={'gray.600'}>
        <Box bg ="white" p = {8} rounded = 'md' shadow = 'lg' width = 'lg' textAlign= 'center'>
            <Text fontSize ='2xl' fontWeight ='bold' mb={6} color = {'black'}>
                Register
            </Text>
            <form onSubmit={handleSignup}>
                <VStack spacing = {4}>
                    <Field.Root required>
                        <Field.Label color ={'black'}>
                            Username 
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input 
                            type = 'text'
                            placeholder = "Create a username"
                            value = {username}
                            onChange={(e) => setUsername(e.target.value)}
                            color = 'black'
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
                            value = {email}
                            onChange={(e) => setEmail(e.target.value)}
                            color = 'black'
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
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                            color = 'black'
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