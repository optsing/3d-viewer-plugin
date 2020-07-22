import 'normalize.css';
import './app.css';

import qs from 'qs';
import * as monaco from 'monaco-editor';

import * as Api from 'scada-plugin-api';

function findFileName (url: string): string {
    const lastSlash = url.lastIndexOf('/');
    if (lastSlash > -1) {
        return url.substring(lastSlash + 1);
    }
    return url;
}

async function main () {

    const editor_element = document.getElementById('editor');
    if (!editor_element) {
        throw new Error('Root element not found');
    }

    const { src } = qs.parse(location.search, { ignoreQueryPrefix: true }) as { [key: string]: string };
    if (!src) {
        throw new Error('No src provided');
    }

    await Api.updateTitle({
        title: findFileName(src)
    });
    const text = await Api.loadTextFile(src);

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: true,
        schemas: [],
        enableSchemaRequest: true,
    });

    const editor = monaco.editor.create(editor_element, {
        value: text,
    });

    window.addEventListener('resize', () => {
        editor.layout();
    }, { passive: true });
}

main();