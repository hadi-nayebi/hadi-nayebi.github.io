/* ============================================================================
 * deck-engine.js — the hand-laid concept-deck engine (GENERIC across all decks).
 * Builds a 2D spatial grid of concept-cards from per-deck CONTENT:
 *   window.DECK_INFO  = { '<box-id>': {title,tag,what,why,hood,warn?} }
 *   window.DECK_CARDS = { 'col,row': {kind,step,eyebrow,title,sub,boxes,edges,stickies,...} }
 * Load this AFTER the deck's <deck>.cards.js. Pairs with deck-engine.css.
 * No external libraries. LEFT/RIGHT = main sequence; UP/DOWN = related detail.
 * Owns: build, nav, chrome (minimap/step-indicator/orientation), tooltip,
 * ref-symbol chips, and the localhost-only diagram-comment tool.
 * Guide: .claude/knowledge/diagrams/consolidated-mechanisms-diagram-guide.md
 * ============================================================================ */
/* ============================================================================
 * Grid addressing: each card cell key is "col,row".
 *   LEFT/RIGHT (col±1) = the main sequence (kind:'seq', carries step:N).
 *   UP/DOWN    (row±1) = a parallel / deeper detail card (kind:'detail').
 * The engine is content-agnostic: a deck supplies its own cards + info in
 * <deck>.cards.js. Per-deck code-accuracy (the source files each hood fact was
 * verified against) is documented in that content file's header, not here.
 * ========================================================================== */
