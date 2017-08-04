/**
  These borrow heavily from:
  https://gist.github.com/Rokotyan/0556f8facbaf344507cdc45dc3622177
  Added Promises to split out file saving from image generation
*/
class DiagramExporter {
  flattenSVGData(svgElement) {
    svgElement.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
    var xmlGenerator = new XMLSerializer();
    return xmlGenerator.serializeToString(svgElement);
  }

  generateData(svgElement){

  }
}

class SVGDiagramExporter extends DiagramExporter {

  generateData(svgElement) {
    var exportDataBlob = new Blob([this.flattenSVGData(svgElement)],{
      type: 'image/svg+xml'
    });
    return Promise.resolve(exportDataBlob);
  }
}

class PNGDiagramExporter extends DiagramExporter {
  renderFlatSVGtoCanvas(svgString, options = {}){
    if (!options.width) {

      options.width = 1000;
    }
    if (!options.height) {
      options.height = 1000;
    }
    if (!options.filename) {
      options.filename = 'Untitled.png';
    }

    var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) );

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    canvas.width = options.width;
    canvas.height = options.height;

    var image = new Image();

    var dx = new Promise(function(resolve, reject){
      image.onload = function() {
        context.clearRect ( 0, 0, options.width, options.height );
        context.drawImage(image, 0, 0, options.width, options.height);
        canvas.toBlobHD( function(blob) {
        // 	// var filesize = Math.round( blob.length/1024 ) + ' KB';
        // 	// if ( callback ) callback( blob, filesize );

          resolve(blob);
        });
      };
      image.src = imgsrc;
    });
    return dx;
  }

  generateData(svgElement,options) {
    var flattenedSVG = this.flattenSVGData(svgElement,options);
    return this.renderFlatSVGtoCanvas(flattenedSVG,options);
  }
}
