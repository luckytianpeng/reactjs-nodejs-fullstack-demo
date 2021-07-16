import {formatBytes} from './utilities';


test('formatBytes, unit for memory', () => {
  expect(formatBytes(0)).toBe('0 Bytes');
  expect(formatBytes(1023)).toBe('1023 Bytes');

  expect(formatBytes(1024)).toBe('1 KB');
  expect(formatBytes(1024 + 512)).toBe('1.5 KB');
  expect(formatBytes(1024 + 512 + 1)).toBe('1.5 KB');
  expect(formatBytes(1024 + 512 + 255)).toBe('1.75 KB');
  expect(formatBytes(1024 + 512 + 256)).toBe('1.75 KB');
  expect(formatBytes(2047)).toBe('2 KB');
  expect(formatBytes(2048)).toBe('2 KB');

  expect(formatBytes(1024 * 1024)).toBe('1 MB');
  expect(formatBytes(1024 * 1024 * 2)).toBe('2 MB');

  expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
});
