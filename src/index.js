/* jshint esversion: 6 */
module.exports = class GaugeLegend {
    constructor(config) {
        const defaultconfig = {
            theme: 'dark',
            size: '100px',
            unit:'',
            text1: '',
            text2: '',
            trigger: 'render',
            decimals: 2
        },
        svgURI = 'http://www.w3.org/2000/svg';
        this.config = Object.assign(defaultconfig, config);
        this._legend = document.createElementNS(svgURI, 'svg');
        this._tick = document.createElementNS(svgURI, 'path');
        this.config.colors.forEach((a, i) => {
            let path = document.createElementNS(svgURI, 'path');
            path.setAttribute('id', `arc_${i}`);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', a);
            path.setAttribute('stroke-width', 5);
            this._legend.appendChild(path);
        });
        this._tick.setAttribute('id', `tick`);
        this._tick.setAttribute('fill', 'none');
        this._tick.setAttribute('stroke', `${(this.config.theme === 'dark') ? '#dddddd' : '#333333'}`);
        this._tick.setAttribute('stroke-width', 3);
        this._legend.appendChild(this._tick);
        this.__flag__ = true;
    }
    refresh() {
        const
            r = this._container.offsetHeight / 2,
            w = Math.round(180 / this.config.breaks.length),
            d = (180 - w) / 2,
            ctrl = document.querySelector('.valor'),
            int = document.querySelector('.int'),
            decimals = document.querySelector('.decimals'),
            data = this._map.queryRenderedFeatures({ layers: [this.config.layer] }).map(b => b.properties[this.config.property] * 1),
            avg = (data.reduce((a, b) => a + b, 0) / data.length),
            b = this.config.breaks.map((b, i) => (b > avg) ? i : -1).filter(k => k > -1)[0],
            color = this.config.colors[b];
        if (this.__flag__ === true) {
            this.config.breaks.forEach((a, i) => {
                let path = document.querySelector(`#arc_${i}`);
                path.setAttribute("d", GaugeLegend.describeArc(r , r , r - 5, (w * i) - 90.1, (w * (i + 1)) - 89.1));
            });
            delete this.__flag__;
        }
        if (isNaN(avg)) {
            ctrl.style.color = '#666';
            int.textContent = `-`;
            decimals.textContent = '-';
            this._tick.setAttribute("d", GaugeLegend.describeArc(r, r, r - 12, 0, 0));
        } else {
            const fixed = avg.toFixed(this.config.decimals).split('.');
            ctrl.style.color = color;
            if (this.config.decimals === 0){
                int.textContent = `${fixed[0]}${(this.config.unit !== '') ? ` ${this.config.unit}` : ''}`;
            }else{
                int.textContent = fixed[0];
                decimals.textContent = `${fixed[1]}${(this.config.unit !== '') ? ` ${this.config.unit}` : ''}`;
            }
            this._tick.setAttribute("d", GaugeLegend.describeArc(r, r, r - 12, (w * b) - d, (w * b) - d + 3));
        }
    }
    static polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
    static describeArc(x, y, radius, startAngle, endAngle) {
        let
            start = GaugeLegend.polarToCartesian(x, y, radius, endAngle),
            end = GaugeLegend.polarToCartesian(x, y, radius, startAngle),
            largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1",
            d = [
                "M", start.x, start.y,
                "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
            ].join(" ");
        return d;
    }
    onAdd(map) {
        this._map = map;
        this._container = document.createElement('div');
        this._container.range = [this.config.breaks[0], this.config.breaks[this.config.breaks.length - 1]];
        this._container.format = this._container.range[1].toString().split('.')[0].length;
        this._container.className = `gauge-core gauge-${this.config.theme}`;
        this._container.style.height = this.config.size;
        this._container.style.width = this.config.size;
        this._container.innerHTML = `
            <div class="titol text-${this.config.theme}">${this.config.text1}</div>
            <div class="valor text-${this.config.theme}">${
                (this.config.decimals === 0) ? 
                `<div class="int" style="width:${this._container.format}ch">-</div>` : 
                `<div class="int" style="width:${this._container.format}ch">-</div>
                <div class="dot">.</div>
                <div class="decimals" style="width:${this.config.decimals}ch">-</div>`
            }</div>
            <div class="titol text-${this.config.theme}">${this.config.text2}</div>
            <div class="min text-${this.config.theme}">${this._container.range[0]}</div>
            <div class="max text-${this.config.theme}">${this._container.range[1]}</div>`;
        this._container.appendChild(this._legend);
        this._map.on(this.config.trigger, this.refresh.bind(this));
        return this._container;
    }
    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map.off(this.config.trigger, this.refresh.bind(this));
        this._map = undefined;
    }
};

