import { test, assert } from 'vitest';
import { executeValidator, getParsonsBlockValidatorDown, getParsonsBlockValidatorUp, validateParsonsProblem } from '../../validate';
import { parseTestHr } from '../testHelper';

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
    const [result, isValid] = validateParsonsProblem(learners, solution);

    // Assert
    assert.deepEqual(result, expected);
    assert.isFalse(isValid)
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