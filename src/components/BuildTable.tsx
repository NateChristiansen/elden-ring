import { Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BuildType, BuildTypeRow, CharacterBuild } from '../types/character';

export interface BuildTableProps {
    builds: BuildTypeRow[],
    classes: string[]
}

interface BuildTableComponentProps {
    title: string,
    field: string,
    classes: string[],
    builds: BuildTypeRow[] | undefined
}

interface BuildRowProps {
    build: BuildTypeRow,
    field: string,
    classes: string[],
    key: string,
}

function getTableData(props: BuildRowProps, startingClass: string) {
    const key = props.field as keyof typeof props.build.classBuildData;
    return props.build.classBuildData[key][startingClass];
}

export const BuildRow = (props: BuildRowProps) => {
    return (
        <Tr key={props.key}>
            <Td>{props.build.buildType}</Td>
            {props.classes.map(startingClass =>
                <Td key={`${props.build.buildType}${startingClass}`}>
                    {getTableData(props, startingClass)}
                </Td>
            )}
        </Tr>
    );
};

export const BuildTableComponent = (props: BuildTableComponentProps) => {

    return (

        <Table variant='simple'>
            <TableCaption placement='top'>{props.title}</TableCaption>
            <Thead>
                <Tr>
                    <Th>Build Archtype</Th>
                    {props.classes.map(header => <Th key={`${header}-header`}>{header}</Th>)}
                </Tr>
            </Thead>
            <Tbody>
                {props.builds?.map(build => <BuildRow key={build.buildType} build={build} field={props.field} classes={props.classes} />)}
            </Tbody>
        </Table>
    );
};

export const BuildTable = (props: BuildTableProps) => {
    const [minLevelTable, setMinLevelTable] = useState({
        title: 'Minimum level needed to reach target build stats (lower is better)',
        classes: props.classes,
        field: 'minLevel',
        builds: [],
    } as BuildTableComponentProps);
    const [flexStatsTable, setFlexStatsTable] = useState({
        title: 'Number of flexible stats left over for class after target level (higher is better, negative means level is unreachable)',
        classes: props.classes,
        field: 'flexStats',
        builds: [],
    } as BuildTableComponentProps);
    const [wastedStatsTable, setWastedStatsTable] = useState({
        title: 'Number of stats wasted by class for unwanted stats (lower is better)',
        classes: props.classes,
        field: 'wastedStats',
        builds: [],
    } as BuildTableComponentProps);

    function setBuilds(builds: BuildTypeRow[]) {

        setMinLevelTable({
            ...minLevelTable,
            builds: builds
        });

        setFlexStatsTable({
            ...flexStatsTable,
            builds: builds
        });

        setWastedStatsTable({
            ...wastedStatsTable,
            builds: builds
        });
    }

    useEffect(() => {
        if (!props.builds) return;
        setBuilds(props.builds);
    }, [props.builds]);

    return (
        <Box>
            <BuildTableComponent
                title={minLevelTable.title}
                builds={minLevelTable.builds}
                field={minLevelTable.field}
                classes={props.classes}
            />
            <BuildTableComponent
                title={flexStatsTable.title}
                builds={flexStatsTable.builds}
                field={flexStatsTable.field}
                classes={props.classes}
            />
            <BuildTableComponent
                title={wastedStatsTable.title}
                builds={wastedStatsTable.builds}
                field={wastedStatsTable.field}
                classes={props.classes}
            />
        </Box>
    );
};