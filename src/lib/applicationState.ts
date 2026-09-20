import type { Payload } from 'payload';
import {
  DEFAULT_ANNOUNCEMENT_SUBJECT,
  DEFAULT_ANNOUNCEMENT_TEXT,
  DEFAULT_CLOSED_MESSAGE,
} from '@/globals/ApplicationSettings';

export type ApplicationState = {
  open: boolean;
  closedMessage: string;
  announcementSubject: string;
  announcementText: string;
};

/**
 * Whether applications are open, plus the editable copy that goes with it.
 *
 * Takes the Payload instance rather than fetching one, so the Subscribers
 * collection can use it from inside the config without importing the module
 * that imports the config.
 *
 * Deliberately no try/catch. If the database cannot be read, a page being
 * revalidated should fail and keep serving its last good render, not quietly
 * fall back to "open" and show a form the academy has closed.
 */
export async function readApplicationState(
  payload: Payload,
): Promise<ApplicationState> {
  const settings = await payload.findGlobal({ slug: 'application-settings' });

  return {
    // A global nobody has saved yet has no value here. That means open.
    open: settings.hapur !== false,
    closedMessage: settings.mesazhiMbyllur?.trim() || DEFAULT_CLOSED_MESSAGE,
    announcementSubject:
      settings.njoftimSubjekti?.trim() || DEFAULT_ANNOUNCEMENT_SUBJECT,
    announcementText:
      settings.njoftimTeksti?.trim() || DEFAULT_ANNOUNCEMENT_TEXT,
  };
}
