import type { EnhancedPage } from './app';
import { common } from './common';

export const createCheckoutPageObject = (testArgs: { page: EnhancedPage }) => {
  const { page } = testArgs;
  const self = {
    ...common(testArgs),
    waitForMounted: (selector = '.cl-checkout-root') => {
      return page.waitForSelector(selector, { state: 'attached' });
    },
    closeDrawer: () => {
      return page.locator('.cl-drawerClose').click();
    },
    fillTestCard: async () => {
      await self.fillCard({
        number: '4242424242424242',
        expiration: '1234',
        cvc: '123',
        country: 'United States',
        zip: '12345',
      });
    },
    fillCard: async (card: { number: string; expiration: string; cvc: string; country: string; zip: string }) => {
      const frame = page.frameLocator('iframe[src*="elements-inner-payment"]');
      await frame.getByLabel('Card number').fill(card.number);
      await frame.getByLabel('Expiration date').fill(card.expiration);
      await frame.getByLabel('Security code').fill(card.cvc);
      await frame.getByLabel('Country').selectOption(card.country);
      await frame.getByLabel('ZIP code').fill(card.zip);
    },
    waitForStripeElements: async ({ state = 'visible' }: { state?: 'visible' | 'hidden' } = {}) => {
      return page.frameLocator('iframe[src*="elements-inner-payment"]').getByLabel('Card number').waitFor({ state });
    },
    clickPayOrSubscribe: async () => {
      await self.root.getByRole('button', { name: /subscribe|pay\s\$/i }).click();
    },
    waitForSubscribeButton: async () => {
      await self.root.getByRole('button', { name: /^subscribe$/i }).waitFor({ state: 'visible' });
    },
    confirmAndContinue: async () => {
      await self.root.getByRole('button', { name: /^continue$/i }).click();
    },
    clickAddPaymentMethod: async () => {
      await self.root.getByRole('radio', { name: 'Add payment method' }).click();
    },
    clickPaymentMethods: async () => {
      await self.root.getByRole('radio', { name: 'Payment Methods' }).click();
    },
    root: page.locator('.cl-checkout-root'),
  };
  return self;
};
