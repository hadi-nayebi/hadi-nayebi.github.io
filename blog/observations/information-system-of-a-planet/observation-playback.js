(function exposeObservationPlayback(root, factory) {
    const playback = factory();
    if (typeof module === 'object' && module.exports) module.exports = playback;
    if (root) root.ObservationPlayback = playback;
})(typeof window === 'undefined' ? null : window, () => {
    'use strict';

    const createState = () => ({ index: 0, playEpisode: false, waitingForAdvance: false });

    const start = (state) => {
        state.playEpisode = true;
        state.waitingForAdvance = false;
    };

    const stop = (state) => {
        state.playEpisode = false;
        state.waitingForAdvance = false;
    };

    const finishSlide = (state, isLastSlide) => {
        if (!state.playEpisode) return;
        if (isLastSlide) {
            stop(state);
            return;
        }
        state.waitingForAdvance = true;
    };

    const navigationOptions = (state) => {
        const autoplayAudio = state.playEpisode;
        state.waitingForAdvance = false;
        return { autoplayAudio };
    };

    return { createState, start, stop, finishSlide, navigationOptions };
});
