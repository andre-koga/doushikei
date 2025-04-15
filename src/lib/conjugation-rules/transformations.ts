import type { VerbEnding, SoundChange } from '../types';

export const transformations = {
    godan: {
        endings: {
            u: { a: 'わ', i: 'い', e: 'え', o: 'お', te: 'って' },
            ku: { a: 'か', i: 'き', e: 'け', o: 'こ', te: 'いて' },
            gu: { a: 'が', i: 'ぎ', e: 'げ', o: 'ご', te: 'いで' },
            su: { a: 'さ', i: 'し', e: 'せ', o: 'そ', te: 'して' },
            tsu: { a: 'た', i: 'ち', e: 'て', o: 'と', te: 'って' },
            nu: { a: 'な', i: 'に', e: 'ね', o: 'の', te: 'んで' },
            bu: { a: 'ば', i: 'び', e: 'べ', o: 'ぼ', te: 'んで' },
            mu: { a: 'ま', i: 'み', e: 'め', o: 'も', te: 'んで' },
            ru: { a: 'ら', i: 'り', e: 'れ', o: 'ろ', te: 'って' }
        } as Record<VerbEnding, Record<SoundChange, string>>
    }
}; 