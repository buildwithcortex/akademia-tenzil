/* Root layout for the admin panel. Deliberately separate from the site's
   layout: Payload renders its own <html> and loads its own styles, so the two
   cannot share a root. */
import type { ServerFunctionClient } from 'payload';
import config from '@payload-config';
// Payload's compiled admin stylesheet. Without this the panel renders unstyled
// (Times, no colours) even though its JS runs fine.
import '@payloadcms/next/css';
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts';
import { importMap } from './admin/importMap';
import './custom.scss';

type Args = { children: React.ReactNode };

const serverFunction: ServerFunctionClient = async function (args) {
  'use server';
  return handleServerFunctions({ ...args, config, importMap });
};

export default async function Layout({ children }: Args) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
