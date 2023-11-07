class ZxPagination {
    constructor(options) {
        this.axiosConfig = options.axiosConfig;
        this.initLoad = options.initLoad || false;
        this.contentDiv = options.contentDiv;
        this.paginationDiv = options.paginationDiv;
        this.skeletonHtml = options.skeletonHtml;
        this.noDataHtml = options.noDataHtml || "No Data is on Server";
        this.template = options.template;
        this.htmlUpdateMode = options.htmlUpdateMode || "single";
        this.limit = options.limit || 10;
        this.mode = options.mode || "client";
        this.processing = options.processing || "client";
        this.dataSrc = options.dataSrc || [];
        this.currentPage = 1;
        this.recordsTotal = 0;
        this.recordsFiltered = 0;
        this.isFetching = false;
        this.dataKey = options.dataKey || "data";
        this.skeletonHtmlShown = false;
        this.showPreviousNextButtons = options.showPreviousNextButtons || false;
        this.paginationButtonsToShow = options.paginationButtonsToShow || 3;
        this.onDataFetchSuccess = options.onDataFetchSuccess || null;
        this.onDataFetchError = options.onDataFetchError || null;
        this.paginationClass =
            options.paginationClass || "pagination mb-0";
        this.activePageClass = options.activePageClass || "active";
        this.pageItemClass = options.pageItemClass || "page-item";
        this.pageLinkClass = options.pageLinkClass || "page-link";

        if (this.initLoad) {
            this.init();
        }
    }

    async fetchData(pageNumber) {
        if (this.isFetching) return;
        this.isFetching = true;

        this.currentPage = pageNumber;

        try {
            this.showSkeletonHtml();

            let start = 0;
            if (this.mode === "client") {
                start = (pageNumber - 1) * this.limit;
            } else if (this.mode === "server") {
                start = (this.currentPage - 1) * this.limit;
            } else {
                throw new Error(`Invalid mode: ${this.mode}`);
            }

            start = Math.max(start, 0);

            let response;
            if (this.mode === "client") {
                // Fetch data from client dataSrc
                const startIndex = start;
                const endIndex = startIndex + this.limit;
                const data = this.dataSrc.slice(startIndex, endIndex);

                response = {
                    data: { [this.dataKey]: data },
                    recordsTotal: this.dataSrc.length,
                    recordsFiltered: this.dataSrc.length,
                };
            } else if (this.mode === "server") {
                // Fetch data from server using axios
                const dataRequest = {
                    start: start,
                    limit: this.limit,
                    ...this.axiosConfig.data,
                };
                response = await axios({
                    method: this.axiosConfig.method || "post",
                    url: this.axiosConfig.url,
                    data: dataRequest,
                    headers: this.axiosConfig.headers || {},
                });
            }

            if (response.data.success) {
                const data = response.data[this.dataKey];
                this.recordsTotal = data.config.recordsTotal;
                this.recordsFiltered = data.config.recordsFiltered;
                this.currentPage = pageNumber;
                this.updateContent(data.data);
                this.updatePagination();
            } else {
                this.handleFetchError(response.data.notify);
            }
        } catch (error) {
            this.handleFetchError(error);
        } finally {
            this.isFetching = false;
            this.hideSkeletonHtml();
        }
    }

    setHtmlUpdateMode(htmlUpdateMode) {
        this.htmlUpdateMode = htmlUpdateMode;
    }

    handleFetchError(error) {
        console.log(error);
    }

    /*
  updateContent(data) {
    const targetContentContainer = document.getElementById(this.contentDiv);
    if (!targetContentContainer) return;

    if (Array.isArray(data)) {
      if (data.length === 0) {
        targetContentContainer.innerHTML = this.noDataHtml;
      } else {
        const contentHtml = data.map(this.template).join("");
        targetContentContainer.innerHTML = contentHtml;
      }
    } else if (typeof data === "string") {
      targetContentContainer.innerHTML = data;
    }
    const event = new Event("updateContentSuccess");
      document.dispatchEvent(event);
  }
  */

    updateContent(data) {
        const targetContentContainer = document.getElementById(this.contentDiv);
        if (!targetContentContainer) return;

        if (Array.isArray(data)) {
            if (data.length === 0) {
                targetContentContainer.innerHTML = this.noDataHtml;
            } else {
                if (this.htmlUpdateMode === "bulk") {
                    const contentHtml = data.map(this.template).join("");
                    targetContentContainer.innerHTML = contentHtml;
                } else {
                    data.forEach((item) => {
                        const contentHtml = this.template(item);
                        targetContentContainer.insertAdjacentHTML(
                            "beforeend",
                            contentHtml
                        );
                        const event = new Event("updateContentSuccess");
                        setTimeout(function() {
                          document.dispatchEvent(event);
                        }, 1);
                    });
                }
            }
        } else if (typeof data === "string") {
            targetContentContainer.innerHTML = data;
        }else{
            targetContentContainer.innerHTML = this.noDataHtml;
        }

        const event = new Event("updateAllContentSuccess");
        setTimeout(function() {
          document.dispatchEvent(event);
        }, 1);
    }

    addEventListener(eventType, callback) {
        document.addEventListener(eventType, callback);
    }

    showSkeletonHtml() {
        const targetContentContainer = document.getElementById(this.contentDiv);
        if (!targetContentContainer) return;

        const skeletonHtmlArray = new Array(this.limit).fill(this.skeletonHtml);
        const combinedSkeletonHtml = skeletonHtmlArray.join("");

        targetContentContainer.innerHTML = combinedSkeletonHtml;
        this.skeletonHtmlShown = true;
    }

    hideSkeletonHtml() {
        if (this.skeletonHtmlShown) {
            const targetContentContainer = document.getElementById(
                this.contentDiv
            );
            if (targetContentContainer) {
                const skeletonHtmlArray = new Array(this.limit).fill(
                    this.skeletonHtml
                );
                const combinedSkeletonHtml = skeletonHtmlArray.join("");

                // Replace the skeleton HTML with an empty string
                targetContentContainer.innerHTML =
                    targetContentContainer.innerHTML.replace(
                        combinedSkeletonHtml,
                        ""
                    );

                this.skeletonHtmlShown = false;
            }
        }
    }

    updatePagination() {
        const targetPaginationContainer = document.getElementById(
            this.paginationDiv
        );
        if (!targetPaginationContainer) return;

        const numPages = Math.ceil(this.recordsTotal / this.limit);
        const halfButtons = Math.floor(this.paginationButtonsToShow / 2);
        let startPage = this.currentPage - halfButtons;
        startPage = Math.max(startPage, 1);
        let endPage = startPage + this.paginationButtonsToShow - 1;
        endPage = Math.min(endPage, numPages);

        const maxVisibleButtons = this.paginationButtonsToShow + 2; // Include prev/next buttons
        const maxPagesToShow =
            numPages > maxVisibleButtons ? maxVisibleButtons : numPages;

        if (numPages > maxVisibleButtons) {
            if (this.currentPage <= halfButtons + 1) {
                endPage = maxPagesToShow - 1;
            } else if (this.currentPage >= numPages - halfButtons) {
                startPage = numPages - maxPagesToShow + 2;
            } else {
                startPage = this.currentPage - halfButtons;
                endPage = this.currentPage + halfButtons;
            }
        }

        let paginationHtml = `<nav><ul class="${this.paginationClass}">`;

        if (this.showPreviousNextButtons && this.currentPage > 1) {
            let dataprevpage = this.currentPage - 1;
            paginationHtml += `<li class="${this.pageItemClass}">
        <a class="${this.pageLinkClass}" href="#" data-page="${dataprevpage}" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>`;
        }

        if (startPage > 1) {
            paginationHtml += `<li class="${this.pageItemClass}">
        <a class="${this.pageLinkClass}" href="#" data-page="1">1</a>
      </li>`;
            if (startPage > 2) {
                paginationHtml += `<li class="page-item disabled">
          <span class="${this.pageLinkClass}">...</span>
        </li>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `<li class="${this.pageItemClass} ${
                this.currentPage === i ? this.activePageClass : ""
            }">
        <a class="${this.pageLinkClass}" href="#" data-page="${i}">${i}</a>
      </li>`;
        }

        if (endPage < numPages) {
            if (endPage < numPages - 1) {
                paginationHtml += `<li class="page-item disabled">
          <span class="${this.pageLinkClass}">...</span>
        </li>`;
            }
            paginationHtml += `<li class="${this.pageItemClass}">
        <a class="${this.pageLinkClass}" href="#" data-page="${numPages}">${numPages}</a>
      </li>`;
        }

        if (this.showPreviousNextButtons && this.currentPage < numPages) {
            let datanextpage = this.currentPage + 1;
            paginationHtml += `<li class="${this.pageItemClass}">
        <a class="${this.pageLinkClass}" href="#" data-page="${datanextpage}" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>`;
        }

        paginationHtml += `</ul></nav>`;
        targetPaginationContainer.innerHTML = paginationHtml;

        const paginationLinks = targetPaginationContainer.querySelectorAll(
            `.${this.pageLinkClass}`
        );

        paginationLinks.forEach((link) => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                const pageNumber =
                    Number(event.target.getAttribute("data-page")) ??
                    Number(
                        event.target
                            .closest(`.${this.pageItemClass}`)
                            .getAttribute("data-page")
                    );
                console.log(
                    "A Before : " +
                        event.target.getAttribute("data-page") +
                        "#" +
                        pageNumber +
                        "#" +
                        this.currentPage
                );
                if (pageNumber !== this.currentPage) {
                    this.currentPage = pageNumber; // Update the currentPage here
                    console.log(
                        "B Before : " + pageNumber + "#" + this.currentPage
                    );
                    this.fetchData(this.currentPage);
                }
            });
        });
    }

    init() {
        const targetContentContainer = document.getElementById(this.contentDiv);
        if (!targetContentContainer) return;

        this.fetchData(1);
    }

    async reload() {
        this.currentPage = 1; // Reset currentPage to 1 before fetching data
        await this.fetchData(this.currentPage);
    }

    async updateConfig(options) {
        if (!options) return;

        const {
            axiosConfig,
            initLoad,
            contentDiv,
            paginationDiv,
            skeletonHtml,
            template,
            limit,
            mode,
            processing,
            dataSrc,
            dataKey,
            noDataHtml,
            showPreviousNextButtons,
            paginationButtonsToShow,
            onDataFetchSuccess,
            onDataFetchError,
            paginationClass,
            activePageClass,
            pageItemClass,
            pageLinkClass,
        } = options;

        if (axiosConfig)
            this.axiosConfig = { ...this.axiosConfig, ...axiosConfig };
        if (initLoad !== undefined) this.initLoad = initLoad;
        if (contentDiv) this.contentDiv = contentDiv;
        if (paginationDiv) this.paginationDiv = paginationDiv;
        if (skeletonHtml) this.skeletonHtml = skeletonHtml;
        if (template) this.template = template;
        if (limit !== undefined) this.limit = limit;
        if (mode) this.mode = mode;
        if (processing) this.processing = processing;
        if (dataSrc) this.dataSrc = dataSrc;
        if (dataKey) this.dataKey = dataKey;
        if (noDataHtml) this.noDataHtml = noDataHtml;
        if (showPreviousNextButtons !== undefined)
            this.showPreviousNextButtons = showPreviousNextButtons;
        if (paginationButtonsToShow)
            this.paginationButtonsToShow = paginationButtonsToShow;
        if (onDataFetchSuccess) this.onDataFetchSuccess = onDataFetchSuccess;
        if (onDataFetchError) this.onDataFetchError = onDataFetchError;
        if (paginationClass) this.paginationClass = paginationClass;
        if (activePageClass) this.activePageClass = activePageClass;
        if (pageItemClass) this.pageItemClass = pageItemClass;
        if (pageLinkClass) this.pageLinkClass = pageLinkClass;

        if (this.initLoad || this.skeletonHtmlShown) {
            await this.fetchData(this.currentPage);
        }
    }
}

export default ZxPagination;