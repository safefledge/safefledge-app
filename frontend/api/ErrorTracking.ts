import {IntlErrorCode} from 'next-intl';
import { Webhook } from 'webhook-discord';


export default function TranslationErrorTracking(error: IntlErrorCode) {
    const hook = new Webhook(process.env.DISCORD_WEB_HOOK ? process.env.DISCORD_WEB_HOOK : '');
    if (error === IntlErrorCode.MISSING_MESSAGE) {
        hook.warn('Missing translation', `Missing translation for ${error}`);
    } else {
        hook.err('Unknown error', `Unknown error: ${error}`);
    }
}
