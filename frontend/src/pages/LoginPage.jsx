
import { Box, Flex, Text, VStack, Input, Button, Link, Field } from '@chakra-ui/react';
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

    
  return (
    <Flex minH = "100vh" align = "center" justify = "center" bgColor={'gray.600'}>
        <Box bg ="white" p = {8} rounded = 'md' shadow = 'lg' width = 'lg' textAlign= 'center'>
            <Text fontSize ='2xl' fontWeight ='bold' mb={6} color = {'black'}>
                Login
            </Text>
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