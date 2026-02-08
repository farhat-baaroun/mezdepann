/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="astro/actions" />
/// <reference types="@types/react" />
/// <reference types="@types/react-dom" />
/// <reference types="resend" />


declare module '@vercel/analytics/astro' {
  import type { Component } from 'astro/components';
  const Analytics: Component;
  export default Analytics;
}