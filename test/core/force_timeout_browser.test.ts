import { test, expect } from 'vitest';
import { PlaywrightCrawler } from '@crawlee/playwright';
import { delay } from '../../packages/browser-crawler/test-timeout';

test('PlaywrightCrawler should timeout requestHandler', async () => {
    const crawler = new PlaywrightCrawler({
        requestHandlerTimeoutSecs: 1,
        requestHandler: async () => {
            await delay(2000);
        },
    });

    await expect(crawler.run(['https://example.com'])).rejects.toThrow(/timed out/i);
});
