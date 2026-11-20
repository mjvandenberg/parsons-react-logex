import { test, assert } from 'vitest';
import { executeValidator, getParsonsValidatorDown, getParsonsValidatorUp, validateParsonsProblem } from '../../validate';
import { parseTestHr } from '../testHelper';

test('dummy', () => {
    assert.isTrue(true);
})

test('scenario 3', () => {
    // Arrange
    const input = [
        '1,1,✔️',
        'a,z,❌',
        '2,2,✔️',
        'b,b,❔',
        '3,X,❌',
        'c,c,❔',
        '4,4,✔️',
        'd,d,✔️',
        '5,5,✔️'
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
        '1,1,✔️',
        'a,z,❌',
        '2,2,✔️',
        'b,b,❔',
        '3,X,❌',
        'c,c,❔',
        '4,4,❔',
        'd,d,❔',
        '5,5,❔'
    ];
    const [solution, learners, expected] = parseTestHr(input);
    const validator = getParsonsValidatorDown();

    // Act
    const result = executeValidator(learners, solution, validator, false);

    // Assert
    assert.deepEqual(result, expected);
})

test('scenario 3 up', () => {
    // Arrange
    const input = [
        '1,1,❔',
        'a,z,❔',
        '2,2,❔',
        'b,b,❔',
        '3,X,❌',
        'c,c,❔',
        '4,4,✔️',
        'd,d,✔️',
        '5,5,✔️'
    ];
    const [solution, learners, expected] = parseTestHr(input);
    const validator = getParsonsValidatorUp();

    // Act
    const result = executeValidator(learners, solution, validator, false);

    // Assert
    assert.deepEqual(result, expected);
})