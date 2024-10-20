import { HttpInterceptorFn } from '@angular/common/http';

const shouldExcludeRoute = (url: string, method: string) => {
  if (url.includes('/auth/employees')) {
    return true;
  }

  if (url.includes('/employees') && method === 'POST') {
    return true;
  }

  return false;
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const shouldSkipToken = shouldExcludeRoute(req.url, req.method);

  const token = localStorage.getItem('token');

  if (!shouldSkipToken && token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
