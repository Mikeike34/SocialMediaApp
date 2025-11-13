import { Avatar, Box, Button, Flex, Heading, HStack, Icon, Input, InputGroup, List, ListItem, Spinner, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


const Header = ({showProfileInfo = false}) => {

    const [user, setUser] = useState(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [ loading, setLoading] = useState(false);

    const navigate = useNavigate();

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
        left = '0'
        w = '100%'
        h = '100px'
        bg = 'blue'
        boxShadow = '0 -2px 10px rgba(0,0,0,0.1)'
        justifyContent = 'space-between'
        alignItems = 'center'
        pt = '10px'
        pb = '10px'
        pl = {{base: '10px', md: '50px'}}
        zIndex = '100'
        borderBottomRadius = '12px'

    >
        <HStack
            w = '100%'
            spacing = '0'
            justify = 'space-between'
            align = 'center'

        >
            <Box
                flex = '1'
                bg = 'green'
                h = '100%'
                display = 'flex'
                justifyContent = 'center'
            >
                <VStack p = '5px'>
                    <Text>Username</Text>
                    <Button onClick = {() => navigate("/update")}>Update Profile</Button>
                </VStack>
            </Box>

            {/*Search Bar */}
            <Box
                flex = '1'
                pr = '10px'
                h = '100%'
            >
                <Flex
                    align = 'center'
                    bg = 'gray.100'
                    borderRadius = 'full'
                    px = '4'
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
                        top = '70px'
                        flex = '1'
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
                                                <Avatar.Image image = {u.profile_pic}/>
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
        </HStack>
    </Flex>
  );
};

export default Header