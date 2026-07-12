// Shared file-preview modal: previewFile(subId, kind, title)
// CSV -> table, txt -> text, ipynb -> rendered cells (markdown/code/outputs).
(function () {
  const style = document.createElement('style');
  style.textContent = `
  #pvOverlay { position:fixed; inset:0; background:rgba(0,0,0,.65); display:none; place-items:center; z-index:1000; }
  #pvBox { background:var(--card,#181b23); color:var(--text,#e8eaf0); border:1px solid var(--line,#2a2f3c);
           border-radius:12px; width:min(950px, 94vw); max-height:88vh; display:flex; flex-direction:column; }
  #pvHead { display:flex; align-items:center; gap:1rem; padding: .8rem 1.1rem; border-bottom:1px solid var(--line,#2a2f3c); }
  #pvHead b { flex:1; font-size:.95rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  #pvHead a { color:var(--accent,#5b8cff); font-size:.85rem; }
  #pvClose { cursor:pointer; border:0; background:var(--line,#2a2f3c); color:inherit; border-radius:8px; padding:.3rem .8rem; }
  #pvBody { overflow:auto; padding:1rem 1.1rem; font-size:.85rem; }
  #pvBody table { border-collapse:collapse; white-space:nowrap; }
  #pvBody th, #pvBody td { border:1px solid var(--line,#2a2f3c); padding:.25rem .55rem; text-align:left; }
  #pvBody pre { white-space:pre-wrap; word-break:break-word; background:var(--bg,#0f1117);
                border:1px solid var(--line,#2a2f3c); border-radius:8px; padding:.6rem; margin:.4rem 0; }
  #pvBody .nb-md { color:var(--muted,#9aa1b2); padding:.4rem 0; white-space:pre-wrap; }
  #pvBody .nb-in { color:var(--accent,#5b8cff); font-size:.72rem; margin-top:.7rem; }
  #pvBody img { max-width:100%; }
  .pvHint { color:var(--muted,#9aa1b2); font-size:.78rem; margin:.4rem 0; }`;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'pvOverlay';
  overlay.innerHTML = `<div id="pvBox">
    <div id="pvHead"><b id="pvTitle"></b><a id="pvDl" href="#">⬇ download</a>
    <button id="pvClose">✕ close</button></div>
    <div id="pvBody"></div></div>`;
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(overlay));
  const close = () => overlay.style.display = 'none';
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  overlay.addEventListener('click', e => { if (e.target.id === 'pvClose') close(); });

  const esc = t => String(t ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;');

  function renderCsv(text) {
    const lines = text.replace(/\r/g, '').split('\n').filter(l => l.length);
    const rows = lines.slice(0, 201).map(l => l.split(','));
    const note = lines.length > 201 ? `<p class="pvHint">Showing first 200 of ${lines.length - 1} rows.</p>` : '';
    return note + '<table><tr>' + rows[0].map(c => `<th>${esc(c)}</th>`).join('') + '</tr>'
      + rows.slice(1).map(r => '<tr>' + r.map(c => `<td>${esc(c)}</td>`).join('') + '</tr>').join('') + '</table>';
  }

  function renderNotebook(nb) {
    const cells = nb.cells || [];
    let html = `<p class="pvHint">${cells.length} cells</p>`;
    cells.forEach((c, i) => {
      const src = (Array.isArray(c.source) ? c.source.join('') : c.source) || '';
      if (c.cell_type === 'markdown') {
        html += `<div class="nb-md">${esc(src)}</div>`;
      } else if (c.cell_type === 'code') {
        html += `<div class="nb-in">In [${c.execution_count ?? ' '}]</div><pre>${esc(src)}</pre>`;
        (c.outputs || []).forEach(o => {
          if (o.output_type === 'stream') {
            html += `<pre>${esc((Array.isArray(o.text) ? o.text.join('') : o.text || '').slice(0, 4000))}</pre>`;
          } else if (o.data) {
            if (o.data['image/png']) html += `<img src="data:image/png;base64,${o.data['image/png']}">`;
            else if (o.data['text/plain']) {
              const t = Array.isArray(o.data['text/plain']) ? o.data['text/plain'].join('') : o.data['text/plain'];
              html += `<pre>${esc(String(t).slice(0, 4000))}</pre>`;
            }
          } else if (o.output_type === 'error') {
            html += `<pre style="color:var(--bad,#e5646c)">${esc((o.traceback || []).join('\n').replace(/\x1b\[[0-9;]*m/g, '').slice(0, 4000))}</pre>`;
          }
        });
      }
    });
    return html;
  }

  window.previewFile = async function (subId, kind, title) {
    const api = window.API ?? '';
    const url = `${api}/api/submissions/${subId}/files/${kind}`;
    overlay.style.display = 'grid';
    document.getElementById('pvTitle').textContent = title;
    document.getElementById('pvDl').href = url;
    const body = document.getElementById('pvBody');
    body.innerHTML = '<p class="pvHint">Loading…</p>';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error((await res.json()).detail || res.statusText);
      const text = await res.text();
      if (kind === 'notebook') body.innerHTML = renderNotebook(JSON.parse(text));
      else if (kind === 'requirements') body.innerHTML = `<pre>${esc(text)}</pre>`;
      else body.innerHTML = renderCsv(text);
    } catch (e) {
      body.innerHTML = `<p class="pvHint">Could not preview: ${esc(e.message)}</p>`;
    }
  };
})();
