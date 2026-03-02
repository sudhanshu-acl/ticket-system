## Next Js learning

- A full stack reactjs library

1. System requirements
- Nodejs > 20.0
- `pnpm create next-app@latest my-app --yes` 
- You can check for manual setup on docs.

2. Check `package.json` file.

2. Next.js uses file-system routing, which means the routes in your application are determined by how you structure your files.

3. Both `layout.tsx` and `page.tsx` will be rendered when the user visits the root of your application (/).

4. Create a `src` folder inside keep your code so that config will be outside for better management.

5. `public` folder will be for handling  static assets.

6. Running dev server
`npm run dev`

7. Set up Absolute Imports and Module Path Aliases
`tsconfig.json`

`
// Before
import { Button } from '../../../components/button'
 
// After
import { Button } from '@/components/button'

`

```
# tsconfig.json

{
  "compilerOptions": {
    "baseUrl": "src/"
  }
}


```

## Project structure and organization

- Top-level files
   = next.config.js
   = src, app, pages, public,
   = proxy.ts

## Nested routes
Folders define URL segments. Nesting folders nests segments. Layouts at any level wrap their child segments. A route becomes public when a page or route file exists.

Path	URL pattern	Notes

app/layout.tsx	     —	    Root layout wraps all routes
app/blog/layout.tsx	 —	    Wraps /blog and descendants
app/page.tsx	     /	    Public route
app/blog/page.tsx	 /blog	Public route
app/blog/authors/page.tsx	/blog/authors	Public route

### Parallel and Intercepted Routes


## Organizing your project

- Next.js is unopinionate about how you oragnize and colocate your project files.

## Components hierarchy

- `layout.js`
- `template.js`
- `error.js` (React error boundary)
- `loading.js`(React suspense boundary)
- `not-found.js`(React boundary for "not found " UI)
- `page.js` or nested    `layout.js`
![alt text](image.png)

## Colocation

- In the app director, nested folder  define route structure. Each folder represents a route segment that is mapped to a corresponding segment in a URL path.

- However , even though route structure is defined through folder 


## Layout and pages
- Next.js uses files system routing, meaning you can use folders and files to define routes
- A layout is UI that is shared between multiple pages. On navigation, layouts preserve state, remain interactive, and do not rerender.

-> generating static props
-> route grouping
-> 

## Nesting layouts

## Creating a dynamic segment

- Dynamic segments allow you to create routes that are generated from data. 
- For example, instead of manually creating a route for each individual blog post, you can create a dynamic segment to generate the routes based on blog post data. 
`app/blog/[slug]/page.tsx`

## `function generateStaticParams() {}`
- generateStaticParams() runs at build time
- Build time screenshot
- 
![alt text](image-1.png)


## SSG VS DYANMIC RENDERING VS STATIC  BUILD DIFFERENCE
- Note the symbol used.

![alt text](image-2.png)


## Parallel route
![alt text](image-3.png)

Parallel route allow to render one or more page within the same layout
They are useful for highly dynamic sections of an app, such as dashboards and feeds on social sites.


- Slots are passed as props to the shared parent layout. For the example above, the component in app/layout.js now accepts the @analytics and @team slots props, and can render them in parallel alongside the children prop:
```
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}

```

## Conditional Routes
- You can use parallel Routes to conditional render routes
- Eg: For role based etc

![alt text](image-4.png)

```
import { checkUserRole } from '@/lib/auth'
 
export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode
  admin: React.ReactNode
}) {
  const role = checkUserRole()
  return role === 'admin' ? admin : user
}

```

## ENV
- `NEXT_PUBLIC_` are only accessed by client components.
- `API_BASE`     are accessed by Server components.

## How to manage backend API

- Create api inside the api folder
- ENV values
- Private folder so that it can not be accessible outside the folder





