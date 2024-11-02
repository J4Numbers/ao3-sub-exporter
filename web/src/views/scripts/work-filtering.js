function collapseFilterListItems(lookupClass, filterList) {
  let itemList = [];
  let items = document.getElementsByClassName(lookupClass);
  for (let itemNo=0; itemNo<items.length; ++itemNo) {
    let foundItem = items.item(itemNo).textContent;
    if (!filterList.includes(foundItem)) {
      filterList.push(foundItem);
    }
    itemList.push(foundItem);
  }
  return itemList;
}

function collapseClassListItems(lookupClass) {
  let itemList = [];
  let items = document.getElementsByClassName(lookupClass);
  for (let itemNo=0; itemNo<items.length; ++itemNo) {
    itemList.push(items.item(itemNo).textContent);
  }
  return itemList;
}

function gatherAvailableFilters() {
  const allFilters = {
    fandoms: [],
    characters: [],
    relationships: [],
    tags: [],
    categories: [],
    warnings: [],
    ratings: [],
    status: [],
  };

  workDetails
    .filter((work) => work.show)
    .forEach((work) => {
      work.fandoms.forEach((fandom) => {
        if (!allFilters.fandoms.includes(fandom)) {
          allFilters.fandoms.push(fandom);
        }
      });
      work.characters.forEach((character) => {
        if (!allFilters.characters.includes(character)) {
          allFilters.characters.push(character);
        }
      });
      work.relationships.forEach((relationship) => {
        if (!allFilters.relationships.includes(relationship)) {
          allFilters.relationships.push(relationship);
        }
      });
      work.tags.forEach((tag) => {
        if (!allFilters.tags.includes(tag)) {
          allFilters.tags.push(tag);
        }
      });
      work.categories.forEach((category) => {
        if (!allFilters.categories.includes(category)) {
          allFilters.categories.push(category);
        }
      });
      work.warnings.forEach((warning) => {
        if (!allFilters.warnings.includes(warning)) {
          allFilters.warnings.push(warning);
        }
      });
      work.ratings.forEach((rating) => {
        if (!allFilters.ratings.includes(rating)) {
          allFilters.ratings.push(rating);
        }
      });
      work.status.forEach((status) => {
        if (!allFilters.status.includes(status)) {
          allFilters.status.push(status);
        }
      });
    });

  return allFilters;
}

function gatherWorkDetails() {
  const ongoingWorkCollection = [];
  const allWorks = document.getElementsByClassName("subscription")

  for (let i=0; i < allWorks.length; ++i) {
    let workId = allWorks.item(i).id.match(/^subscription-work-([0-9]+)$/)[1];

    ongoingWorkCollection.push({
      id: workId,
      title: document.getElementById(`subscription-work-${workId}-title`).textContent,
      fandoms: collapseClassListItems(`${workId}-fandom`),
      characters: collapseClassListItems(`${workId}-character`),
      relationships: collapseClassListItems(`${workId}-relationship`),
      tags: collapseClassListItems(`${workId}-tag`),
      summary: document.getElementById(`subscription-work-${workId}-summary`).textContent,
      categories: collapseClassListItems(`${workId}-category`),
      warnings: collapseClassListItems(`${workId}-warning`),
      ratings: collapseClassListItems(`${workId}-rating`),
      words: document.getElementsByClassName(`${workId}-word-count`).item(0).textContent,
      kudos: document.getElementsByClassName(`${workId}-kudos-count`).item(0).textContent,
      status: collapseClassListItems(`${workId}-status`),
      url: document.getElementById(`${workId}-ao3-link`).href,
      show: true,
    });
  }
  return ongoingWorkCollection;
}

