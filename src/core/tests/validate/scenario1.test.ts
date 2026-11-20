import { test, assert } from 'vitest';
import { executeValidator, getParsonsValidatorDown, getParsonsValidatorUp, validateParsonsProblem } from '../../validate';
import { parseTestHr } from '../testHelper';

test('scenario 1 wn', () => {
    // Arrange
    const input = [
        '1,1,✔️',
        'a,z,❌',
        '2,2,✔️',
        'b,b,✔️',
        '3,3,✔️',
        'c,Z,❔',
        '4,5,✔️',
        'd, , ',
        '5, , '
    ];
    const [solution, learners, expected] = parseTestHr(input);

    // Act
    const [result, isValid] = validateParsonsProblem(learners, solution);

    // Assert
    assert.deepEqual(result, expected);
    assert.isFalse(isValid);
})

test('scenario 1 down', () => {
    // Arrange
    const input = [
        '1,1,✔️',
        'a,z,❌',
        '2,2,✔️',
        'b,b,✔️',
        '3,3,✔️',
        'c,Z,❔',
        '4,5,❌',
        'd, , ',
        '5, , '
    ];
    const [solution, learners, expected] = parseTestHr(input);
    const validator = getParsonsValidatorDown();

    // Act
    const result = executeValidator(learners, solution, validator, false);

    // Assert
    assert.deepEqual(result, expected);
})

test('scenario 1 up', () => {
    // Arrange
    const input = [
        '1,1,❔',
        'a,z,❔',
        '2,2,❔',
        'b,b,❔',
        '3,3,❌',
        'c,Z,❔',
        '4,5,✔️',
        'd, , ',
        '5, , '
    ];
    const [solution, learners, expected] = parseTestHr(input);
    const validator = getParsonsValidatorUp();

    // Act
    const result = executeValidator(learners, solution, validator, false);

    // Assert
    assert.deepEqual(result, expected);
})