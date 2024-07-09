import { test, expect } from '@playwright/test';

const baseURL = 'https://reqres.in/api';

test('GET request for user details', async ({ request }) => {
    const response = await request.get(`${baseURL}/users/2`);
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.data).toHaveProperty('id', 2);
    expect(responseBody.data).toHaveProperty('email');
    expect(responseBody.data).toHaveProperty('first_name');
    expect(responseBody.data).toHaveProperty('last_name');
});

const userData = { name: 'New User', job: 'QA Engineer' };
test('POST request to create user', async ({ request }) => {
    const postData = {
        name: 'morpheus',
        job: 'leader'
      };
      const response = await request.post(`${baseURL}/users`, {
        data: postData,
      });
      expect(response.status()).toBe(201);
      const responseBody = await response.json();
      expect(responseBody).toHaveProperty('id');
      expect(responseBody.name).toBe(postData.name);
      expect(responseBody.job).toBe(postData.job);
});

test('PUT request to update user', async ({ request }) => {
    const putData = {
        name: 'morpheus',
        job: 'zion resident'
      };
      const response = await request.put(`${baseURL}/users/2`, {
        data: putData,
      });
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
      expect(responseBody.name).toBe(putData.name);
      expect(responseBody.job).toBe(putData.job);
});

test('DELETE request to delete user', async ({ request }) => {
    const response = await request.delete(`${baseURL}/users/2`);
    expect(response.status()).toBe(204);
});


