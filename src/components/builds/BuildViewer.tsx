import { Button, Container, Flex, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Stat, StatHelpText, StatLabel, StatNumber, Tag } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { MAX_CHAR_LEVEL, MAX_STAT_LEVEL, MIN_CHAR_LEVEL, MIN_STAT_LEVEL } from '../../constants/constants';
import { Build, StartingClass, TargetBuild } from '../../types/Builds';
import { generateBuild } from '../../util/buildGen/buildGenerator';
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
    startingClass: StartingClass;
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
            </Stack>
        </Container>
    );
};

export const BuildStats = (props: BuildStatsProps) => {
    const { targetBuild, setTargetBuild, startingClass } = props;

    const statField = (defaultValue: number, min: number, max: number, id: string, text: string, onChange: (_str: string, val: number) => void) => {
        return (
            <Container key={`${id}--buildviewform`} sx={{ padding: '.5em' }}>
                <FormLabel htmlFor={`${id}--buildview`}>{text}</FormLabel>
                <NumberInput
                    id={`${id}-buildview`}
                    defaultValue={defaultValue}
                    min={min}
                    max={max}
                    onChange={onChange}
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
        <Container>
            <Stack>
                {statField(targetBuild.targetLevel, startingClass.startingLevel, MAX_CHAR_LEVEL, 'level', 'Target Level', (_str, val) => {
                    setTargetBuild({
                        ...targetBuild,
                        targetLevel: val
                    });
                })}
                {statField(targetBuild.targetStats.vigor, startingClass.startingStats.vigor, MAX_STAT_LEVEL, 'vigor', 'Vigor', (_str, val) => {
                    setTargetBuild({
                        ...targetBuild,
                        targetStats: {
                            ...targetBuild.targetStats,
                            vigor: val
                        }
                    });
                })}
                {statField(targetBuild.targetStats.mind, startingClass.startingStats.mind, MAX_STAT_LEVEL, 'mind', 'Mind', (_str, val) => {
                    setTargetBuild({
                        ...targetBuild,
                        targetStats: {
                            ...targetBuild.targetStats,
                            mind: val
                        }
                    });
                })}
                {statField(targetBuild.targetStats.endurance, startingClass.startingStats.endurance, MAX_STAT_LEVEL, 'endurance', 'Endurance', (_str, val) => {
                    setTargetBuild({
                        ...targetBuild,
                        targetStats: {
                            ...targetBuild.targetStats,
                            endurance: val
                        }
                    });
                })}
                {statField(targetBuild.targetStats.strength, startingClass.startingStats.strength, MAX_STAT_LEVEL, 'strength', 'Strength', (_str, val) => {
                    setTargetBuild({
                        ...targetBuild,
                        targetStats: {
                            ...targetBuild.targetStats,
                            strength: val
                        }
                    });
                })}
                {statField(targetBuild.targetStats.dexterity, startingClass.startingStats.dexterity, MAX_STAT_LEVEL, 'dexterity', 'Dexterity', (_str, val) => {
                    setTargetBuild({
                        ...targetBuild,
                        targetStats: {
                            ...targetBuild.targetStats,
                            dexterity: val
                        }
                    });
                })}
                {statField(targetBuild.targetStats.intelligence, startingClass.startingStats.intelligence, MAX_STAT_LEVEL, 'intelligence', 'Intelligence', (_str, val) => {
                    setTargetBuild({
                        ...targetBuild,
                        targetStats: {
                            ...targetBuild.targetStats,
                            intelligence: val
                        }
                    });
                })}
                {statField(targetBuild.targetStats.faith, startingClass.startingStats.faith, MAX_STAT_LEVEL, 'faith', 'Faith', (_str, val) => {
                    setTargetBuild({
                        ...targetBuild,
                        targetStats: {
                            ...targetBuild.targetStats,
                            faith: val
                        }
                    });
                })}
                {statField(targetBuild.targetStats.vigor, startingClass.startingStats.arcane, MAX_STAT_LEVEL, 'arcane', 'Arcane', (_str, val) => {
                    setTargetBuild({
                        ...targetBuild,
                        targetStats: {
                            ...targetBuild.targetStats,
                            arcane: val
                        }
                    });
                })}
            </Stack>
        </Container>
    );
};

export const BuildViewer = (props: BuildViewerProps) => {

    const { build, isOpen, onClose } = props;
    if (!build) return null;

    const [modalBuild, setModalBuild] = useState<Build>(build);
    const [targetBuild, setTargetBuild] = useState<TargetBuild>(build.targetBuild);

    useEffect(() => {
        if (!targetBuild) return;
        setModalBuild(generateBuild(modalBuild.startingClass, targetBuild, modalBuild.buildType));
    }, [targetBuild]);

    useEffect(() => {
        if (!build) return;
        setTargetBuild({
            ...targetBuild,
            targetStats: {
                ...build.stats
            }
        });
        setModalBuild(build);
    }, [build]);

    function updateBuild(build: TargetBuild) {
        setTargetBuild(build);
    }

    return (
        <Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{'Build Viewer'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction={['column', null, 'row']}>
                            <BuildInfo build={modalBuild} />
                            <BuildStats targetBuild={targetBuild} setTargetBuild={updateBuild} startingClass={build.startingClass} />
                        </Flex>
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