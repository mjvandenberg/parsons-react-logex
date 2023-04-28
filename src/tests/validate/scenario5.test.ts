import { test, assert } from 'vitest';
import { executeValidator, getParsonsBlockValidatorDown, getParsonsBlockValidatorUp, validateParsonsProblem } from '../../validate';
import { parseTestHr } from '../testHelper';

test('scenario 5', () => {
    // Arrange
    const input = [
        '1,1,g',
        'a,a,g',
        '2,2,y',
        'b,-,?',
        '3,4,y',
        'c, , ',
        '4, , '
    ];
    const [solution, learners, expected] = parseTestHr(input);

    // Act
    const [result, isValid] = validateParsonsProblem(learners, solution);

    // Assert
    assert.deepEqual(result, expected);
    assert.isFalse(isValid);
})
/*
test('scenario 5 down', () => {
    // Arrange
    const input = [
        '1,1,g',
        'a,a,?',
        '2,2,g',
        'b,b,?',
        '3,3,g'
    ];
    const [solution, learners, expected] = parseTestHr(input);
    const validator = getParsonsBlockValidatorDown();

    // Act
    const result = executeValidator(learners, solution, validator);

    // Assert
    assert.deepEqual(result, expected);
})

test('scenario 5 up', () => {
    // Arrange
    const input = [
        '1,1,g',
        'a,a,?',
        '2,2,g',
        'b,b,?',
        '3,3,g'
    ];
    const [solution, learners, expected] = parseTestHr(input);
    const validator = getParsonsBlockValidatorUp();

    // Act
    const result = executeValidator(learners, solution, validator);

    // Assert
    assert.deepEqual(result, expected);
})*/