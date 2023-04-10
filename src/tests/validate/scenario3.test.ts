import { expect, test, assert } from 'vitest';
import { executeValidator, getParsonsBlockValidatorDown, getParsonsBlockValidatorUp, validateParsonsProblem2 } from '../../validate';
import { ValidatedParsonsItem, ParsonsItem, b, r } from '../../types';
import { parseTest, parseTestHr, stringToParsonsItems as q, toExpectedResult as w } from '../testHelper';

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
    const [result] = validateParsonsProblem2(learners, solution);

    // Assert
    assert.deepEqual(result, expected);
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