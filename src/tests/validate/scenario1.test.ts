import { expect, test, assert } from 'vitest';
import { executeValidator, getParsonsBlockValidatorDown, getParsonsBlockValidatorUp, validateParsonsProblem2 } from '../../validate';
import { ValidatedParsonsItem, ParsonsItem, b, r } from '../../types';
import { parseTest, parseTestHr, stringToParsonsItems as q, toExpectedResult as w } from '../testHelper';

test('scenario 1 wn', () => {
    // Arrange
    const input = [
        '1,@,r',
        'a,a,?',
        '2,2,?',
        'b,b,?',
        '3,@,r'
    ];
    const [solution, learners, expected] = parseTestHr(input);

    // Act
    const [result, isValid] = validateParsonsProblem2(learners, solution);

    // Assert
    assert.deepEqual(result, expected);
    assert.isFalse(isValid);
})

test('scenario 1 down', () => {
    // Arrange
    const input = [
        '1,@,r',
        'a,a,?',
        '2,2,?',
        'b,b,?',
        '3,@,?'
    ];
    const [solution, learners, expected] = parseTestHr(input);
    const validator = getParsonsBlockValidatorDown();

    // Act
    const result = executeValidator(learners, solution, validator);

    // Assert
    assert.deepEqual(result, expected);
})

test('scenario 1 up', () => {
    // Arrange
    const input = [
        '1,@,?',
        'a,a,?',
        '2,2,?',
        'b,b,?',
        '3,@,r'
    ];
    const [solution, learners, expected] = parseTestHr(input);
    const validator = getParsonsBlockValidatorUp();

    // Act
    const result = executeValidator(learners, solution, validator);

    // Assert
    assert.deepEqual(result, expected);
})