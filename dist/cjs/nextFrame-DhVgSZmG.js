'use strict';

function nextFrame(cb) {
    requestAnimationFrame(() => {
        requestAnimationFrame(cb);
    });
}

exports.nextFrame = nextFrame;
