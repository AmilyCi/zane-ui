'use strict';

const isClient = typeof window !== 'undefined' && typeof document !== 'undefined';

exports.isClient = isClient;
