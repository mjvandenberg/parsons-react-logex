import { test, assert } from 'vitest';
import { executeValidator, getParsonsBlockValidatorDown, getParsonsBlockValidatorUp, validateParsonsProblem } from '../../validate';
import { parseTestHr } from '../testHelper';

test('scenario 3', () => {
    // Arrange
    const input = [
        '1,1,y',
        'a,a,?',
        '2,3,y',
        'b, , ',
        '3, , '
    ];
    const [solution, learners, expected] = parseTestHr(input);

    // Act
    const [result, isValid] = validateParsonsProblem(learners, solution);

    // Assert
    assert.deepEqual(result, expected);
    assert.isFalse(isValid);
})

test('scenario 3 down', () => {
    // Arrange
    const input = [
        '1,1,g',
        'a,a,?',
        '2,3,r',
        'b, , ',
        '3, , '
    ];
    const [solution, learners, expected] = parseTestHr(input);
    const validator = getParsonsBlockValidatorDown();

    // Act
    const result = executeValidator(learners, solution, validator);

    // Assert
    assert.deepEqual(result, expected);
})

test('scenario 3 up', () => {
    // Arrange
    const input = [
        '1,1,r',
        'a,a,?',
        '2,3,g',
        'b, , ',
        '3, , '
    ];
    const [solution, learners, expected] = parseTestHr(input);
    const validator = getParsonsBlockValidatorUp();

    // Act
    const result = executeValidator(learners, solution, validator);

    // Assert
    assert.deepEqual(result, expected);
})