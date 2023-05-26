import { test } from 'tap';

import { build } from '../helper.js';

test('example is loaded', async (t) => {
  const app = await build(t);
  const res = await app.inject({
    url: '/example',
  });

  t.same(JSON.parse(res.payload), { message: 'Hi example!' });
});
