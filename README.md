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

* stream specific components using React Suspense.  Suspense allows you to defer rendering parts of your application until some condition is met (e.g. data is loaded). You can wrap your dynamic components in Suspense. Then, pass it a fallback component to show while the dynamic component loads.

## Deciding where to place your Suspense boundaries

Where you place your Suspense boundaries will depend on a few things:
* How you want the user to experience the page as it streams.
* What content you want to prioritize.
* If the components rely on data fetching.
* Take a look at your dashboard page, is there anything you would've done differently?

You could stream the whole page like we did with loading.tsx... but that may lead to a longer loading time if one of the components has a slow data fetch.
You could stream every component individually... but that may lead to UI popping into the screen as it becomes ready.
You could also create a staggered effect by streaming page sections. But you'll need to create wrapper components.
Where you place your suspense boundaries will vary depending on your application. In general, it's good practice to move your data fetches down to the components that need it, and then wrap those components in Suspense. But there is nothing wrong with streaming the sections or the whole page if that's what your application needs.

## Partial Pre-rendering

Partial pre-rendering is a technique that allows you to pre-render only a part of your page. This is useful when you have a page with a mix of static and dynamic content.

Next.js 14 contains a preview of Partial Prerendering – an experimental feature that allows you to render a route with a static loading shell, while keeping some parts dynamic. In other words, you can isolate the dynamic parts of a route. 

When a user visits a route:

A static route shell is served, ensuring a fast initial load.
The shell leaves holes where dynamic content will load in asynchronous.
The async holes are streamed in parallel, reducing the overall load time of the page.
This is different from how your application behaves today, where entire routes are either entirely static or dynamic.

Partial Prerendering combines ultra-quick static edge delivery with fully dynamic capabilities and we believe it has the potential to become the default rendering model for web applications, bringing together the best of static site generation and dynamic delivery.

### How does Partial Prerendering work?
Partial Prerendering leverages React's Concurrent APIs and uses Suspense to defer rendering parts of your application until some condition is met (e.g. data is loaded).

The fallback is embedded into the initial static file along with other static content. At build time (or during revalidation), the static parts of the route are prerendered, and the rest is postponed until the user requests the route.

It's worth noting that wrapping a component in Suspense doesn't make the component itself dynamic (remember you used unstable_noStore to achieve this behavior), but rather Suspense is used as a boundary between the static and dynamic parts of your route.

The great thing about Partial Prerendering is that you don't need to change your code to use it. As long as you're using Suspense to wrap the dynamic parts of your route, Next.js will know which parts of your route are static and which are dynamic.

## URL Search Parameters
There are a couple of benefits of implementing search with URL params:
* **Bookmarkable and Shareable URLs**: Since the search parameters are in the URL, users can bookmark the current state of the application, including their search queries and filters, for future reference or sharing.
* **Server-Side Rendering and Initial Load**: URL parameters can be directly consumed on the server to render the initial state, making it easier to handle server rendering.
* **Analytics and Tracking**: Having search queries and filters directly in the URL makes it easier to track user behavior without requiring additional client-side logic.

## Adding the search functionality
These are the Next.js client hooks that you'll use to implement the search functionality:

* `useSearchParams`- Allows you to access the parameters of the current URL. For example, the search params for this URL /dashboard/invoices?page=1&query=pending would look like this: {page: '1', query: 'pending'}.
* `usePathname` - Lets you read the current URL's pathname. For example, for the route /dashboard/invoices, usePathname would return '/dashboard/invoices'.
* `useRouter` - Enables navigation between routes within client components programmatically. There are multiple methods you can use.

Here's a quick overview of the implementation steps:
1. Capture the user's input.
2. Update the URL with the search params.
3. Keep the URL in sync with the input field.
4. Update the table to reflect the search query.

"use client" - This is a Client Component, which means you can use event listeners and hooks.

Page components accept a prop called searchParams, so you can pass the current URL params to the <Table> component.

