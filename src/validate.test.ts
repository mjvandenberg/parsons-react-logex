import { test, assert } from 'vitest';
import {
  countNumberOfItemsValid,
  getItemByIndex,
  getMatchingItemFromEnd,
  isItemValid,
} from './validate';
import { ParsonsUiItem } from './types';

test('getItemByIndex', () => {
  // Arrange
  const arr = ['a', 'b', 'c'];

  // Act
  const result = getItemByIndex(arr, 0);

  // Assert
  assert.equal(result, 'a');
});

test('getItemByIndex', () => {
  // Arrange
  const arr = ['a', 'b', 'c'];

  // Act
  const result = getItemByIndex(arr, 2);

  // Assert
  assert.equal(result, 'c');
});

test('getItemByIndex', () => {
  // Arrange
  const arr = ['a', 'b', 'c'];

  // Act
  const result = getItemByIndex(arr, 4);

  // Assert
  assert.equal(result, undefined);
});

test('isItemValid', () => {
  // Arrange
  const a = { text: '1' };
  const b = { text: '2' };

  // Act
  const result = isItemValid(a, b);

  // Assert
  assert.equal(result, 'red');
});

test('isItemValid', () => {
  // Arrange
  const a = { text: '1' };
  const b = { text: '1' };

  // Act
  const result = isItemValid(a, b);

  // Assert
  assert.equal(result, 'green');
});

test('getMatchingItemFromEnd', () => {
  // Arrange
  const org = ['A', 'B', 'C'];
  const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const index = org.length - 1;
  const length = org.length;

  // Act
  const result = getMatchingItemFromEnd(arr, index, length);

  // Assert
  assert.equal(result, 'g');
});

test('getMatchingItemFromEnd', () => {
  // Arrange
  const org = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const arr = ['A', 'B', 'C'];
  const index = org.length - 1;
  const length = org.length;

  // Act
  const result = getMatchingItemFromEnd(arr, index, length);

  // Assert
  assert.equal(result, 'C');
});

test('getMatchingItemFromEnd', () => {
  // Arrange
  const org = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const arr = ['A', 'B', 'C'];
  const index = org.length - 3;
  const length = org.length;

  // Act
  const result = getMatchingItemFromEnd(arr, index, length);

  // Assert
  assert.equal(result, 'A');
});

test('getMatchingItemFromEnd', () => {
  // Arrange
  const org = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const arr = ['A', 'B', 'C'];
  const index = org.length - 4;
  const length = org.length;

  // Act
  const result = getMatchingItemFromEnd(arr, index, length);

  // Assert
  assert.equal(result, undefined);
});

test('countNumberOfItemsValid_Downwards', () => {
  // Arrange
  const list: ParsonsUiItem[] = [
    { id: "1", "text": "1", isValid: "green", isValidRule: "unknown" },
    { id: "2", "text": "2", isValid: "green", isValidRule: "green" },
    { id: "3", "text": "3", isValid: "green", isValidRule: "green" },
    { id: "4", "text": "4", isValid: "red", isValidRule: "red" },
    { id: "5", "text": "5", isValid: "green", isValidRule: "green" },
    { id: "6", "text": "6", isValid: "green", isValidRule: "green" },
  ];
  // Act
  const result = countNumberOfItemsValid(list, "downwards");

  // Assert
  assert.equal(result, 3);
});

test('countNumberOfItemsValid_Upwards', () => {
  // Arrange
  const list: ParsonsUiItem[] = [
    { id: "1", "text": "1", isValid: "green", isValidRule: "green" },
    { id: "2", "text": "2", isValid: "green", isValidRule: "green" },
    { id: "3", "text": "3", isValid: "green", isValidRule: "green" },
    { id: "4", "text": "4", isValid: "red", isValidRule: "red" },
    { id: "5", "text": "5", isValid: "green", isValidRule: "green" },
    { id: "6", "text": "6", isValid: "green", isValidRule: "green" },
  ];
  // Act
  const result = countNumberOfItemsValid(list, "upwards");

  // Assert
  assert.equal(result, 2);
});