(function () {
    "use strict";

    var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- lane → css color (mirrors the legend) ---------- */
    var LANE_COLOR = {
        job_core: 'var(--lane-job_core)',
        phasic:   'var(--lane-phasic)',
        footer:   'var(--lane-footer)',
        summary:  'var(--lane-summary)',
        gate:     'var(--lane-gate)'
    };
    var LANE_LABEL = {
        job_core: 'job_core · base record',
        phasic:   'phasic_system · phase mirror',
        footer:   'working memory · CLAUDE.md',
        summary:  'interaction summary',
        gate:     'a code-enforced gate'
    };

    /* ========================================================================
     * NODE INFO — the click-to-open detail for every box, keyed by node id.
     * Shape: { title, lane, what, why, hood (HTML ok), warn? }
     * ====================================================================== */
    var INFO  = window.DECK_INFO  || {};   /* content: job-life.cards.js */

    /* ========================================================================
     * CARDS — the 2x2 grid. Each card declares its diagram (boxes + edges +
     * stickies + guiding notes) in a small hand-laid coordinate space.
     * Coords are in a 1000 x 560 viewBox; the SVG scales to fit the stage.
     * ====================================================================== */
    var VB_W = 1000, VB_H = 560;

    /* The TYPE TAG taxonomy — each pill carries one so its KIND reads instantly.
       Grow this deliberately; never reuse a tag for a different idea. */
    var TAG_DEF = {
        state:   { sym:'◌', label:'State' },    /* the seed's condition (idle, focused…) */
        context: { sym:'✎', label:'Context' },  /* input the seed reads (a prompt) */
        object:  { sym:'▣', label:'Object' },   /* a data thing that now exists (the job/a field) */
        phase:   { sym:'◆', label:'Phase' },    /* an OPEVC phase (OBSERVE…) */
        action:  { sym:'⚡', label:'Action' },   /* something the system does */
        gate:    { sym:'✓', label:'Gate' }      /* a checked condition that must pass to advance */
    };

    var CARDS = window.DECK_CARDS || {};   /* content: job-life.cards.js */

    /* record-box field rows (the "born empty" reveal) */
    var RECORD_FIELDS =
        '<div class="dfields">' +
        '<div class="dfield"><b>name:</b> <span class="nul">"" (empty!)</span></div>' +
        '<div class="dfield"><b>objective:</b> <span class="nul">"" (empty!)</span></div>' +
        '<div class="dfield"><b>status:</b> active</div>' +
        '<div class="dfield"><b>focused:</b> true</div>' +
        '<div class="dfield"><b>user_interactions:</b></div>' +
        '<div class="dfield">&nbsp;&nbsp;[ your prompt ]</div>' +
        '<div class="dfield"><b>depends_on:</b> []</div>' +
        '</div>';

    /* navigation order: which cells exist + their sequence step */
    var EXISTS = {}; Object.keys(CARDS).forEach(function (k) { EXISTS[k] = 1; });  /* every defined card cell exists */
    /* total numbered steps in the main ←→ sequence (kind:'seq'); drives the
       step indicator + dots. Computed so adding sequence cards auto-scales. */
    var SEQ_TOTAL = Object.keys(CARDS).filter(function (k) { return CARDS[k].kind === 'seq'; }).length;

    /* ========================================================================
     * RENDER
     * ====================================================================== */
    var grid = document.getElementById('deck-grid');

    function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    function buildCard(key, card) {
        var col = +key.split(',')[0], row = +key.split(',')[1];
        var cell = document.createElement('div');
        cell.className = 'deck-cell';
        /* position each cell by its grid coords — inline so the deck supports
           any number of columns/rows (the CSS only hardcoded cols 0-1). */
        cell.style.left = (col * 100) + 'vw';
        cell.style.top  = (row * 100) + 'vh';
        cell.setAttribute('data-col', col);
        cell.setAttribute('data-row', row);
        cell.setAttribute('data-key', key);
        cell.setAttribute('role', 'group');
        cell.setAttribute('aria-label', card.title);

        var article = document.createElement('div');
        article.className = 'card';

        /* head */
        var head = document.createElement('div');
        head.className = 'card__head';
        head.innerHTML =
            '<div class="card__eyebrow ' + card.kind + '"><span class="card__eyebrow-dot"></span>' + esc(card.eyebrow) + '</div>' +
            '<h1 class="card__title">' + esc(card.title) + '</h1>' +
            '<p class="card__sub">' + esc(card.sub) + '</p>';
        article.appendChild(head);

        /* stage (svg diagram) */
        var stage = document.createElement('div');
        stage.className = 'card__stage';
        stage.innerHTML = (card.kind === 'routes') ? buildRoutes(card) : buildDiagram(card);
        article.appendChild(stage);

        /* sticky notes + guiding notes layered over the stage, positioned in viewBox % */
        (card.stickies || []).forEach(function (st, idx) {
            var s = document.createElement('div');
            s.className = 'sticky' + (st.r ? ' r' : '') + (st.aha ? ' sticky--aha' : '');
            /* draggable: restore a saved position if the reader moved this note before */
            var skey = stickyKey(key, idx), saved = stickyStore()[skey];
            var sx = saved ? saved.x : st.x, sy = saved ? saved.y : st.y;
            s.style.left = pctX(sx); s.style.top = pctY(sy);
            s.setAttribute('data-sticky-key', skey);
            s.setAttribute('data-default-x', st.x);
            s.setAttribute('data-default-y', st.y);
            s.title = 'Drag to move · double-click to reset';
            s.innerHTML = st.text;
            if (st.ref) {
                /* a footnote ref-chip linking this note to its blog source (matches the blog's ⓘ ref-markers) */
                var chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'refchip';
                chip.innerHTML = '&#9432;';
                chip.setAttribute('aria-label', 'Reference — ' + (st.ref.section || 'blog') + ' (opens the essay in a new tab)');
                chip.setAttribute('data-ref-url', st.ref.url);
                chip.setAttribute('data-ref-section', st.ref.section || '');
                chip.setAttribute('data-ref-blurb', st.ref.blurb || '');
                s.appendChild(chip);
            }
            stage.appendChild(s);
        });
        /* Direction pills removed (they crowded + misplaced). Navigation is the
           four edge arrows + their hover message; a card may still describe a
           specific direction via card.navHints (read by the nav-arrow hover). */

        cell.appendChild(article);
        grid.appendChild(cell);
    }

    /* viewBox coordinate → CSS % of the stage (stage uses preserveAspectRatio none-ish via 100% svg) */
    function pctX(x){ return (x / VB_W * 100) + '%'; }
    function pctY(y){ return (y / VB_H * 100) + '%'; }

    /* ---- per-deck identity + draggable-sticky persistence (localStorage) ---- */
    function pageId(){
        return (window.DECK_META && window.DECK_META.page) ||
               (location.pathname.split('/').pop() || '').replace(/\.html$/, '') || 'deck';
    }
    var STICKY_LS = 'deckStickyPos';
    function stickyStore(){ try { return JSON.parse(localStorage.getItem(STICKY_LS) || '{}'); } catch (e) { return {}; } }
    function stickyStoreSave(o){ try { localStorage.setItem(STICKY_LS, JSON.stringify(o)); } catch (e) {} }
    function stickyKey(cardKey, idx){ return pageId() + '|' + cardKey + '|' + idx; }

    /* generic field-row list for a box — lets a box show a concrete SHAPE
       (a growing list, an objective brief, a gate checklist) instead of generic
       words. Each item is a raw string ('—' = a separator) or {k,v,state} where
       state ∈ nul|ok|grow tints the value. */
    function fieldsSvg(fields){
        var rows = (fields || []).map(function (f) {
            if (typeof f === 'string') {
                if (f === '—' || f === '--') return '<div class="dfield dfield--sep"></div>';
                return '<div class="dfield">' + f + '</div>';
            }
            var cls = f.state ? (' dfield--' + f.state) : '';
            var k = f.k ? '<b>' + esc(f.k) + '</b> ' : '';
            return '<div class="dfield' + cls + '">' + k + esc(f.v != null ? f.v : '') + '</div>';
        }).join('');
        return '<div class="dfields">' + rows + '</div>';
    }

    /* ---- build one card's SVG (edges first, then boxes via foreignObject) ---- */
    function buildDiagram(card) {
        var defs = '<defs>' +
            '<marker id="ah" markerWidth="9" markerHeight="9" refX="7" refY="4.2" orient="auto">' +
            '<path d="M0,0 L8.4,4.2 L0,8.4 Z" fill="rgba(200,204,236,0.9)"/></marker>' +
            '<marker id="ahs" markerWidth="9" markerHeight="9" refX="7" refY="4.2" orient="auto">' +
            '<path d="M0,0 L8.4,4.2 L0,8.4 Z" fill="rgba(160,166,224,0.7)"/></marker>' +
            '</defs>';

        var boxIndex = {};
        (card.boxes || []).forEach(function (b) { boxIndex[b.id] = b; });

        /* edges: paths drawn UNDER the boxes; labels collected into a separate
           string drawn in a TOP layer (after the boxes) so a label is never
           hidden behind a box. Labels sit just above the connector line. */
        var edgeSvg = '', labelSvg = '';
        (card.edges || []).forEach(function (e) {
            var a = boxIndex[e.from], b = boxIndex[e.to];
            if (!a || !b) return;
            /* a LOOP edge: a small U routed BELOW both boxes (down from the source's
               bottom, across, up into the target's bottom) so it never overlaps the
               forward chain. Used to draw "↻ next cycle" cleanly. */
            if (e.loop) {
                var lfx = a.x + a.w / 2, lfy = a.y + a.h, ltx = b.x + b.w / 2, lty = b.y + b.h;
                var dip = Math.max(lfy, lty) + (e.dip || 38);
                var ld = 'M' + lfx + ',' + lfy + ' L' + lfx + ',' + dip + ' L' + ltx + ',' + dip + ' L' + ltx + ',' + lty;
                edgeSvg += '<path class="edge edge--loop" d="' + ld + '" marker-end="url(#ah)"/>';
                if (e.label) {
                    var llx = (lfx + ltx) / 2, lw2 = e.label.length * 6.4 + 16;
                    labelSvg += '<g transform="translate(' + llx + ',' + dip + ')">' +
                        '<rect class="edge-lbl-bg" x="' + (-lw2 / 2) + '" y="-11" width="' + lw2 + '" height="21" rx="8"/>' +
                        '<text class="edge-lbl" x="0" y="4.5" text-anchor="middle">' + esc(e.label) + '</text></g>';
                }
                return;
            }
            var p = anchorPair(a, b);
            var soft = e.kind === 'soft';
            var d = orthPath(p);
            edgeSvg += '<path class="edge ' + (soft ? 'edge--soft' : 'edge--hard') + '" d="' + d +
                       '" marker-end="url(#' + (soft ? 'ahs' : 'ah') + ')"/>';
            /* a transparent wide hit-area: hovering the arrow shows its meaning,
               so the annotation lives in the hover, not as static clutter. */
            if (e.label) {
                edgeSvg += '<path class="edge-hit" d="' + d + '" data-elabel="' + esc(e.label) + '"' +
                           (e.meaning ? ' data-emean="' + esc(e.meaning) + '"' : '') + '/>';
            }
            /* edge labels are OFF by default (they crowd + misplace); render a static
               one only where a fork genuinely needs disambiguating — keepLabel:true */
            if (e.label && e.keepLabel) {
                var mid = midOf(p);
                var lw = e.label.length * 7.0 + 18;
                var ly = (e.labelY != null) ? e.labelY : (mid.y - 14);
                labelSvg += '<g transform="translate(' + mid.x + ',' + ly + ')">' +
                    '<rect class="edge-lbl-bg" x="' + (-lw/2) + '" y="-12" width="' + lw + '" height="23" rx="8"/>' +
                    '<text class="edge-lbl" x="0" y="4.5" text-anchor="middle">' + esc(e.label) + '</text></g>';
            }
        });

        /* boxes as foreignObject glass cards */
        var boxSvg = '';
        (card.boxes || []).forEach(function (b) {
            /* a MINI node: a small tag-coloured chip showing just b.t (e.g. a phase
               letter O/P/E/V/C), no tag-chip/subtitle. Optional native title tooltip. */
            if (b.mini) {
                var miniInner = '<div class="dnode' + (b.tag ? ' dnode--' + b.tag : '') + '"' +
                    (b.title ? ' title="' + esc(b.title) + '"' : '') + '>' + esc(b.t) + '</div>';
                boxSvg += '<foreignObject x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h + '">' +
                          '<div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%">' + miniInner + '</div></foreignObject>';
                return;
            }
            var laneClass = b.tag ? ('dbox--tag-' + b.tag) : ('dbox--lane-' + b.lane);
            var td = b.tag && TAG_DEF[b.tag];
            var tagChip = td ? ('<span class="dbox__tag tag--' + b.tag + '"><span class="sym">' +
                td.sym + '</span>' + td.label + '</span>') : '';
            var inner =
                '<div class="dbox ' + laneClass + (b.record ? ' dbox--record' : '') + '" ' +
                     'tabindex="0" role="button" data-node="' + b.id + '" ' +
                     'aria-label="' + esc((INFO[b.id] && INFO[b.id].title) || b.t) + ' — open detail">' +
                    (b.warn ? '<span class="dbox__warn" aria-hidden="true">&#9888;</span>' : '') +
                    tagChip +
                    '<div class="dbox__t">' + esc(b.t) + '</div>' +
                    (b.s ? '<div class="dbox__s">' + esc(b.s) + '</div>' : '') +
                    (b.fields ? fieldsSvg(b.fields) : (b.record ? RECORD_FIELDS : '')) +
                '</div>';
            boxSvg += '<foreignObject x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h + '">' +
                      '<div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%">' + inner + '</div></foreignObject>';
        });

        return '<svg class="diagram" viewBox="0 0 ' + VB_W + ' ' + VB_H + '" preserveAspectRatio="xMidYMid meet" aria-hidden="false">' +
               defs + edgeSvg + boxSvg + labelSvg + '</svg>';
    }

    /* choose connection points on the box edges based on relative position */
    function anchorPair(a, b) {
        var ac = { x: a.x + a.w/2, y: a.y + a.h/2 };
        var bc = { x: b.x + b.w/2, y: b.y + b.h/2 };
        var dx = bc.x - ac.x, dy = bc.y - ac.y;
        var from, to;
        if (Math.abs(dx) >= Math.abs(dy)) {
            // horizontal dominant
            if (dx >= 0) { from = { x: a.x + a.w, y: ac.y }; to = { x: b.x, y: bc.y }; }
            else         { from = { x: a.x, y: ac.y };       to = { x: b.x + b.w, y: bc.y }; }
        } else {
            if (dy >= 0) { from = { x: ac.x, y: a.y + a.h }; to = { x: bc.x, y: b.y }; }
            else         { from = { x: ac.x, y: a.y };       to = { x: bc.x, y: b.y + b.h }; }
        }
        return { from: from, to: to, horiz: Math.abs(dx) >= Math.abs(dy) };
    }

    /* orthogonal-ish path with a gentle elbow so labels sit clean and lines never cross boxes */
    function orthPath(p) {
        var f = p.from, t = p.to;
        if (p.horiz) {
            var mx = (f.x + t.x) / 2;
            return 'M' + f.x + ',' + f.y + ' L' + mx + ',' + f.y + ' L' + mx + ',' + t.y + ' L' + t.x + ',' + t.y;
        } else {
            var my = (f.y + t.y) / 2;
            return 'M' + f.x + ',' + f.y + ' L' + f.x + ',' + my + ' L' + t.x + ',' + my + ' L' + t.x + ',' + t.y;
        }
    }
    function midOf(p) {
        if (p.horiz) return { x: (p.from.x + p.to.x) / 2, y: p.from.y };
        return { x: p.to.x, y: (p.from.y + p.to.y) / 2 };
    }

    /* ---- build a 'routes' card: a tabbed comparison rendered as HTML, not SVG.
       Used for the "where jobs come from" card — N route panels + a comparison
       table, switched by a tab bar. Content lives in card.routes[] + card.compare. */
    function buildRoutes(card) {
        var tabs = '', panels = '';
        /* each creation path is its OWN mini-diagram (boxes + edges), shown by a
           tab; the prose for each box lives in its click tooltip, like every other
           card. The FINAL tab is the at-a-glance comparison table. */
        (card.routes || []).forEach(function (rt, i) {
            var on = i === 0 ? ' is-active' : '';
            tabs += '<button class="routes-tab' + on + '" role="tab" data-rt="' + esc(rt.key) + '">' +
                    esc(rt.key) + ' &middot; ' + esc(rt.name) + '</button>';
            panels += '<div class="routes-panel routes-panel--diagram' + on + '" data-rp="' + esc(rt.key) + '">' +
                      buildDiagram(rt) + routeStickies(rt) + '</div>';
        });
        tabs += '<button class="routes-tab" role="tab" data-rt="compare">&#9638; Compare all</button>';
        panels += '<div class="routes-panel routes-panel--table" data-rp="compare">' + compareTable(card.compare) + '</div>';
        return '<div class="routecard">' +
               '<div class="routes-tabs" role="tablist">' + tabs + '</div>' +
               '<div class="routes-panels">' + panels + '</div></div>';
    }
    /* static (non-draggable) notes layered over a route's mini-diagram, in viewBox % */
    function routeStickies(rt) {
        return (rt.stickies || []).map(function (st) {
            return '<div class="sticky sticky--static' + (st.r ? ' r' : '') + (st.aha ? ' sticky--aha' : '') +
                   '" style="left:' + pctX(st.x) + ';top:' + pctY(st.y) + '">' + st.text + '</div>';
        }).join('');
    }
    function compareTable(cmp) {
        if (!cmp) return '';
        var head = '<tr>' + cmp.cols.map(function (c, i) {
            return '<th' + (i === 0 ? ' class="rt-rowhead"' : '') + ' scope="col">' + esc(c) + '</th>';
        }).join('') + '</tr>';
        var body = (cmp.rows || []).map(function (r) {
            return '<tr><th class="rt-rowhead" scope="row">' + esc(r.label) + '</th>' +
                   r.cells.map(function (cell) {
                       var c = (typeof cell === 'object') ? cell : { v: cell };
                       return '<td' + (c.warn ? ' class="rt-warn"' : '') + '>' +
                              (c.warn ? '<span class="rt-warn-dot" title="code-vs-blog-vs-CONTEXT divergence">&#9888;</span> ' : '') +
                              (c.code ? '<code>' + esc(c.v) + '</code>' : esc(c.v)) + '</td>';
                   }).join('') + '</tr>';
        }).join('');
        return '<div class="routes-tablewrap"><table class="routes-table">' +
               '<thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>' +
               (cmp.note ? '<p class="routes-note">' + cmp.note + '</p>' : '');
    }
    /* routes tab switching (delegated — panels swap within their own card) */
    document.addEventListener('click', function (e) {
        var tab = e.target.closest && e.target.closest('.routes-tab');
        if (!tab) return;
        var wrap = tab.closest('.routecard'); if (!wrap) return;
        var key = tab.getAttribute('data-rt');
        wrap.querySelectorAll('.routes-tab').forEach(function (t) { t.classList.toggle('is-active', t === tab); });
        wrap.querySelectorAll('.routes-panel').forEach(function (p) {
            p.classList.toggle('is-active', p.getAttribute('data-rp') === key);
        });
    });

    /* build all cards */
    Object.keys(CARDS).forEach(function (k) { buildCard(k, CARDS[k]); });

    /* size the deck-grid to span every column/row that exists (the CSS default
       of 200vw×200vh only fit a 2x2 deck). */
    (function sizeDeck(){
        var maxC = 0, maxR = 0;
        Object.keys(EXISTS).forEach(function (k) {
            var c = +k.split(',')[0], r = +k.split(',')[1];
            if (c > maxC) maxC = c; if (r > maxR) maxR = r;
        });
        grid.style.width  = ((maxC + 1) * 100) + 'vw';
        grid.style.height = ((maxR + 1) * 100) + 'vh';
    })();

    /* ========================================================================
     * CUBE RIG — wrap the deck-grid in a 3D scene so card-to-card navigation
     * reads as a translucent cube rotating / zooming back. The grid + its cards
     * are untouched (they ride inside the viewport face); only the wrapper turns.
     * ====================================================================== */
    var REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    (function buildCubeRig() {
        var root = document.querySelector('.deck-root');
        if (!root || !grid || REDUCE) return;   /* reduced-motion → plain translate, no rig */
        var stage = document.createElement('div');
        stage.className = 'cube-stage'; stage.id = 'cube-stage';
        var vp = document.createElement('div');
        vp.className = 'deck-viewport'; vp.id = 'deck-viewport';
        root.insertBefore(stage, grid);   /* stage takes the grid's slot */

        /* glass cube body — sits BEHIND the front face so its sides are revealed
           only as the cube turns */
        var shell = document.createElement('div');
        shell.className = 'cube-shell';
        ['back', 'right', 'left', 'top', 'bottom'].forEach(function (side) {
            var f = document.createElement('div');
            f.className = 'cube-face cube-face--' + side;
            shell.appendChild(f);
        });
        stage.appendChild(shell);

        stage.appendChild(vp);
        vp.appendChild(grid);             /* grid now rides inside the front face */

        /* lit glass frame on the front face — the cube's leading glow edge */
        var frame = document.createElement('div');
        frame.className = 'cube-frame';
        stage.appendChild(frame);

        /* hover-lit clickable cube sides ("click on the sides") — screen-fixed so
           a click lands regardless of the cube's turn; enabled state mirrors arrows */
        [['left', -1, 0], ['right', 1, 0], ['up', 0, -1], ['down', 0, 1]].forEach(function (s) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'cube-edge cube-edge--' + s[0];
            b.id = 'cube-edge-' + s[0];
            b.setAttribute('aria-hidden', 'true');
            b.tabIndex = -1;
            b.setAttribute('data-dc', s[1]);
            b.setAttribute('data-dr', s[2]);
            root.appendChild(b);
        });

        root.classList.add('cube-on');    /* grid slide off — the cube turn is the motion */
    })();

    /* ========================================================================
     * NAVIGATION STATE
     * ====================================================================== */
    var curCol = 0, curRow = 0;
    var animating = false;

    function keyOf(c, r){ return c + ',' + r; }
    function cellExists(c, r){ return !!EXISTS[keyOf(c, r)]; }

    /* Animate the cube between cards: rotate away + pull back, swap the grid while
       it's turned out of view, then swing the new face in from the opposite side
       and settle it forward. Direction picks the axis (L/R = Y, U/D = X). */
    function cubeNav(dc, dr, done) {
        var stage = document.getElementById('cube-stage');
        if (!stage || REDUCE) { applyTransform(); done(); return; }
        var axis = (dc !== 0) ? 'Y' : 'X';
        var outSign;
        if (dc > 0)      outSign = -1;   /* go right  → cube turns left  */
        else if (dc < 0) outSign =  1;   /* go left   → cube turns right */
        else if (dr > 0) outSign = -1;   /* go down   → cube rolls up    */
        else             outSign =  1;   /* go up     → cube rolls down  */
        var ANG = 42, Z = 340, OUT = 240, IN = 330;
        stage.style.transition = 'transform ' + (OUT / 1000) + 's cubic-bezier(.45,.05,.55,.95)';
        stage.style.transform  = 'translateZ(-' + Z + 'px) rotate' + axis + '(' + (outSign * ANG) + 'deg)';
        setTimeout(function () {
            applyTransform();                       /* swap card while turned away */
            stage.style.transition = 'none';
            stage.style.transform  = 'translateZ(-' + Z + 'px) rotate' + axis + '(' + (-outSign * ANG) + 'deg)';
            void stage.offsetWidth;                 /* force reflow before settling */
            stage.style.transition = 'transform ' + (IN / 1000) + 's cubic-bezier(.2,.7,.25,1)';
            stage.style.transform  = 'translateZ(0) rotate' + axis + '(0deg)';
            setTimeout(function () {
                stage.style.transition = ''; stage.style.transform = '';
                done();
            }, IN + 20);
        }, OUT + 10);
    }

    function applyTransform() {
        var grid = document.getElementById('deck-grid');
        grid.style.transform = 'translate(' + (-curCol * 100) + 'vw, ' + (-curRow * 100) + 'vh)';
    }

    function updateChrome() {
        /* nav arrows */
        setArrow('nav-left',  cellExists(curCol-1, curRow), neighborHint(curCol-1, curRow, 'left'));
        setArrow('nav-right', cellExists(curCol+1, curRow), neighborHint(curCol+1, curRow, 'right'));
        setArrow('nav-up',    cellExists(curCol, curRow-1), neighborHint(curCol, curRow-1, 'up'));
        setArrow('nav-down',  cellExists(curCol, curRow+1), neighborHint(curCol, curRow+1, 'down'));

        /* hover-lit cube sides mirror the arrows' reachability */
        setEdge('left',  cellExists(curCol-1, curRow));
        setEdge('right', cellExists(curCol+1, curRow));
        setEdge('up',    cellExists(curCol, curRow-1));
        setEdge('down',  cellExists(curCol, curRow+1));

        /* minimap */
        Array.prototype.forEach.call(document.querySelectorAll('.mm-cell'), function (el) {
            el.classList.toggle('is-current', el.getAttribute('data-key') === keyOf(curCol, curRow));
        });

        /* step indicator */
        var step = document.getElementById('step-ind');
        var card = CARDS[keyOf(curCol, curRow)];
        if (card.kind === 'seq') {
            step.classList.remove('is-detail');
            var dots = '';
            for (var i = 1; i <= SEQ_TOTAL; i++) {
                dots += '<span class="step-ind__dot' + (card.step === i ? ' on' : '') + '"></span>';
            }
            var _seqLabel = (window.DECK_META && window.DECK_META.seqLabel) ? ' — ' + window.DECK_META.seqLabel : '';
            step.innerHTML =
                '<span>Step <b>' + card.step + '</b> of <b>' + SEQ_TOTAL + '</b>' + _seqLabel + '</span>' +
                '<span class="step-ind__dots">' + dots + '</span>';
        } else if (card.kind === 'capstone') {
            step.classList.add('is-detail');
            var _capLabel = (window.DECK_META && window.DECK_META.capstoneLabel) || 'The big picture';
            step.innerHTML = '<span>&#9733; ' + _capLabel + '</span>';
        } else {
            step.classList.add('is-detail');
            step.innerHTML = '<span>Related detail &mdash; press <b>&uarr;</b> to return to the main sequence</span>';
        }

        /* focus the active card region for screen readers */
    }

    function neighborHint(c, r, dir) {
        var k = keyOf(c, r);
        if (!EXISTS[k]) return '';
        /* a card can describe its own directions (e.g. down = "see other places
           jobs are created") via navHints — those win over the generic title. */
        var cur = CARDS[keyOf(curCol, curRow)];
        if (cur && cur.navHints && cur.navHints[dir]) return cur.navHints[dir];
        var card = CARDS[k];
        var prefix = '';
        if (dir === 'right' && card.kind === 'seq') prefix = 'next: ';
        else if (dir === 'left' && card.kind === 'seq') prefix = 'back: ';
        else if (dir === 'down') prefix = 'detail: ';
        else if (dir === 'up') prefix = 'up: ';
        return prefix + card.title;
    }

    function setArrow(id, enabled, hint) {
        var el = document.getElementById(id);
        el.classList.toggle('is-disabled', !enabled);
        el.querySelector('.nav-arrow__hint').textContent = hint || '';
        var labelDir = { 'nav-left':'left', 'nav-right':'right', 'nav-up':'up', 'nav-down':'down' }[id];
        el.setAttribute('aria-label', enabled ? ('Go ' + labelDir + ' to ' + (hint||'').replace(/^.*?: /,'')) : ('No card to the ' + labelDir));
    }

    function setEdge(dir, enabled) {
        var el = document.getElementById('cube-edge-' + dir);
        if (el) el.classList.toggle('is-disabled', !enabled);
    }

    function go(c, r) {
        if (!cellExists(c, r) || animating) return;
        var dc = c - curCol, dr = r - curRow;
        curCol = c; curRow = r;
        updateChrome();
        closeInfo();
        if (dc === 0 && dr === 0) { applyTransform(); return; }
        animating = true;
        cubeNav(dc, dr, function () { animating = false; });
    }
    function move(dc, dr) { go(curCol + dc, curRow + dr); }

    /* ========================================================================
     * MINIMAP build
     * ====================================================================== */
    (function buildMinimap() {
        var mg = document.getElementById('minimap-grid');
        if (!mg) return;   /* minimap removed from the shell — navigation is the arrows */
        mg.innerHTML = '';
        /* compute the real grid extent so the map mirrors the deck spatially */
        var maxCol = 0, maxRow = 0;
        Object.keys(EXISTS).forEach(function (k) {
            var p = k.split(','); maxCol = Math.max(maxCol, +p[0]); maxRow = Math.max(maxRow, +p[1]);
        });
        mg.style.gridTemplateColumns = 'repeat(' + (maxCol + 1) + ', 1fr)';
        for (var r = 0; r <= maxRow; r++) {
            for (var c = 0; c <= maxCol; c++) {
                var k = c + ',' + r;
                if (!EXISTS[k]) {
                    var spacer = document.createElement('div');
                    spacer.className = 'mm-cell mm-cell--empty';
                    spacer.setAttribute('aria-hidden', 'true');
                    mg.appendChild(spacer);
                    continue;
                }
                var card = CARDS[k];
                var kind = card.kind === 'seq' ? 'is-seq' : (card.kind === 'capstone' ? 'is-capstone' : 'is-detail');
                var token = card.kind === 'seq' ? String(card.step) : (card.kind === 'capstone' ? '★' : '•');
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'mm-cell ' + kind;
                b.setAttribute('data-key', k);
                b.innerHTML = token;
                b.setAttribute('aria-label', 'Jump to: ' + card.title);
                b.title = card.title;
                b.addEventListener('click', (function (key) {
                    return function () { var p = key.split(','); go(+p[0], +p[1]); };
                })(k));
                mg.appendChild(b);
            }
        }
    })();

    /* ========================================================================
     * INFO PANEL
     * ====================================================================== */
    var panel = document.getElementById('info-panel');
    var panelContent = document.getElementById('info-content');
    var lastFocused = null;

    function openInfo(nodeId) {
        var d = INFO[nodeId];
        if (!d) return;
        lastFocused = document.activeElement;
        var TAG_COLOR = { state:'#6b7fb8', context:'#d9a948', object:'#6366f1', phase:'#8b5cf6', action:'#38bdf8', gate:'#34d399' };
        var isTag = d.tag && TAG_DEF[d.tag];
        var dotColor = isTag ? TAG_COLOR[d.tag] : (LANE_COLOR[d.lane] || 'var(--lane-job_core)');
        var dotLabel = isTag ? (TAG_DEF[d.tag].sym + ' ' + TAG_DEF[d.tag].label) : (LANE_LABEL[d.lane] || d.lane);
        var html =
            '<div class="info-kind">Concept</div>' +
            '<h2>' + esc(d.title) + '</h2>' +
            '<div class="info-lane-tag"><span class="info-lane-dot" style="background:' + dotColor + '"></span>' + esc(dotLabel) + '</div>' +
            '<div class="info-field"><div class="info-field-label">What it is</div><div class="info-field-body">' + d.what + '</div></div>' +
            '<div class="info-field"><div class="info-field-label">Why it matters</div><div class="info-field-body">' + d.why + '</div></div>' +
            '<div class="info-hood"><div class="info-hood-label">Under the hood</div><div class="info-hood-body">' + d.hood + '</div></div>' +
            (d.warn ? '<div class="info-warn"><div class="info-warn-label">Blog vs code</div><div class="info-warn-body">' + d.warn + '</div></div>' : '');
        panelContent.innerHTML = html;
        panel.classList.add('open');
        hideTooltip();
        var close = document.getElementById('info-close');
        close.focus();
    }
    function closeInfo() {
        if (!panel.classList.contains('open')) return;
        panel.classList.remove('open');
        if (lastFocused && document.contains(lastFocused)) { try { lastFocused.focus(); } catch(e){} }
        lastFocused = null;
    }
    document.getElementById('info-close').addEventListener('click', closeInfo);

    /* focus trap inside the info panel */
    panel.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.stopPropagation(); closeInfo(); return; }
        if (e.key !== 'Tab') return;
        var focusables = panel.querySelectorAll('button, [href], a');
        if (!focusables.length) return;
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* ========================================================================
     * TOOLTIP (hover)
     * ====================================================================== */
    var tt = document.getElementById('tooltip');
    var ttT = document.getElementById('tooltip-t'), ttW = document.getElementById('tooltip-w'), ttWarn = document.getElementById('tooltip-warn');

    function showTooltip(nodeId, ev) {
        var d = INFO[nodeId];
        if (!d) return;
        ttT.textContent = d.title;
        /* short one-line plain summary = first sentence of "what" */
        var oneLine = (d.what || '').split('. ')[0];
        if (oneLine && oneLine.slice(-1) !== '.') oneLine += '.';
        ttW.textContent = oneLine;
        ttWarn.style.display = d.warn ? 'block' : 'none';
        tt.classList.add('is-on'); tt.setAttribute('aria-hidden', 'false');
        positionTooltip(ev);
    }
    function positionTooltip(ev) {
        var pad = 14, w = tt.offsetWidth, h = tt.offsetHeight;
        var x = ev.clientX + 16, y = ev.clientY + 16;
        if (x + w + pad > window.innerWidth)  x = ev.clientX - w - 16;
        if (y + h + pad > window.innerHeight) y = ev.clientY - h - 16;
        tt.style.left = Math.max(pad, x) + 'px';
        tt.style.top  = Math.max(pad, y) + 'px';
    }
    function hideTooltip() { tt.classList.remove('is-on'); tt.setAttribute('aria-hidden', 'true'); }

    /* ========================================================================
     * EVENT DELEGATION on boxes
     * ====================================================================== */
    grid.addEventListener('click', function (e) {
        var box = e.target.closest('[data-node]');
        if (!box) return;
        openInfo(box.getAttribute('data-node'));
    });
    grid.addEventListener('keydown', function (e) {
        var box = e.target.closest('[data-node]');
        if (!box) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInfo(box.getAttribute('data-node')); }
    });
    grid.addEventListener('mouseover', function (e) {
        var box = e.target.closest('[data-node]');
        if (!box) return;
        showTooltip(box.getAttribute('data-node'), e);
    });
    grid.addEventListener('mousemove', function (e) {
        if (tt.classList.contains('is-on') && e.target.closest('[data-node]')) positionTooltip(e);
    });
    grid.addEventListener('mouseout', function (e) {
        var box = e.target.closest('[data-node]');
        if (box && !box.contains(e.relatedTarget)) hideTooltip();
    });
    grid.addEventListener('focusin', function (e) {
        var box = e.target.closest('[data-node]');
        if (!box) return;
        var rect = box.getBoundingClientRect();
        showTooltip(box.getAttribute('data-node'), { clientX: rect.left + rect.width/2, clientY: rect.bottom });
    });
    grid.addEventListener('focusout', function (e) {
        var box = e.target.closest('[data-node]');
        if (box) hideTooltip();
    });

    /* ========================================================================
     * REF-SYMBOL chips — hover shows a preview of the blog section; click opens it
     * ====================================================================== */
    var reftip = document.createElement('div');
    reftip.className = 'reftip'; reftip.setAttribute('role', 'tooltip');
    reftip.innerHTML = '<div class="reftip__sec"></div><div class="reftip__blurb"></div>' +
        '<a class="reftip__go" target="_blank" rel="noopener">↗ Open the essay</a>';
    document.body.appendChild(reftip);
    var reftipSec  = reftip.querySelector('.reftip__sec'),
        reftipBlurb = reftip.querySelector('.reftip__blurb'),
        reftipLink  = reftip.querySelector('.reftip__go');
    var reftipHideT = null;
    function refCancelHide() { if (reftipHideT) { clearTimeout(reftipHideT); reftipHideT = null; } }
    function refScheduleHide() { refCancelHide(); reftipHideT = setTimeout(function () { reftip.classList.remove('is-on'); }, 340); }
    function showReftip(chip) {
        refCancelHide();
        var url = chip.getAttribute('data-ref-url') || '#';
        reftipSec.textContent  = chip.getAttribute('data-ref-section') || 'Reference';
        reftipBlurb.textContent = chip.getAttribute('data-ref-blurb') || '';
        reftipLink.setAttribute('href', url);
        reftip.classList.add('is-on');
        /* anchor the popover to the CHIP (not the cursor) so the pointer can travel INTO it */
        var pad = 12, r = chip.getBoundingClientRect(), w = reftip.offsetWidth, h = reftip.offsetHeight;
        var x = r.left - 6, y = r.bottom + 8;
        if (x + w + pad > window.innerWidth)  x = window.innerWidth - w - pad;
        if (y + h + pad > window.innerHeight) y = r.top - h - 8;   /* flip above if no room below */
        reftip.style.left = Math.max(pad, x) + 'px';
        reftip.style.top  = Math.max(pad, y) + 'px';
    }
    function chipOf(e) { return e.target.closest ? e.target.closest('.refchip') : null; }
    document.addEventListener('mouseover', function (e) { var c = chipOf(e); if (c) showReftip(c); });
    document.addEventListener('mouseout',  function (e) { if (chipOf(e)) refScheduleHide(); });
    document.addEventListener('click',     function (e) { var c = chipOf(e); if (c) { e.preventDefault(); e.stopPropagation(); var u = c.getAttribute('data-ref-url'); if (u) window.open(u, '_blank', 'noopener'); } });
    document.addEventListener('focusin',   function (e) { var c = chipOf(e); if (c) showReftip(c); });
    document.addEventListener('focusout',  function (e) { if (chipOf(e)) refScheduleHide(); });
    /* the popover itself is reachable + clickable — keep it open while hovered/focused */
    reftip.addEventListener('mouseenter', refCancelHide);
    reftip.addEventListener('mouseleave', refScheduleHide);
    reftip.addEventListener('focusin',  refCancelHide);
    reftip.addEventListener('focusout', refScheduleHide);

    /* ========================================================================
     * EDGE HOVER — each arrow describes itself on hover (annotation lives in the
     * hover, not as static text). Driven by the transparent .edge-hit paths.
     * ====================================================================== */
    var edgetip = document.createElement('div');
    edgetip.className = 'edgetip'; edgetip.setAttribute('role', 'tooltip');
    document.body.appendChild(edgetip);
    function posEdgetip(ev) {
        var pad = 12, w = edgetip.offsetWidth, h = edgetip.offsetHeight;
        var x = ev.clientX + 14, y = ev.clientY + 14;
        if (x + w + pad > window.innerWidth)  x = ev.clientX - w - 14;
        if (y + h + pad > window.innerHeight) y = ev.clientY - h - 14;
        edgetip.style.left = Math.max(pad, x) + 'px';
        edgetip.style.top  = Math.max(pad, y) + 'px';
    }
    function showEdgetip(hit, ev) {
        var lab = hit.getAttribute('data-elabel') || '', mean = hit.getAttribute('data-emean') || '';
        edgetip.innerHTML = '<b>' + esc(lab) + '</b>' + (mean ? '<br>' + esc(mean) : '');
        edgetip.classList.add('is-on'); posEdgetip(ev);
    }
    grid.addEventListener('mouseover', function (e) { var h = e.target.closest && e.target.closest('.edge-hit'); if (h) showEdgetip(h, e); });
    grid.addEventListener('mousemove', function (e) { if (edgetip.classList.contains('is-on') && e.target.closest('.edge-hit')) posEdgetip(e); });
    grid.addEventListener('mouseout',  function (e) { if (e.target.closest && e.target.closest('.edge-hit')) edgetip.classList.remove('is-on'); });

    /* ========================================================================
     * DRAGGABLE STICKY NOTES — the reader can reposition any note; the new
     * spot persists per deck+card+index in localStorage. Double-click resets.
     * ====================================================================== */
    (function stickyDrag() {
        var drag = null;
        function clamp(v, lo, hi){ return v < lo ? lo : (v > hi ? hi : v); }
        grid.addEventListener('pointerdown', function (e) {
            var s = e.target.closest && e.target.closest('.sticky');
            if (!s) return;
            if (e.target.closest('.refchip')) return;        /* let ref-chip clicks through */
            e.preventDefault();
            var stage = s.parentNode, rect = stage.getBoundingClientRect();
            drag = { s: s, rect: rect, startX: e.clientX, startY: e.clientY,
                     origL: parseFloat(s.style.left), origT: parseFloat(s.style.top), moved: false };
            s.classList.add('is-dragging');
            try { s.setPointerCapture(e.pointerId); } catch (err) {}
        });
        grid.addEventListener('pointermove', function (e) {
            if (!drag) return;
            if (Math.abs(e.clientX - drag.startX) + Math.abs(e.clientY - drag.startY) > 3) drag.moved = true;
            var dxp = (e.clientX - drag.startX) / drag.rect.width  * 100;
            var dyp = (e.clientY - drag.startY) / drag.rect.height * 100;
            drag.s.style.left = clamp(drag.origL + dxp, -3, 95) + '%';
            drag.s.style.top  = clamp(drag.origT + dyp, -3, 95) + '%';
        });
        function endDrag() {
            if (!drag) return;
            drag.s.classList.remove('is-dragging');
            if (drag.moved) {
                var store = stickyStore();
                store[drag.s.getAttribute('data-sticky-key')] = {
                    x: parseFloat(drag.s.style.left) / 100 * VB_W,
                    y: parseFloat(drag.s.style.top)  / 100 * VB_H
                };
                stickyStoreSave(store);
            }
            drag = null;
        }
        grid.addEventListener('pointerup', endDrag);
        grid.addEventListener('pointercancel', endDrag);
        grid.addEventListener('dblclick', function (e) {
            var s = e.target.closest && e.target.closest('.sticky');
            if (!s || e.target.closest('.refchip')) return;
            s.style.left = pctX(+s.getAttribute('data-default-x'));
            s.style.top  = pctY(+s.getAttribute('data-default-y'));
            var store = stickyStore(); delete store[s.getAttribute('data-sticky-key')]; stickyStoreSave(store);
        });
        /* one-time discoverability hint */
        try {
            if (localStorage.getItem('deckStickyHintSeen') !== '1') {
                var hint = document.createElement('div');
                hint.textContent = '✎ Tip: drag the sticky notes to rearrange them — double-click to reset.';
                hint.style.cssText = 'position:fixed;left:50%;bottom:1.3rem;transform:translateX(-50%);z-index:2300;' +
                    'background:rgba(20,20,30,0.96);color:#efeaff;padding:0.5rem 0.9rem;border-radius:9px;' +
                    'border:1px solid rgba(139,92,246,0.45);font-size:0.8rem;box-shadow:0 8px 22px rgba(0,0,0,0.5);' +
                    'transition:opacity .4s;';
                document.body.appendChild(hint);
                setTimeout(function(){ hint.style.opacity = '0'; }, 5200);
                setTimeout(function(){ hint.remove(); }, 5800);
                localStorage.setItem('deckStickyHintSeen', '1');
            }
        } catch (e) {}
    })();

    /* ========================================================================
     * NAV ARROW buttons
     * ====================================================================== */
    document.getElementById('nav-left').addEventListener('click', function () { move(-1, 0); });
    document.getElementById('nav-right').addEventListener('click', function () { move(1, 0); });
    document.getElementById('nav-up').addEventListener('click', function () { move(0, -1); });
    document.getElementById('nav-down').addEventListener('click', function () { move(0, 1); });

    /* hover-lit cube-side buttons (created by the cube rig; absent in reduced-motion) */
    Array.prototype.forEach.call(document.querySelectorAll('.cube-edge'), function (b) {
        b.addEventListener('click', function () {
            move(parseInt(b.getAttribute('data-dc'), 10), parseInt(b.getAttribute('data-dr'), 10));
        });
    });

    /* ========================================================================
     * KEYBOARD
     * ====================================================================== */
    document.addEventListener('keydown', function (e) {
        var orientOpen = document.getElementById('orient').classList.contains('is-open');
        if (orientOpen) {
            if (e.key === 'Escape') closeOrient();
            return;
        }
        if (panel.classList.contains('open')) {
            /* panel traps its own keys; let Escape there handle close */
            return;
        }
        switch (e.key) {
            case 'ArrowLeft':  e.preventDefault(); move(-1, 0); break;
            case 'ArrowRight': e.preventDefault(); move(1, 0); break;
            case 'ArrowUp':    e.preventDefault(); move(0, -1); break;
            case 'ArrowDown':  e.preventDefault(); move(0, 1); break;
            case 'Escape':     closeInfo(); break;
            case '?':          openOrient(); break;
        }
    });

    /* ========================================================================
     * LEGEND collapse
     * ====================================================================== */
    var legend = document.getElementById('legend');
    document.getElementById('legend-head').addEventListener('click', function () {
        var collapsed = legend.classList.toggle('is-collapsed');
        this.setAttribute('aria-expanded', String(!collapsed));
    });

    /* ========================================================================
     * ORIENTATION overlay
     * ====================================================================== */
    var orient = document.getElementById('orient');
    var orientLastFocus = null;
    function openOrient() {
        orientLastFocus = document.activeElement;
        orient.classList.add('is-open');
        document.getElementById('orient-go').focus();
    }
    function closeOrient() {
        orient.classList.remove('is-open');
        if (orientLastFocus && document.contains(orientLastFocus)) { try { orientLastFocus.focus(); } catch(e){} }
    }
    document.getElementById('orient-go').addEventListener('click', closeOrient);
    document.getElementById('help-btn').addEventListener('click', openOrient);
    orient.addEventListener('click', function (e) { if (e.target === orient) closeOrient(); });
    orient.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab') return;
        var f = orient.querySelectorAll('button');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* ========================================================================
     * INIT
     * ====================================================================== */
    applyTransform();
    updateChrome();

    /* show orientation on first load (once per browser PER DECK via localStorage; safe-guarded) */
    var orientKey = pageId() + ':orientSeen';
    var seen = false;
    try { seen = localStorage.getItem(orientKey) === '1'; } catch (e) {}
    if (!seen) {
        openOrient();
        try { localStorage.setItem(orientKey, '1'); } catch (e) {}
    }

    /* ========================================================================
     * PUBLIC COMMENTS — a Giscus thread per deck page (same repo + category as
     * the blog essays). Shown to EVERYONE (not localhost-gated). A docked
     * "Discuss" button opens an overlay; the Giscus iframe lazy-loads on first
     * open and maps by pathname, so each deck gets its own discussion.
     * ====================================================================== */
    (function publicComments() {
        var gcss = `
        .discuss-btn { position: fixed; left: 1.5rem; bottom: 3.5rem; z-index: 2200;
            display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.9rem;
            border-radius: 999px; background: rgba(5,5,7,0.62); border: 1px solid var(--border);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            color: var(--text-muted); font-size: 0.8rem; cursor: pointer; transition: color .2s, border-color .2s; }
        .discuss-btn:hover, .discuss-btn:focus-visible { color: var(--text-main); border-color: var(--primary); outline: none; }
        .discuss-ov { position: fixed; inset: 0; z-index: 5000; display: none;
            align-items: center; justify-content: center; background: rgba(3,3,6,0.72);
            backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); padding: 2.2rem 1rem; }
        .discuss-ov.is-open { display: flex; }
        .discuss-card { width: 760px; max-width: 96vw; max-height: 86vh; display: flex; flex-direction: column;
            background: rgba(12,12,20,0.985); border: 1px solid rgba(139,92,246,0.35);
            border-radius: 16px; box-shadow: 0 24px 60px rgba(0,0,0,0.6); overflow: hidden; }
        .discuss-card__head { display: flex; justify-content: space-between; align-items: center;
            padding: 1rem 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .discuss-card__title { font-size: 1rem; font-weight: 700; color: #f1eeff; }
        .discuss-card__sub { font-size: 0.7rem; color: #8a8a9c; margin-top: 0.15rem; }
        .discuss-card__close { background: none; border: none; color: #b6b6c8; font-size: 1.5rem; line-height: 1; cursor: pointer; }
        .discuss-card__body { padding: 0.6rem 1.1rem 1.1rem; overflow-y: auto; }
        .discuss-card__body .gc-loading { color: #8a8a9c; font-size: 0.85rem; text-align: center; padding: 1.4rem; }`;
        var gst = document.createElement('style'); gst.textContent = gcss; document.head.appendChild(gst);

        var dbtn = document.createElement('button');
        dbtn.className = 'discuss-btn'; dbtn.type = 'button';
        dbtn.setAttribute('aria-label', 'Open public discussion for this diagram');
        dbtn.innerHTML = '💬 Discuss';
        document.body.appendChild(dbtn);

        var ov = document.createElement('div');
        ov.className = 'discuss-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
        ov.setAttribute('aria-label', 'Public discussion');
        ov.innerHTML =
            '<div class="discuss-card">' +
              '<div class="discuss-card__head"><div>' +
                '<div class="discuss-card__title">Discuss this diagram</div>' +
                '<div class="discuss-card__sub">Public comments via GitHub — one thread per page</div>' +
              '</div><button class="discuss-card__close" type="button" aria-label="Close discussion">&times;</button></div>' +
              '<div class="discuss-card__body"><div class="gc-loading">Loading comments…</div><div id="giscus-container"></div></div>' +
            '</div>';
        document.body.appendChild(ov);

        var loaded = false;
        function loadGiscus() {
            if (loaded) return; loaded = true;
            var s = document.createElement('script');
            s.src = 'https://giscus.app/client.js';
            s.setAttribute('data-repo', 'hadi-nayebi/hadi-nayebi.github.io');
            s.setAttribute('data-repo-id', 'R_kgDOHL_tnQ');
            s.setAttribute('data-category', 'General');
            s.setAttribute('data-category-id', 'DIC_kwDOHL_tnc4C3cRQ');
            s.setAttribute('data-mapping', 'pathname');
            s.setAttribute('data-strict', '0');
            s.setAttribute('data-reactions-enabled', '1');
            s.setAttribute('data-emit-metadata', '0');
            s.setAttribute('data-input-position', 'top');
            s.setAttribute('data-theme', 'dark');
            s.setAttribute('data-lang', 'en');
            s.setAttribute('data-loading', 'lazy');
            s.crossOrigin = 'anonymous'; s.async = true;
            s.addEventListener('load', function () { var l = ov.querySelector('.gc-loading'); if (l) l.style.display = 'none'; });
            ov.querySelector('#giscus-container').appendChild(s);
        }
        function openOv() { ov.classList.add('is-open'); loadGiscus(); }
        function closeOv() { ov.classList.remove('is-open'); }
        dbtn.addEventListener('click', openOv);
        ov.querySelector('.discuss-card__close').addEventListener('click', closeOv);
        ov.addEventListener('click', function (e) { if (e.target === ov) closeOv(); });
        ov.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); closeOv(); } });
    })();

    /* ========================================================================
     * DIAGRAM COMMENTS — local review tool (localhost ONLY, never on the public site)
     * Drops a comment tagged to the CURRENT card. Saves to the dev server
     * (POST /api/diagram-comments -> diagram-comments.json on disk) with a
     * localStorage mirror as fallback. The author reads the file, writes a
     * >=100-word reply back (PATCH address), and the bubble shows it addressed.
     * ====================================================================== */
    (function commentTool() {
        var isLocal = /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/.test(location.hostname);
        if (!isLocal) return;

        var API = '/api/diagram-comments', LS = 'jobLifeComments', comments = [];
        function lsGet() { try { return JSON.parse(localStorage.getItem(LS) || '[]'); } catch (e) { return []; } }
        function lsSet(a) { try { localStorage.setItem(LS, JSON.stringify(a)); } catch (e) {} }
        function cEsc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]; }); }

        var css = `
        .cmt-fab { position: fixed; right: 1.4rem; bottom: 6.2rem; z-index: 4000; width: 52px; height: 52px; border-radius: 50%; cursor: pointer; background: linear-gradient(150deg,#6366f1,#8b5cf6); color:#fff; border: 1px solid rgba(255,255,255,0.28); box-shadow: 0 8px 22px rgba(0,0,0,0.5); font-size: 1.4rem; display:flex; align-items:center; justify-content:center; }
        .cmt-fab:hover { filter: brightness(1.12); }
        .cmt-fab__badge { position:absolute; top:-5px; right:-5px; min-width:20px; height:20px; border-radius:10px; background:#f43f5e; color:#fff; font-size:0.72rem; font-weight:700; display:flex; align-items:center; justify-content:center; padding:0 5px; border:2px solid #0a0a0f; }
        .cmt-fab__badge.is-zero { display:none; }
        .cmt-panel { position:fixed; top:0; right:0; height:100%; width:368px; max-width:92vw; z-index:4100; background:rgba(12,12,20,0.975); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border-left:1px solid rgba(139,92,246,0.35); box-shadow:-16px 0 40px rgba(0,0,0,0.5); transform:translateX(100%); transition:transform .22s ease; display:flex; flex-direction:column; }
        .cmt-panel.is-open { transform:translateX(0); }
        .cmt-panel__head { padding:1rem 1.1rem; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center; }
        .cmt-panel__title { font-size:0.95rem; font-weight:700; color:#f1eeff; }
        .cmt-panel__sub { font-size:0.66rem; color:#8a8a9c; margin-top:0.15rem; }
        .cmt-panel__close { background:none; border:none; color:#b6b6c8; font-size:1.4rem; line-height:1; cursor:pointer; }
        .cmt-compose { padding:0.9rem 1.1rem; border-bottom:1px solid rgba(255,255,255,0.1); }
        .cmt-compose__tag { font-size:0.72rem; color:var(--accent); font-weight:700; margin-bottom:0.45rem; }
        .cmt-compose textarea { width:100%; box-sizing:border-box; min-height:74px; resize:vertical; background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.16); border-radius:9px; color:#eee; font:inherit; font-size:0.85rem; padding:0.55rem 0.65rem; }
        .cmt-compose__btn { margin-top:0.55rem; width:100%; padding:0.5rem; border-radius:9px; background:linear-gradient(150deg,#6366f1,#8b5cf6); color:#fff; border:none; font-weight:600; cursor:pointer; }
        .cmt-compose__btn:hover { filter:brightness(1.1); }
        .cmt-list { flex:1; overflow-y:auto; padding:0.6rem 0.8rem 2rem; }
        .cmt-empty { color:#8a8a9c; font-size:0.82rem; text-align:center; padding:1.5rem 0.5rem; line-height:1.5; }
        .cmt-item { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:0.6rem 0.7rem; margin-bottom:0.6rem; }
        .cmt-item__top { display:flex; justify-content:space-between; align-items:center; gap:0.4rem; margin-bottom:0.35rem; }
        .cmt-item__card { font-size:0.66rem; font-weight:700; color:#c9c2ff; background:rgba(99,102,241,0.18); border-radius:5px; padding:0.12rem 0.4rem; }
        .cmt-item__status { font-size:0.64rem; font-weight:700; white-space:nowrap; }
        .cmt-item__status.open { color:#fbbf24; }
        .cmt-item__status.addressed { color:#34d399; }
        .cmt-item__text { font-size:0.83rem; color:#dcdce6; line-height:1.42; }
        .cmt-item__reply { margin-top:0.45rem; padding:0.45rem 0.55rem; background:rgba(52,211,153,0.08); border-left:2px solid #34d399; border-radius:6px; font-size:0.77rem; color:#c7ead9; line-height:1.46; white-space:pre-wrap; }
        .cmt-item__foot { text-align:right; margin-top:0.3rem; }
        .cmt-item__del { background:none; border:none; color:#7a7a8c; cursor:pointer; font-size:0.7rem; }
        .cmt-item__del:hover { color:#f43f5e; }
        .cmt-flash { position:fixed; bottom:1.2rem; left:50%; transform:translateX(-50%); z-index:4200; background:rgba(20,20,30,0.96); color:#eee; padding:0.5rem 0.9rem; border-radius:8px; border:1px solid rgba(139,92,246,0.4); font-size:0.8rem; opacity:0; transition:opacity .2s; pointer-events:none; max-width:80vw; text-align:center; }
        .cmt-flash.is-on { opacity:1; }`;
        var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

        var fab = document.createElement('button');
        fab.className = 'cmt-fab'; fab.type = 'button';
        fab.setAttribute('aria-label', 'Open diagram comments');
        fab.innerHTML = '💬<span class="cmt-fab__badge is-zero">0</span>';
        document.body.appendChild(fab);

        var cmtPanel = document.createElement('aside');
        cmtPanel.className = 'cmt-panel'; cmtPanel.setAttribute('aria-hidden', 'true');
        cmtPanel.innerHTML =
            '<div class="cmt-panel__head"><div><div class="cmt-panel__title">Diagram comments</div><div class="cmt-panel__sub">saved to diagram-comments.json &middot; local review tool</div></div><button class="cmt-panel__close" type="button" aria-label="Close">&times;</button></div>' +
            '<div class="cmt-compose"><div class="cmt-compose__tag" id="cmt-tag"></div><textarea id="cmt-text" placeholder="Leave a comment on this diagram…"></textarea><button class="cmt-compose__btn" id="cmt-add" type="button">Add comment</button></div>' +
            '<div class="cmt-list" id="cmt-list"></div>';
        document.body.appendChild(cmtPanel);

        var flashEl = document.createElement('div'); flashEl.className = 'cmt-flash'; document.body.appendChild(flashEl);
        var flashT;
        function cmtFlash(msg) { flashEl.textContent = msg; flashEl.classList.add('is-on'); clearTimeout(flashT); flashT = setTimeout(function () { flashEl.classList.remove('is-on'); }, 2800); }

        var listEl = cmtPanel.querySelector('#cmt-list'),
            tagEl  = cmtPanel.querySelector('#cmt-tag'),
            textEl = cmtPanel.querySelector('#cmt-text'),
            badge  = fab.querySelector('.cmt-fab__badge');

        function curCard() { var k = keyOf(curCol, curRow); var c = CARDS[k] || {}; return { key: k, title: c.title || k }; }
        function cmtRefreshTag() { var c = curCard(); tagEl.textContent = 'On: ' + c.title + '  (' + c.key + ')'; }

        function render() {
            var open = comments.filter(function (c) { return c.status !== 'addressed'; }).length;
            badge.textContent = open; badge.classList.toggle('is-zero', open === 0);
            if (!comments.length) { listEl.innerHTML = '<div class="cmt-empty">No comments yet.<br>Navigate to a card, then add one above.</div>'; return; }
            var sorted = comments.slice().sort(function (a, b) { return (b.timestamp || '').localeCompare(a.timestamp || ''); });
            listEl.innerHTML = sorted.map(function (c) {
                var done = c.status === 'addressed';
                return '<div class="cmt-item">' +
                    '<div class="cmt-item__top"><span class="cmt-item__card">' + cEsc(c.cardTitle || c.card || '?') + '</span>' +
                    '<span class="cmt-item__status ' + (done ? 'addressed' : 'open') + '">' + (done ? '✓ addressed' : 'open') + '</span></div>' +
                    '<div class="cmt-item__text">' + cEsc(c.text) + '</div>' +
                    (done && c.address ? '<div class="cmt-item__reply">' + cEsc(c.address) + '</div>' : '') +
                    '<div class="cmt-item__foot"><button class="cmt-item__del" type="button" data-id="' + cEsc(c.id) + '">delete</button></div>' +
                    '</div>';
            }).join('');
        }

        function load() {
            fetch(API).then(function (r) { return r.ok ? r.json() : Promise.reject(); })
                .then(function (d) { comments = d; lsSet(d); render(); })
                .catch(function () { comments = lsGet(); render(); });
        }

        function add() {
            var text = (textEl.value || '').trim(); if (!text) { textEl.focus(); return; }
            var c = curCard();
            fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: pageId(), card: c.key, cardTitle: c.title, text: text }) })
                .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
                .then(function (entry) { comments.push(entry); lsSet(comments); textEl.value = ''; render(); cmtFlash('Saved → diagram-comments.json'); })
                .catch(function () {
                    var entry = { id: 'ls-' + Date.now(), page: pageId(), card: c.key, cardTitle: c.title, text: text, timestamp: new Date().toISOString(), status: 'open', address: null, addressedAt: null, _local: true };
                    comments.push(entry); lsSet(comments); textEl.value = ''; render();
                    cmtFlash('Saved locally — restart dev-server to write the file');
                });
        }

        function del(id) {
            comments = comments.filter(function (c) { return c.id !== id; }); lsSet(comments); render();
            fetch(API + '/' + encodeURIComponent(id), { method: 'DELETE' }).catch(function () {});
        }

        function openPanel() { cmtRefreshTag(); cmtPanel.classList.add('is-open'); cmtPanel.setAttribute('aria-hidden', 'false'); setTimeout(function () { textEl.focus(); }, 60); }
        function closePanel() { cmtPanel.classList.remove('is-open'); cmtPanel.setAttribute('aria-hidden', 'true'); }

        fab.addEventListener('click', function () { cmtPanel.classList.contains('is-open') ? closePanel() : openPanel(); });
        cmtPanel.querySelector('.cmt-panel__close').addEventListener('click', closePanel);
        cmtPanel.querySelector('#cmt-add').addEventListener('click', add);
        listEl.addEventListener('click', function (e) { var b = e.target.closest('.cmt-item__del'); if (b) del(b.getAttribute('data-id')); });
        /* typing in the textarea must not drive deck navigation; Escape closes */
        textEl.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Escape') { closePanel(); } });
        textEl.addEventListener('keyup', function (e) { e.stopPropagation(); });

        /* keep the compose tag live as the reviewer navigates with the panel open */
        var __cmtOrigGo = go;
        go = function (c, r) { __cmtOrigGo(c, r); if (cmtPanel.classList.contains('is-open')) cmtRefreshTag(); };

        load();
    })();
})();