### When to use the useSearchParams() hook vs. the searchParams prop?

You might have noticed you used two different ways to extract search params. Whether you use one or the other depends on whether you're working on the client or the server.

* <Search> is a Client Component, so you used the useSearchParams() hook to access the params from the client.
* <Table> is a Server Component that fetches its own data, so you can pass the searchParams prop from the page to the component.

As a general rule, if you want to read the params from the client, use the useSearchParams() hook as this avoids having to go back to the server.

## Debouncing

Debouncing is a programming practice that limits the rate at which a function can fire. In our case, you only want to query the database when the user has stopped typing.

Debouncing is a great way to improve the performance of your application by reducing the number of times a function is called. It's especially useful when working with input fields, as it prevents the function from being called on every keystroke.

#### How Debouncing Works:

Trigger Event: When an event that should be debounced (like a keystroke in the search box) occurs, a timer starts.
Wait: If a new event occurs before the timer expires, the timer is reset.
Execution: If the timer reaches the end of its countdown, the debounced function is executed.

* fetch the data on the server, and pass it to the component as a prop.

## Server Actions

React Server Actions allow you to run asynchronous code directly on the server. They eliminate the need to create API endpoints to mutate your data. Instead, you write asynchronous functions that execute on the server and can be invoked from your Client or Server Components.

They offer an effective security solution, protecting against different types of attacks, securing your data, and ensuring authorized access. Server Actions achieve this through techniques like POST requests, encrypted closures, strict input checks, error message hashing, and host restrictions, all working together to significantly enhance your app's safety.

In React, you can use the action attribute in the <form> element to invoke actions. The action will automatically receive the native FormData object, containing the captured data.

```tsx
// Server Component
export default function Page() {
  // Action
  async function create(formData: FormData) {
    'use server';
 
    // Logic to mutate data...
  }
 
  // Invoke the action using the "action" attribute
  return <form action={create}>...</form>;
}
```

An advantage of invoking a Server Action within a Server Component is progressive enhancement - forms work even if JavaScript is disabled on the client.

### Steps to create a Server Action:
1. Create a form to capture the user's input.
2. Create a Server Action and invoke it from the form.
3. Inside your Server Action, extract the data from the formData object.
4. Validate and prepare the data to be inserted into your database.
5. Insert the data and handle any errors.
6. Revalidate the cache and redirect the user back to invoices page.

By adding the 'use server', you mark all the exported functions within the file as server functions. These server functions can then be imported into Client and Server components, making them extremely versatile.  You can also write Server Actions directly inside Server Components by adding "use server" inside the action.

Server Actions are also deeply integrated with Next.js caching. When a form is submitted through a Server Action, not only can you use the action to mutate data, but you can also revalidate the associated cache using APIs like revalidatePath and revalidateTag.

Behind the scenes, Server Actions create a POST API endpoint. This is why you don't need to create API endpoints manually when using Server Actions.

 If you're working with forms that have many fields, you may want to consider using the entries() method with JavaScript's `Object.fromEntries()`. For example:

```tsx
const rawFormData = Object.fromEntries(formData.entries())
```

### Type validation and coercion
It's important to validate that the data from your form aligns with the expected types in your database. For instance, if you add a console.log inside your action:
  
  ```tsx
  console.log(typeof rawFormData.amount)
  ```

