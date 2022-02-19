import { Build, TargetBuild } from '../types/Builds';
import { useEffect, useState } from 'react';
import { generateBuild, getBuildComparisonForTargetBuild } from '../util/buildGen/buildGenerator';
import { CharacterStats } from './stats/CharacterStats';
import { Flex, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import { BuildComparisonTable } from './tables/BuildTable';
import { BuildComparison } from '../types/BuildComparison';
import { BuildViewer } from './builds/BuildViewer';

export const CharacterPlanner = () => {
    const [targetBuild, setTargetBuild] = useState({} as TargetBuild);
    const [builds, setBuilds] = useState({} as BuildComparison);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [modalBuild, setModalBuild] = useState<Build>();

    useEffect(() => {
        if (!targetBuild || !Object.keys(targetBuild).length) return;
        setBuilds(getBuildComparisonForTargetBuild(targetBuild));
    }, [targetBuild]);

    useEffect(() => {
        if (!modalBuild) return;
        setTargetBuild(modalBuild.targetBuild);
        onOpen();
    }, [modalBuild]);

    const onModalOpen = (build: Build) => {
        setTargetBuild(build.targetBuild);
        setModalBuild(build);
        onOpen();
    };

    const onModalClose = () => {
        setModalBuild(undefined);
        onClose();
    };

    useEffect(() => {
        if (!modalBuild) return;
        const startingClass = modalBuild?.startingClass;
        const targetBuild = modalBuild?.targetBuild;
        const buildType = modalBuild?.buildType;
        if (!startingClass || !targetBuild || !buildType) {
            return;
        }

        setModalBuild(generateBuild(startingClass, targetBuild, buildType));
    }, [modalBuild?.targetBuild]);

    return (
        <Flex direction={['column', 'row']}>
            <CharacterStats build={targetBuild} setBuild={setTargetBuild} />
            <BuildComparisonTable builds={builds} onModalOpen={onModalOpen} />
            <BuildViewer build={modalBuild} isOpen={isOpen} onClose={onModalClose} />
        </Flex>
    );
};