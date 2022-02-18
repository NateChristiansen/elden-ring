/* eslint-disable indent */
import React from 'react';
import {
  ChakraProvider,
  Box,
  theme,
  Flex,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { CharacterPlanner } from './components/CharacterPlanner';
import { ColorModeScript } from '@chakra-ui/react';

export const App = () => {

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode='system' />
      <Box>
        <Flex justifyContent='flex-end'>
          <ColorModeSwitcher />
        </Flex>
        <CharacterPlanner />
      </Box>
    </ChakraProvider>
  );
};
