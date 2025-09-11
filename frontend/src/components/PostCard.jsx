import { Avatar, Button, Card, Flex, HStack, Icon, IconButton } from '@chakra-ui/react'
import { GoHeart } from "react-icons/go";
import { FcLike } from "react-icons/fc";
import React, { useEffect, useState } from 'react'

const PostCard = ({ post }) => {
    const userID = localStorage.getItem('userID');
    const token = localStorage.getItem('token');
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likesCount);

    useEffect(() => {
        const fetchLikedStatus = async () => {
            try{
                const res = await fetch(`http://localhost:5000/api/likes/${post._id}/status`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if(!res.ok) return;

                const data = await res.json();

                setLiked(data.liked)
            }catch(err){
                console.error("Error checking liked status:", err);
            }
        };

        if(token && post?._id){
            fetchLikedStatus();
        }
    },[post._id, token]);

    const handleLike = async () => {
        //prevent liking own post
        if(post.author.id === userID){
            alert('You cannot like your own post.');
            return;
        }

        try{
            const res = await fetch(`http://localhost:5000/api/likes/${post._id}` , {
                method: liked ? 'DELETE' : 'POST', //toggle like
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if(!res.ok){
                console.error("Failed to update likes");
                return;
            }

            //update local state
            setLiked(!liked);
            setLikeCount(prev => liked ? prev - 1: prev + 1);

        } catch(err){
            console.error('Network Error:', err);
        }
    }
    
  return (
    <Card.Root minh = '20vh' w = '60%' justify = 'center' bgColor = 'gray.200' border = 'transparent' shadow={'sm'} borderRadius = '10px'> 
        <Card.Body gap = '2'>
            <HStack>
                <Avatar.Root>
                    <Avatar.Image />
                    <Avatar.Fallback name = {post.author?.username || 'User'} />
                </Avatar.Root>
                <Card.Title color = 'black'>{post.author?.username}</Card.Title>
            </HStack>
            <Card.Description color = 'black'>
                {post.text}
            </Card.Description>
        </Card.Body>
        <Card.Footer p ={2}>
            <Flex w ='100%' justify = 'space-between' align = 'center'>
                <Button 
                    onClick = {handleLike}
                    background = 'transparent'
                >
                    <Icon as = {liked ? FcLike : GoHeart} />
                    {likeCount}
                </Button>
                <Button background = 'none' _hover = {{background: 'white'}} size = 'xs'>
                    View Comments
                    ({post.commentsCount})
                </Button>
            </Flex>
        </Card.Footer>
    </Card.Root>
  )
}

export default PostCard