You might notice that the amount is a string, even if you expect it to be a number. This is because the FormData object returns all values as strings. You can use the Number() function to coerce the string to a number:
  
  ```tsx
  const amount = Number(rawFormData.amount)
  ```

  To handle type validation, you have a few options. While you can manually validate types, using a type validation library can save you time and effort. For your example, we'll use Zod, a TypeScript-first validation library that can simplify this task for you.

  Zod is a TypeScript-first schema declaration and validation library. It's designed to be easy to use and understand, and it's a great fit for Next.js applications. You can use Zod to validate the data from your form and ensure that it aligns with the expected types in your database.

  To use Zod, you'll need to install it and create a schema that matches the expected types in your database. Then, you can use the schema to validate the data from your form.

  ```tsx

  import { z } from 'zod'

  const schema = z.object({
    amount: z.number(),
    date: z.string(),
    description: z.string(),
  })

  const validatedData = schema.parse(rawFormData)
  ```

  If the data from your form doesn't match the schema, Zod will throw an error. You can use a try...catch block to handle the error and provide feedback to the user.

  ```tsx
  try {
    const validatedData = schema.parse(rawFormData)
  } catch (error) {
    console.error(error)
  }
  ```
  You can also use Zod to coerce the data to the expected types. For example, you can use the .coerce() method to convert the date string to a Date object.

  ```tsx
  const schema = z.object({
    amount: z.number(),
    date: z.string().coerce((date) => new Date(date)),
    description: z.string(),
  })

  const validatedData = schema.parse(rawFormData)
  ```

### Revalidate and redirect

Next.js has a Client-side Router Cache that stores the route segments in the user's browser for a time. Along with prefetching, this cache ensures that users can quickly navigate between routes while reducing the number of requests made to the server.

When you mutate data, you need to revalidate the cache to ensure that the user sees the updated data. You can use the revalidatePath and revalidateTag APIs to revalidate the cache.

```tsx

import { revalidatePath } from 'next/router'

// Inside your Server Action
async function create(formData: FormData) {
  'use server'

  // Logic to mutate data...

  // Revalidate the cache
  revalidatePath('/dashboard/invoices')
}
```

You can also use the revalidateTag API to revalidate the cache based on a tag. This is useful when you want to revalidate the cache for multiple routes that share the same tag.

```tsx
import { revalidateTag } from 'next/router'

// Inside your Server Action
async function create(formData: FormData) {
  'use server'

  // Logic to mutate data...

  // Revalidate the cache
  revalidateTag('invoices')
}
```

When you revalidate the cache, the user's browser will make a request to the server to fetch the updated data. This ensures that the user sees the most up-to-date information.

When updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server. You can do this with the revalidatePath function from Next.js:

```tsx
import { revalidatePath } from 'next/router'

// Inside your Server Action
async function create(formData: FormData) {
  'use server'

  // Logic to mutate data...

  // Revalidate the cache
  revalidatePath('/dashboard/invoices')
}
```

## Steps to update an invoice:

1. Create a new dynamic route segment with the invoice id.
2. Read the invoice id from the page params.
3. Fetch the specific invoice from your database.
4. Pre-populate the form with the invoice data.
5. Update the invoice data in your database.

### Create a new dynamic route segment with the invoice `id`

Next.js allows you to create Dynamic Route Segments when you don't know the exact segment name and want to create routes based on data. This could be blog post titles, product pages, etc. You can create dynamic route segments by wrapping a folder's name in square brackets. For example, [id], [post] or [slug].

## Handling errors

* `error.tsx` is useful for catching all errors
* `notFound` can be used when you try to fetch a resource that doesn't exist
* `notFound` will take precedence over `error.tsx`, so you can reach out for it when you want to handle more specific errors

## React Hooks

### useFormState hook

Takes two arguments: (action, initialState).
Returns two values: [state, dispatch] - the form state, and a dispatch function (similar to useReducer)

## Authentication

The advantage of employing Middleware for this task is that the protected routes will not even start rendering until the Middleware verifies the authentication, enhancing both the security and performance of your application.

### Password hashing

It's good practice to hash passwords before storing them in a database. Hashing converts a password into a fixed-length string of characters, which appears random, providing a layer of security even if the user's data is exposed.

In your seed.js file, you used a package called bcrypt to hash the user's password before storing it in the database. You will use it again later in this chapter to compare that the password entered by the user matches the one in the database. However, you will need to create a separate file for the bcrypt package. This is because bcrypt relies on Node.js APIs not available in Next.js Middleware.