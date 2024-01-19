'use client';

// lib
import { Shell, FullScreen, Warning } from '@/components/shared';

/**
 * NotFound
 */

export default function NotFound() {
  return (
    <Shell container={false} header={true} footer={false}>
      <FullScreen>
        <Warning message="Oops, that page doesn't exist." />
      </FullScreen>
    </Shell>
  );
}
