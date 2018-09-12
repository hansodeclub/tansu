// forked from https://github.com/tootsuite/mastodon/blob/995f8b389a66ab76ec92d9a240de376f1fc13a38/app/javascript/mastodon/features/emoji/emoji.js

import unicodeMapping from './emoji_unicode_mapping_light';
import Trie from 'substring-trie';

const autoPlayGif = true;

const trie = new Trie(Object.keys(unicodeMapping));

const assetHost = process.env.CDN_HOST || 'https://handon.club/';

const emojify = (str, customEmojis = {}) => {
    const tagCharsWithoutEmojis = '<&';
    const tagCharsWithEmojis = Object.keys(customEmojis).length ? '<&:' : '<&';
    let rtn = '', tagChars = tagCharsWithEmojis, invisible = 0;
    for (; ;) {
        let match, i = 0, tag;
        while (i < str.length && (tag = tagChars.indexOf(str[i])) === -1 && (invisible || !(match = trie.search(str.slice(i))))) {
            i += str.codePointAt(i) < 65536 ? 1 : 2;
        }
        let rend, replacement = '';
        if (i === str.length) {
            break;
        } else if (str[i] === ':') {
            if (!(() => {
                rend = str.indexOf(':', i + 1) + 1;
                if (!rend) return false; // no pair of ':'
                const lt = str.indexOf('<', i + 1);
                if (!(lt === -1 || lt >= rend)) return false; // tag appeared before closing ':'
                const shortname = str.slice(i, rend);
                // now got a replacee as ':shortname:'
                // if you want additional emoji handler, add statements below which set replacement and return true.
                if (shortname in customEmojis) {
                    const filename = autoPlayGif ? customEmojis[shortname].url : customEmojis[shortname].static_url;
                    replacement = `<img draggable="false" class="emojione" alt="${shortname}" title="${shortname}" src="${filename}" />`;
                    return true;
                }
                return false;
            })()) rend = ++i;
        } else if (tag >= 0) { // <, &
            rend = str.indexOf('>;'[tag], i + 1) + 1;
            if (!rend) {
                break;
            }
            if (tag === 0) {
                if (invisible) {
                    if (str[i + 1] === '/') { // closing tag
                        if (!--invisible) {
                            tagChars = tagCharsWithEmojis;
                        }
                    } else if (str[rend - 2] !== '/') { // opening tag
                        invisible++;
                    }
                } else {
                    if (str.startsWith('<span class="invisible">', i)) {
                        // avoid emojifying on invisible text
                        invisible = 1;
                        tagChars = tagCharsWithoutEmojis;
                    }
                }
            }
            i = rend;
        } else { // matched to unicode emoji
            const { filename, shortCode } = unicodeMapping[match];
            const title = shortCode ? `:${shortCode}:` : '';
            replacement = `<img draggable="false" class="emojione" alt="${match}" title="${title}" src="${assetHost}/emoji/${filename}.svg" />`;
            rend = i + match.length;
        }
        rtn += str.slice(0, i) + replacement;
        str = str.slice(rend);
    }
    return rtn + str;
};

export default emojify;

export const buildCustomEmojis = (customEmojis) => {
    const emojis = [];

    customEmojis.forEach(emoji => {
        const shortcode = emoji.get('shortcode');
        const url = autoPlayGif ? emoji.get('url') : emoji.get('static_url');
        const name = shortcode.replace(':', '');

        emojis.push({
            id: name,
            name,
            short_names: [name],
            text: '',
            emoticons: [],
            keywords: [name],
            imageUrl: url,
            custom: true,
        });
    });

    return emojis;
};