function static_assert(condition, message) {
    if (console.assert) return console.assert(condition, message);
    if (!condition) {
        message = message || "Assertion failed";
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}

function getByte(index, val) {
    return (val >> (8 * index)) & 0xFF;
}

function getAlpha(val) { return getByte(3, val); }
function getRed  (val) { return getByte(2, val); }
function getGreen(val) { return getByte(1, val); }
function getBlue (val) { return getByte(0, val); }

function abs(value) {
    return value < 0 ? -value : value;
}

function alphaBlend(M, N, dst, col) {
    static_assert(0 < M && M < N && N <= 256, "possible overflow of (col & byte1Mask) * M + (dst & byte1Mask) * (N - M)");

    var byte1Mask = 0x000000ff;
    var byte2Mask = 0x0000ff00;
    var byte3Mask = 0x00ff0000;
    var byte4Mask = 0xff000000;

    dst = (byte1Mask & (((col & byte1Mask) * M + (dst & byte1Mask) * (N - M)) / N)) | //
          (byte2Mask & (((col & byte2Mask) * M + (dst & byte2Mask) * (N - M)) / N)) | //this works because next higher 8 bits are free
          (byte3Mask & (((col & byte3Mask) * M + (dst & byte3Mask) * (N - M)) / N)) | //
          (byte4Mask & (((((col & byte4Mask) >> 8) * M + ((dst & byte4Mask) >> 8) * (N - M)) / N) << 8)); //next 8 bits are not free, so shift
    //the last row operating on a potential alpha channel costs only ~1% perf => negligible!
}


// TODO
uint32_t*       byteAdvance(      uint32_t* ptr, int bytes) { return reinterpret_cast<      uint32_t*>(reinterpret_cast<      char*>(ptr) + bytes); }
const uint32_t* byteAdvance(const uint32_t* ptr, int bytes) { return reinterpret_cast<const uint32_t*>(reinterpret_cast<const char*>(ptr) + bytes); }

// TODO uint32_t* trg
function fillBlock(uint32_t* trg, pitch, col, blockWidth, blockHeight)
{
    //for (int y = 0; y < blockHeight; ++y, trg = byteAdvance(trg, pitch))
    //    std::fill(trg, trg + blockWidth, col);

    if (arguments.length == 4) {
        blockHeight = blockWidth;
    }

    for (var y = 0; y < blockHeight; ++y, trg = byteAdvance(trg, pitch)) {
        for (var x = 0; x < blockWidth; ++x) {
            trg[x] = col;
        }
    }
}

// enum RotationDegree //clock-wise
// {
//     ROT_0,
//     ROT_90,
//     ROT_180,
//     ROT_270
// };


// TODO VERIFY
var ROT_0 = 0,
    ROT_90 = 90,
    ROT_180 = 180,
    ROT_270 = 270;


// TODO 
// calculate input matrix coordinates after rotation at compile time
// template <RotationDegree rotDeg, size_t I, size_t J, size_t N>
// struct MatrixRotation;

// template <size_t I, size_t J, size_t N>
// struct MatrixRotation<ROT_0, I, J, N>
// {
//     static const size_t I_old = I;
//     static const size_t J_old = J;
// };

// template <RotationDegree rotDeg, size_t I, size_t J, size_t N> //(i, j) = (row, col) indices, N = size of (square) matrix
// struct MatrixRotation
// {
//     static const size_t I_old = N - 1 - MatrixRotation<static_cast<RotationDegree>(rotDeg - 1), I, J, N>::J_old; //old coordinates before rotation!
//     static const size_t J_old =         MatrixRotation<static_cast<RotationDegree>(rotDeg - 1), I, J, N>::I_old; //
// };

function OutputMatrix(out, outWidth) {
    this.out_ = out;
    this.outWidth_ = outWidth;

    this.ref = function() {
        
    }
}

OutputMatrix.prototype = {
    out_: null,
    outWidth_: 0
};
