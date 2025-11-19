//Feed showing all posts from accounts that user follows
import { Flex, Spinner, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import PostCard from './PostCard';


const MainFeed = ({userID, token}) => {
    const[posts, setPosts] = useState([]);
    const[loading,setLoading] = useState(true);

    useEffect(() => {
        if(!userID || !token) return;

        const fetchFollowedPosts = async () => {
            try{
                const res = await fetch(`http://localhost:5000/api/posts/following`, {
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
        fetchFollowedPosts();
    }, [userID, token]);

    if(loading) return <Spinner size = 'xl' />;

    if(posts.length === 0) return <Text color = 'gray.600' pt = '33vh'>No posts to see here...</Text>;
  return (
    <Flex flexDir = 'column' align = 'center' p ={5}>
        <VStack spacing = {4} w = '100%'>
            {!loading ? (
                posts.map((post) => <PostCard key = {post._id} post = {post} />)
            ) : (
                <Text pt = '33vh'>Loading Posts...</Text>
            )}
        </VStack>
    </Flex>
  )
}

export default MainFeed