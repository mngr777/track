function coordToString(value) {
    return value !== null
        ? value.toString()
        : 'nil';
}


class Vect {
    constructor(x, y) {
        this.x_ = x;
        this.y_ = y;
    }

    copy() {
        return Vect(this.x_, this.y_);
    }

    add(other) {
        this.x_ += other.x;
        this.y_ += other.y;
    }

    sum(other) {
        let result = this.copy();
        result.add(other);
        return result;
    }

    get x() { return this.x_; }
    set x(x) { this.x_ = x; }

    get y() { return this.y_; }
    set y(y) { this.y_ = y; }

    toString() {
        return '(' + coordToString(this.x_) + ' ' + coordToString(this.y_) + ')';
    }
}


let LinkType = {
    In: 'in',
    Out: 'out',
    None: 'none'
};

class Link {
    constructor(inner, outer) {
        this.inner_ = inner;
        this.outer_ = outer;
        this.type_ = LinkType.None;
    }

    copy() {
        return Link(
            this.inner_.copy(),
            this.outer_.copy(),
            this.type_);
    }

    move(vect) {
        this.inner_.add(vect);
        this.outer_.add(vect);
    }

    moved(vect) {
        let result = this.copy();
        result.move(vect);
        return result;
    }

    get inner() { return this.inner_; }
    get outer() { return this.outer_; }

    toString() {
        return '('
            + this.inner_.toString() + ' '
            + this.outer_.toString() + ' '
            + this.type_ + ')';
    }
}


class TrackElement {
    constructor(pos, tiles, links) {
        this.id_ = null;
        this.pos_ = pos;
        this.tiles_ = tiles;
        this.links_ = links;
    }

    get id() { return this.id_; }
    set id(id) { this.id_ = id; }

    get pos() { return this.pos_; }
    get tiles() { return this.tiles_; }
    get links() { return this.links_; }
}


class TrackElementType {
    constructor(name, tiles, links) {
        this.name_ = name;
        this.tiles_ = tiles;
        this.links_ = links;
    }

    create(pos) {
        let tiles = this.tiles_.map(function(tile) {
           return tile.sum(pos);
        });
        let links = this.links_.map(function(link) {
            return link.moved(pos);
        });
        // TODO: check if inner links match tiles
        return TraceElement(pos, tiles, links);
    }

    getDimensions() {
        let min = null,
            max = null;
        // TODO
    }

    get tiles() { return this.tiles_; }
    get links() { return this.links_; }
}


class Matrix {
    constructor() {
        this.items_ = {};
    }

    has(pos, element) {
        let row = this.items_[pos.y];
        return row && (typeof row[pos.x()] != 'undefined');
    }

    get(pos, element) {
        
    }

    add(pos, element) {
        this.items_[pos.y] || this.items_[pos.y] = {};
        let row = this.items_[pos.y()];
        if (row[pos.x])
            throw "already exists";

        row[pos.x] = tile;
    }

    remove(pos) {
        let row = this.items_[pos.y];
        if (row && row[pos.x]) {
            delete row[pos.x];
        }
    }
}


class Trace {
    constructor(width, height) {
        this.width_ = width;
        this.height_ = height;
        this.nextId_ = 1;
        this.matrix_ = new Matrix();
        this.elements_ = {};
    }

    add(element) {
        if (_canAdd(element))
            throw "cannot add element";
        _add(element);
        _addTiles(element);
        return element.id;
    }

    _canAdd(element) {
        return element.tiles.every(function(tile) {
            return !this.matrix_.has(tile);
        }, this);
    }

    _add(element) {
        element.id = this.nextId_++;
        this.elements_[element.id] = element;
    }

    _addTiles(element) {
        element.tiles.forEach(function(tile) {
            this.matrix_.add(tile, element);
        }, this)
    }

    get width() { return this.width_; }
    get height() { return this.height_; }
}
