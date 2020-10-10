/**
 * Copyright Schrodinger, LLC
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule columnTemplates
 */
import forEach from 'lodash/forEach';
import { createSelector } from 'reselect';

import columnWidths from './columnWidths';

/**
 * @typedef {{
 *   props: !Object,
 *   template: React.ReactElement,
 * }}
 */
let cellDetails;

/**
 * @typedef {{
 *   cell: !Array.<cellDetails>,
 *   footer: !Array.<cellDetails>,
 *   header: !Array.<cellDetails>,
 * }}
 */
let columnDetails;

/**
 * Lists of cell templates & component props for
 * the fixed and scrollable columns and column groups
 *
 * @param {{
 *   columnGroupProps: !Array.<!Object>,
 *   columnProps: !Array.<!Object>,
 * }} columnWidths
 * @param {{
 *   cell: !Array.<React.ReactElement>,
 *   footer: !Array.<React.ReactElement>,
 *   groupHeader: !Array.<React.ReactElement>,
 *   header: !Array.<React.ReactElement>,
 * }} elementTemplates
 * @return {{
 *   fixedColumnGroups: !Array.<cellDetails>,
 *   fixedRightColumnGroups: !Array.<cellDetails>,
 *   scrollableColumnGroups: !Array.<cellDetails>,
 *   fixedColumns: !Array.<columnDetails>,
 *   fixedRightColumns: !Array.<columnDetails>,
 *   scrollableColumns: !Array.<columnDetails>,
 * }}
 */
function columnTemplates(columnWidths, elementTemplates) {
  const { columnGroupProps, columnProps } = columnWidths;

  // Ugly transforms to extract data into a row consumable format.
  // TODO (jordan) figure out if this can efficiently be merged with
  // the result of convertColumnElementsToData.
  const fixedColumnGroups = [];
  const fixedRightColumnGroups = [];
  const scrollableColumnGroups = [];
  forEach(columnGroupProps, (columnGroup, index) => {
    const groupData = {
      props: columnGroup,
      template: elementTemplates.groupHeader[index],
    };
    if (columnGroup.fixed) {
      fixedColumnGroups.push(groupData);
    } else if (columnGroup.fixedRight) {
      fixedRightColumnGroups.push(groupData);
    } else {
      scrollableColumnGroups.push(groupData);
    }
  });

  const fixedColumns = {
    cell: [],
    header: [],
    footer: [],
  };
  const fixedRightColumns = {
    cell: [],
    header: [],
    footer: [],
  };
  const scrollableColumns = {
    cell: [],
    header: [],
    footer: [],
  };
  forEach(columnProps, (column, index) => {
    let columnContainer = scrollableColumns;
    if (column.fixed) {
      columnContainer = fixedColumns;
    } else if (column.fixedRight) {
      columnContainer = fixedRightColumns;
    }

    columnContainer.cell.push({
      props: column,
      template: elementTemplates.cell[index],
    });
    columnContainer.header.push({
      props: column,
      template: elementTemplates.header[index],
    });
    columnContainer.footer.push({
      props: column,
      template: elementTemplates.footer[index],
    });
  });

  return {
    fixedColumnGroups,
    fixedColumns,
    fixedRightColumnGroups,
    fixedRightColumns,
    scrollableColumnGroups,
    scrollableColumns,
  };
}

export default createSelector([
  state => columnWidths(state),
  state => state.elementTemplates,
], columnTemplates);
