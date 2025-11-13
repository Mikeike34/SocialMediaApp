import { Avatar, Box, Button, Card, Flex, HStack, Icon, IconButton, Input, Spinner, Text, VStack } from '@chakra-ui/react'
import { GoHeart } from "react-icons/go";
import { FcLike } from "react-icons/fc";
import { MdOutlineDelete } from "react-icons/md";
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

const PostCard = ({ post }) => {
    const userID = localStorage.getItem('userID');
    const token = localStorage.getItem('token');


    //Like states
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likesCount || 0);


    //comment states
    const  [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    //router const
    //using to soft-refresh when commenting
    const navigate = useNavigate();
    const location = useLocation();

    //colors
    const backgroundYellow = '#fdfce8';
    const green = '#1f574f';
    const accentYellow = '#f6f8b5';
    const pink = '#ee98e0';
    const purple = '#a78dfc';
    const orange = '#f08853';

    

    useEffect(() => {
        const fetchLikedStatus = async () => {
            try{
                const res = await fetch(`http://localhost:5000/api/likes/${post._id}/status`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if(!res.ok) throw new Error('Failed to fetch liked status');
                const data = await res.json();
                setLiked(data.liked);
                setLikeCount(data.likesCount);
                console.log('Fetched Like status: ', data);
            }catch(err){
                console.error('Error fetching like status: ', err);
            }
        };
        if (token && post?._id){
            fetchLikedStatus();
        }
    },[post._id, token]);

    const handleLike = async () => {
        //prevent liking own post
        if(post.author?._id === userID){
            alert('You cannot like your own post.');
            return;
        }
        try{
            //optimistically update UI first for instant feedback
            setLiked((prev) => !prev);
            setLikeCount((prev) => (liked ? prev -1 : prev + 1));

            const res = await fetch(`http://localhost:5000/api/likes/${post._id}` , {
                method: liked ? 'DELETE' : 'POST', //toggle like
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            //If API fails, revert the optimistic update
            if(!res.ok){
                console.error("Failed to update likes");
                setLiked((prev) => !prev);
                setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
                return;
            }
            //re-fetching to guarentee correct like status
            const updatedStatus = await fetch(`http://localhost:5000/api/likes/${post._id}/status`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            //update local state
            if (updatedStatus.ok){
                const data = await updatedStatus.json();
                setLiked(data.liked);
                setLikeCount(data.likesCount);
            }

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
                await fetchComments();
                setNewComment('');
                post.commentsCount = (post.commentsCount || 0) + 1;
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
            setComments((prev) => prev.filter((c) => c.id !== commentId));
            post.commentsCount = Math.max((post.commentsCount || 1) - 1, 0);
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
    <Card.Root 
        minh = '20vh' 
        w = '90%' 
        justify = 'center' 
        bgColor = {accentYellow} 
        border = 'transparent' 
        overflow = 'hidden'
        shadow = 'sm' 
        borderRadius = '12px'
    > 
        <Card.Body gap = '2'>
            {/*Header of a post */}
            <Flex w ='100%' justify = 'space-between' align = 'flex-start'>
                <Avatar.Root>
                    <Avatar.Image src = {post.author?.profile_pic}/>
                    <Avatar.Fallback name = {post.author?.username || 'User'} />
                </Avatar.Root>
                <Card.Title color = 'black'>{post.author?.username}</Card.Title>

                {/* Delete button only for current user's posts */}
                <Button 
                    background = 'transparent' 
                    _hover={{background: 'red.300'}} 
                    display = {post.author?._id != userID ? 'none' : 'flex'} 
                    onClick ={() => handleDeletePost(post._id)}
                > 
                    <Icon as = {MdOutlineDelete} />
                </Button>
            </Flex>
            {/*Post content*/}
            <Card.Description color = 'black'>
                {post.text}
            </Card.Description>
        </Card.Body>

        <Card.Footer p ={2}>
            <Flex w ='100%' justify = 'space-between' align = 'center'>
                <Button 
                    onClick = {handleLike}
                    background = 'transparent'
                    _hover = {{transform: 'scale(1.05)', transition: '0.1s ease-in-out'}}
                    _active = {{transform: 'scale(0.9'}}
                >
                    <Icon as = {liked ? FcLike : GoHeart} boxSize = {5} transition = 'all 0.2s ease' />
                    <Text ml = {1}>{likeCount}</Text> {/* prevents squishing */}
                </Button>

                {/* Toggle comments*/}
                <Button 
                    background = 'none' 
                    _hover = {{bg: 'white'}} 
                    _active = {{bg: 'white'}} 
                    transition = 'all 0.2s ease-in-out' 
                    size = 'xs' 
                    onClick={toggleComments}
                >
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
                            <Box key = {c._id || c.id} p ={2} borderWidth = '1px' borderRadius = 'md' bg = 'white'  color = 'black' shadow = {'sm'}>
                                <Flex w ='100%' justify = 'space-between' align = 'center'>
                                    <Avatar.Root>
                                        <Avatar.Image src = {c.profile_pic}/>
                                        <Avatar.Fallback name = {c.username || 'User'} />
                                    </Avatar.Root>
                                    <Text fontWeight = 'bold'>{c.username}</Text>
                                    <Button background = 'transparent' _hover={{bg: 'red.300'}} _active = {{bg: 'red.300'}} transition = "all 0.2s ease-in-out" display = {c.authorId != userID ? 'none' : 'flex'} onClick = {() => handleDeleteComment(c.id)}> <Icon as = {MdOutlineDelete} /></Button>
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
                    <Button 
                        size = 'sm' 
                        colorScheme = 'blue'
                        borderRadius = '12px' 
                        _hover = {{
                            bg: accentYellow,
                            shadow: 'xs'
                        }}
                        _active = {{
                            bg: accentYellow
                        }}
                        transition = 'all 0.2s ease-in-out'
                        onClick = {() => {
                            handleAddComment();
                        }}
                    >
                        Post
                    </Button>
                </HStack>
            </Box>
        )}
    </Card.Root>
  )
}

export default PostCard