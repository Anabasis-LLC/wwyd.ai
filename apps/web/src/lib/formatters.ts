/**
 * formatBytes
 */

const FILE_SIZE_UNITS = [
  'bytes',
  'KB',
  'MB',
  'GB',
  'TB',
  'PB',
  'EB',
  'ZB',
  'YB',
];

export const formatFileSize = (bytes: number) => {
  let size = bytes;
  let divisions = 0;

  while (size >= 1024 && ++divisions) {
    size = size / 1024;
  }

  const unitValue = size
    .toFixed(size < 10 && divisions > 0 ? 1 : 0)
    .replace(/\.0$/, '');

  const unit = FILE_SIZE_UNITS[divisions];

  return `${unitValue} ${unit}`;
};
