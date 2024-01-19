/**
 * Window
 */

declare const window: Window & { dataLayer?: Record<string, unknown>[] };

/**
 * Constants
 */

export const GTM_ID = 'GTM-NG69KH5';

/**
 * Event
 */

export type Event =
  | { event: 'landing_visit' }
  | { event: 'landing_choose' }
  | { event: 'landing_choose_cancel' }
  | { event: 'landing_start_registration'; provider: string }
  | { event: 'landing_complete_registration'; provider: string };

/**
 * fireEvent
 */

export const fireEvent = (event: Event) => {
  if (window.dataLayer) {
    window.dataLayer.push(
      process.env.NODE_ENV === 'production'
        ? event
        : { ...event, debug_mode: true },
    );
  } else {
    pendingEvents.push(event);
  }
};

/**
 * flushPendingEvents
 */

const pendingEvents: Event[] = [];

export const flushPendingEvents = () => {
  if (pendingEvents.length > 0 && window.dataLayer) {
    pendingEvents.forEach((event) => fireEvent(event));
  }
};
