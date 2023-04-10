import { expect, test, assert } from 'vitest';
import { ValidatedParsonsItem, ParsonsItem, b, r } from './types';
import { getItemByIndex, getMatchingItemFromEnd, getPreviousItemReduce, getPreviousItemReduceRight, isItemValid, validateParsonsProblem2 } from './validate';

test('getPreviousItemReduceRight', () => {
  // Arrange
  const arr = ["a", "b", "c"];

  // Act
  const result = getPreviousItemReduceRight(arr, 2);

  // Assert
  assert.equal(result, "b");
})

test('getPreviousItemReduceRight a', () => {
  // Arrange
  const arr = ["a", "b", "c"];

  // Act
  const result = getPreviousItemReduceRight(arr, 2);

  // Assert
  assert.equal(result, "b");
})

test('getPreviousItemReduceRight b', () => {
  // Arrange
  const arr: string[] = [];

  // Act
  const result = getPreviousItemReduceRight(arr, 1);

  // Assert
  assert.equal(result, undefined);
})

test('getPreviousItemReduce a', () => {
  // Arrange
  const arr = ["a", "b", "c"];

  // Act
  const result = getPreviousItemReduce(arr, 2);

  // Assert
  assert.equal(result, "a");
})

test('getPreviousItemReduce undefined left', () => {
  // Arrange
  const arr = ["a", "b", "c"];

  // Act
  const result = getPreviousItemReduce(arr, 0);

  // Assert
  assert.equal(result, undefined);
})

test('getPreviousItemReduce b', () => {
  // Arrange
  const arr = ["a", "b", "c"];

  // Act
  const result = getPreviousItemReduce(arr, 3);

  // Assert
  assert.equal(result, "b");
})

test('getPreviousItemReduce', () => {
  // Arrange
  const arr = ["a", "b", "c"];

  // Act
  const result = getPreviousItemReduce(arr, 4);

  // Assert
  assert.equal(result, "c");
})

test('getItemByIndex', () => {
  // Arrange
  const arr = ["a", "b", "c"];

  // Act
  const result = getItemByIndex(arr, 0);

  // Assert
  assert.equal(result, "a");
})

test('getItemByIndex', () => {
  // Arrange
  const arr = ["a", "b", "c"];

  // Act
  const result = getItemByIndex(arr, 2);

  // Assert
  assert.equal(result, "c");
})

test('getItemByIndex', () => {
  // Arrange
  const arr = ["a", "b", "c"];

  // Act
  const result = getItemByIndex(arr, 4);

  // Assert
  assert.equal(result, undefined);
})

test('isItemValid', () => {
  // Arrange
  const a = { text: "1" };
  const b = { text: "2" };

  // Act
  const result = isItemValid(a, b);

  // Assert
  assert.equal(result, "red");
})

test('isItemValid', () => {
  // Arrange
  const a = { text: "1" };
  const b = { text: "1" };

  // Act
  const result = isItemValid(a, b);

  // Assert
  assert.equal(result, "green");
})

test('getMatchingItemFromEnd', () => {
  // Arrange
  const org = ["A", "B", "C"]
  const arr = ["a", "b", "c", "d", "e", "f", "g"];
  const index = org.length - 1;
  const length = org.length;

  // Act
  const result = getMatchingItemFromEnd(arr, index, length);

  // Assert
  assert.equal(result, "g");
})

test('getMatchingItemFromEnd', () => {
  // Arrange
  const org = ["a", "b", "c", "d", "e", "f", "g"];
  const arr = ["A", "B", "C"]
  const index = org.length - 1;
  const length = org.length;

  // Act
  const result = getMatchingItemFromEnd(arr, index, length);

  // Assert
  assert.equal(result, "C");
})

test('getMatchingItemFromEnd', () => {
  // Arrange
  const org = ["a", "b", "c", "d", "e", "f", "g"];
  const arr = ["A", "B", "C"]
  const index = org.length - 3;
  const length = org.length;

  // Act
  const result = getMatchingItemFromEnd(arr, index, length);

  // Assert
  assert.equal(result, "A");
})

test('getMatchingItemFromEnd', () => {
  // Arrange
  const org = ["a", "b", "c", "d", "e", "f", "g"];
  const arr = ["A", "B", "C"]
  const index = org.length - 4;
  const length = org.length;

  // Act
  const result = getMatchingItemFromEnd(arr, index, length);

  // Assert
  assert.equal(result, undefined);
})