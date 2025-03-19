#!/usr/bin/env node

import test from '../tape/index.js';
import Settings from './Settings.js';

test('Basic value operations', async t => {
  t.plan(3);

  const defaultSettings = {
    author: {
      name: 'user',
      email: 'user@localhost',
    }
  };

  const settings = new Settings('v1-test', 'application.settings', defaultSettings);
  await settings.start();

  console.log('REVISOIN', settings.signal('author', 'name').revision)
  t.equal(settings.get('author', 'name'), 'Alice Smitdh', 'Check reading from storage');
  t.equal(settings.get('author', 'email'), 'user@localhost', 'Check reading from defaults');
  settings.set('author', 'name', 'Bob Smith')
  console.log('REVISOIN', settings.signal('author', 'name').revision)

  t.equal(settings.get('author', 'name'), 'Bob Smith', 'Initial value is set correctly');

  t.end();
});

/*
// Basic value setting and getting
test('Basic value operations', t => {
  t.plan(2);

  const sync = new Synchronizable('initial');
  t.equal(sync.value, 'initial', 'Initial value is set correctly');

  sync.value = 'updated';
  t.equal(sync.value, 'updated', 'Value updates correctly');

  t.end();
});

// Testing subscriptions
test('Subscription notifications', t => {
  t.plan(3);

  const sync = new Synchronizable(10);
  let notificationCount = 0;

  const unsubscribe = sync.subscribe((newVal, oldVal) => {
    notificationCount++;

    if (notificationCount === 1) {
      // Initial notification
      t.equal(newVal, 10, 'Initial subscription gets current value');
      t.equal(oldVal, null, 'Initial subscription has null for old value');
    } else if (notificationCount === 2) {
      t.equal(newVal, 20, 'Notification receives new value after change');
    }
  });

  // This should trigger a notification
  sync.value = 20;

  // Wait for debounced notifications
  setTimeout(() => {
    unsubscribe();
    t.end();
  }, 20); // Slightly longer than default debounce
});

// Testing remote updates and conflict resolution
test('Remote update handling', t => {
  t.plan(4);

  const sync = new Synchronizable('local', 1, 'uuid-1');

  // Higher revision should win
  sync.remote(2, 'uuid-2', 'remote');
  t.equal(sync.value, 'remote', 'Higher revision remote update accepted');
  t.equal(sync.revision, 2, 'Revision updated with remote value');

  // Same revision but "greater" UUID should win
  sync.remote(2, 'uuid-3', 'conflict winner');
  t.equal(sync.value, 'conflict winner', 'Higher UUID wins in conflict');

  // Same revision but "lesser" UUID should lose
  sync.remote(2, 'uuid-1', 'conflict loser');
  t.equal(sync.value, 'conflict winner', 'Lower UUID loses in conflict');

  t.end();
});

// Test error handling
test('Input validation', t => {
  t.plan(3);

  // Invalid initial revision
  try {
    new Synchronizable('test', 0);
    t.assert(false, 'Should throw on zero revision');
  } catch (error) {
    t.assert(true, 'Throws on zero revision');
  }

  const sync = new Synchronizable('test');

  // Invalid remote revision
  try {
    sync.remote('not-a-number', 'uuid', 'value');
    t.assert(false, 'Should throw on non-number revision');
  } catch (error) {
    t.assert(true, 'Throws on non-number revision');
  }

  // Invalid debounce
  try {
    sync.debounce = -1;
    t.assert(false, 'Should throw on negative debounce');
  } catch (error) {
    t.assert(true, 'Throws on negative debounce');
  }

  t.end();
});
*/
