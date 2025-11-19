
import { Box, Flex, Text, VStack, Input, Button, Link, Field, Heading } from '@chakra-ui/react';
import React,{ useState } from 'react'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    //Handle Form Submission
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try{
            const res = await fetch('http://localhost:5000/api/users/login' , {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();
            if(!res.ok){
                setError(data.error || 'Login Failed');
                return;
            }

            //Save token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userID', data.user.id);

            //redirect to feed
            navigate('/feed');
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
    <Flex 
        minH = "100vh" 
        align = "center" 
        justify = "center" 
        bgColor = {green} 
    >
        <Box 
            bg = {backgroundYellow} 
            p = {8} borderRadius = '12px' 
            shadow = 'lg' 
            w = {{base: 'lg', md: '2xl'}} 
            h = {{base: '45%', md: '40%', xl: '50%'}} 
            textAlign= 'center' 
            m = {{base: '20px'}}
        >
            <Heading
                fontFamily = "'Gravitas One, serif'"
                color = {purple}
                fontSize = '10vh'
                py = {{base: '20px', md: '30px', lg: '40px', xl: '20px'}}
            >
                Login
            </Heading>
            <form onSubmit = {handleLogin}>
                <VStack spacing = {4}>
                    <Field.Root required>
                        <Field.Label color = {'black'}>
                            Email
                            <Field.RequiredIndicator />
                        </Field.Label>
                        <Input 
                            type = "text"
                            placeholder ="Enter your email"
                            value = {email}
                            onChange = {(e) => setEmail(e.target.value)}
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
                            placeholder = "Enter your password"
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                            color = 'black'
                        />
                    </Field.Root>
                    <Button
                        type = 'submit'
                        width = '100%'
                        bgColor = 'black'
                        color = 'white'
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