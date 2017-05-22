// ==UserScript==
// @name         Documentation contributor links
// @namespace    http://github.com/Vogel612/mini-se-userscripts/documentation-contributor-breakdown
// @version      0.2
// @description  Add links to the contributor breakdown for topics and examples on stackoverflow documentation.
// @author       Vogel612
// @include      /https?:\/\/stackoverflow\.com\/documentation\/.*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    // these are in here for debugging purposes
    document.addLinks = addLinks;
    document.addContributorLink = addContributorLink;
    addLinks();
})();
// because the page is modified on SE side after loading. 2 secs should be enough to wait

function addLinks() {
    'use strict';
    let topicLink = document.querySelectorAll("a.doc-topic-link")[0];
    let topicMenuContainer = document.querySelector(".topic-section div.docs-menu .menu-for-show");
    addContributorLink("topic", topicLink.href.split('/')[5], topicMenuContainer);

    let exampleLinks = document.querySelectorAll(".example-link a.doc-example-link");
    let exampleMenus = document.querySelectorAll("div.example-menu.docs-menu .menu-for-show");
    for (var i = 0; i < exampleLinks.length; i++) {
        let currentLink = exampleLinks[i];
        let currentMenuContainer = exampleMenus[i];
        addContributorLink("example", currentLink.href.split('/')[7], currentMenuContainer);
    }
}

function addContributorLink(section, linkId, menu) {
    'use strict';
    menu.insertAdjacentHTML('beforeend',
           `<a href="/documentation/contributors/${section}/${linkId}" target="cb_${linkId}" title="Contributor Breakdown">CB</a>`);
}
