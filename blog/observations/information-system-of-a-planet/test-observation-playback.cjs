#!/usr/bin/env node
const { test } = require('node:test');
const assert = require('node:assert/strict');
const playback = require('./observation-playback.js');

test('an initiated episode pauses at the slide boundary without losing playback intent', () => {
    const state = playback.createState();
    playback.start(state);
    playback.finishSlide(state, false);

    assert.deepEqual(state, {
        index: 0,
        playEpisode: true,
        waitingForAdvance: true,
    });
});

test('reader navigation resumes narration using the destination slide audio', () => {
    const state = playback.createState();
    playback.start(state);
    playback.finishSlide(state, false);

    assert.deepEqual(playback.navigationOptions(state), { autoplayAudio: true });
    assert.equal(state.waitingForAdvance, false);
});

test('page load does not silently arm slide narration', () => {
    const state = playback.createState();
    playback.finishSlide(state, false);

    assert.deepEqual(playback.navigationOptions(state), { autoplayAudio: false });
});

test('the final slide ends narrated-reading mode', () => {
    const state = playback.createState();
    playback.start(state);
    playback.finishSlide(state, true);

    assert.equal(state.playEpisode, false);
    assert.equal(state.waitingForAdvance, false);
});

test('stopping narration prevents navigation from starting another slide', () => {
    const state = playback.createState();
    playback.start(state);
    playback.finishSlide(state, false);
    playback.stop(state);

    assert.deepEqual(playback.navigationOptions(state), { autoplayAudio: false });
});
