import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  const publicUrls = ['/auth/login', '/auth/register'];
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));
  
  if (token && !isPublicUrl) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Request con token a:', req.url);
    return next(clonedRequest);
  }
  
  if (!token && !isPublicUrl) {
    console.warn('Request sin token a:', req.url);
  }
  
  return next(req);
};