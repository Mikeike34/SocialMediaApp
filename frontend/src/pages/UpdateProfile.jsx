import Sidebar from '@/components/Sidebar';
import { Avatar, Box, Button, Flex, Heading, HStack, Image, Input, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { toaster } from "@/components/ui/toaster"

const UpdateProfile = () => {

    const [user, setUser] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); //store selected image file
    const [preview, setPreview] = useState(null); //preview the URL for the file
    const [uploading, setUploading] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    const userID = localStorage.getItem('userID');
    const token = localStorage.getItem('token');


    //colors
    const backgroundYellow = '#fdfce8';
    const green = '#1f574f';
    const accentYellow = '#f6f8b5';
    const pink = '#ee98e0';
    const purple = '#a78dfc';
    const orange = '#f08853';

    useEffect(() => {
        if(!userID || !token) return;
        const fetchUser = async () => {
            try{
            const res = await fetch(`http://localhost:5000/api/users/${userID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

                const data = await res.json();

                if(res.ok){
                    setUser(data);
                }else{
                    console.error('Failed to fetch user:', data.error);
                }
            }catch(err){
                console.error('Network Error: ',err);
            }
        };
        fetchUser();
    },[userID, token]);

    //handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file){
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    //upload image to backend
    const handleUpload = async () => {
        if(!selectedFile){
           toaster.create({
            description: 'No File Selected',
            type: 'warning',
            duration: 2000,
            closable: true,
           })
           return;
        }
        setUploading(true);

        const formData = new FormData();
        formData.append('profile_pic', selectedFile);

        try{
            const res = await fetch(`http://localhost:5000/api/users/${userID}/profile_pic`,{
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if(res.ok){
                setUser(data.user); //update displayed profile
                toaster.create({
                    description: 'Profile Picture Updated!',
                    type: 'success',
                    duration: 3000,
                })
                setPreview(null);
                setSelectedFile(null);
            }else{
                toaster.create({
                    title: 'Upload Failed',
                    description: data.error || 'Something went wrong.',
                    type: 'error',
                    duration: 3000,
                    closable: true,
                })
            }
        }catch(err){
            console.error('Upload Error: ', err);
            toaster.create({
                title: 'Network Error',
                type: 'error',
                duration: 3000,
                cloasable: true,
            })
        }finally{
            setUploading(false);
        }
    };

    //Change username
    const handleChangeUsername = async() => {
        if(!newUsername.trim()){
            toaster.create({
                description: "Username cannot be empty",
                type: 'warning',
                duration: 2000,
                closable: true,
            });
            return;
        }

        try{
            const res = await fetch(`http://localhost:5000/api/users/${userID}/username`,{
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({username: newUsername }),
            });

            const data = await res.json();

            if (res.ok){
                setUser((prev) => ({...prev, username: newUsername})); //Displays new username on UI

                toaster.create({
                    description: 'Username updated!',
                    type: 'success',
                    duration: 3000,
                    closable: true,
                });

                setNewUsername("");
            }else{
                toaster.create({
                    description: data.error || "Update failed",
                    type: 'error',
                    duration: 3000,
                    closable: true,
                });
            }
        }catch(err){
            console.error("Username update error: ", err);
            toaster.create({
                description: 'Network Error',
                type: 'error',
                duration: 3000,
                closable: true,
            });
        }
    };
    

  return (
    <Flex
        minH = '100vh'
        bg = {green}
        p = {{base: 2,md: 4, lg: 6}}
    >
        <Sidebar />
        <Flex
            flex = '1'
            justify = 'center'
            align = 'flex-start'
            mt = '5'
            mb = '5'
        >
            <Box
                bg = {backgroundYellow}
                p = '8'
                borderRadius = '30px'
                shadow = 'md'
                minH = '60%'
                minW = '60%'
                textAlign = 'center'
            >
                {/*Header*/}
                <HStack
                    display = 'flex'
                    justifyContent = 'center'
                >
                    <Avatar.Root>
                        <Avatar.Image src = {preview || user?.profile_pic}/>
                        <Avatar.Fallback name = {user?.username} />
                    </Avatar.Root>
                    <VStack>
                        <Heading
                            as = 'h3'
                            size = {{base: 'sm', md: 'lg', lg: 'xl'}}
                            color = 'black'
                        >
                            {user?.username}
                        </Heading>
                        <Text color = 'black'>{user?.email}</Text>
                    </VStack>
                </HStack>
                <Heading 
                    color = 'black' 
                    textDecoration = 'underline' 
                >
                    Update Your Profile
                </Heading>

                {/*Profile Picture Upload Section*/}
                <VStack
                    spacing = '4'
                    align = 'center'
                    pb = '40px'
                    pt = '20px'
                >
                    <Heading 
                        fontSize = {{base: 'md', md: 'lg', lg: 'lg'}}  
                        color = 'black'
                    >
                        Change your profile picture:
                    </Heading>
                    {preview && (
                        <Image 
                            src = {preview}
                            alt = 'New Profile Preview'
                            boxSize = '150px'
                            objectFit = 'cover'
                            borderRadius = 'full'
                            shadow = 'md'
                        />
                    )}

                    <Input 
                        type = 'file'
                        accept = 'image/*'
                        onChange = {handleFileChange}
                        w = 'auto'
                        bg = {accentYellow}
                        border = '1px solid #ccc'
                        borderRadius = '12px'
                        p = '1'
                        color = 'black'
                    />


                    {selectedFile && (
                        <Button
                            bg = {'#AEC8CA'}
                            onClick = {handleUpload}
                            isLoading = {uploading}
                            color = 'black'
                            _hover={{
                                boxShadow: 'md',
                                border: `2px solid ${purple}`
                            }}
                            _active ={{
                                border: `2px solid ${purple}`
                            }}
                        >
                            Upload Profile Picture
                        </Button>
                    )}
                </VStack>
                {/*Username Update Section*/}
                <VStack>
                    <Heading 
                        fontSize = {{base: 'md', md: 'lg', lg: 'lg'}} 
                        color = 'black'
                    >
                        Change your username:
                    </Heading>
                    <HStack>
                        <Input 
                            placeholder = 'New Username'
                            fontSize = {{base: 'xs', md: 'sm', lg: 'md'}}
                            color = 'black' 
                            value = {newUsername}
                            onChange = {(e) => setNewUsername(e.target.value)}
                        />
                        <Button 
                            bg = {accentYellow}
                            _hover = {{
                                shadow: 'sm',
                                border: `2px solid ${green}`
                            }}
                            _active = {{
                                border: `2px solid ${green}`
                            }}
                            onClick = {handleChangeUsername}
                        >
                            Submit
                        </Button>
                    </HStack>
                </VStack>


            </Box>

        </Flex>

    </Flex>
  )
}

export default UpdateProfile