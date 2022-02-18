import { TargetBuild } from '../types/Builds';
import { useEffect, useState } from 'react';
import { getBuildComparisonForTargetBuild } from '../util/buildGen/buildGenerator';
import { CharacterStats } from './stats/CharacterStats';
import { Box, Container } from '@chakra-ui/react';
import React from 'react';

import { BuildComparisonTable } from './tables/BuildTable';
import { BuildComparison } from '../types/BuildComparison';

export const CharacterPlanner = () => {
    const [targetBuild, setTargetBuild] = useState({} as TargetBuild);
    const [builds, setBuilds] = useState({} as BuildComparison);

    useEffect(() => {
        if (!Object.entries(targetBuild).length) {
            return;
        }

        setBuilds(getBuildComparisonForTargetBuild(targetBuild));
    }, [targetBuild]);

    return (
        <Box>
            <Container display={'flex'}>
                <CharacterStats build={targetBuild} setBuild={setTargetBuild} />
            </Container>
            <Container display={'flex'}>
                <BuildComparisonTable builds={builds} />
            </Container>
        </Box>
    );
};