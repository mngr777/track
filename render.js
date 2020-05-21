function makeElement(type) {
    return document.createElement(type);
}


class Widget {
    constructor() {
        this.element_ = null;
    }

    get element() { return this.element_; }
}


let GridCellSize = 20;

class GridWidget extends Widget {
    constructor(width, height) {
        super();

        let canvas = makeElement('canvas');
        canvas.width = width * GridCellSize;
        canvas.height = height * GridCellSize;

        this.element_ = canvas;
        this.ctx_ = canvas.getContext('2d');
        this.width_ = width;
        this.height_ = height;
    }

    reset() {
        this._clear();
        this._drawGrid();
    }

    _clear() {
        this.ctx_.clearRect(0, 0, this.element_.width, this.element_.height);
    }

    _drawGrid() {
        let ctx = this.ctx_
        ctx.save();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        for (let i = 0; i <= this.height_; ++i) {
            ctx.beginPath();
            ctx.moveTo(0, i * GridCellSize);
            ctx.lineTo(this.element_.width, i * GridCellSize);
            ctx.closePath();
            ctx.stroke();
        }

        for (let i = 0; i <= this.width_; ++i) {
            ctx.beginPath();
            ctx.moveTo(i * GridCellSize, 0);
            ctx.lineTo(i * GridCellSize, this.element_.height);
            ctx.closePath();
            ctx.stroke();
        }

        ctx.restore();
    }

    get element() { return this.element_; }
}


class TrackElementGridWidget extends GridWidget {
    _drawTiles(tiles) {
        tiles.forEach(this._drawTile, this);
    }

    _drawLinks(links) {
        links.forEach(this._drawLink, this);
    }

    _drawTile(pos) {
        let ctx = this.ctx_,
            pad = GridCellSize * 0.1;

        ctx.save();
        ctx.fillStyle = 'gray';
        ctx.fillRect(
            pos.x * GridCellSize + pad, pos.y * GridCellSize + pad,
            GridCellSize - pad * 2, GridCellSize - pad * 2);
        ctx.restore();
    }

    _drawLink(link) {
        this._drawLinkIn(link.inner);
        this._drawLinkOut(link.outer);
    }

    _drawLinkIn(pos) {
        let ctx = this.ctx_,
            x0 = (pos.x + 0.5) * GridCellSize,
            y0 = (pos.y + 0.5) * GridCellSize,
            radius = GridCellSize / 4;
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(x0, y0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    _drawLinkOut(pos) {
        let ctx = this.ctx_,
            x0 = (pos.x + 0.5) * GridCellSize,
            y0 = (pos.y + 0.5) * GridCellSize,
            radius = GridCellSize / 5;
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(x0, y0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}


class TrackElementTypeWidget extends TrackElementGridWidget {
    constructor(type) {
        super(type.getWidth(), type.getHeight());
        this.type_ = type;
    }

    render() {
        this.reset();
        this._drawTiles(this.type_.tiles);
        this._drawLinks(this.type_.links);
    }

    get type() { return this.type_; }
}
