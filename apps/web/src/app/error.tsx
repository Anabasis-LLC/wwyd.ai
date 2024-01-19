'use client';

// lib
import { Shell, FullScreen, Warning } from '@/components/shared';

/**
 * Error
 */

export default function Error({ error }: { error: { digest?: string } }) {
  return (
    <Shell container={false} header={true} footer={false}>
      <FullScreen>
        <Warning
          message={`Oops, something bad happened. (Digest: ${
            error?.digest || '-'
          })`}
        />
      </FullScreen>
    </Shell>
  );
}
