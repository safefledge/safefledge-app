"use server"
import TranslationErrorTracking from '@/api/ErrorTracking';
import {IntlErrorCode} from 'next-intl';


export async function onError(error: any) {
  if (error === IntlErrorCode.MISSING_MESSAGE) {
    TranslationErrorTracking(error)
  } else {
    console.warn('Unknown error', `Unknown error: ${error}`);
  }
}


