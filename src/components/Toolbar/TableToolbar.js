// @flow
import * as React from "react";
import { withTheme } from "styled-components";
import { Editor } from "slate-react";
import {
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  InsertLeftIcon,
  InsertRightIcon,
  InsertAboveIcon,
  InsertBelowIcon,
  TrashIcon,
} from "outline-icons";

import type { Theme } from "../../types";
import ToolbarButton from "./ToolbarButton";
import Separator from "./Separator";

type Props = {
  isRowSelected: boolean,
  isColumnSelected: boolean,
  isTableSelected: boolean,
  editor: Editor,
  theme: Theme,
};

class TableToolbar extends React.Component<Props> {
  hasAlign = (align: string) => {
    try {
      const { editor } = this.props;
      const { startBlock, document } = editor.value;
      const position = editor.getPositionByKey(document, startBlock.key);

      return (
        position.cell.data.get("align") === align ||
        startBlock.data.get("align") === align
      );
    } catch (_err) {
      return false;
    }
  };

  onClickAlign = (ev, align) => {
    ev.preventDefault();
    ev.stopPropagation();

    const { editor } = this.props;
    const { startBlock, document } = editor.value;
    const position = editor.getPositionByKey(document, startBlock.key);
    editor.moveSelection(position.getColumnIndex(), position.getRowIndex());
    editor.setColumnAlign(align);
  };

  renderAlignButton = (align: string, IconClass: Function) => {
    const isActive = this.hasAlign(align);
    const onMouseDown = ev => this.onClickAlign(ev, align);

    return (
      <ToolbarButton
        onMouseDown={onMouseDown}
        active={isActive}
        title={`Align ${align}`}
      >
        <IconClass color={this.props.theme.toolbarItem} />
      </ToolbarButton>
    );
  };

  removeTable = ev => {
    ev.preventDefault();
    this.props.editor.removeTable().blur();
  };

  addRowBelow = ev => {
    ev.preventDefault();

    const { editor } = this.props;
    const { startBlock, document } = editor.value;
    const position = editor.getPositionByKey(document, startBlock.key);
    editor
      .clearSelected(position.table)
      .insertRow(position.getRowIndex() + 1)
      .resetAlign(position.table, position.getRowIndex() + 1)
      .blur();
  };

  addRowAbove = ev => {
    ev.preventDefault();

    const { editor } = this.props;
    const { startBlock, document } = editor.value;
    const position = editor.getPositionByKey(document, startBlock.key);
    editor
      .clearSelected(position.table)
      .insertRow(position.getRowIndex())
      .resetAlign(position.table, position.getRowIndex())
      .blur();
  };

  removeRow = ev => {
    ev.preventDefault();
    this.props.editor.removeRow().blur();
  };

  addColumnRight = ev => {
    ev.preventDefault();
    const { editor } = this.props;
    const { startBlock, document } = editor.value;
    const position = editor.getPositionByKey(document, startBlock.key);

    this.props.editor.clearSelected(position.table).insertColumn();
  };

  addColumnLeft = ev => {
    ev.preventDefault();
    const { editor } = this.props;
    const { startBlock, document } = editor.value;
    const position = editor.getPositionByKey(document, startBlock.key);

    editor
      .insertColumn(position.getColumnIndex())
      .clearSelected(position.table)
      .moveSelectionBy(-1, 0);
  };

  removeColumn = ev => {
    ev.preventDefault();
    this.props.editor.removeColumn().blur();
  };

  render() {
    const { isRowSelected, isColumnSelected, isTableSelected } = this.props;

    return (
      <React.Fragment>
        {isTableSelected && (
          <ToolbarButton onMouseDown={this.removeTable} title="Remove table">
            <TrashIcon color={this.props.theme.toolbarItem} />
          </ToolbarButton>
        )}
        {isColumnSelected && (
          <React.Fragment>
            {this.renderAlignButton("left", AlignLeftIcon)}
            {this.renderAlignButton("center", AlignCenterIcon)}
            {this.renderAlignButton("right", AlignRightIcon)}
            <Separator />
            <ToolbarButton
              onMouseDown={this.removeColumn}
              title="Remove column"
            >
              <TrashIcon color={this.props.theme.toolbarItem} />
            </ToolbarButton>
            <Separator />
            <ToolbarButton
              onMouseDown={this.addColumnLeft}
              title="Insert column left"
            >
              <InsertLeftIcon color={this.props.theme.toolbarItem} />
            </ToolbarButton>
            <ToolbarButton
              onMouseDown={this.addColumnRight}
              title="Insert column right"
            >
              <InsertRightIcon color={this.props.theme.toolbarItem} />
            </ToolbarButton>
          </React.Fragment>
        )}
        {isRowSelected && (
          <React.Fragment>
            <ToolbarButton onMouseDown={this.removeRow} title="Remove row">
              <TrashIcon color={this.props.theme.toolbarItem} />
            </ToolbarButton>
            <Separator />
            <ToolbarButton
              onMouseDown={this.addRowAbove}
              title="Insert row above"
            >
              <InsertAboveIcon color={this.props.theme.toolbarItem} />
            </ToolbarButton>
            <ToolbarButton
              onMouseDown={this.addRowBelow}
              title="Insert row below"
            >
              <InsertBelowIcon color={this.props.theme.toolbarItem} />
            </ToolbarButton>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default withTheme(TableToolbar);
