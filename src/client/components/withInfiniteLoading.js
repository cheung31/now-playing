/*
 * Taken from [`yoavniran/convertFromGridToInfiniteProps.js`](https://gist.github.com/yoavniran/9e2a8972a8586cba7d949f448ff002f3)
 * This allows `react-window-infinite-loader` to support a `Grid`
 */

import React, { useRef, useEffect } from "react";
import InfiniteLoader from "react-window-infinite-loader";

export default function withInfiniteLoading(List) {
  return function Wrapper(props) {
    let {
      // Are there more items to load?
      // (This information comes from the most recent API request.)
      hasNextPage,

      // Are we currently loading a page of items?
      // (This may be an in-flight flag in your Redux store for example.)
      isNextPageLoading,

      // Array of items loaded so far.
      items,

      // Callback function responsible for loading the next page of items.
      loadNextPage,

      sortOrder,

      useOverscanForLoading,

      ...listProps
    } = props;
    // We create a reference for the InfiniteLoader
    const listRef = useRef(null);
    const hasMountedRef = useRef(false);

    // Each time the sort prop changed we called the method resetloadMoreItemsCache to clear the cache
    useEffect(() => {
      if (listRef.current && hasMountedRef.current) {
        listRef.current.resetloadMoreItemsCache();
      }
      hasMountedRef.current = true;
    }, [sortOrder]);

    // If there are more items to be loaded then add an extra row to hold a loading indicator.
    let itemCount;
    if (!items) {
      itemCount = 0;
    } else {
      itemCount = hasNextPage ? items.length + 1 : items.length;
    }

    // Only load 1 page of items at a time.
    // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
    const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;

    // Every row is loaded except for our loading indicator row.
    const isItemLoaded = index => !hasNextPage || index < items.length;

    // Render an item or a loading indicator.
    const Item = ({ index, style }) => {
      let content;
      if (!isItemLoaded(index)) {
        content = "Loading...";
      } else {
        content = items[index].name;
      }

      return <div style={style}>{content}</div>;
    };

    // We passed down the ref to the InfiniteLoader component
    return (
      <InfiniteLoader
        ref={listRef}
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <List
            {...listProps}
            ref={ref}
            onItemsRendered={(data) => {
              const normalizedData = normalizeOnItemsRenderedData(data, useOverscanForLoading);
              onItemsRendered(normalizedData);
              if (listProps.onItemsRendered) {
                listProps.onItemsRendered(data);
              }
            }}
          >
            {listProps.children}
          </List>
        )}
      </InfiniteLoader>
    );
  }
}

function normalizeOnItemsRenderedData(data, useOverscanForLoading = true) {
  const {
    visibleRowStartIndex,
    visibleRowStopIndex,
    visibleColumnStopIndex,
    overscanRowStartIndex,
    overscanRowStopIndex,
    overscanColumnStopIndex
  } = data;

  if (data.hasOwnProperty('visibleStartIndex') && data.hasOwnProperty('visibleStopIndex')) {
    return data;
  }

  const endCol =
    (useOverscanForLoading ? overscanColumnStopIndex : visibleColumnStopIndex) + 1;

  const startRow = (useOverscanForLoading ? overscanRowStartIndex : visibleRowStartIndex);
  const endRow = (useOverscanForLoading ? overscanRowStopIndex : visibleRowStopIndex);

  const visibleStartIndex = startRow * endCol;
  const visibleStopIndex = endRow * endCol;

  return {
    visibleStartIndex,
    visibleStopIndex
  };
}
