'use strict';

const { EOL } = require('os');

const TAB = '  ';
const SEP = new Array(70).join('-');

function cleanText(text) {
  // eslint-disable-next-line
  return text.replace(/\x1B\[(?:[0-9]{1,2}(?:;[0-9]{1,2})?)?[m|K]/g, '');
}

class UI  {
  constructor() {
    this.stream = process.stdout;
  }

  /**
   * Write messages to the stream
   * @param msgs messages to write
   */
  write(...msgs) {
    this.append(...msgs).stream.write(EOL);
    return this;
  }

  /**
   * Append text to existing line
   * @param  {...any} msgs
   */
  append(...msgs) {
    msgs.forEach((msg, i) => this.stream.write(`${i ? TAB : ''}${msg}`));
    return this;
  }
  
  /**
   * Print messages to the ui stream
   * @param msg messages to print
   */
  output(...msg) {
    return this.write(...msg);
  }

  paragraph(body, tab = 0) {
    return this.output().outputLines(body, tab).output();
  }

  banner(body, tab = 0) {
    return this.sep().outputLines(body, tab).sep();
  }

  sep() {
    return this.output(SEP);
  }

  /**
   * Print a section to the ui with heading.
   * @param heading section heading
   * @param body section text
   */
  outputSection(heading, body) {
    return this.write(`${EOL}${heading}:${EOL + EOL}${this._indentLines(body, 1)}`);
  }
  /**
   * Print a multiline message with specified indentation
   * @param body message to print
   * @param tabs indentation tabs (1 tab = 2 spaces)
   */
  outputLines(body, tabs = 0, trim = true) {
    return this.write(this._indentLines(body, tabs, trim));
  }
  /**
   * Output an aligned grid of the text matrix
   * @param table matrix of rows/cols
   * @param spacing spacing between items
   */
  outputGrid(table, spacing = 2, tabs = 1) {
    return this.outputLines(this.grid(table, spacing), tabs, false);
  }
  /**
   * Create an aligned grid of the text matrix. Very basic for the time-being
   * @param table matrix of rows/cols
   * @param spacing spacing between items
   */
  grid(table, spacing = 2) {
    const widths = this._colWidths(table);
    const rows = table.reduce((list, row) => {
      // determine the number of lines in this row
      const linesInRow = Math.max(...row
        .map(cell => this._lines(cell + '').length));
      // prefill a subgrid array
      const subgrid = Array.apply(null, new Array(linesInRow))
        .map(() => new Array(widths.length));
      // adjust cells in each row by the column width
      row.map(cell => cell + '') // to string
        .forEach((text, col) => {
          const w = widths[col];
          const lines = this._lines(text);
          for (let i = 0; i < subgrid.length; i++) {
            // create new cells for this line
            const cellText = (lines[i] || '').trim();
            const clean = cleanText(cellText);
            const diff = w - clean.length;
            const rpad = diff > 0 ? new Array(diff + 1).join(' ') : '';
            subgrid[i][col] = cellText + rpad;
          }
        });
      return list.concat(subgrid.map(cells => cells.join(this._indent(spacing))));
    }, []);
    return rows.join(EOL);
  }
  /**
   * determine col widths from a rows/colums in a table
   * @param table a table structure with columns
   */
  _colWidths(table) {
    const widths = [];
    table.forEach(row => {
      row.forEach((cell, col) => {
        const cellW = this._lines(cleanText(`${cell}`)).map(line => line.length);
        widths[col] = Math.max(widths[col] || 0, ...cellW);
      });
    });
    return widths;
  }
  /**
   * get indent by tabs
   * @param tabs
   */
  _indent(tabs = 1) {
    return new Array(tabs + 1).join(TAB);
  }
  /**
   * format text with same indent for each line
   * @param text
   * @param tabs
   */
  _indentLines(text, tabs = 1, trim = true) {
    return this._lines(text).map(line => `${this._indent(tabs)}${trim ? line.trim() : line}`).join(EOL);
  }
  /**
   * Lineify text
   * @param text text to convert to lines
   */
  _lines(text) {
    const chunks = [].concat(text);
    const lines = [].concat(...chunks.map(item => item.trim().split(EOL)));
    return lines;
  }
}

module.exports = {
  UI,
};