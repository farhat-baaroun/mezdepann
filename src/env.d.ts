/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '@vercel/analytics/astro' {
  import type { Component } from 'astro/components';
  const Analytics: Component;
  export default Analytics;
}