import { Avatar, Box, Button, Card, Flex, HStack, Icon, IconButton, Input, Spinner, Text, VStack } from '@chakra-ui/react'
import { GoHeart } from "react-icons/go";
import { FcLike } from "react-icons/fc";
import { MdOutlineDelete } from "react-icons/md";
import React, { useEffect, useState } from 'react'

const PostCard = ({ post }) => {
    const userID = localStorage.getItem('userID');
    const token = localStorage.getItem('token');

    //Like states
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likesCount);


    //comment states
    const  [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    

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
    };

    //fetchComments
    const fetchComments = async () => {
        setLoadingComments(true);
        try{
            const res = await fetch(`http://localhost:5000/api/comments/${post._id}`);
            const data = await res.json();
            if(res.ok){
                setComments(data);
            }
        }catch(err){
            console.error('Failed to load comments:', err);
        }finally{
            setLoadingComments(false);
        }
    };

    //toggle comments 
    const toggleComments = () => {
        if(!showComments && comments.length === 0){
            fetchComments();
        }
        setShowComments(!showComments);
    };

    //add a new comment
    const handleAddComment = async () => {
        if(!newComment.trim()) return;

        try{
            const res = await fetch(
                `http://localhost:5000/api/comments/${post._id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({text: newComment }),
                }
            );

            if(res.ok){
                const savedComment = await res.json();

                setComments([
                    ...comments,
                    {...savedComment, username: 'You'}, //backend returns authorId only
                ]);
                setNewComment('');
            }
        }catch(err){
            console.error('Error posting comment:', err);
        }
    };

    //Delete a comment
    const handleDeleteComment = async (commentId) => {
        try{
            const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if(!res.ok){
                console.error("Failed to delete comment");
                return;
            }

            //Remove the deleted comment from local state
            setComments(comments.filter((c) => c.id !== commentId));
        }catch(err){
            console.error('Error deleting comment:', err);
        }
    };

    //User's Posts
    //Delete your own post
    const handleDeletePost = async (postId) => {
        try{
            const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if(!res.ok){
                console.error('Failed to delete post');
                return;
            }
            //if response is okay, refresh the page.
            console.log('Post deleted successfully');
            window.location.reload();
            
        }catch(err){
            console.error('Error deleting post:', err);
        }
    };
    
  return (
    <Card.Root minh = '20vh' w = '60%' justify = 'center' bgColor = 'gray.200' border = 'transparent' shadow={'sm'} borderRadius = '10px'> 
        <Card.Body gap = '2'>
            <Flex w ='100%' justify = 'space-between' align = 'flex-start'>
                <Avatar.Root>
                    <Avatar.Image />
                    <Avatar.Fallback name = {post.author?.username || 'User'} />
                </Avatar.Root>
                <Card.Title color = 'black'>{post.author?.username}</Card.Title>

                {/* Delete button only for current user's posts */}
                <Button background = 'transparent' _hover={{background: 'red.300'}} display = {post.author.id != userID ? 'none' : 'flex'} onClick ={() => handleDeletePost(post._id)}> <Icon as = {MdOutlineDelete} /></Button>

            </Flex>
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

                {/* Toggle comments*/}
                <Button background = 'none' _hover = {{background: 'white'}} size = 'xs' onClick={toggleComments}>
                    {showComments ? 'Hide Comments' : 'View Comments'}
                    ({post.commentsCount})
                </Button>
            </Flex>
        </Card.Footer>

        {/* Comment Section */}
        {showComments && (
            <Box p ={3} bg = 'gray.50'>
                {loadingComments ? (<Spinner />) : (
                    <VStack align = 'stretch' spacing = {2}>
                        {comments.map((c) => (
                            <Box key = {c.id} p ={2} borderWidth = '1px' borderRadius = 'md' bg = 'white'  color = 'black' shadow = {'sm'}>
                                <Flex w ='100%' justify = 'space-between' align = 'center'>
                                <Text fontWeight = 'bold'>{c.username}</Text>
                                <Button background = 'transparent' _hover={{background: 'red.300'}} display = {c.authorId != userID ? 'none' : 'flex'} onClick = {() => handleDeleteComment(c.id)}> <Icon as = {MdOutlineDelete} /></Button>
                                </Flex>
                                <Text>{c.text}</Text>
                            </Box>
                        ))}
                    </VStack>
                )}

                {/*Add Comment Input */}
                <HStack mt = {3}>
                    <Input 
                        placeholder = 'Write a comment...'
                        value = {newComment}
                        color = 'black'
                        onChange = {(e) => setNewComment(e.target.value)}
                    />
                    <Button size = 'sm' colorScheme = 'blue' onClick = {handleAddComment}>
                        Post
                    </Button>
                </HStack>
            </Box>
        )}
    </Card.Root>
  )
}

export default PostCard