# My thoughts and ideas

> Here's the general thought process I took when figuring out and evaluating what to optimize for.
> I typically start identifying non-functional requirements alongside functional requirements.
> Non-functional requirements can help influence architecture. Functional requirements are the explicit features we need to deliver.

## Non-functional Requirements
* Performant UI
  * Minimize load time 
    * Minimal dependencies
    * Code-splitting to minimize payload per page
    * Server-side rendered / hydrate on client-side
  * Smooth scrolling of long list of content
    * Virtualized list
* SEO friendly
  * Content should be part of server HTML document response (server-side rendered) such that content is crawlable
* Continuity in user flow
  * Navigating from a list retains scroll position when returning to that list
* Mobile / desktop friendly
  * UI layout intuitively according to device size
* Secure secrets/keys from client-side
  * Defer to proxy server to facilitate API calls requiring API key.
* Test coverage
  * Have some basic unit tests to prevent regressions. (~75% coverage)
    
## Functional Requirements
* See list of movies
  * Fetch `Now Playing` list of movies
  * Can display entire list
    * Paginated list
    * Infinite list
* See details of a movie
  * Navigate to new screen
  * Fetch `Movie Details` of a particular movie
  * Navigate back to list/dismiss details, retains scroll position in list
 
> As mentioned above, the architecture is influenced a lot by the non-functional requirements I thought should be a priority.
> This led to a client/server application. The server helps proxy API calls to avoid cross-origin resource sharing issues.
> It also helps secure the API key and not expose from the client-side if we were to directly hit the 3rd-party API.
> The server also gives us an opportunity to server-side render some of the UI which can be a benefit for SEO and enhances page load performance
> and time to first interaction. One trade-off of this is the overhead of a proxy server. I have to replicate some endpoints to pass-through API calls.
>
> On the client-side, I wanted the application to be responsive on different device sizes. I also wanted to ensure scroll performance
> and memory footprint was minimal. To achieve this on a large list of data (~1000 items), I relied on a virtualized list which
> puts an upper bound on the number of DOM elements to represent the list. Looking at the repsonse of the API
> it appears the list is paginated. So in addition to a virtualized list, we can use an infinite loading technique to load additional pages.
>
> I decided to rely on some open-source libraries to help with some of the complexity since I've seen high adoption/activity in their 
> respective GitHub repos. Below, you can see more details on why a specific framework/library was chosen.
>
> See below on thoughts after finishing my submission about things I'd change or do differently if I had more time.
 
 ## Architecture
 The architecture / choice of dependencies will be influenced by both non-functional and functional requirements listed above.
 * Server-side
   * Server-side rendering + Client-side hydration
     * [Razzle](https://github.com/jaredpalmer/razzle)
       * Various approaches to this. Some require adopting to a whole platform/ecosystem (Next.js). These are a bit too opinionated. 
       * Razzle differs in that it's agnostic to platform/framework/libraries. Can configure component library, router, data fetching, etc.
       * Razzle has a nice CLI scaffolder synonymous to `create-react-app`
   * Secure secrets / keys from client-side
     * Leverage `express` server scaffolded by `create-razzle-app` to proxy TMDB API requests to hide API key from client 
     * Use `.env` convention and `dotenv` package to capture secrets/environment variables
 * Client-side
   * Responsive layout
     * Utility-first CSS to systematically layout components for various device sizes
     * [Tailwind CSS](https://tailwindcss.com/) - Use `base` and `utilities`
   * To ensure list continuity
     * 2-column list/detail view on large devices (list does not unmount)
     * 1-column Stack-based views on smaller devices (list does not unmount)
     * In both cases, do not unmount list in order to maintain scroll position. Memory concerns addressed by list virtualization.
   * To ensure scroll performance, use virtualized list
     * [react-window](https://github.com/bvaughn/react-window)
   * API fetching
     * [axios](https://github.com/axios/axios) - Client-side HTTP request library
     
## Things I'd Change

> I decided to de-prioritize test coverage in my non-functional requirements. Looking at the scope of the project, I 
> felt like this is a read-only application. There's not a lot of risk in such an application. Where bugs can arise is 
> how I fetch the data, and manipulate it for display. And also what happens when the API I'm fetching fails. If I had 
> more time I'd write a basic test suite to assert those two things at minimum.
>
> I was not able to implement the "list continuity" feature. Because I'm keeping my state minimal (no Redux), I don't have a way
> to capture state across multiple components outside of their lifecycles. At the moment once the list unmounts after a 
> route change, the loaded movies data will be garbage collected. If I had more time, I'd add Redux to manage the list and pagination
> such that I could return to the Now Playing route, and have the list re-render the loaded content from memory and scroll to the 
> appropriate scroll offset.
>
> From a tech debt perspective, I would avoid inlining `style`s. I had a mix of css files and inline. If I had time to refactor
> I would use a utility-first CSS framework (Tailwind utilities) to help with layout. To remove the inline styles, I would
> use some CSS in JS framework such as `styled-components`. I find when I'm prototyping it's easier to inline things to quickly 
> experiment with an idea. I also had to find a pattern to implement initial data fetching for server-side async content.
> I stumbled upon a solution online that mimicked Next.js's `getInitialState`. While it works and is quite simple to add on,
> have to create some conventions around defining routes (see `routes.js`) and adding a static method `getInitialData` on each Page component.

## Random notes for myself
* Movie DB API
  * Register API Key
  * Look at movies related endpoints
    * List Movies
      * [Latest](https://developers.themoviedb.org/3/movies/get-latest-movie)
      * [Now Playing](https://developers.themoviedb.org/3/movies/get-now-playing)
      * [Popular](https://developers.themoviedb.org/3/movies/get-popular-movies)
      * [Top Rated](https://developers.themoviedb.org/3/movies/get-top-rated-movies)
      * [Upcoming](https://developers.themoviedb.org/3/movies/get-upcoming)
    * Movie Details
      * [Movie Details](https://developers.themoviedb.org/3/movies/get-movie-details)
  * Observations
    * All endpoints for this application are read-only
* Server-side
  * Basic pass-through API to avoid CORS issues and secure API Key on API requests
* Client-side
  * List must support pagination. Either load when reach scroll end or explicit pagination buttons
  * Consider size of list. If extremely large list, must be mindful of memory, DOM insertions, and how it may effect scrolling.
    * For extremely large list size, consider a virtualized list.
