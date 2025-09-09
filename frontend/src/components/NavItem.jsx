import { Button, Flex, Icon, Link, Menu, Text } from '@chakra-ui/react'
import React from 'react'

const NavItem = ({navSize, title, icon, active}) => {
  return (
    <Flex
        mt = {30}
        flexDir = 'column'
        w = '100%'
        alignItems = {navSize == 'small' ? 'center' : "flex-start"}
    >
        <Menu.Root>
                <Button 
                    backgroundColor={active && '#AEC8CA'}
                    p={3}
                    borderRadius = {8}
                    _hover = {{textDecor: 'none', backgroundColor: '#AEC8CA'}}
                    w = {navSize == 'large' && '100%'}
                >
                    <Icon as = {icon} fontSize = 'xl' color ={active ? '#47967d' : 'gray.500'} />
                    <Text display={navSize == 'small' ? 'none' : 'Text'}>{title}</Text>
                </Button>
        </Menu.Root>

    </Flex>
  )
}

export default NavItem