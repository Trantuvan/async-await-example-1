async function loadJson(url) {
  const response = await fetch(url);

  if (response.status === 200) {
    // *we could simply return response.json()
    // *but the outer loadJson(url) must await to wait for promise
    // *to resolve
    // *in this case we already await to wait for promise to resolve
    // *and return the actual result
    const json = await response.json();
    return json;
  }

  throw new Error(response.status);
}

// *don't need to await here because we already await and return the actual result result
loadJson(
  'https://api.giphy.com/v1/gifs/translate?api_key=gFnkECeS6G0N9DRYLXM9P9IDM0c8Wd3C&s=cats'
)
  .then(console.log)
  .catch(console.log);

class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

async function loadJson2(url) {
  const response = await fetch(url);
  if (response.status === 200) {
    // *need outer await here because it just returns the promise
    // *instead wait for the promise resolve
    return response.json();
  }
  throw new HttpError(response);
}

async function demoGithubUser() {
  // eslint-disable-next-line no-alert
  const name = prompt('Enter a name?', 'iliakan');

  try {
    // *use await here because loadJson returns a promise instead of resolve result
    const user = await loadJson2(`https://api.github.com/users/${name}`);
    console.log(`Fullname: ${user.name}`);
    return user;
  } catch (error) {
    if (error instanceof HttpError && error.response.status === 404) {
      console.log('No such user, please reenter');
      return demoGithubUser();
    }
    throw error;
  }
}

demoGithubUser();

async function wait() {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return 10;
}

function f() {
  // shows 10 after 1 second
  // *call async function from a regular not allow to use await keyword
  // *in this case knowing how it works inside helpful
  // *async function always returns a promise
  // *just use .then here to force JS to wait for promise to be resolved
  // eslint-disable-next-line no-alert
  wait().then((result) => alert(result));
}

f();
