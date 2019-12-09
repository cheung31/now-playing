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
> One non-functional requirement I missed was test coverage. My initial feeling towards the entire scope is that it's not too complex.
> I'm relying on well-tested libraries. Where bugs could occur are related to the way I'm saving state and the shape of data that state is.
> If I had more time, I would add a basic test suite to assert API call payload structure. I would add some tests to assert when API calls fail and 
> how that gets displayed to the user.
 
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
