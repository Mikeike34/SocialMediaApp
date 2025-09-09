import { Avatar, Flex, Heading, IconButton, Text } from '@chakra-ui/react'
import { FiMenu } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FiMessageCircle } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import React, { useState } from 'react'
import NavItem from './NavItem';

const Sidebar = () => {
    const [navSize, changeNavSize] = useState('small')
  return (
    <Flex
        pos = 'sticky'
        top ='0'
        ml = {5}
        h = '95vh'
        mt = '2.5vh'
        boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.05)'
        borderRadius={navSize == 'small' ? '15px' : '30px'}
        w = {navSize == 'small' ? '75px' : '200px'}
        flexDir = 'column'
        justifyContent = 'space-between'
        divideY={navSize == 'small' ? 'none' : '2px'}
        bgColor = 'white'
    >
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
            <NavItem navSize = {navSize} icon = {FiHome} title = "Dashboard" />
            <NavItem navSize = {navSize} icon = {FiMessageCircle} title = 'Messages' />
            <NavItem navSize = {navSize} icon = {FiSettings} title = 'Settings' />
        </Flex>
        <Flex mt = {4} p = '5%' flexDir = 'row' w = '100%' justifyContent={navSize == 'small' ? 'center': 'flex-start'} mb = {4}>
            <Avatar.Root>
                <Avatar.Fallback name = 'Test' />
                <Avatar.Image src = 'https://bit.ly/broken-link' />
            </Avatar.Root>
            <Flex flexDir = 'column' ml = {2} display={navSize == 'small' ? 'none' : 'flex'}>
                <Heading as = 'h3' size = 'sm' color = 'black'>Username</Heading>
                <Text color = 'gray'>Test</Text>
            </Flex>
        </Flex>
    </Flex>
  );
};

export default Sidebar;