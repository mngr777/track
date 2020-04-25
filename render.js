function makeElement(type) {
    return document.createElement(type);
}


class Widget {
    constructor() {
        this.element_ = null;
    }

    get element() { return this.element_; }
}


class TableWidget {
    constructor(width, height) {
        this.element_ = makeElement('table');
        this.element_.classList.add('tile-table');

        this.matrix_ = new Matrix();

        for (i = 0; i < height; ++i) {
            let row = makeElement('tr');
            for (j = 0; j < width; ++j) {
                let cell = makeElement('td'),
                    pos = new Vect(i, j);
                this.matrix_.add(pos, cell);
            }
            this.element_.appendChild(row);
        }
    }
}


class ElementTypeWidget {
    constructor(type) {
        this.element_ = makeElement('div');

        // TODO
    }
}