function renderFilters(filters, anchorId, actionFn) {
  const availableFiltersAnchor = document.getElementById(anchorId);
  availableFiltersAnchor.innerHTML = "";

  filters.fandoms.forEach((fandom) => {
    let fandomNode = document.createElement("span");
    fandomNode.classList.add("badge", "rounded-pill", "text-bg-secondary");
    fandomNode.addEventListener("click", (_ev) => actionFn("fandoms", fandom));
    fandomNode.textContent = fandom;
    availableFiltersAnchor.appendChild(fandomNode);
  });

  filters.characters.forEach((character) => {
    let chrNode = document.createElement("span");
    chrNode.classList.add("badge", "rounded-pill", "text-bg-primary");
    chrNode.addEventListener("click", (_ev) => actionFn("characters", character));
    chrNode.textContent = character;
    availableFiltersAnchor.appendChild(chrNode);
  });

  filters.relationships.forEach((relationship) => {
    let relationNode = document.createElement("span");
    relationNode.classList.add("badge", "rounded-pill", "text-bg-success");
    relationNode.addEventListener("click", (_ev) => actionFn("relationships", relationship));
    relationNode.textContent = relationship;
    availableFiltersAnchor.appendChild(relationNode);
  });

  filters.tags.forEach((tag) => {
    let tagNode = document.createElement("span");
    tagNode.classList.add("badge", "rounded-pill", "text-bg-secondary");
    tagNode.addEventListener("click", (_ev) => actionFn("tags", tag));
    tagNode.textContent = tag;
    availableFiltersAnchor.appendChild(tagNode);
  });

  filters.status.forEach((status) => {
    let statusNode = document.createElement("span");
    statusNode.classList.add("badge", "rounded-pill", "text-bg-success");
    statusNode.addEventListener("click", (_ev) => actionFn("status", status));
    statusNode.textContent = status;
    availableFiltersAnchor.appendChild(statusNode);
  });
}

function renderAvailableFilters() {
  const availableFilters = gatherAvailableFilters();
  renderFilters(availableFilters, 'available-filter-collection', addToActiveFilters);
}

function renderActiveFilters() {
  renderFilters(activeFilters, 'active-filter-collection', removeFromActiveFilters);
}

function applyFilters() {
  for (let workX=0; workX<workDetails.length; ++workX) {
    let show = true;
    for (let fandomFilterX=0; fandomFilterX<activeFilters.fandoms.length; ++fandomFilterX) {
      show = show && workDetails[workX].fandoms.includes(activeFilters.fandoms[fandomFilterX]);
    }
    for (let chrFilterX=0; chrFilterX<activeFilters.characters.length; ++chrFilterX) {
      show = show && workDetails[workX].characters.includes(activeFilters.characters[chrFilterX]);
    }
    for (let rlFilterX=0; rlFilterX<activeFilters.relationships.length; ++rlFilterX) {
      show = show && workDetails[workX].relationships.includes(activeFilters.relationships[rlFilterX]);
    }
    for (let tagFilterX=0; tagFilterX<activeFilters.tags.length; ++tagFilterX) {
      show = show && workDetails[workX].tags.includes(activeFilters.tags[tagFilterX]);
    }
    for (let statusFilterX=0; statusFilterX<activeFilters.status.length; ++statusFilterX) {
      show = show && workDetails[workX].status.includes(activeFilters.status[statusFilterX]);
    }

    workDetails[workX].show = show;
    let subscription = document.getElementById(`subscription-work-${workDetails[workX].id}`);
    if (show) {
      subscription.classList.remove("d-none");
    } else {
      subscription.classList.add("d-none")
    }
  }
}

const workDetails = gatherWorkDetails();
const activeFilters = {
  fandoms: [],
  characters: [],
  relationships: [],
  tags: [],
  categories: [],
  warnings: [],
  ratings: [],
  status: [],
}

renderAvailableFilters();


function addToActiveFilters(filterType, filter) {
  const index = activeFilters[filterType].indexOf(filter);
  if (index === -1) {
    activeFilters[filterType].push(filter);
  }
  renderActiveFilters();
  applyFilters();
  renderAvailableFilters();
}

function removeFromActiveFilters(filterType, filter) {
  const index = activeFilters[filterType].indexOf(filter);
  if (index > -1) {
    activeFilters[filterType].splice(index, 1);
  }
  renderActiveFilters();
  applyFilters();
  renderAvailableFilters();
}
