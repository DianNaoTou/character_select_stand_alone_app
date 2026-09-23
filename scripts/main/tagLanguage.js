import OpenCC from 'opencc-js';

const toSimplified = OpenCC.Converter({ from: 'tw', to: 'cn' });
const toTaiwanTraditional = OpenCC.Converter({ from: 'cn', to: 'tw' });

export function normalizeTagSearch(text, language) {
    return language === 'zh-TW' ? toSimplified(text) : text;
}

export function localizeTagAliases(text, language) {
    return language === 'zh-TW' ? toTaiwanTraditional(text) : text;
}
