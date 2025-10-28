import { Avatar, Flex, Heading, IconButton, Text, useBreakpointValue } from '@chakra-ui/react'
import { FiMenu } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FiMessageCircle } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { CgLogOut } from "react-icons/cg";
import { MdOutlineAddBox } from "react-icons/md";
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import NavItem from './NavItem';

const Sidebar = () => {
    const [navSize, changeNavSize] = useState('small');
    const location = useLocation();

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

                if (res.ok) {
                    setUser(data);
                }else{
                    console.error('Failed to fetch user:', data.error);                }
            }catch(err){
                console.error('Network Error:', err);
            }finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userID, token]);

    {/*Detects screen size mobile/tablet vs desktop */}
    const isMobile = useBreakpointValue({base: true, xl: false});

    {/*Display for mobile/tablet screens*/}
    if (isMobile){
        return (
            <Flex
                pos = 'fixed'
                bottom = '0'
                left = '0'
                w = '100%'
                h = '60px'
                bg = 'white'
                boxShadow = '0 -2px 10px rgba(0,0,0,0.1)'
                justify = 'space-around'
                alignItems = 'center'
                pb = '20px'
                pl = {{base: 0, md: '50px'}}
                zIndex = '100'
                borderTopRadius = '12px'
            >
                {/*Nav Items */}
                <NavItem icon = {FiHome} title = 'Feed' active = {location.pathname === '/feed'} mobile />
                <NavItem icon = {MdOutlineAddBox} title = 'Create' active = {location.pathname === '/create'} mobile />
                <NavItem icon = {IoPersonOutline} title = 'Profile' active = {location.pathname === '/profile'} mobile />
                <NavItem icon = {CgLogOut} title = 'Logout' mobile />
            </Flex>
        );
    }

    {/*Display for desktop*/}
    return (
        <Flex
            pos = 'fixed'
            top ='0'
            minH = '95vh'
            mt = '2.5vh'
            mb = '2.5vh'
            boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.05)'
            borderRadius={navSize == 'small' ? '15px' : '30px'}
            w = {navSize == 'small' ? '75px' : '200px'}
            flexDir = 'column'
            justifyContent = 'space-between'
            divideY={navSize === 'small' ? 'none' : '2px'}
            bgColor = 'white'   
        >
            {/*Top Section*/}
            <Flex
                p = '5%'
                flexDir = 'column'
                alignItems = {navSize == 'small' ? 'center' : 'flex-start'}
                as = 'nav'
            >
                <IconButton
                    background = 'none'
                    mt = {5}
                    _hover = {{background: 'none'}}
                    onClick = {() => {
                        if(navSize == 'small'){
                            changeNavSize('large')
                        }else{
                            changeNavSize('small')
                        }
                    }}
                >
                    <FiMenu />
                </IconButton>
                <NavItem navSize = {navSize} icon = {FiHome} title = "Feed" active={location.pathname === '/feed'} />
                <NavItem navSize = {navSize} icon = {MdOutlineAddBox} title = 'Create' active = {location.pathname == '/create'} />
                <NavItem navSize = {navSize} icon = {IoPersonOutline} title = 'Profile' active={location.pathname == '/profile'} />
                <NavItem navSize = {navSize} icon = {CgLogOut} title = 'Logout' />
            </Flex>

            {/*Bottom Section*/}
            <Flex 
                mt = {4} 
                p = '5%' 
                flexDir = 'row' 
                w = '100%' 
                justifyContent={navSize == 'small' ? 'center': 'flex-start'} 
                mb = {4}
            >
                <Avatar.Root>
                    <Avatar.Fallback name = {user?.username} />
                    <Avatar.Image />
                </Avatar.Root>
                <Flex flexDir = 'column' ml = {2} display={navSize == 'small' ? 'none' : 'flex'}>
                    <Heading 
                        as = 'h3' 
                        size = 'sm' 
                        color = 'black'
                    >
                        {user?.username}
                    </Heading>
                    <Text 
                        color = 'gray' 
                        fontSize = 'xs' 
                        wordBreak={'break-word'}
                    >
                        {user?.email}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
  
};

export default Sidebar;