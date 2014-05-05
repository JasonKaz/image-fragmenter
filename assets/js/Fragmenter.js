var Fragmenter = (function (d, Math) {
    function Fragmenter(image) {
        var self = this;

        self.drawGrid = true;

        self.canvas = d.getElementById('myCanvas');

        self.output = d.getElementById("outputCanvas");
        self.outputContext = self.output.getContext("2d");

        self.imageObj = new Image();
        self.gridX = self.gridY = self.gridW = self.gridH = 0;

        self.imageObj.onload = function () {
            self.gridW = self.imageObj.width;
            self.gridH = self.imageObj.height;

            self.gridX = 20;
            self.gridY = 15;

            d.getElementById("grid-x").value = self.gridX;
            d.getElementById("grid-y").value = self.gridY;

            self.canvas.width = self.gridW;
            self.canvas.height = self.gridH;

            self.context = self.canvas.getContext('2d');

            self.updateCanvas();
        };

        self.imageObj.src = image;

        d.getElementById("grid-x").addEventListener("change", function () {
            self.gridX = Math.max(this.value, 10);

            self.updateCanvas();
        });

        d.getElementById("grid-y").addEventListener("change", function () {
            self.gridY = Math.max(this.value, 10);

            self.updateCanvas();
        });
    }

    Fragmenter.prototype.updateCanvas = function () {
        var self = this,
            xx, yy;

        self.gridX = Math.max(self.gridX, 10);
        self.gridY = Math.max(self.gridY, 10);

        self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.context.drawImage(self.imageObj, 0, 0);

        if (self.drawGrid === true) {
            for (yy = 0; yy < self.gridH; yy += self.gridY) {
                for (xx = 0; xx < self.gridW; xx += self.gridX) {
                    self.context.strokeRect(xx, yy, self.gridX, self.gridY);
                }
            }
        }
    };

    Fragmenter.prototype.getBase64 = function (imageData) {
        var self = this;

        self.output.width = self.gridX;
        self.output.height = self.gridY;

        self.outputContext.putImageData(imageData, 0, 0);

        return self.output.toDataURL("image/png");
    };

    Fragmenter.prototype.getCellData = function (x, y) {
        return this.getBase64(this.context.getImageData(x, y, this.gridX, this.gridY));
    };

    Fragmenter.prototype.getCellMarkup = function (x, y) {
        var div = d.createElement("div"),
            img = new Image(),
            base64Data = this.getCellData(x, y);


        img.src = base64Data;

        div.innerHTML = img.outerHTML;
        div.className = "fragment";

        div.setAttribute("style", "left:" + x + "px;top:" + y + "px");
        div.dataset.left = x;
        div.dataset.top = y;

        return div.outerHTML;
    };

    Fragmenter.prototype.getImageMarkup = function () {
        var self = this,
            output = d.createElement("div"),
            images = "",
            yy, xx;

        self.drawGrid = false;
        self.updateCanvas();

        for (yy = 0; yy < self.gridH; yy += self.gridY) {
            for (xx = 0; xx < self.gridW; xx += self.gridX) {
                images += self.getCellMarkup(xx, yy);
            }
        }

        self.drawGrid = true;
        self.updateCanvas();

        output.innerHTML = images;

        output.setAttribute("style", "width:" + self.gridW + "px;height:" + self.gridH + "px");
        output.width = self.gridW;
        output.height = self.gridH;
        output.className = "test-image";

        return output.outerHTML;
    };

    Fragmenter.prototype.preview = function (target) {
        var markup = this.getImageMarkup();

        target.innerHTML = markup;

        return markup;
    };

    return Fragmenter;
})(document, Math);
