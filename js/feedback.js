// Version: v0.1.0
// Dev-only feedback widget — only renders on localhost
// Injected by components.js when hostname is localhost

(function () {
    'use strict';

    // Guard: only run on localhost
    var host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') return;

    var isOpen = false;
    var bubble, panel;

    function getCurrentPage() {
        var path = window.location.pathname;
        if (path === '/' || path === '') return 'index.html';
        var segments = path.split('/').filter(Boolean);
        return segments.join('/');
    }

    function createWidget() {
        // Inject styles
        var style = document.createElement('style');
        style.textContent = [
            '.fb-bubble {',
            '  position: fixed; bottom: 24px; right: 24px; z-index: 9999;',
            '  width: 52px; height: 52px; border-radius: 50%;',
            '  background: linear-gradient(135deg, #6366f1, #8b5cf6);',
            '  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);',
            '  cursor: pointer; border: none;',
            '  display: flex; align-items: center; justify-content: center;',
            '  transition: transform 0.2s ease, box-shadow 0.2s ease;',
            '}',
            '.fb-bubble:hover {',
            '  transform: scale(1.1);',
            '  box-shadow: 0 6px 28px rgba(99, 102, 241, 0.6);',
            '}',
            '.fb-bubble svg { width: 24px; height: 24px; fill: white; }',
            '.fb-panel {',
            '  position: fixed; bottom: 88px; right: 24px; z-index: 9998;',
            '  width: 340px; max-height: 400px;',
            '  background: rgba(15, 15, 20, 0.95);',
            '  backdrop-filter: blur(20px);',
            '  border: 1px solid rgba(255, 255, 255, 0.1);',
            '  border-radius: 16px;',
            '  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);',
            '  padding: 1.25rem;',
            '  display: none; flex-direction: column; gap: 0.75rem;',
            '  font-family: Inter, sans-serif;',
            '}',
            '.fb-panel.is-open { display: flex; }',
            '.fb-panel-header {',
            '  display: flex; justify-content: space-between; align-items: center;',
            '}',
            '.fb-panel-title {',
            '  font-size: 0.9rem; font-weight: 600; color: #fff;',
            '}',
            '.fb-panel-page {',
            '  font-size: 0.75rem; color: #9ca3af;',
            '  background: rgba(255,255,255,0.05); padding: 0.2rem 0.5rem;',
            '  border-radius: 8px;',
            '}',
            '.fb-textarea {',
            '  width: 100%; min-height: 100px; resize: vertical;',
            '  background: rgba(255, 255, 255, 0.05);',
            '  border: 1px solid rgba(255, 255, 255, 0.1);',
            '  border-radius: 8px; padding: 0.75rem;',
            '  color: #fff; font-family: Inter, sans-serif; font-size: 0.9rem;',
            '  line-height: 1.5;',
            '}',
            '.fb-textarea:focus {',
            '  outline: none; border-color: #6366f1;',
            '}',
            '.fb-textarea::placeholder { color: #6b7280; }',
            '.fb-submit {',
            '  background: linear-gradient(135deg, #6366f1, #8b5cf6);',
            '  color: white; border: none; border-radius: 8px;',
            '  padding: 0.6rem 1rem; font-weight: 600; font-size: 0.85rem;',
            '  cursor: pointer; transition: opacity 0.2s ease;',
            '}',
            '.fb-submit:hover { opacity: 0.9; }',
            '.fb-submit:disabled { opacity: 0.5; cursor: not-allowed; }',
            '.fb-toast {',
            '  position: fixed; bottom: 88px; right: 24px; z-index: 10000;',
            '  background: rgba(34, 197, 94, 0.9); color: white;',
            '  padding: 0.5rem 1rem; border-radius: 8px; font-size: 0.85rem;',
            '  font-weight: 500; opacity: 0; transition: opacity 0.3s ease;',
            '}',
            '.fb-toast.show { opacity: 1; }'
        ].join('\n');
        document.head.appendChild(style);

        // Bubble button
        bubble = document.createElement('button');
        bubble.className = 'fb-bubble';
        bubble.setAttribute('aria-label', 'Leave feedback');
        bubble.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/></svg>';
        document.body.appendChild(bubble);

        // Panel
        panel = document.createElement('div');
        panel.className = 'fb-panel';
        panel.innerHTML = [
            '<div class="fb-panel-header">',
            '  <span class="fb-panel-title">Page Feedback</span>',
            '  <span class="fb-panel-page">' + getCurrentPage() + '</span>',
            '</div>',
            '<textarea class="fb-textarea" placeholder="What needs attention on this page?"></textarea>',
            '<button class="fb-submit">Send Feedback</button>'
        ].join('');
        document.body.appendChild(panel);

        // Events
        bubble.addEventListener('click', togglePanel);
        panel.querySelector('.fb-submit').addEventListener('click', submitFeedback);

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen) togglePanel();
        });
    }

    function togglePanel() {
        isOpen = !isOpen;
        panel.classList.toggle('is-open', isOpen);
    }

    function submitFeedback() {
        var textarea = panel.querySelector('.fb-textarea');
        var btn = panel.querySelector('.fb-submit');
        var text = textarea.value.trim();
        if (!text) return;

        btn.disabled = true;
        btn.textContent = 'Sending...';

        fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                page: getCurrentPage(),
                text: text
            })
        })
        .then(function (res) {
            if (!res.ok) throw new Error('Failed');
            return res.json();
        })
        .then(function () {
            textarea.value = '';
            togglePanel();
            showToast('Feedback saved!');
        })
        .catch(function () {
            showToast('Error — is dev-server.py running?');
        })
        .finally(function () {
            btn.disabled = false;
            btn.textContent = 'Send Feedback';
        });
    }

    function showToast(msg) {
        var toast = document.createElement('div');
        toast.className = 'fb-toast';
        toast.textContent = msg;
        document.body.appendChild(toast);

        requestAnimationFrame(function () {
            toast.classList.add('show');
        });

        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 300);
        }, 2000);
    }

    // Initialize when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidget);
    } else {
        createWidget();
    }
})();
