# ZxPagination

`ZxPagination` is a JavaScript library designed to simplify the process of creating paginated content with both client-side and server-side data fetching. It provides an easy-to-use interface for creating paginated data views in web applications.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [Fetching Data](#fetching-data)
  - [Updating Configuration](#updating-configuration)
  - [Reloading Data](#reloading-data)
- [Options](#options)
- [Events](#events)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

## Introduction

`ZxPagination` provides a flexible and customizable solution for handling paginated data views in your web applications. Whether you want to fetch data from a server or use client-side data, this library simplifies the process and offers various configuration options for tailoring the pagination experience to your needs.

## Installation

You can include `ZxPagination` in your project by including the following script tag in your HTML:

```html
<script src="path-to/zx-pagination.js"></script>
```

Replace `path-to` with the actual path to the `zx-pagination.js` file in your project.

## Usage

### Initialization

To create a paginated data view, you need to initialize an instance of the `ZxPagination` class. Here's how you can do it:

```javascript
const options = {
  // Configuration options (see below)
};

const pagination = new ZxPagination(options);
```

### Fetching Data

`ZxPagination` supports both client-side and server-side data fetching. The `mode` option specifies the fetching mode. You can fetch data manually using the `fetchData` method:

```javascript
pagination.fetchData(pageNumber);
```

### Updating Configuration

You can update the configuration of an existing `ZxPagination` instance using the `updateConfig` method:

```javascript
const newOptions = {
  // New configuration options
};

pagination.updateConfig(newOptions);
```

### Reloading Data

You can reload the current page of data using the `reload` method:

```javascript
await pagination.reload();
```

## Options

Here are the available configuration options that you can pass when initializing or updating a `ZxPagination` instance:

- `axiosConfig`: Configuration options for Axios (if using server-side data fetching).
- `initLoad`: Boolean indicating whether to load data immediately.
- `contentDiv`: ID of the container for displaying data content.
- `paginationDiv`: ID of the container for displaying pagination controls.
- `skeletonHtml`: HTML template for displaying loading skeleton.
- `template`: Function that generates HTML for each data item.
- `limit`: Number of items per page.
- `mode`: Fetching mode (`"client"` or `"server"`).
- `processing`: Processing mode (`"client"` or `"server"`).
- `dataSrc`: Array of data items (if using client-side data).
- `dataKey`: Key to access data in server response.
- `noDataHtml`: HTML for displaying when there is no data.
- `showPreviousNextButtons`: Boolean indicating whether to show previous/next buttons.
- `paginationButtonsToShow`: Number of pagination buttons to show.
- `onDataFetchSuccess`: Custom function to call on successful data fetch.
- `onDataFetchError`: Custom function to call on data fetch error.
- `paginationClass`: CSS class for the pagination container.
- `activePageClass`: CSS class for the active page button.
- `pageItemClass`: CSS class for pagination page item.
- `pageLinkClass`: CSS class for pagination page link.

## Events

`ZxPagination` triggers the following events:

- `onDataFetchSuccess(data)`: Triggered on successful data fetch.
- `onDataFetchError(error)`: Triggered on data fetch error.

## Customization

You can customize the appearance and behavior of the pagination controls and data content by updating the CSS classes and HTML templates used in the options.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests to help improve `ZxPagination`.

## License

`ZxPagination` is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
