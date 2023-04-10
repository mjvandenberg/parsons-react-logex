import { expect, test, assert } from 'vitest';
import { executeValidator, getParsonsBlockValidatorDown, getParsonsBlockValidatorUp, validateParsonsProblem2 } from '../../validate';
import { ValidatedParsonsItem, ParsonsItem, b, r } from '../../types';
import { parseTest, parseTestHr, stringToParsonsItems as q, toExpectedResult as w } from '../testHelper';

test('scenario 2', () => {
    // Arrange
    const input = [
        '1,1,g',
        'a,a,?',
        '2,@,r',
        'b,b,?',
        '3,3,?',
        'c,c,?',
        '4,@,r'
    ];
    const [solution, learners, expected] = parseTestHr(input);

    // Act
    const [result] = validateParsonsProblem2(learners, solution);

    // Assert
    assert.deepEqual(result, expected);
})

test('scenario 2 down', () => {
    // Arrange
    const input = [
        '1,1,g',
        'a,a,?',
        '2,@,r',
        'b,b,?',
        '3,3,?',
        'c,c,?',
        '4,@,?'
    ];
    const [solution, learners, expected] = parseTestHr(input);
    const validator = getParsonsBlockValidatorDown();

    // Act
    const result = executeValidator(learners, solution, validator);

    // Assert
    assert.deepEqual(result, expected);
})

test('scenario 2 up', () => {
    // Arrange
    const input = [
        '1,1,?',
        'a,a,?',
        '2,@,?',
        'b,b,?',
        '3,3,?',
        'c,c,?',
        '4,@,r'
    ];
    const [solution, learners, expected] = parseTestHr(input);
    const validator = getParsonsBlockValidatorUp();

    // Act
    const result = executeValidator(learners, solution, validator);

    // Assert
    assert.deepEqual(result, expected);
})