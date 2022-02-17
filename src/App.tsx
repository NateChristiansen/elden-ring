/* eslint-disable indent */
import React from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { CharacterPlanner } from './components/CharacterPlanner';

export const App = () => {

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <CharacterPlanner />
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
