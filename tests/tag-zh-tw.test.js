import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { normalizeTagSearch, localizeTagAliases } from '../scripts/main/tagLanguage.js';

// Exercise the real search class without starting Electron or loading the full CSV.
const source = fs.readFileSync(new URL('../scripts/main/tagAutoComplete_backend.js', import.meta.url), 'utf8');
const groups = source.slice(source.indexOf('const groupNames ='), source.indexOf('class PromptManager'));
const classSource = source.slice(source.indexOf('class PromptManager'), source.indexOf('const tagBackend ='));
const context = { normalizeTagSearch, localizeTagAliases, console };
vm.runInNewContext(`${groups}\n${classSource}\nthis.PromptManager = PromptManager`, context);

test('Traditional Chinese search reuses simplified aliases and keeps English prompts', () => {
    const manager = new context.PromptManager();
    manager.prompts = [
        { prompt: 'long_hair', group: 0, heat: 100, aliases: '长发,长头发' },
        { prompt: 'short_hair', group: 0, heat: 90, aliases: '短发' },
    ];
    manager.dataLoaded = true;
    manager.useTranslate = true;

    const tw = manager.updateSuggestions('長髮', 'zh-TW');
    assert.equal(tw.length, 1);
    assert.match(tw[0][0], /<b>long_hair<\/b>/);
    assert.match(tw[0][0], /長髮/);
    assert.doesNotMatch(tw[0][0], /长发/);

    const cn = manager.updateSuggestions('长发', 'zh-CN');
    assert.match(cn[0][0], /长发/);
    const english = manager.updateSuggestions('long_', 'en-US');
    assert.match(english[0][0], /<b>long_hair<\/b>/);
});

test('Traditional query and displayed alias conversion are independent', () => {
    assert.equal(normalizeTagSearch('頭髮', 'zh-TW'), '头发');
    assert.equal(localizeTagAliases('头发', 'zh-TW'), '頭髮');
    assert.equal(normalizeTagSearch('頭髮', 'en-US'), '頭髮');
    assert.equal(localizeTagAliases('头发', 'zh-CN'), '头发');
});

test('existing SAA Chinese dictionary has the alias used by Traditional search', () => {
    const csv = fs.readFileSync(new URL('../data/danbooru_e621_merged_zh_cn.csv', import.meta.url), 'utf8');
    assert.match(csv, /^long_hair,0,长发$/m);
    assert.equal(normalizeTagSearch('長髮', 'zh-TW'), '长发');
});
