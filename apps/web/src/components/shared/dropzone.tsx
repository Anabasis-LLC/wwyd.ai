'use client';

// 3rd party
import { useState, useCallback } from 'react';
import { reduce, merge } from 'lodash';
import { useDropzone, FileRejection, ErrorCode, Accept } from 'react-dropzone';
import {
  Stack,
  Flex,
  Group,
  Box,
  Text,
  Image,
  Loader,
  AspectRatio,
  Button,
} from '@mantine/core';
import { FaUpload } from 'react-icons/fa6';

// package
import type { Image as PrismaImage } from '@wwyd/db';

// lib
import { formatFileSize, createImage, cdnUrl } from '@/lib';
import { showNotification } from '@mantine/notifications';
import { constants, schemeColors } from '@/theme';

/**
 * MimeType
 */

type MimeType = 'png' | 'jpg';

const MimeTypes: Record<MimeType, Accept> = {
  png: { 'image/png': ['.png'] },
  jpg: { 'image/jpg': ['.jpeg', '.jpg'] },
};

/**
 * Dropzone
 */

export type DropzoneProps = {
  mimeTypes?: MimeType[];
  maxFileSize?: number;
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[]) => void;
  onImage?: (image?: PrismaImage) => void;
};

export function Dropzone({
  mimeTypes = ['png', 'jpg'],
  maxFileSize = 1024 * 1024 * 10,
  onImage,
  onDrop,
}: DropzoneProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<PrismaImage>();

  const onFileAccepted = useCallback(
    async (file: File) => {
      setIsLoading(true);

      // TODO: Use a mutation.
      const { ok, val } = await createImage(file);

      if (ok) {
        setImage(val.image);
        onImage && onImage(val.image);
      } else {
        showNotification({ message: val.error.message, color: 'pink' });
      }

      setIsLoading(false);
    },
    [onImage],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (onDrop) {
        onDrop(acceptedFiles, fileRejections);
      }

      setImage(undefined);

      if (fileRejections[0]) {
        showNotification({
          message: fileRejections[0].errors[0].message,
          color: 'pink',
        });
      }

      if (acceptedFiles[0]) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    onError: (error: Error) =>
      showNotification({ message: error.message, color: 'pink' }),
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    accept: reduce(
      mimeTypes.map((key) => MimeTypes[key]),
      (result, value) => merge(result, value),
    ),
    validator: ({ size }) =>
      size > maxFileSize
        ? {
            message: `Image must be less than ${formatFileSize(maxFileSize)}.`,
            code: ErrorCode.FileTooLarge,
          }
        : null,
    disabled: isLoading,
  });

  return (
    <Stack>
      {isLoading ? (
        <Flex direction="column" align="center">
          <Loader color="pink" />
        </Flex>
      ) : image ? (
        <Box>
          <AspectRatio
            ratio={(image.width || 1) / (image.height || 1)}
            maw={300}
            mah={400}
            mx="auto"
          >
            <Image src={cdnUrl(image.key)} radius="sm" alt="" />
          </AspectRatio>
        </Box>
      ) : null}
      <Box
        py="xl"
        sx={({ colorScheme }) => ({
          backgroundColor: isDragActive
            ? schemeColors[colorScheme].translucentBorderColor
            : undefined,
          border: `2px dashed ${schemeColors[colorScheme].translucentBorderColor}`,
          borderRadius: constants.radius.sm,
        })}
        {...getRootProps()}
      >
        <input type="file" {...getInputProps()} />
        <Group position="center" spacing="xs">
          <Button
            variant="light"
            color="gray"
            size="sm"
            onClick={open}
            disabled={isLoading}
          >
            <FaUpload />
          </Button>
          <Text color="dimmed" size="sm">
            {mimeTypes.map((type) => type.toUpperCase()).join(', ')} up to{' '}
            {formatFileSize(maxFileSize)}
          </Text>
        </Group>
      </Box>
    </Stack>
  );
}
