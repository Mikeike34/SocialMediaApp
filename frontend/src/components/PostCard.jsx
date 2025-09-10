import { Avatar, Button, Card, Flex, HStack, Icon, IconButton } from '@chakra-ui/react'
import { GoHeart } from "react-icons/go";
import { FcLike } from "react-icons/fc";
import React, { useState } from 'react'

const PostCard = () => {
    const [liked, setLiked] = useState(false)
  return (
    <Card.Root minh = '20vh' w = '60%' justify = 'center' bgColor = 'yellow.300' border = 'transparent' shadow={'sm'} borderRadius = '10px'> 
        <Card.Body gap = '2'>
            <HStack>
                <Avatar.Root>
                    <Avatar.Image />
                    <Avatar.Fallback name = 'Test' />
                </Avatar.Root>
                <Card.Title color = 'black'>Username</Card.Title>
            </HStack>
            <Card.Description color = 'black'>
                This is a test post so I can see how it is formatted. Wow This is cool!
            </Card.Description>
        </Card.Body>
        <Card.Footer p ={2}>
            <Flex w ='100%' justify = 'space-between' align = 'center'>
                <Button 
                    onClick = {() => setLiked(!liked)}
                    background = 'transparent'
                >
                    <Icon as = {liked ? FcLike : GoHeart} />
                </Button>
                <Button background = 'none' _hover = {{background: 'white'}} size = 'xs'>View Comments</Button>
            </Flex>
        </Card.Footer>
    </Card.Root>
  )
}

export default PostCard