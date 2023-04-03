import { expect, test, assert } from 'vitest';
import { ParsonsItem, ParsonsSolutionItem } from './types';
import { validateParsonsProblem } from './validate';

test('validateParsonsProblem()', () => {
  // Arrange
  const solutionToValidate: ParsonsItem[] = [];
  const validSolution: ParsonsSolutionItem[] = [];

  // Act
  const [result, isValid] = validateParsonsProblem(
    solutionToValidate,
    validSolution
  );

  // Assert
  assert.equal(isValid, true);
  assert.equal(result.length, 0);
});
