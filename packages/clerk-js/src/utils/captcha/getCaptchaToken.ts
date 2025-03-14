import { getTurnstileToken } from './turnstile';
import type { CaptchaOptions } from './types';

export const getCaptchaToken = (opts: CaptchaOptions) => {
  if (__BUILD_DISABLE_RHC__) {
    return Promise.reject(new Error('Captcha not supported in this environment'));
  }

  return getTurnstileToken(opts);
};
