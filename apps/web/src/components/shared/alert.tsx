'use client';

// 3rd party
import { AlertProps as MantineAlertProps, Alert } from '@mantine/core';
import { FaSkullCrossbones, FaLightbulb } from 'react-icons/fa6';

/**
 * AlertProps
 */

type AlertProps = Omit<
  MantineAlertProps,
  | 'title'
  | 'color'
  | 'icon'
  | 'withCloseButton'
  | 'onClose'
  | 'closeButtonLabel'
  | 'styles'
  | 'children'
> & {
  message: string;
};

const defaultProps: Partial<MantineAlertProps> = {
  withCloseButton: false,
  styles: { title: { marginBottom: 0 } },
};

/**
 * Warning
 */

export type WarningProps = AlertProps;

export const Warning = ({ message, ...props }: WarningProps) => {
  return (
    <Alert
      title={message}
      color="pink"
      icon={<FaSkullCrossbones />}
      {...defaultProps}
      {...props}
    >
      {null}
    </Alert>
  );
};

/**
 * Info
 */

export type InfoProps = AlertProps;

export const Info = ({ message, ...props }: InfoProps) => {
  return (
    <Alert
      title={message}
      color="blue"
      icon={<FaLightbulb />}
      {...defaultProps}
      {...props}
    >
      {null}
    </Alert>
  );
};
