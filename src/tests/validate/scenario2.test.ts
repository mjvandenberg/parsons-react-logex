import { test, assert } from 'vitest';
import { executeValidator, getParsonsValidatorDown, getParsonsValidatorUp, validateParsonsProblem } from '../../validate';
import { parseTestHr } from '../testHelper';

test('scenario 2', () => {
    // Arrange
    const input = [
        '1,1,✔️',
        'a,a,✔️',
        '2,2,✔️',
        'b,b,✔️',
        '3,3,✔️',
        ' ,c,❔',
        ' ,4,❌'
    ];
    const [solution, learners, expected] = parseTestHr(input);

    // Act
    const [result, isValid] = validateParsonsProblem(learners, solution);

    // Assert
    assert.deepEqual(result, expected);
    assert.isFalse(isValid)
})

test('scenario 2 down', () => {
    // Arrange
    const input = [
        '1,1,✔️',
        'a,a,✔️',
        '2,2,✔️',
        'b,b,✔️',
        '3,3,✔️',
        ' ,c,❔',
        ' ,4,❌'
    ];
    const [solution, learners, expected] = parseTestHr(input);
    const validator = getParsonsValidatorDown();

    // Act
    const result = executeValidator(learners, solution, validator, false);

    // Assert
    assert.deepEqual(result, expected);
})

test('scenario 2 up', () => {
    // Arrange
    const input = [
        '1,1,❔',
        'a,a,❔',
        '2,2,❔',
        'b,b,❔',
        '3,3,❔',
        ' ,c,❔',
        ' ,4,❌'
    ];
    const [solution, learners, expected] = parseTestHr(input);
    const validator = getParsonsValidatorUp();

    // Act
    const result = executeValidator(learners, solution, validator, false);

    // Assert
    assert.deepEqual(result, expected);
})