import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

test('first-run language choices follow the language file', async () => {
    const languages = JSON.parse(fs.readFileSync(new URL('../data/language.json', import.meta.url), 'utf8'));
    const source = fs.readFileSync(new URL('../scripts/renderer.js', import.meta.url), 'utf8');
    const start = source.indexOf('async function setupWizard(){');
    const end = source.indexOf("    await showDialog('info'", start);
    assert.ok(start >= 0 && end > start);

    let dialogOptions;
    const context = {
        globalThis: { cachedFiles: { language: languages }, globalSettings: {} },
        showDialog: async (type, options) => {
            assert.equal(type, 'radio');
            dialogOptions = options;
            return 1;
        },
        console,
    };
    vm.runInNewContext(`${source.slice(start, end)}\nreturn LANG.language;\n}\nthis.runWizard = setupWizard;`, context);
    const selectedLabel = await context.runWizard();

    assert.deepEqual(dialogOptions.items.split(','), Object.keys(languages));
    assert.deepEqual(dialogOptions.itemsTitle.split(','), Object.values(languages).map(x => x.language));
    assert.equal(context.globalThis.globalSettings.language, 'zh-TW');
    assert.equal(selectedLabel, '繁體中文（台灣）');
});
