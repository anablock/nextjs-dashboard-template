## Next.js

- use React hooks only with client side rendering (CSR)
- use getServerSideProps or getStaticProps for server side rendering (SSR)
- use getStaticPaths for dynamic routes
- use getInitialProps for server side rendering (SSR) and client side rendering (CSR)
- use `usePathname()` to get the current pathname
- use `useQuery()` to get the current query
- use `useRouter()` to get the current router

## React Server Components
* Server Components support promises, providing a simpler solution for asynchronous tasks like data fetching. You can use async/await syntax without reaching out for useEffect, useState or data fetching libraries.  
* You can query the database directly without an additional API layer.
* You can call sql inside any Server Component.  But to allow you to navigate the components more easily, we've kept all the data queries in the data.ts file, and you can import them into the components.

* Waterfall and parallel data fetching

## Static Rendering

* With static rendering, data fetching and rendering happens on the server at build time (when you deploy) or during revalidation. The result can then be distributed and cached in a Content Delivery Network (CDN).

Whenever a user visits your application, the cached result is served. There are a couple of benefits of static rendering:
* Faster Websites - Prerendered content can be cached and globally distributed. This ensures that users around the world can access your website's content more quickly and reliably.
* Reduced Server Load - Because the content is cached, your server does not have to dynamically generate content for each user request.
* SEO - Prerendered content is easier for search engine crawlers to index, as the content is already available when the page loads. This can lead to improved search engine rankings.
Static rendering is useful for UI with no data or data that is shared across users, such as a static blog post or a product page. It might not be a good fit for a dashboard that has personalized data that is regularly updated.

The opposite of static rendering is dynamic rendering.

## Dynamic Rendering

With dynamic rendering, content is rendered on the server for each user at request time (when the user visits the page). There are a couple of benefits of dynamic rendering:
* Real-Time Data - Dynamic rendering allows your application to display real-time or frequently updated data. This is ideal for applications where data changes often.
* User-Specific Content - It's easier to serve personalized content, such as dashboards or user profiles, and update the data based on user interaction.
* Request Time Information - Dynamic rendering allows you to access information that can only be known at request time, such as cookies or the URL search parameters.
* You can use a Next.js API called unstable_noStore inside your Server Components or data fetching functions to opt out of static rendering. Let's add this.
 
**With dynamic rendering, your application is only as fast as your slowest data fetch.**

## Streaming

Streaming is a data transfer technique that allows you to break down a route into smaller "chunks" and progressively stream them from the server to the client as they become ready.

By streaming, you can prevent slow data requests from blocking your whole page. This allows the user to see and interact with parts of the page without waiting for all the data to load before any UI can be shown to the user.

There are two ways you implement streaming in Next.js:
* At the page level, with the loading.tsx file.
* For specific components, with <Suspense>.

`loading.tsx` is a special Next.js file built on top of Suspense, it allows you to create fallback UI to show as a replacement while page content loads.