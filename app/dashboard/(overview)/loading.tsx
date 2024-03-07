// loading.tsx is a special Next.js file built on top of Suspense, it allows you to create fallback UI to show as a replacement while page content loads. This is useful for when you have a slow network connection or a slow server response. You can use this to show a loading spinner or a message to the user while the page is loading. This is a great way to improve the user experience of your application.

import DashboardSkeleton from '@/app/ui/skeletons';
 
export default function Loading() {
  return <DashboardSkeleton />;
}