import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import ExcelJS from 'exceljs';
import { query } from '@/server/db/client';
import { ADMIN_COOKIE } from '@/server/auth/admin';
import { verifySession } from '@/server/auth/adminSession';

/**
 * GET /api/admin/orders/export?format=csv|xlsx&status=&q=&from=&to=
 *
 * Exports the CURRENT filter, not the whole table — the point of an export is
 * to take the list you are looking at into a spreadsheet.
 *
 * CSV carries a UTF-8 BOM, which is what makes Excel read ৳ and Bengali names
 * instead of mangling them. XLSX is a real workbook: money is written as a
 * NUMBER with a currency format, so the totals column can actually be summed —
 * in CSV every cell is a string, and "৳ 47,250" sums to nothing.
 */
const COLUMNS = [
  'Order', 'Placed', 'Status', 'Customer', 'Phone', 'City', 'Items',
  'Payment', 'Payment status', 'Subtotal', 'Discount', 'Coupon', 'VAT', 'Shipping', 'Total',
];

/** RFC 4180: quote everything, double any inner quote. Cheap, and never wrong. */
function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const jar = await cookies();
  if (verifySession(jar.get(ADMIN_COOKIE)?.value) === null) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const where: string[] = ['1 = 1'];
  const values: (string | number)[] = [];

  const status = params.get('status');
  if (status && status !== 'all') { where.push('o.status = ?'); values.push(status); }

  const search = params.get('q')?.trim();
  if (search) {
    where.push('(o.order_no LIKE ? OR o.shipping_name LIKE ? OR o.shipping_phone LIKE ?)');
    const like = `%${search}%`;
    values.push(like, like, like);
  }

  const from = params.get('from');
  if (from) { where.push('o.placed_at >= ?'); values.push(from); }
  const to = params.get('to');
  if (to) { where.push('o.placed_at < DATE_ADD(?, INTERVAL 1 DAY)'); values.push(to); }

  const rows = await query<Record<string, unknown>>(
    `SELECT o.order_no, o.placed_at, o.status, o.shipping_name, o.shipping_phone, o.shipping_city,
            (SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi WHERE oi.order_id = o.id) AS items,
            o.payment_method, o.payment_status,
            o.subtotal, o.discount_total, o.coupon_code, o.tax_total, o.shipping_total, o.grand_total
       FROM orders o
      WHERE ${where.join(' AND ')}
      ORDER BY o.placed_at DESC
      LIMIT 5000`,
    values,
  );

  const stamp = new Date().toISOString().slice(0, 10);

  if (params.get('format') === 'xlsx') {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Nahar Jewellers';
    const sheet = workbook.addWorksheet('Orders');

    sheet.columns = COLUMNS.map(header => ({
      header,
      key: header,
      width: header.length < 10 ? 14 : 20,
    }));
    sheet.getRow(1).font = { bold: true };

    // mysql2 hands DECIMAL back as a STRING. Written straight into a cell that
    // is text, not money — the Total column would look right and sum to zero.
    // These are the numeric columns, 1-based, matching COLUMNS above.
    const NUMERIC = new Set([7, 10, 11, 13, 14, 15]);

    for (const row of rows) {
      const added = sheet.addRow(
        Object.values(row).map((value, index) =>
          NUMERIC.has(index + 1) ? Number(value ?? 0) : value),
      );
      for (const index of NUMERIC) {
        if (index === 7) continue; // item count is a plain integer
        added.getCell(index).numFmt = '#,##0.00';
      }
    }
    sheet.autoFilter = { from: 'A1', to: { row: 1, column: COLUMNS.length } };

    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="orders-${stamp}.xlsx"`,
      },
    });
  }

  const body = [
    COLUMNS.map(csvCell).join(','),
    ...rows.map(row => Object.values(row).map(csvCell).join(',')),
  ].join('\r\n');

  return new NextResponse(`﻿${body}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="orders-${stamp}.csv"`,
    },
  });
}
