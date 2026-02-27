const BASE = 'http://localhost:3000/api/v1';

function checkFetch() {
  if (typeof fetch !== 'function') {
    console.error('Global fetch is not available. Run on Node 18+ or install node-fetch.');
    process.exit(1);
  }
}

async function http(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(BASE + path, opts);
  let data;
  try { data = await res.json(); } catch (e) { data = null; }
  return { status: res.status, data };
}

async function createUsers(n) {
  const ids = [];
  for (let i = 0; i < n; i++) {
    const t = Date.now();
    const payload = {
      username: `test_user_${t}_${i}`,
      email: `test_${t}_${i}@example.com`,
      password: `pass${i}`
    };
    const res = await http('POST', '/users', payload);
    if (res.status >= 200 && res.status < 300 && res.data && res.data.data && res.data.data._id) {
      ids.push(res.data.data._id);
    } else {
      console.warn('User create failed:', res.status, res.data && res.data.message);
    }
  }
  return ids;
}

async function createPosts(n, authorNamePrefix) {
  const ids = [];
  for (let i = 0; i < n; i++) {
    const t = Date.now();
    const payload = {
      title: `Test Post ${t} - ${i}`,
      content: `This is test content ${i}`,
      author: `${authorNamePrefix}_${i}`
    };
    const res = await http('POST', '/posts', payload);
    if (res.status >= 200 && res.status < 300 && res.data && res.data.data && res.data.data._id) {
      ids.push(res.data.data._id);
    } else {
      console.warn('Post create failed:', res.status, res.data && res.data.message);
    }
  }
  return ids;
}

async function run() {
  checkFetch();
  console.log('Starting route tests against', BASE);

  // Create 50 users and 50 posts -> 100 documents
  console.log('Creating 50 users...');
  const userIds = await createUsers(50);
  console.log('Created users:', userIds.length);

  console.log('Creating 50 posts...');
  const authorPrefix = 'test_author';
  const postIds = await createPosts(50, authorPrefix);
  console.log('Created posts:', postIds.length);

  // Test GET all
  const allUsers = await http('GET', '/users');
  console.log('GET /users ->', allUsers.status, Array.isArray(allUsers.data && allUsers.data.data) ? `${allUsers.data.data.length} items` : 'no list');

  const allPosts = await http('GET', '/posts');
  console.log('GET /posts ->', allPosts.status, Array.isArray(allPosts.data && allPosts.data.data) ? `${allPosts.data.data.length} items` : 'no list');

  // Test GET by id (first ones)
  if (userIds.length) {
    const u = await http('GET', `/users/${userIds[0]}`);
    console.log('GET /users/:id ->', u.status);
  }
  if (postIds.length) {
    const p = await http('GET', `/posts/${postIds[0]}`);
    console.log('GET /posts/:id ->', p.status);
  }

  // Test PUT (update) for first user and post
  if (userIds.length) {
    const res = await http('PUT', `/users/${userIds[0]}`, { username: `updated_${Date.now()}` });
    console.log('PUT /users/:id ->', res.status);
  }
  if (postIds.length) {
    const res = await http('PUT', `/posts/${postIds[0]}`, { title: `Updated Title ${Date.now()}` });
    console.log('PUT /posts/:id ->', res.status);
  }

  // Test DELETE endpoints without removing created docs: use a valid-looking but non-existent id
  const fakeId = '000000000000000000000000';
  const delUser = await http('DELETE', `/users/${fakeId}`);
  console.log('DELETE /users/:id (non-existent) ->', delUser.status);
  const delPost = await http('DELETE', `/posts/${fakeId}`);
  console.log('DELETE /posts/:id (non-existent) ->', delPost.status);

  console.log('Finished. Created', userIds.length + postIds.length, 'documents (users+posts). No created documents were deleted.');
}

run().catch(err => {
  console.error('Test script error:', err);
  process.exit(1);
});
