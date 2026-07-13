'use client';

import { Printer } from 'lucide-react';

/**
 * Print / Save as PDF.
 *
 * One button, because in every browser they are the same action: the print
 * dialog's "Save as PDF" destination produces the PDF. Rendering one
 * server-side would need a headless browser in production to gain nothing.
 */
export default function PrintButton() {
  return (
    <button type="button" className="inv-print" onClick={() => window.print()}>
      <Printer size={15} /> Print / Save as PDF
    </button>
  );
}
