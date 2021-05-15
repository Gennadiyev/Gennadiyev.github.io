function _LoadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function _EnableVertexAttribArray(gl, attribLoc, buffer, numComponents, type = gl.FLOAT, normalize = false, stride = 0, offset = 0) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribLoc, numComponents, type, normalize, stride, offset);
    gl.enableVertexAttribArray(attribLoc);
}

function InitThermalView(canvasId, width, height) {
    const canvas = document.getElementById(canvasId);
    var gl = canvas.getContext("webgl", {preserveDrawingBuffer: false});
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    const program = gl.createProgram();
    const vsSource = `
        attribute vec2 aPosition;
        attribute vec4 aColor;
        varying lowp vec4 vColor;

        void main() {
            gl_Position = vec4(aPosition, 0.0, 1.0);
            vColor = aColor;
        }
    `;
    const fsSource = `
        varying lowp vec4 vColor;

        void main() {
            gl_FragColor = vColor;
        }
    `;
    gl.attachShader(program, _LoadShader(gl, gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, _LoadShader(gl, gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
    }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    var positions = [];
    for (var j = 0; j < height; j++) { // populate the position buffer in the right order
        for (var i = 0; i < width; i++) {
            positions.push(2 * i / (width - 1) - 1);
            positions.push(1 - 2 * j / (height - 1));
        }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    _EnableVertexAttribArray(gl, gl.getAttribLocation(program, 'aPosition'), positionBuffer, 2);

    const indexBuffer = gl.createBuffer();
    var indices = [];
    const getIndex = (x, y) => {
        return x + y * width;
    }
    for (var i = 0; i < width - 1; i++) { // order does not matter here
        for (var j = 0; j < height - 1; j++) {
            const TL = getIndex(i, j);
            const BL = getIndex(i, j + 1);
            const TR = getIndex(i + 1, j);
            const BR = getIndex(i + 1, j + 1);
            indices.push(TL);
            indices.push(BL);
            indices.push(BR);
            indices.push(TL);
            indices.push(BR);
            indices.push(TR);
        }
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    const context = {
        width: width,
        height: height,
        gl: gl,
        color: gl.getAttribLocation(program, 'aColor'),
        colorBuffer: colorBuffer
    }
    return context;
}

function RenderThermalView(context, values, valuesToColors = _tempToRGBA) {
    const gl = context.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, context.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(valuesToColors(values)), gl.STATIC_DRAW);
    _EnableVertexAttribArray(gl, context.color, context.colorBuffer, 4);

    {
        const vertexCount = 6 * (context.width - 1) * (context.height - 1);
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}

function _tempToRGBA(values) {
    const minTemp = Math.min(...values);
    const maxTemp = Math.max(...values);
    const d = maxTemp - minTemp;
    const constrain = (value) => {
        return (value - minTemp) / d;
    }
    const clamp = (rgb) => {
        return Math.min(Math.max(rgb, 0), 1);
    }

    var colors = [];
    values.forEach((value) => {
        // Convert according to the 180-360 part of hue
        colors.push(clamp(-1 + 3 * constrain(value)));
        colors.push(clamp(1 - 3 * constrain(value)));
        colors.push(clamp(3 - 3 * constrain(value)));
        colors.push(1);
    })

    return colors;
}
