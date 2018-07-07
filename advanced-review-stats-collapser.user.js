// ==UserScript==
// @name         Advanced Review Stats TableCollapser
// @namespace    http://github.com/Vogel612
// @version      1.0
// @description  Collapse review-stats columns
// @updateURL    https://raw.githubusercontent.com/Vogel612/mini-se-userscripts/master/advanced-review-stats-collapser.user.js
// @downloadURL  https://raw.githubusercontent.com/Vogel612/mini-se-userscripts/master/advanced-review-stats-collapser.user.js
// @author       Vogel612
// @match        *://*.stackexchange.com/admin/review/breakdown*
// @match        *://*.stackoverflow.com/admin/review/breakdown*
// @match        *://*.superuser.com/admin/review/breakdown*
// @match        *://*.serverfault.com/admin/review/breakdown*
// @match        *://*.askubuntu.com/admin/review/breakdown*
// @match        *://*.stackapps.com/admin/review/breakdown*
// @match        *://*.mathoverflow.net/admin/review/breakdown*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let statsTable = document.querySelectorAll("#content .mainbar-full table")[0];
    let headers = Array.from(statsTable.getElementsByTagName("th"));
    let percentageHeaders = filterHeaders(headers);
    let collapsings = buildCollapseSpecs(headers, percentageHeaders);
    collapseTable(statsTable, collapsings);

    function filterHeaders(headers) {
        let percentageHeaders = [];
        for (let head of headers) {
            if (head.innerHTML.endsWith("%")) {
                percentageHeaders.push(head);
            }
        }
        return percentageHeaders;
    }

    function buildCollapseSpecs(headers, percentageHeaders) {
        let collapsings = [];
        for (let percentage of percentageHeaders) {
            let h = percentage.innerHTML;
            // drop trailing %
            let header = h.substr(0, h.length - 1);
            let from = headers.indexOf(percentage);
            // find matching non-percentage header
            var to = -1;
            for (let tableHead of headers) {
                if (tableHead.innerHTML === header) {
                    to = headers.indexOf(tableHead);
                    break;
                }
            }
            // we can't collapse upwards
            if (to !== -1 && to <= from) {
                collapsings.push({from: from, to: to});
            }
        }
        return collapsings;
    }


    function collapseTable(table, collapsings) {
        // sort collapsings by from descending to allow us to drop the column we're done with
        collapsings.sort((a,b) => { return b.from - a.from });

        // collapse the columns
        for (let collapse of collapsings) {
            for (let row of table.getElementsByTagName("tr")) {
                collapseRow(row, collapse);
            }
        }
    }

    function collapseRow(row, collapseSpec) {
        let from = row.children[collapseSpec.from];
        let percentageValue = from.innerHTML.trim();
        if (from.tagName === "TH") {
            row.children[collapseSpec.to].innerHTML += " (%)";
        } else {
            row.children[collapseSpec.to].innerHTML += " (" + percentageValue + ")";
        }
        row.removeChild(from);
    }
})();
