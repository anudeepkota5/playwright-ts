import { test, expect } from '@playwright/test';

const BASE_URL = 'https://graphqlzero.almansi.me/api';

test.describe('GraphQL API Testing', () => {

  test('GraphQL Query: Get User', async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        query: `
          query {
            user(id: "1") {
              id
              name
              username
              email
            }
          }
        `
      }
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    console.log(responseBody);

    expect(responseBody.data.user).toEqual({
      id: '1',
      name: expect.any(String),
      username: expect.any(String),
      email: expect.any(String),
    });
  });

  test('GraphQL Query: Get Posts', async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        query: `
          query {
            posts(options: { paginate: { page: 1, limit: 5 } }) {
              data {
                id
                title
                body
              }
            }
          }
        `
      }
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    console.log(responseBody);

    expect(responseBody.data.posts.data.length).toBeGreaterThan(0);
    responseBody.data.posts.data.forEach((post: any) => {
      expect(post).toEqual({
        id: expect.any(String),
        title: expect.any(String),
        body: expect.any(String),
      });
    });
  });

  test('GraphQL Mutation: Update Post', async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        query: `
          mutation {
            updatePost(id: "1", input: {
              title: "Updated Title",
              body: "Updated Body"
            }) {
              id
              title
              body
              user {
                id
                name
              }
            }
          }
        `
      }
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    console.log(responseBody);

    expect(responseBody.data.updatePost).toEqual({
      id: '1',
      title: 'Updated Title',
      body: 'Updated Body',
      user: {
        id: '1',
        name: expect.any(String),
      },
    });
  });

  test('GraphQL Mutation: Delete Post', async ({ request }) => {
    const response = await request.post(BASE_URL, {
      data: {
        query: `
          mutation {
            deletePost(id: "1")
          }
        `
      }
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    console.log(responseBody);

    expect(responseBody.data.deletePost).toBe(true);
  });

});
