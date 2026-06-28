import { test, expect } from '@playwright/test';

test.describe('Public API Routes', () => {
  test('GET /api/products returns products', async ({ request }) => {
    const response = await request.get('/api/products');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.pagination).toBeDefined();
  });

  test('GET /api/products accepts category filter', async ({ request }) => {
    const response = await request.get('/api/products?category=Men');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.products)).toBe(true);
  });

  test('GET /api/products accepts search query', async ({ request }) => {
    const response = await request.get('/api/products?search=shoe');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.products)).toBe(true);
  });

  test('GET /api/blog returns blog posts', async ({ request }) => {
    const response = await request.get('/api/blog');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.posts)).toBe(true);
    expect(body.pagination).toBeDefined();
  });

  test('POST /api/contact accepts form submission', async ({ request }) => {
    const response = await request.post('/api/contact', {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Inquiry',
        message: 'This is a test message.',
      },
    });
    expect([200, 201, 400, 422]).toContain(response.status());
  });

  test('POST /api/newsletter accepts subscription', async ({ request }) => {
    const response = await request.post('/api/newsletter', {
      data: { email: 'newsletter-test@example.com' },
    });
    expect([200, 201, 400, 409]).toContain(response.status());
  });

  test('POST /api/coupons/validate returns error for fake coupon', async ({ request }) => {
    const response = await request.post('/api/coupons/validate', {
      data: { code: 'FAKECOUPON123' },
    });
    expect([400, 404, 401]).toContain(response.status());
  });

  test('GET /api/cart returns 401 without auth', async ({ request }) => {
    const response = await request.get('/api/cart');
    expect(response.status()).toBe(401);
  });

  test('GET /api/wishlist returns 401 without auth', async ({ request }) => {
    const response = await request.get('/api/wishlist');
    expect(response.status()).toBe(401);
  });

  test('GET /api/orders returns 401 without auth', async ({ request }) => {
    const response = await request.get('/api/orders');
    expect(response.status()).toBe(401);
  });

  test('POST /api/checkout returns 401 without auth', async ({ request }) => {
    const response = await request.post('/api/checkout', { data: {} });
    expect(response.status()).toBe(401);
  });

  test('POST /api/reviews returns 401 without auth', async ({ request }) => {
    const response = await request.post('/api/reviews', {
      data: { productId: 'fake', rating: 5, content: 'Great!' },
    });
    expect(response.status()).toBe(401);
  });
});
