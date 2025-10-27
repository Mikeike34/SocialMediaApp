import { Box, Flex, Text, VStack, Input, Button, Link, Field, Heading } from '@chakra-ui/react';
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

        const backgroundYellow = '#fdfce8';
        const green = '#1f574f';
        const accentYellow = '#f6f8b5';
        const pink = '#ee98e0';
        const purple = '#a78dfc';
        const orange = '#f08853';

        
  return (
    <Flex minH = "100vh" align = "center" justify = "center" bgColor ={backgroundYellow}>
        <Box bg = {green} p = {8} borderRadius = '12px' shadow = 'lg' width = {{base: 'lg', md: '3xl' }} h = {{md: '33vh', xl: '45vh'}} textAlign= 'center' m = {{base: '20px'}}>
            <Heading
                fontFamily = "'Gravitas One, serif'"
                color = {accentYellow}
                fontSize = '10vh'
                pb = '10px'
                pt = '10px'
            >
                Register
            </Heading>
            <form onSubmit={handleSignup}>
                <VStack spacing = {4}>
                    <Field.Root required>
                        <Field.Label color ='white'>
                            Username 
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input 
                            type = 'text'
                            placeholder = "Create a username"
                            value = {username}
                            onChange={(e) => setUsername(e.target.value)}
                            color = 'white'
                        />
                    </Field.Root>
                    <Field.Root required>
                        <Field.Label color = 'white'>
                            Email
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input 
                            type = "text"
                            placeholder ="Enter your email"
                            value = {email}
                            onChange={(e) => setEmail(e.target.value)}
                            color = 'white'
                        />
                    </Field.Root>
                    <Field.Root required>
                        <Field.Label color = 'white'>
                            Password 
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input 
                            type = "password"
                            placeholder = "Create a password"
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                            color = 'white'
                        />
                    </Field.Root>
                    <Button
                        type = 'submit'
                        width = '100%'
                        bgColor = 'white'
                        color = "black"
                        borderRadius = '12px'
                        transition = 'all 0.25s ease-in-out'
                        _hover ={{
                            transform: 'scale(1.02)',
                            bg: accentYellow,
                            color: 'black',
                            shadow: 'md'
                        }}
                         _active = {{
                            bg: accentYellow,
                            color: 'black',
                        }}      
                    >
                        Create Account
                    </Button>
                </VStack>
            </form>
            <Text mt ={6} fontSize = {'sm'} color = 'white'>
                Already have an account?{" "}
                <Link color= 'blue.500' onClick={() => navigate("/login")}>
                    Login Here
                </Link>
            </Text>
        </Box>
    </Flex>
  );
};

export default SignupPage;