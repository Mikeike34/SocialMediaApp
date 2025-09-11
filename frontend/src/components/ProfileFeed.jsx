import { Flex, Spinner, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import PostCard from './PostCard';

const ProfileFeed = ({userID, token}) => {
    const [posts, setPosts] = useState([]);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        if(!userID || !token) return;

        const fetchUserPosts = async () =>{
            try{
                const res = await fetch(`http://localhost:5000/api/posts/user/${userID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if(res.ok){
                    setPosts(data.posts);
                }else{
                    console.error('Failed to fetch posts:', data.error);
                }
            }catch(err){
                console.error('Network Error:', err);
            }finally{
                setLoading(false);
            }
        };
        fetchUserPosts();
    }, [userID, token]);

    if(loading) return <Spinner size = 'xl' />;

    if(posts.length === 0) return <Text color = 'gray.600'>You have not created any posts yet.</Text>;
  return (
    <Flex flexDir = 'column' align = 'center' p ={5}>
        <VStack spacing = {4} w = '100%'>
            {!loading ? (
                posts.map((post) => <PostCard key = {post._id} post = {post} />)
            ) : (
                <Text>Loading Posts...</Text>
            )}
        </VStack>
    </Flex>
  );
};

export default ProfileFeed