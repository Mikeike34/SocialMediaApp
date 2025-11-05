import PostCard from '@/components/PostCard'
import ProfileFeed from '@/components/ProfileFeed'
import Sidebar from '@/components/Sidebar'
import { Avatar, Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userID = localStorage.getItem('userID');
  const token = localStorage.getItem('token');

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
          console.error('Failed to fetch user:', data.err);
        }
      }catch(err){
        console.error('Network Error:', err);
      }finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userID, token]);

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
        <HStack 
          w = '100%' 
          align= 'stretch' 
          spacing = {{base: 0, md: 4, lg: 6}}
          flexDir = {{base: 'column', xl: 'row'}}
        >

          {/*Navigation */}
          <Box
            w = {{md: '100px', lg: '150px'}}
            display = 'flex'
            justifyContent = 'center'
          >
            <Sidebar />
          </Box>

          {/*Content (User's posts)*/}
          <Flex 
            alignItems = 'center'
            minH = '100vh'
            flex = '1'
            mt = {{base: 2, xl: 4}}
            bg = {backgroundYellow}
            borderRadius = '12px'
            p = {{base: 2, md: 4}}
            overflow = 'auto'
          >
           <VStack 
            divideY = '2px'
            flexDir = 'column' 
            h= 'full' 
            w = '100%' 
            align = 'stretch'
            spacing = '0'
           >

            {/*HEader Section */}
            <Flex 
              h = {{base: '8vh', md: '10vh'}} 
              justify = 'center' 
              align = 'center'
              px = {{base: 2, md: 4}} 
            >
              <Avatar.Root>
                <Avatar.Fallback name = {user?.username} />
                <Avatar.Image />
              </Avatar.Root>
              <Flex flexDir = 'column' ml = {2} alignItems = {'center'}>
                <Heading as = 'h2' color = 'black'>{user?.username}</Heading>
                <Text color = 'gray' fontSize = 'sm' wordBreak = {'break-word'}>{user?.email}</Text>
              </Flex>
            </Flex>

            {/*Posts */}
            <Flex 
              justify = 'center'
              px = {{base: 2, md: 4}}
            >
              <ProfileFeed userID = {userID} token = {token} />
            </Flex>

           </VStack>
          </Flex>

        </HStack>

    </Flex>
  )
}

export default UserProfile