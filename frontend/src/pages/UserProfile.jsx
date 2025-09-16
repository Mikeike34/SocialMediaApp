import PostCard from '@/components/PostCard'
import ProfileFeed from '@/components/ProfileFeed'
import Sidebar from '@/components/Sidebar'
import { Avatar, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
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

  return (
    <Flex minH = '100vh' bgColor = 'gray.600' w = '100%' padding = {0}>
        <HStack align = 'stretch' w = '100%' mr = {5}>
          <Sidebar />
          <Flex 
            alignItems={'center'}
            minH = '100vh'
            flex={'1'}
            mt = {5}
            bgColor = 'white'
            borderRadius={'10px'}
          >
           <VStack divideY={'2px'} flexDir={'column'} w = '100%' align = 'stretch' spacing = {0}>
            <Flex h = 'auto' justify = 'center' align = 'center' >
              <Avatar.Root>
                <Avatar.Fallback name = {user?.username} />
                <Avatar.Image />
              </Avatar.Root>
              <Flex flexDir = 'column' ml = {2} alignItems = {'center'}>
                <Heading as = 'h2' color = 'black'>{user?.username}</Heading>
                <Text color = 'gray' fontSize = 'sm' wordBreak = {'break-word'}>{user?.email}</Text>
              </Flex>
            </Flex>

            <Flex justify = 'center'>
              <ProfileFeed userID = {userID} token = {token} />
            </Flex>

           </VStack>
          </Flex>

        </HStack>

    </Flex>
  )
}

export default UserProfile