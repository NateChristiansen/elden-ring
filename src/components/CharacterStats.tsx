import React from 'react';
import { Box, Button, FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Switch } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MAX_CHAR_LEVEL, MAX_STAT_LEVEL, MIN_CHAR_LEVEL, MIN_STAT_LEVEL } from '../constants/constants';
import { TargetBuild, Stats } from '../types/character';

export interface CharacterStatsProps {
    build: TargetBuild,
    setBuild: (build: TargetBuild) => void
}

export const CharacterStats = (props: CharacterStatsProps) => {
    const {
        handleSubmit,
        register,
        formState: { isSubmitting }
    } = useForm();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function onSubmit(values: any) {
        return new Promise<void>((resolve) => {
            props.setBuild(values as TargetBuild);
            resolve();
        });
    }

    const statField = (defaultValue: number, min: number, max: number, id: string, text: string) => {
        return (
            <Box key={`${id}-form`} sx={{ padding: '.5em', maxWidth: '50rem' }}>
                <FormLabel htmlFor={`${id}-form`}>{text}</FormLabel>
                <NumberInput
                    id={`${id}-form`}
                    defaultValue={defaultValue}
                    value={defaultValue}
                    min={min}
                    max={max}
                >
                    <NumberInputField
                        {...register(`${id}`, {
                            required: 'This is required',
                            valueAsNumber: true,
                            min: { value: min, message: `Minimum value should be ${min}` },
                            max: { value: max, message: `Minimum value should be ${max}` },
                        })}
                    />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </Box>
        );
    };

    const toggleDamageStat = (id: string) => {
        return (
            <Stack direction={'row'} key={`${id}-dump`}>
                <Switch id={`${id}-dump`} defaultChecked={true}
                    {...register(`damageStats.${id}`)}
                />
                <FormLabel htmlFor={`${id}-dump`}>{id.toLowerCase()}</FormLabel>
            </Stack>
        );
    };

    return (
        <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                    {statField(150, MIN_CHAR_LEVEL, MAX_CHAR_LEVEL, 'targetLevel', 'Target Level')}
                    {statField(40, MIN_STAT_LEVEL, MAX_STAT_LEVEL, `targetStats.${Stats.Vigor}`, 'Minimum Vigor')}
                    {statField(40, MIN_STAT_LEVEL, MAX_STAT_LEVEL, `targetStats.${Stats.Mind}`, 'Minimum Mind')}
                    {statField(40, MIN_STAT_LEVEL, MAX_STAT_LEVEL, `targetStats.${Stats.Endurance}`, 'Minimum Endurance')}
                    {statField(0, MIN_STAT_LEVEL, MAX_STAT_LEVEL, `targetStats.${Stats.Strength}`, 'Minimum Strength')}
                    {statField(0, MIN_STAT_LEVEL, MAX_STAT_LEVEL, `targetStats.${Stats.Dexterity}`, 'Minimum Dexterity')}
                    {statField(0, MIN_STAT_LEVEL, MAX_STAT_LEVEL, `targetStats.${Stats.Intelligence}`, 'Minimum Intelligence')}
                    {statField(0, MIN_STAT_LEVEL, MAX_STAT_LEVEL, `targetStats.${Stats.Faith}`, 'Minimum Faith')}
                    {statField(0, MIN_STAT_LEVEL, MAX_STAT_LEVEL, `targetStats.${Stats.Arcane}`, 'Minimum Arcane')}
                    {statField(40, MIN_STAT_LEVEL, MAX_STAT_LEVEL, 'damageStatTarget', 'Target Damage Stat')}
                </FormControl>
                <FormControl>
                    <FormLabel>Toggle Damage Stats</FormLabel>
                    <Stack direction={['column', 'row']}>
                        {toggleDamageStat(Stats.Strength)}
                        {toggleDamageStat(Stats.Dexterity)}
                        {toggleDamageStat(Stats.Intelligence)}
                        {toggleDamageStat(Stats.Faith)}
                        {toggleDamageStat(Stats.Arcane)}
                    </Stack>
                </FormControl>
                <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                    Submit
                </Button>
            </form>
        </Box>
    );
};