import type { LongRunningApplication } from '../models/longRunningApplication';
import { longRunningApplication } from '../models/longRunningApplication';
import { astro } from './astro';
import { elements } from './elements';
import { envs } from './envs';
import { expo } from './expo';
import { express } from './express';
import { next } from './next';
import { nuxt } from './nuxt';
import { react } from './react';
import { reactRouter } from './react-router';
import { tanstack } from './tanstack';
import { vue } from './vue';

/**
 * A list of long-running applications that can be used in tests.
 * These are applications that are started once and then used for all tests,
 * making the tests run faster as the app doesn't need to be started for each test.
 */
export const createLongRunningApps = () => {
  const configs = [
    { id: 'express.vite.withEmailCodes', config: express.vite, env: envs.withEmailCodes },
    { id: 'react.vite.withEmailCodes', config: react.vite, env: envs.withEmailCodes },
    { id: 'react.vite.withEmailCodes_persist_client', config: react.vite, env: envs.withEmailCodes_destroy_client },
    { id: 'react.vite.withEmailLinks', config: react.vite, env: envs.withEmailLinks },
    { id: 'next.appRouter.withEmailCodes', config: next.appRouter, env: envs.withEmailCodes },
    { id: 'next.appRouter.sessionsProd1', config: next.appRouter, env: envs.sessionsProd1 },
    {
      id: 'next.appRouter.withEmailCodes_persist_client',
      config: next.appRouter,
      env: envs.withEmailCodes_destroy_client,
    },
    { id: 'next.appRouter.withCustomRoles', config: next.appRouter, env: envs.withCustomRoles },
    { id: 'next.appRouter.withReverification', config: next.appRouter, env: envs.withReverification },
    { id: 'next.appRouter.withSignInOrUpFlow', config: next.appRouter, env: envs.withSignInOrUpFlow },
    {
      id: 'next.appRouter.withSignInOrUpEmailLinksFlow',
      config: next.appRouter,
      env: envs.withSignInOrUpEmailLinksFlow,
    },
    {
      id: 'next.appRouter.withSessionTasks',
      config: next.appRouter,
      env: envs.withSessionTasks,
    },
    { id: 'next.appRouter.withAPIKeys', config: next.appRouter, env: envs.withAPIKeys },
    { id: 'withBillingStaging.next.appRouter', config: next.appRouter, env: envs.withBillingStaging },
    { id: 'withBilling.next.appRouter', config: next.appRouter, env: envs.withBilling },
    { id: 'withBillingStaging.vue.vite', config: vue.vite, env: envs.withBillingStaging },
    { id: 'withBilling.vue.vite', config: vue.vite, env: envs.withBilling },
    { id: 'withBilling.astro.node', config: astro.node, env: envs.withBilling },
    // { id: 'withBillingStaging.nuxt.node', config: nuxt.node, env: envs.withBillingStaging },
    // { id: 'withBilling.nuxt.node', config: nuxt.node, env: envs.withBilling },
    {
      id: 'next.appRouter.withLegalConsent',
      config: next.appRouter,
      env: envs.withLegalConsent,
    },
    { id: 'quickstart.next.appRouter', config: next.appRouterQuickstart, env: envs.withEmailCodesQuickstart },
    { id: 'elements.next.appRouter', config: elements.nextAppRouter, env: envs.withEmailCodes },
    { id: 'astro.node.withCustomRoles', config: astro.node, env: envs.withCustomRoles },
    { id: 'astro.static.withCustomRoles', config: astro.static, env: envs.withCustomRoles },
    { id: 'expo.expo-web', config: expo.expoWeb, env: envs.withEmailCodes },
    { id: 'tanstack.react-start', config: tanstack.reactStart, env: envs.withEmailCodes },
    { id: 'tanstack.react-router', config: tanstack.reactRouter, env: envs.withEmailCodes },
    { id: 'vue.vite', config: vue.vite, env: envs.withCustomRoles },
    { id: 'nuxt.node', config: nuxt.node, env: envs.withCustomRoles },
    { id: 'react-router.node', config: reactRouter.reactRouterNode, env: envs.withEmailCodes },
  ] as const;

  const apps = configs.map(longRunningApplication);

  return {
    getByPattern: (patterns: Array<string | (typeof configs)[number]['id']>) => {
      const res = new Set(patterns.map(pattern => apps.filter(app => idMatchesPattern(app.id, pattern))).flat());
      if (!res.size) {
        const availableIds = configs.map(c => `\n- ${c.id}`).join('');
        throw new Error(`Could not find long running app with id ${patterns}. The available ids are: ${availableIds}`);
      }
      return [...res] as any as LongRunningApplication[];
    },
  };
};

// A function that accepts an array of string ids and returns the ids that match the input id
// The ids are strings and they follow the string.string.string format
// The input id can be either an excact match or a partial match using the string.* format
// Example: ['react.vite.withEmailCodes', 'react.vite.withEmailLinks', 'remix.node.withEmailCodes']
// Input: 'react.vite.*'
// Output: ['react.vite.withEmailCodes', 'react.vite.withEmailLinks']
const idMatchesPattern = (id: string, pattern: string) => {
  if (pattern.includes('*')) {
    const [idStart, _] = pattern.split('*');
    return id.startsWith(idStart);
  }
  return id === pattern;
};
