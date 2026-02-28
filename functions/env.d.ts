// Bindings for Cloudflare Pages Functions (D1 + env)
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<D1Result<unknown>>;
}
interface D1Result<T = unknown> {
  results?: T[];
  success?: boolean;
}

interface Env {
  DB: D1Database;
  APP_URL: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  ADMIN_TOKEN?: string;
  DEFAULT_CURRENCY?: string;
}
