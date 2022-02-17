import React from 'react';
import { TargetBuild, StartingClass, Stats, CharacterBuild, BuildTypeRow } from '../types/character';
import { useEffect, useState } from 'react';
import { generateAllBuilds, generateBuild, getBuildTable } from '../util/buildGenerator';
import { CharacterStats } from './CharacterStats';
import { Box } from '@chakra-ui/react';

import startingClasses from '../resources/startingClasses.json';
import { BuildTable } from './BuildTable';

export const CharacterPlanner = () => {
    const [targetBuild, setTargetBuild] = useState({} as TargetBuild);
    const [builds, setBuilds] = useState([] as BuildTypeRow[]);

    const [classes] = useState(() => {
        return new Map<string, StartingClass>([
            ['hero', startingClasses.hero],
            ['bandit', startingClasses.bandit],
            ['astrologer', startingClasses.astrologer],
            ['warrior', startingClasses.warrior],
            ['prisoner', startingClasses.prisoner],
            ['confessor', startingClasses.confessor],
            ['wretch', startingClasses.wretch],
            ['vagabond', startingClasses.vagabond],
        ]);
    });

    const [classNames, setClassNames] = useState([] as string[]);

    useEffect(() => {
        const names = [] as string[];
        classes.forEach(c => names.push(c.name.toLowerCase()));
        setClassNames(names);
    }, [classes]);

    useEffect(() => {
        if (!Object.entries(targetBuild).length) {
            return;
        }
        let result = [] as CharacterBuild[];
        for (const name in classNames) {
            const clazz = classes.get(classNames[name]);
            if (clazz) {
                result = result.concat(generateAllBuilds(clazz, targetBuild));
            }
        }
        setBuilds(getBuildTable(result, classNames));
    }, [targetBuild]);

    return (
        <Box>
            <CharacterStats build={targetBuild} setBuild={setTargetBuild} />
            <BuildTable builds={builds} classes={classNames} />
        </Box>
    );
};