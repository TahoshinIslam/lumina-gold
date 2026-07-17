'use client';

import { createContext, useContext } from 'react';
import type { SocialLinks } from '@/server/dal/settings';

/**
 * Makes server-fetched site config (the social links) available to client
 * components — the header, which renders on every page and is a Client
 * Component, so it cannot read the database itself. The root layout fetches
 * once and provides it here; the header reads it with useSocialLinks().
 *
 * Importing only the TYPE from the settings DAL is erased at build, so no server
 * code is pulled into the client bundle.
 */
const EMPTY: SocialLinks = { facebook: '', instagram: '', x: '', youtube: '' };
const SocialContext = createContext<SocialLinks>(EMPTY);

export function SiteConfigProvider({ social, children }: { social: SocialLinks; children: React.ReactNode }) {
  return <SocialContext.Provider value={social}>{children}</SocialContext.Provider>;
}

export function useSocialLinks(): SocialLinks {
  return useContext(SocialContext);
}
