import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

function clear(value: unknown, seen = new WeakSet<object>()): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => clear(item, seen));
  }

  if (value instanceof Date || value === null || typeof value !== 'object') {
    return value;
  }

  if (seen.has(value)) {
    return undefined;
  }
  seen.add(value);

  const result: Record<string, unknown> = {};
  for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
    if (key === 'password') {
      continue;
    }
    result[key] = clear(nestedValue, seen);
  }

  return result;
}

@Injectable()
export class HidePasswordInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((value) => clear(value)));
  }
}
