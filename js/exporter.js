import { into_tokens, trim_lines, into_lines, into_nodes, nodeToHTML } from './parser.js';

export function setupExporter() {
    document.getElementById('exportBtn').addEventListener('click', exportHTML);
}

function exportHTML() {
    const editorContent = document.getElementById('editor').value;
    const { tokenList, indentList } = into_tokens(editorContent);
    trim_lines(tokenList);
    const lineList = into_lines(tokenList);
    const root = into_nodes("root", indentList, lineList);

    let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.getElementById('filename').value || 'local'}</title>
    <style>
:root {
    --back_ground: #ffffff;
    --text: #111111;
    --local: #dddddd;
    --shadow: #eeeeee;
    --block: #cccccc;
}
body {
    background: var(--back_ground);
    color: var(--text);
    font-family: "Fira Sans", sans-serif;
    padding: 17px;
}
details {
    background: var(--back_ground);
    margin-bottom: 5px;
}
details[open] {
    background: var(--back_ground);
}
summary {
    list-style: none;
    color: var(--text);
    padding: 5px 0;
    cursor: pointer;
}
summary:hover {
    background: var(--back_ground);
}
summary::-webkit-details-marker {
    display: none;
}
summary::before {
    content: "+";
    margin-right: 12px;
    display: inline-block;
    width: 17px;
    text-align: center;
    color: var(--text);
    font-weight: bold;
}
details[open] > summary::before {
    content: "-";
}
.links {
    padding-left: 17px;
    border-left: 2px solid var(--text);
    margin-top: 5px;
}
a {
    display: block;
    color: var(--text);
    text-decoration: none;
    padding: 5px 17px;
}
a:hover {
    background: var(--local);
    color: var(--back_ground);
}
    </style>
</head>
<body>
    <details open>
        <summary>${root.name}</summary>
        <div style="margin-left:17px">\n`;

    root.rails.forEach(node => {
        html += nodeToHTML(node, 2);
    });

    html += `        </div>
    </details>
</body>
</html>`;

    let filename = document.getElementById('filename').value.trim() || 'root';
    filename = filename.replace(/\.html$/g, '') + '.html';

    const blob = new Blob([html], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}