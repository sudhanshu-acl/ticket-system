/**
 * Logger utility for use in middleware and API routes
 * Works in both edge and Node.js environments
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, any>;
  pathname?: string;
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatLog = (level: LogLevel, message: string, data?: Record<string, any>, pathname?: string): string => {
  const timestamp = getTimestamp();
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  const pathStr = pathname ? ` | ${pathname}` : '';
  return `[${timestamp}] [${level.toUpperCase()}]${pathStr} ${message}${dataStr}`;
};

export const logger = {
  info: (message: string, data?: Record<string, any>, pathname?: string) => {
    const formatted = formatLog('info', message, data, pathname);
    console.log(formatted);
  },

  warn: (message: string, data?: Record<string, any>, pathname?: string) => {
    const formatted = formatLog('warn', message, data, pathname);
    console.warn(formatted);
  },

  error: (message: string, data?: Record<string, any>, pathname?: string) => {
    const formatted = formatLog('error', message, data, pathname);
    console.error(formatted);
  },

  debug: (message: string, data?: Record<string, any>, pathname?: string) => {
    if (process.env.DEBUG) {
      const formatted = formatLog('debug', message, data, pathname);
      console.debug(formatted);
    }
  },

  // Middleware-specific logger
  middleware: (pathname: string, method: string, details?: Record<string, any>) => {
    logger.info(`[MIDDLEWARE] ${method}`, { ...details }, pathname);
  },

  // Auth logger
  auth: (action: string, email: string, success: boolean, error?: string) => {
    if (success) {
      logger.info(`[AUTH] ${action} succeeded`, { email });
    } else {
      logger.error(`[AUTH] ${action} failed`, { email, error });
    }
  },

  // API logger
  api: (pathname: string, method: string, status: number, duration?: number) => {
    logger.info(`[API] ${method} ${pathname}`, { status, duration_ms: duration });
  },
};

export default logger;
