import { test, assert } from 'vitest';
import { executeValidator, getParsonsBlockValidatorDown, getParsonsBlockValidatorUp, validateParsonsProblem2 } from '../../validate';
import { parseTestHr } from '../testHelper';

test('scenario 4', () => {
    // Arrange
    const input = [
        '1,1,g',
        'a,a,g',
        '2,2,g',
        'b,b,g',
        '3,3,g'
    ];
    const [solution, learners, expected] = parseTestHr(input);

    // Act
    const [result, isValid] = validateParsonsProblem2(learners, solution);

    // Assert
    assert.deepEqual(result, expected);
    assert.isTrue(isValid);
})

test('scenario 4 down', () => {
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

test('scenario 4 up', () => {
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
})