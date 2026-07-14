'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { track } from '@/features/analytics/track';

/**
 * Reports Core Web Vitals (LCP, CLS, INP, FCP, TTFB) to our own /api/track.
 *
 * This is the field data — what real phones on real connections actually
 * experienced — as opposed to the lab numbers a Lighthouse run produces. The
 * LCP work on this site was measured in a lab; this is how you find out whether
 * it held up in Dhaka on a 3G handset.
 *
 * The callback is defined at MODULE scope, not inline. The hook calls a NEW
 * function reference with every metric collected so far, so an inline arrow
 * would re-report the same metrics on every render — the docs are explicit about
 * this, and it is exactly the kind of duplicate-counting this whole task is about.
 */
const report = (metric: { name: string; value: number }) => {
  track('web_vital', { label: metric.name, value: metric.value });
};

export default function WebVitals() {
  useReportWebVitals(report);
  return null;
}
