/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */
import createEmotionCache from '@emotion/cache';
import { CacheProvider as EmotionCacheProvider } from '@emotion/react';
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

const emotionCache = createEmotionCache({ key: 'css' })

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <EmotionCacheProvider value={emotionCache}>
        <RemixBrowser />
      </EmotionCacheProvider>
    </StrictMode>
  );
});
