/**
 * Demo data for the admin dashboard — customers, coupons, and 60 days of
 * orders so the analytics look alive. SAFE & REVERSIBLE: every row it
 * creates is tagged (customer emails @demo.lumina, orders order_no
 * 'LUM-DEMO-…'), and the script deletes those first, so re-running never
 * duplicates and never touches real data.
 *
 *   Seed:   npx tsx database/seed-demo.ts
 *   Remove: npx tsx database/seed-demo.ts --clear
 */
import mysql from 'mysql2/promise';

const FIRST = ['Ayesha', 'Rahim', 'Nusrat', 'Tanvir', 'Farhana', 'Imran', 'Sadia', 'Kabir', 'Mehjabin', 'Arif', 'Zara', 'Rafiq', 'Lamia', 'Sourav', 'Nabila', 'Hasan', 'Tasnia', 'Fahim', 'Rumana', 'Shakib'];
const LAST = ['Rahman', 'Ahmed', 'Chowdhury', 'Islam', 'Hossain', 'Karim', 'Akter', 'Siddiqui', 'Jahan', 'Bhuiyan'];
const STATUSES = ['delivered', 'delivered', 'delivered', 'confirmed', 'processing', 'shipped', 'pending', 'cancelled'];
const rand = <T>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const randInt = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));

async function main() {
  const clear = process.argv.includes('--clear');
  const db = await mysql.createConnection({
    host: '127.0.0.1', user: 'root', password: '', database: 'lumina_jewelry',
  });

  // Remove any previous demo rows (orders cascade to items/history).
  await db.query("DELETE FROM orders WHERE order_no LIKE 'LUM-DEMO-%'");
  await db.query("DELETE FROM users WHERE email LIKE '%@demo.lumina'");
  await db.query("DELETE FROM coupons WHERE code IN ('EID40','FLAT1000','NEWLUM','FESTIVE25')");
  if (clear) { console.log('Demo data removed.'); await db.end(); return; }

  // Customers
  const userIds: number[] = [];
  for (let i = 0; i < 42; i++) {
    const name = `${rand(FIRST)} ${rand(LAST)}`;
    const email = `${name.toLowerCase().replace(/[^a-z]/g, '.')}.${i}@demo.lumina`;
    const daysAgo = randInt(0, 120);
    const [res] = await db.query(
      `INSERT INTO users (name, email, phone, is_active, created_at)
       VALUES (?, ?, ?, 1, DATE_SUB(NOW(), INTERVAL ? DAY))`,
      [name, email, `+8801${randInt(300000000, 999999999)}`, daysAgo],
    );
    userIds.push((res as mysql.ResultSetHeader).insertId);
  }

  // Coupons
  await db.query(
    `INSERT INTO coupons (code, type, value, min_order, usage_limit, used_count, expires_at, is_active) VALUES
     ('EID40','percent',40,50000,200,138,DATE_ADD(NOW(),INTERVAL 20 DAY),1),
     ('FLAT1000','fixed',1000,20000,500,212,DATE_ADD(NOW(),INTERVAL 45 DAY),1),
     ('NEWLUM','percent',15,0,1000,64,DATE_ADD(NOW(),INTERVAL 90 DAY),1),
     ('FESTIVE25','percent',25,80000,150,150,DATE_SUB(NOW(),INTERVAL 3 DAY),1)`,
  );

  // Purchasable variants with prices
  const [vrows] = await db.query(
    `SELECT v.id, v.variant_sku, p.name, pc.fixed_price price
     FROM product_variants v
     JOIN products p ON p.id = v.product_id
     JOIN variant_price_components pc ON pc.variant_id = v.id
     WHERE pc.fixed_price > 0`,
  );
  const variants = vrows as { id: number; variant_sku: string; name: string; price: number }[];

  // 60 days of orders — heavier toward recent days
  let made = 0;
  for (let day = 60; day >= 0; day--) {
    const ordersToday = randInt(0, 5);
    for (let k = 0; k < ordersToday; k++) {
      const items = Array.from({ length: randInt(1, 3) }, () => rand(variants));
      let subtotal = 0;
      const lineItems = items.map(v => {
        const qty = randInt(1, 2);
        subtotal += v.price * qty;
        return { v, qty };
      });
      const discount = Math.random() < 0.25 ? Math.round(subtotal * 0.1) : 0;
      const tax = Math.round((subtotal - discount) * 0.05);
      const shipping = subtotal > 100000 ? 0 : 500;
      const grand = subtotal - discount + tax + shipping;
      const status = rand(STATUSES);
      const uid = rand(userIds);
      const orderNo = `LUM-DEMO-${String(day).padStart(2, '0')}${String(k)}${randInt(100, 999)}`;

      const [ores] = await db.query(
        `INSERT INTO orders
          (order_no, user_id, status, currency, subtotal, discount_total, tax_total, shipping_total, grand_total,
           shipping_name, shipping_phone, placed_at, created_at)
         VALUES (?, ?, ?, 'BDT', ?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ? DAY), DATE_SUB(NOW(), INTERVAL ? DAY))`,
        [orderNo, uid, status, subtotal, discount, tax, shipping, grand,
         'Demo Customer', `+8801${randInt(300000000, 999999999)}`, day, day],
      );
      const orderId = (ores as mysql.ResultSetHeader).insertId;
      for (const { v, qty } of lineItems) {
        await db.query(
          `INSERT INTO order_items (order_id, variant_id, product_name, variant_sku, quantity, unit_price, line_total)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [orderId, v.id, v.name, v.variant_sku, qty, v.price, v.price * qty],
        );
      }
      made++;
    }
  }

  const [[stats]] = await db.query(
    `SELECT (SELECT COUNT(*) FROM users WHERE email LIKE '%@demo.lumina') customers,
            (SELECT COUNT(*) FROM orders WHERE order_no LIKE 'LUM-DEMO-%') orders`,
  ) as never as [{ customers: number; orders: number }[]];
  console.log(`Seeded ${stats.customers} demo customers, ${stats.orders} demo orders (${made}), 4 coupons.`);
  await db.end();
}

main().catch(e => { console.error(e); process.exit(1); });
