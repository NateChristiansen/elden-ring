import { Button, Container, Flex, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Stat, StatHelpText, StatLabel, StatNumber, Tag } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { MAX_CHAR_LEVEL, MAX_STAT_LEVEL, MIN_CHAR_LEVEL } from '../../constants/constants';
import { register } from '../../serviceWorker';
import { Build, TargetBuild } from '../../types/Builds';
import { getFlexStats, getMinLevel, getWastedStats } from '../../util/buildUtil';

export interface BuildViewerProps {
    build: Build | undefined;
    isOpen: boolean;
    onClose: () => void;
}

export interface BuildInfoProps {
    build: Build;
}

export interface BuildStatsProps {
    targetBuild: TargetBuild;
    setTargetBuild: (targetBuild: TargetBuild) => void;
}

export const BuildInfo = (props: BuildInfoProps) => {
    const { build } = props;

    return (
        <Container>
            <Stack direction={['column', 'row']}>
                <Stat>
                    <StatLabel>Starting Class</StatLabel>
                    <StatNumber>{build.startingClass.name}</StatNumber>
                    <StatHelpText>Build Type<Tag>{build.buildType.text}</Tag></StatHelpText>
                </Stat>

                <Stat>
                    <StatLabel>Level</StatLabel>
                    <StatNumber>{getMinLevel(build)}</StatNumber>
                </Stat>

                <Stat>
                    <StatLabel>Flex Stats</StatLabel>
                    <StatNumber>{getFlexStats(build)}</StatNumber>
                </Stat>

                <Stat>
                    <StatLabel>Wasted Stats</StatLabel>
                    <StatNumber>{getWastedStats(build)}</StatNumber>
                </Stat>
            </Stack>
        </Container>
    );
};

export const BuildStats = (props: BuildStatsProps) => {
    const { targetBuild, setTargetBuild } = props;

    const statField = (defaultValue: number, min: number, max: number, id: string, text: string) => {
        return (
            <Container key={`${id}-form`} sx={{ padding: '.5em' }}>
                <FormLabel htmlFor={`${id}-form`}>{text}</FormLabel>
                <NumberInput
                    id={`${id}-form`}
                    defaultValue={defaultValue}
                    min={min}
                    max={max}
                    onChange={(str, val) => {
                        setTargetBuild({
                            ...targetBuild,
                            targetLevel: val
                        });
                    }}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Container>
        );
    };

    return (
        <Flex>
            {statField(targetBuild.targetLevel, MIN_CHAR_LEVEL, MAX_CHAR_LEVEL, 'level', 'Target Level')}
        </Flex>
    );
};

export const BuildViewer = (props: BuildViewerProps) => {

    const { build, isOpen, onClose } = props;
    if (!build) return null;

    const [targetBuild, setTargetBuild] = useState<TargetBuild>(build.targetBuild);

    useEffect(() => {
        build.targetBuild = targetBuild;
    }, [targetBuild]);

    function updateBuild(build: TargetBuild) {
        setTargetBuild(build);
    }

    return (
        <Flex>
            <BuildInfo build={build} />
            <BuildStats targetBuild={targetBuild} setTargetBuild={setTargetBuild} />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{'Build Viewer'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <BuildInfo build={build} />
                        <BuildStats targetBuild={targetBuild} setTargetBuild={updateBuild} />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};