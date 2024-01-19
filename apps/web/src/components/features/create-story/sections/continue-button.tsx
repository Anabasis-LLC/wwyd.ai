// 3rd party
import React, { MouseEventHandler } from 'react';
import { BoxProps, Box, Button } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FaFloppyDisk } from 'react-icons/fa6';

// lib
import { constants } from '@/theme';

/**
 * ContinueButton
 */

export type ContinueButtonProps = BoxProps & {
  icon?: React.ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  disabled?: boolean;
};

export const ContinueButton = ({
  icon,
  onClick,
  loading,
  disabled,
  children = 'Save & Continue',
  ...props
}: ContinueButtonProps) => {
  const isXs = useMediaQuery(`(max-width: ${constants.breakpoints.sm}px)`);

  return (
    <Box ta="right" {...props}>
      <Button
        variant="outline"
        color="secondaryAccent"
        size="lg"
        leftIcon={icon ?? <FaFloppyDisk />}
        onClick={onClick}
        loading={loading}
        disabled={disabled}
        fullWidth={isXs}
      >
        {children}
      </Button>
    </Box>
  );
};
