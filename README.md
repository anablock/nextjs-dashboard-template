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

