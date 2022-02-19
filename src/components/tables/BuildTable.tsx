import React from 'react';
import { Table, TableCaption, Thead, Tr, Th, Tbody, Td, Box, Button, Center, Tfoot, Flex } from '@chakra-ui/react';
import { BuildComparison } from '../../types/BuildComparison';
import { Build } from '../../types/Builds';
import { getFlexStats, getMinLevel, getWastedStats } from '../../util/buildUtil';

export interface BuildComparisonTableProps {
    builds: BuildComparison;
    onModalOpen: (build: Build) => void;
}

interface BuildTableProps {
    title: string,
    name: string,
    builds: BuildComparison,
    mapping: (build: Build) => number,
}

interface BuildRowProps {
    builds: BuildComparison,
    buildType: string,
    mapping: (build: Build) => number,
}

interface AvgRowProps {
    builds: BuildComparison,
    name: string,
    mapping: (build: Build) => number,
}

export const BuildComparisonTable = (props: BuildComparisonTableProps) => {

    const { builds, onModalOpen: setModalBuild } = props;

    const BuildRow = (props: BuildRowProps) => {

        const { builds, buildType, mapping } = props;

        function getBuild(className: string): Build {
            const exists = builds.builds.get(buildType)?.get(className);
            if (!exists) return {} as Build;
            return exists;
        }

        return (
            <Tr>
                <Td>{buildType}</Td>
                {builds.keyOrder.map(className => {
                    return <Td key={`${className}`}>
                        <Center>
                            <Button size={'xs'}
                                onClick={() => {
                                    setModalBuild(getBuild(className));
                                }}>
                                {mapping(getBuild(className))}
                            </Button>
                        </Center>
                    </Td>;
                })}
            </Tr>
        );
    };

    const AvgRow = (props: AvgRowProps) => {
        const { builds, name, mapping } = props;

        if (!builds.builds) return <Box></Box>;

        function getBuild(className: string, buildType: string): Build {
            const exists = builds.builds.get(buildType)?.get(className);
            if (!exists) return {} as Build;
            return exists;
        }

        function getAverage(startingClass: string): number {
            let sum = 0, count = 0;

            for (const buildType in builds.buildOrder) {
                count += 1;
                sum += mapping(getBuild(startingClass, builds.buildOrder[buildType]));
            }

            return sum / count;
        }

        return (
            <Tr>
                <Th>Average</Th>
                {builds.keyOrder.map(className => {
                    return <Th key={`${className}-${name}-avg`}>
                        <Center>
                            {getAverage(className).toFixed(2)}
                        </Center>
                    </Th>;
                })}
            </Tr>
        );
    };

    const BuildTable = (props: BuildTableProps) => {

        const { builds, name, title, mapping } = props;

        if (!builds?.builds) return <Box></Box>;

        return (
            <Center>
                <Flex overflowX={['auto']} mb={4} padding={4}>
                    <Table variant='striped' size={'sm'}>
                        <TableCaption placement='top'>{title}</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Buildtype</Th>
                                {builds.keyOrder.map(className => <Th key={`${className}-${name}-header`}>{className}</Th>)}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {builds.buildOrder?.map(buildType => <BuildRow key={`${buildType}-${name}-data`} builds={builds} buildType={buildType} mapping={mapping} />)}
                        </Tbody>
                        <Tfoot>
                            <AvgRow builds={builds} mapping={mapping} name={name} />
                        </Tfoot>
                    </Table>
                </Flex>
            </Center>
        );
    };

    return (
        <Box>
            <BuildTable
                name='minlevel'
                title={'Minimum level needed to reach target build stats (lower is better)'}
                builds={builds}
                mapping={build => getMinLevel(build)}
            />
            <BuildTable
                name='flexstats'
                title={'Number of flexible stats left over for class after target level (higher is better, negative means level is unreachable)'}
                builds={builds}
                mapping={build => getFlexStats(build)}
            />
            <BuildTable
                name='wastedstats'
                title={'Number of stats wasted by class for unwanted stats (lower is better)'}
                builds={builds}
                mapping={build => getWastedStats(build)}
            />
        </Box>
    );
};