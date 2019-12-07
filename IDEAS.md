# moviez

## Non-functional Requirements
* Performant UI
  * Minimize load time 
    * Minimal dependencies
    * Code-splitting to minimize payload per page
    * *Server-side rendered / hydrate on client-side?*
  * Smooth scrolling of long list of content
    * Virtualized list
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

## Notes
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
