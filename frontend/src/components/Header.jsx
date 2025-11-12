import { Avatar, Box, Button, Flex, Heading, HStack, Icon, Input, InputGroup, List, ListItem, Spinner, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";

const Header = ({showProfileInfo = false}) => {

    const [user, setUser] = useState(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [ loading, setLoading] = useState(false);

    const userID = localStorage.getItem ('userID');
    const token = localStorage.getItem('token');

    //fetch current user data
    useEffect(() => {
        let isMounted = true;
        if(!showProfileInfo || !userID || !token) return;

        const fetchUser = async() => {
            try{
                const res = await fetch(`http://localhost:5000/api/users/${userID}`,{
                    headers: {Authorization: `Bearer ${token}`},
                });
                const data = await res.json();
                if(isMounted && res.ok) setUser(data);
            }catch(err){
                console.error('Error fetching user: ', err);
            }
        };
        fetchUser();
        return () => {
            isMounted = false; //cleanup flag
        };
    }, [showProfileInfo, userID, token]);

    //Live search users
    useEffect(() => {

        let isMounted = true;

        if(!query.trim()){
            setResults([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            if(!token) return;
            setLoading(true);
            try{
                const res = await fetch(
                    `http://localhost:5000/api/users/search/following?query=${query}`,
                    {
                        headers: {Authorization: `Bearer ${token}`},
                    }
                );
                const data = await res.json();
                if(isMounted && res.ok) {
                    setResults(data || []);
                }
            }catch(err){
                console.error('Search error: ', err);
            }finally{
                if(isMounted) setLoading(false);
            }
        }, 400); //debounce typing for smoother UX

        return () =>{
            clearTimeout(delayDebounce);
            isMounted = false;
        };
    }, [query, token]);

    //Follow/Unfollow user handler
    const handleFollowToggle = async (targetUserId, isFollowing) => {
        try{
            let res;
            if(isFollowing){
                //unfollow
                res = await fetch(
                    `http://localhost:5000/api/follow/${targetUserId}`,
                    {
                        method: 'DELETE',
                        headers: {Authorization: `Bearer ${token}`},
                    }
                );
            }else {
                //Follow: POST request
                res = await fetch(
                    `http://localhost:5000/api/follow/${targetUserId}`,
                    {
                        method: 'POST',
                        headers: {Authorization: `Bearer ${token}`},
                    }
                );
            }

            if(!res.ok){
                const errorData = await res.json();
                console.error('Follow/Unfollow error: ', errorData);
                return;
            }

            //update local results state
            setResults((prev) => 
                prev.map((u) =>
                    u.id === targetUserId ? {...u, isFollowing: !isFollowing } : u
                )
            );
        }catch(err){
            console.error('Follow/Unfollow request failed: ', err);
        }
    };

    console.log("Search results: ", results);

  return (
    <Flex
        pos = 'fixed'
        top = '0'
        bg = 'blue.500'
        w = '100%'
        py = '3'
        px = {{base: 4, md: 8}}
        boxShadow = 'md'
        zIndex = '100'
        align = 'center'
        justify = 'space-between'
        flexWrap = 'wrap'
    >
        {/*Left: Display user info when on profile page*/}
        {showProfileInfo && user && (
            <Flex
                align = 'center'
                mb = {{base: 3, md: 0}}
            >
                <Avatar 
                    name = {user.username}
                    src ={user.profile_pic}
                    size = 'sm'
                />
                <VStack
                    align = 'start'
                    spacing = '0'
                    ml = '3'
                    display = {{base: 'none', sm: 'flex'}}
                >
                    <Heading
                        size = 'sm'
                        color = 'gray.800'
                    >
                        {user.username}
                    </Heading>
                    <Text
                        fontSize = 'xs'
                        color = 'gray.500'
                    >
                        {user.email}
                    </Text>
                </VStack>
            </Flex>
        )}

        {/*Right: Search Bar */}
        <Box
            position = 'relative'
            w = {{base: '100%', md: '300px', lg: '350px'}}
        >
            <Flex
                align = 'center'
                bg = 'gray.100'
                borderRadius = 'full'
                px = '3'
                py = '1'
                _focusWithin = {{
                    bg: 'white',
                    boxShadow: '0 0 0 2px var(--chakra-colors-blue-400)',
                }}
            >
                <Icon as = {IoSearch} color = 'gray.400' mr = '2'/>
                <Input 
                    placeholder = 'Search Users...'
                    variant = 'unstyled'
                    value = {query}
                    onChange = {(e) => setQuery(e.target.value)}
                    fontSize = 'sm'
                />
            </Flex>

            {/*Dropdown results */}
            {query && (
                <Box
                    position = 'absolute'
                    top = '45px'
                    w = '100%'
                    bg = 'white'
                    borderRadius = 'md'
                    boxShadow = 'md'
                    maxH = '250px'
                    overflowY = 'auto'
                    zIndex = '999'
                >
                    {loading ? (
                        <Flex justify = 'center' p = '3'>
                            <Spinner size = 'sm' />
                        </Flex>
                    ) : results.length === 0 ?(
                        <Text 
                            p = '3'
                            color = 'gray.500'
                            fontSize = 'sm'
                        >
                            No Users Found
                        </Text>
                    ) : (
                        <VStack align = 'stretch' spacing = '1'>
                            {results.map((u) => (
                                <Box
                                    key = {u.id}
                                    px = '3'
                                    py = '2'
                                    borderRadius = 'md'
                                    _hover = {{bg: 'gray.50'}}
                                    display = 'flex'
                                    alignItems = 'center'
                                    justifyContent = 'space-between'
                                    color = 'black'
                                >
                                    {/*User Info */}
                                    <Flex align = 'center' gap = '2'>
                                        <Avatar.Root>
                                            <Avatar.Fallback name = {u.username} />
                                            <Avatar.Image />
                                        </Avatar.Root>
                                        <Text>{u.username}</Text>
                                    </Flex>
                                    {/*Follow/Unfollow button */}
                                    <Button
                                        size = 'sm'
                                        colorScheme = {u.isFollowing ? 'red' : 'blue'}
                                        onClick = {async () => {
                                            //disable button while processing to stop double clicks
                                            setResults(prev =>
                                                prev.map(user =>
                                                    user.id === u.id ? {...user,loading: true } : user
                                                )
                                            );

                                            await handleFollowToggle(u.id, u.isFollowing);

                                            //removes loading after request completes
                                            setResults(prev => 
                                                prev.map(user => 
                                                    user.id === u.id ? {...user, loading: false }: user
                                                )
                                            );
                                        }}
                                        isLoading = {u.loading}
                                    >
                                        {u.isFollowing ? 'Unfollow' : 'Follow'}
                                    </Button>
   
                                </Box>
                            ))}
                        </VStack>
                    )}
                </Box>
            )}

        </Box>
    </Flex>
  );
};

export default Header