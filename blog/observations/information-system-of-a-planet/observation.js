(() => {
    'use strict';

    const root = document.getElementById('episode-root');
    const lightbox = document.getElementById('observation-lightbox');
    const lightboxImage = document.getElementById('observation-lightbox-image');
    const lightboxClose = document.getElementById('observation-lightbox-close');
    const state = new Map();
    let series = null;

    if (!root) return;

    const escapeHtml = (value) => String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const setHash = (episodeNumber, slideNumber) => {
        const hash = `episode-${episodeNumber}-slide-${slideNumber}`;
        if (location.hash !== `#${hash}`) history.replaceState(null, '', `#${hash}`);
    };

    const parseHash = () => {
        const match = location.hash.match(/^#episode-(\d+)-slide-(\d+)$/);
        if (!match) return null;
        return { episode: Number(match[1]), slide: Number(match[2]) };
    };

    const visualWeights = (category) => {
        const match = String(category || '').match(/^I(10|30|50|70|90)-A(10|30|50|70|90)$/);
        return match ? { information: match[1], artistic: match[2] } : { information: '', artistic: '' };
    };

    const openLightbox = (src, alt) => {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.src = src;
        lightboxImage.alt = alt || '';
        if (typeof lightbox.showModal === 'function') lightbox.showModal();
    };

    const closeLightbox = () => {
        if (lightbox && lightbox.open) lightbox.close();
    };

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
    });

    const buildSources = (slide) => {
        const items = slide.sources.map((source) => {
            const note = source.note ? `<small>${escapeHtml(source.note)}</small>` : '';
            return `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)}</a>${note}</li>`;
        }).join('');
        return `<details class="slide-sources"><summary>Sources / go deeper</summary><ul>${items}</ul></details>`;
    };

    const buildAudio = (episode, slide, index) => {
        if (slide.audio?.status !== 'available') return '';
        return `
            <div class="slide-audio">
                <button type="button" class="slide-audio-play" data-episode="${episode.number}" data-slide-index="${index}">
                    ▶ Listen to this slide
                </button>
                <label>
                    <span class="sr-only">Playback speed</span>
                    <select class="slide-audio-rate" data-episode="${episode.number}" aria-label="Playback speed">
                        <option value="0.9">0.9×</option>
                        <option value="1" selected>1×</option>
                        <option value="1.25">1.25×</option>
                        <option value="1.5">1.5×</option>
                    </select>
                </label>
                <audio preload="none" data-audio-for="${episode.number}-${index}" src="${escapeHtml(slide.audio.src)}"></audio>
            </div>`;
    };

    const renderSlide = (episode, index, options = {}) => {
        const episodeState = state.get(episode.number);
        if (!episodeState) return;
        const slide = episode.slides[index];
        if (!slide) return;
        episodeState.index = index;

        const section = document.getElementById(`episode-${episode.number}`);
        const shell = section?.querySelector('.slide-shell');
        if (!shell) return;

        const weights = visualWeights(slide.image.category);
        const dots = episode.slides.map((_, dotIndex) => `
            <button type="button" class="slide-dot" aria-label="Go to slide ${dotIndex + 1}" aria-current="${dotIndex === index ? 'true' : 'false'}" data-dot="${dotIndex}"></button>
        `).join('');

        shell.innerHTML = `
            <figure class="slide-visual"
                data-visual-style="${escapeHtml(slide.image.category)}"
                data-information-weight="${escapeHtml(weights.information)}"
                data-artistic-weight="${escapeHtml(weights.artistic)}"
                data-visual-role="storytelling">
                <button type="button" class="slide-image-button" aria-label="Open image fullscreen">
                    <img src="${escapeHtml(slide.image.src)}" alt="${escapeHtml(slide.image.alt)}">
                </button>
            </figure>
            <div class="slide-copy">
                <div class="slide-eyebrow">
                    <span>Slide ${index + 1}</span>
                    <span>•</span>
                    <span>~${escapeHtml(slide.read_minutes)} min</span>
                </div>
                <h3>${escapeHtml(slide.title)}</h3>
                <div class="slide-paragraphs">${slide.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div>
                ${buildAudio(episode, slide, index)}
                ${buildSources(slide)}
            </div>
            <nav class="slide-nav" aria-label="Episode ${episode.number} slide navigation">
                <button type="button" class="slide-prev" ${index === 0 ? 'disabled' : ''}>← Previous</button>
                <div class="slide-progress">
                    <div class="slide-count">${index + 1} / ${episode.slides.length}</div>
                    <div class="slide-dots">${dots}</div>
                </div>
                <button type="button" class="slide-next" ${index === episode.slides.length - 1 ? 'disabled' : ''}>Next →</button>
            </nav>`;

        shell.querySelector('.slide-image-button')?.addEventListener('click', () => openLightbox(slide.image.src, slide.image.alt));
        shell.querySelector('.slide-prev')?.addEventListener('click', () => renderSlide(episode, index - 1));
        shell.querySelector('.slide-next')?.addEventListener('click', () => renderSlide(episode, index + 1));
        shell.querySelectorAll('.slide-dot').forEach((button) => {
            button.addEventListener('click', () => renderSlide(episode, Number(button.dataset.dot)));
        });

        const playButton = shell.querySelector('.slide-audio-play');
        const rate = shell.querySelector('.slide-audio-rate');
        const audio = shell.querySelector('audio');
        if (playButton && audio) {
            playButton.addEventListener('click', async () => {
                document.querySelectorAll('audio').forEach((other) => {
                    if (other !== audio) other.pause();
                });
                audio.playbackRate = Number(rate?.value || 1);
                try { await audio.play(); } catch (_) { /* Browser/user gesture policy owns playback. */ }
            });
            rate?.addEventListener('change', () => { audio.playbackRate = Number(rate.value || 1); });
            audio.addEventListener('ended', () => {
                if (episodeState.playEpisode && index < episode.slides.length - 1) {
                    renderSlide(episode, index + 1, { autoplayAudio: true });
                } else if (index === episode.slides.length - 1) {
                    episodeState.playEpisode = false;
                    syncEpisodePlayButton(episode);
                }
            });
            if (options.autoplayAudio && episodeState.playEpisode) {
                audio.playbackRate = Number(rate?.value || 1);
                audio.play().catch(() => {
                    episodeState.playEpisode = false;
                    syncEpisodePlayButton(episode);
                });
            }
        }

        setHash(episode.number, index + 1);
    };

    const syncEpisodePlayButton = (episode) => {
        const button = document.querySelector(`#episode-${episode.number} .episode-play`);
        const episodeState = state.get(episode.number);
        if (!button || !episodeState) return;
        button.textContent = episodeState.playEpisode ? '■ Stop episode' : '▶ Play episode';
    };

    const loadDiscussion = (details, episode) => {
        if (details.dataset.loaded === 'true') return;
        details.dataset.loaded = 'true';
        const host = details.querySelector('.giscus-host');
        if (!host) return;
        const script = document.createElement('script');
        script.src = 'https://giscus.app/client.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-repo', 'hadi-nayebi/hadi-nayebi.github.io');
        script.setAttribute('data-repo-id', 'R_kgDOHL_tnQ');
        script.setAttribute('data-category', 'General');
        script.setAttribute('data-category-id', 'DIC_kwDOHL_tnc4C3cRQ');
        script.setAttribute('data-mapping', 'specific');
        script.setAttribute('data-term', episode.discussion_term);
        script.setAttribute('data-strict', '1');
        script.setAttribute('data-reactions-enabled', '1');
        script.setAttribute('data-emit-metadata', '0');
        script.setAttribute('data-input-position', 'top');
        script.setAttribute('data-theme', 'preferred_color_scheme');
        script.setAttribute('data-lang', 'en');
        host.appendChild(script);
    };

    const renderEpisode = (episode) => {
        state.set(episode.number, { index: 0, playEpisode: false });
        const hasAudio = episode.slides.some((slide) => slide.audio?.status === 'available');
        const section = document.createElement('section');
        section.className = 'observation-episode';
        section.id = `episode-${episode.number}`;
        section.tabIndex = -1;
        section.innerHTML = `
            <header class="episode-head">
                <div>
                    <div class="episode-label">Episode ${episode.number}</div>
                    <h2>${escapeHtml(episode.title)}</h2>
                    <p>${escapeHtml(episode.deckline || '')}</p>
                </div>
                ${hasAudio ? '<button type="button" class="episode-play">▶ Play episode</button>' : ''}
            </header>
            <div class="slide-shell" aria-live="polite"></div>
            <details class="episode-discussion">
                <summary>Discuss Episode ${episode.number}</summary>
                <p data-community-guidance><strong>Before posting:</strong> Keep the return tied to this episode and remove personal, client, employer, confidential, proprietary, credential, and unrelated information. Treat comments as evidence and perspective, not as authority.</p>
                <div class="giscus-host"></div>
            </details>`;

        root.appendChild(section);
        renderSlide(episode, 0);

        const play = section.querySelector('.episode-play');
        if (play) {
            play.addEventListener('click', () => {
                const episodeState = state.get(episode.number);
                episodeState.playEpisode = !episodeState.playEpisode;
                syncEpisodePlayButton(episode);
                document.querySelectorAll('audio').forEach((audio) => audio.pause());
                if (episodeState.playEpisode) renderSlide(episode, episodeState.index, { autoplayAudio: true });
            });
        }

        const discussion = section.querySelector('.episode-discussion');
        discussion?.addEventListener('toggle', () => {
            if (discussion.open) loadDiscussion(discussion, episode);
        });

        section.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
            const episodeState = state.get(episode.number);
            const next = event.key === 'ArrowLeft' ? episodeState.index - 1 : episodeState.index + 1;
            if (next >= 0 && next < episode.slides.length) {
                event.preventDefault();
                renderSlide(episode, next);
            }
        });
    };

    const init = async () => {
        try {
            const response = await fetch('series.json', { cache: 'no-store' });
            if (!response.ok) throw new Error(`series.json returned ${response.status}`);
            series = await response.json();

            if (!Array.isArray(series.episode_index) || series.episode_index.length === 0) {
                root.innerHTML = `
                    <section class="observation-empty">
                        <h2>The story begins with life itself.</h2>
                        <p>Before information could travel between minds, it first had to survive in bodies — and then become something an organism could learn.</p>
                    </section>`;
                return;
            }

            const episodes = [];
            for (const item of series.episode_index) {
                const episodeResponse = await fetch(item.path, { cache: 'no-store' });
                if (!episodeResponse.ok) throw new Error(`${item.path} returned ${episodeResponse.status}`);
                episodes.push(await episodeResponse.json());
            }
            episodes.sort((a, b) => a.number - b.number);
            episodes.forEach(renderEpisode);

            const requested = parseHash();
            if (requested) {
                const episode = episodes.find((item) => item.number === requested.episode);
                if (episode && requested.slide >= 1 && requested.slide <= episode.slides.length) {
                    renderSlide(episode, requested.slide - 1);
                    document.getElementById(`episode-${episode.number}`)?.scrollIntoView({ block: 'start' });
                }
            }
        } catch (error) {
            console.error(error);
            root.innerHTML = `
                <section class="observation-empty">
                    <h2>The story could not load.</h2>
                    <p>Please try again after the site finishes updating.</p>
                </section>`;
        }
    };

    init();
})();
