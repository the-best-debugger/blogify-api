const BASE = 'http://localhost:3000/api/v1';

function checkFetch() {
  if (typeof fetch !== 'function') {
    console.error('Global fetch is not available. Run on Node 18+ or install node-fetch.');
    process.exit(1);
  }
}

async function http(method, path, body, cookie) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  if (cookie) opts.headers['Cookie'] = cookie;
  const res = await fetch(BASE + path, opts);
  let data;
  try { data = await res.json(); } catch (e) { data = null; }
  return { status: res.status, data, headers: res.headers };
}

async function run() {
  checkFetch();
  console.log('Integration tests against', BASE);

  // Phase 1: Happy path for Alice
  const alice = { username: `Alice_${Date.now()}`, email: `alice_${Date.now()}@example.com`, password: 'alicepass' };
  console.log('Registering Alice...');
  const regA = await http('POST', '/users', alice);
  console.log('Register Alice ->', regA.status);
  if (regA.status !== 201) return console.error('Alice registration failed', regA.data);

  console.log('Logging in Alice...');
  const loginA = await http('POST', '/users/login', { email: alice.email, password: alice.password });
  console.log('Login Alice ->', loginA.status);
  if (loginA.status !== 200) return console.error('Alice login failed', loginA.data);
  const setCookie = loginA.headers.get('set-cookie');
  if (!setCookie || !/token=/.test(setCookie)) {
    console.warn('No token cookie set in login response headers');
  } else {
    console.log('Set-Cookie header:', setCookie.split(';')[1] ? setCookie.split(';')[0] : setCookie.split(';')[0]);
  }
  const aliceCookie = setCookie ? setCookie.split(';')[0] : null;
  if (setCookie && !/HttpOnly/i.test(setCookie)) console.warn('Warning: Set-Cookie missing HttpOnly flag');

  console.log('Creating a post as Alice (cookie present)...');
  const postPayload = { title: 'Alice Post', content: 'Content by Alice' };
  const createPost = await http('POST', '/posts', postPayload, aliceCookie);
  console.log('Create Post ->', createPost.status);
  if (createPost.status !== 201) return console.error('Create post failed', createPost.data);
  const postId = createPost.data && createPost.data.data && createPost.data.data._id;

  // Phase 2: Intruder
  console.log('Logging out Alice (clear cookie)...');
  const logoutA = await http('POST', '/users/logout', null, aliceCookie);
  console.log('Logout Alice ->', logoutA.status);

  console.log('Attempting to DELETE Alice post without cookie...');
  const delNoAuth = await http('DELETE', `/posts/${postId}`);
  console.log('DELETE without cookie ->', delNoAuth.status, delNoAuth.data && delNoAuth.data.message);

  // Phase 3: Imposter
  const bob = { username: `Bob_${Date.now()}`, email: `bob_${Date.now()}@example.com`, password: 'bobpass' };
  console.log('Registering Bob...');
  const regB = await http('POST', '/users', bob);
  console.log('Register Bob ->', regB.status);
  if (regB.status !== 201) return console.error('Bob registration failed', regB.data);

  console.log('Logging in Bob...');
  const loginB = await http('POST', '/users/login', { email: bob.email, password: bob.password });
  console.log('Login Bob ->', loginB.status);
  const setCookieB = loginB.headers.get('set-cookie');
  const bobCookie = setCookieB ? setCookieB.split(';')[0] : null;

  console.log('Bob attempting to DELETE Alice post...');
  const delByBob = await http('DELETE', `/posts/${postId}`, null, bobCookie);
  console.log('DELETE by Bob ->', delByBob.status, delByBob.data && delByBob.data.message);

  // Final checks: GET endpoints
  const allUsers = await http('GET', '/users');
  console.log('GET /users ->', allUsers.status, Array.isArray(allUsers.data && allUsers.data.data) ? `${allUsers.data.data.length} items` : 'no list');
  const allPosts = await http('GET', '/posts');
  console.log('GET /posts ->', allPosts.status, Array.isArray(allPosts.data && allPosts.data.data) ? `${allPosts.data.data.length} items` : 'no list');

  console.log('Integration test finished. Post created:', postId);
}

run().catch(err => {
  console.error('Test script error:', err);
  process.exit(1);
});
