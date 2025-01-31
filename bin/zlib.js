/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */ (function () {
    "use strict";
    var n = void 0,
        w = !0,
        aa = this;
    function ba(f, d) {
        var c = f.split("."),
            e = aa;
        !(c[0] in e) && e.execScript && e.execScript("var " + c[0]);
        for (var b; c.length && (b = c.shift());)
            !c.length && d !== n ? (e[b] = d) : (e = e[b] ? e[b] : (e[b] = {}));
    }
    var C =
        "undefined" !== typeof Uint8Array &&
        "undefined" !== typeof Uint16Array &&
        "undefined" !== typeof Uint32Array &&
        "undefined" !== typeof DataView;
    function K(f, d) {
        this.index = "number" === typeof d ? d : 0;
        this.e = 0;
        this.buffer =
            f instanceof (C ? Uint8Array : Array)
                ? f
                : new (C ? Uint8Array : Array)(32768);
        if (2 * this.buffer.length <= this.index) throw Error("invalid index");
        this.buffer.length <= this.index && ca(this);
    }
    function ca(f) {
        var d = f.buffer,
            c,
            e = d.length,
            b = new (C ? Uint8Array : Array)(e << 1);
        if (C) b.set(d);
        else for (c = 0; c < e; ++c) b[c] = d[c];
        return (f.buffer = b);
    }
    K.prototype.b = function (f, d, c) {
        var e = this.buffer,
            b = this.index,
            a = this.e,
            g = e[b],
            m;
        c &&
            1 < d &&
            (f =
                8 < d
                    ? ((L[f & 255] << 24) |
                        (L[(f >>> 8) & 255] << 16) |
                        (L[(f >>> 16) & 255] << 8) |
                        L[(f >>> 24) & 255]) >>
                    (32 - d)
                    : L[f] >> (8 - d));
        if (8 > d + a) (g = (g << d) | f), (a += d);
        else
            for (m = 0; m < d; ++m)
                (g = (g << 1) | ((f >> (d - m - 1)) & 1)),
                    8 === ++a &&
                    ((a = 0),
                        (e[b++] = L[g]),
                        (g = 0),
                        b === e.length && (e = ca(this)));
        e[b] = g;
        this.buffer = e;
        this.e = a;
        this.index = b;
    };
    K.prototype.finish = function () {
        var f = this.buffer,
            d = this.index,
            c;
        0 < this.e && ((f[d] <<= 8 - this.e), (f[d] = L[f[d]]), d++);
        C ? (c = f.subarray(0, d)) : ((f.length = d), (c = f));
        return c;
    };
    var da = new (C ? Uint8Array : Array)(256),
        M;
    for (M = 0; 256 > M; ++M) {
        for (var N = M, S = N, ea = 7, N = N >>> 1; N; N >>>= 1)
            (S <<= 1), (S |= N & 1), --ea;
        da[M] = ((S << ea) & 255) >>> 0;
    }
    var L = da;
    function ia(f) {
        this.buffer = new (C ? Uint16Array : Array)(2 * f);
        this.length = 0;
    }
    ia.prototype.getParent = function (f) {
        return 2 * (((f - 2) / 4) | 0);
    };
    ia.prototype.push = function (f, d) {
        var c,
            e,
            b = this.buffer,
            a;
        c = this.length;
        b[this.length++] = d;
        for (b[this.length++] = f; 0 < c;)
            if (((e = this.getParent(c)), b[c] > b[e]))
                (a = b[c]),
                    (b[c] = b[e]),
                    (b[e] = a),
                    (a = b[c + 1]),
                    (b[c + 1] = b[e + 1]),
                    (b[e + 1] = a),
                    (c = e);
            else break;
        return this.length;
    };
    ia.prototype.pop = function () {
        var f,
            d,
            c = this.buffer,
            e,
            b,
            a;
        d = c[0];
        f = c[1];
        this.length -= 2;
        c[0] = c[this.length];
        c[1] = c[this.length + 1];
        for (a = 0; ;) {
            b = 2 * a + 2;
            if (b >= this.length) break;
            b + 2 < this.length && c[b + 2] > c[b] && (b += 2);
            if (c[b] > c[a])
                (e = c[a]),
                    (c[a] = c[b]),
                    (c[b] = e),
                    (e = c[a + 1]),
                    (c[a + 1] = c[b + 1]),
                    (c[b + 1] = e);
            else break;
            a = b;
        }
        return { index: f, value: d, length: this.length };
    };
    function ka(f, d) {
        this.d = la;
        this.i = 0;
        this.input = C && f instanceof Array ? new Uint8Array(f) : f;
        this.c = 0;
        d &&
            (d.lazy && (this.i = d.lazy),
                "number" === typeof d.compressionType && (this.d = d.compressionType),
                d.outputBuffer &&
                (this.a =
                    C && d.outputBuffer instanceof Array
                        ? new Uint8Array(d.outputBuffer)
                        : d.outputBuffer),
                "number" === typeof d.outputIndex && (this.c = d.outputIndex));
        this.a || (this.a = new (C ? Uint8Array : Array)(32768));
    }
    var la = 2,
        na = { NONE: 0, h: 1, g: la, n: 3 },
        T = [],
        U;
    for (U = 0; 288 > U; U++)
        switch (w) {
            case 143 >= U:
                T.push([U + 48, 8]);
                break;
            case 255 >= U:
                T.push([U - 144 + 400, 9]);
                break;
            case 279 >= U:
                T.push([U - 256 + 0, 7]);
                break;
            case 287 >= U:
                T.push([U - 280 + 192, 8]);
                break;
            default:
                throw "invalid literal: " + U;
        }
    ka.prototype.f = async function () {
        var f,
            d,
            c,
            e,
            b = this.input;
        switch (this.d) {
            case 0:
                c = 0;
                for (e = b.length; c < e;) {
                    d = C ? b.subarray(c, c + 65535) : b.slice(c, c + 65535);
                    c += d.length;
                    var a = d,
                        g = c === e,
                        m = n,
                        k = n,
                        p = n,
                        t = n,
                        u = n,
                        l = this.a,
                        h = this.c;
                    if (C) {
                        for (
                            l = new Uint8Array(this.a.buffer);
                            l.length <= h + a.length + 5;

                        )
                            l = new Uint8Array(l.length << 1);
                        l.set(this.a);
                    }
                    m = g ? 1 : 0;
                    l[h++] = m | 0;
                    k = a.length;
                    p = (~k + 65536) & 65535;
                    l[h++] = k & 255;
                    l[h++] = (k >>> 8) & 255;
                    l[h++] = p & 255;
                    l[h++] = (p >>> 8) & 255;
                    if (C) l.set(a, h), (h += a.length), (l = l.subarray(0, h));
                    else {
                        t = 0;
                        for (u = a.length; t < u; ++t) l[h++] = a[t];
                        l.length = h;
                    }
                    this.c = h;
                    this.a = l;
                }
                break;
            case 1:
                var q = new K(C ? new Uint8Array(this.a.buffer) : this.a, this.c);
                q.b(1, 1, w);
                q.b(1, 2, w);
                var s = await oa(this, b),
                    x,
                    fa,
                    z;
                x = 0;
                for (fa = s.length; x < fa; x++)
                    if (((z = s[x]), K.prototype.b.apply(q, T[z]), 256 < z))
                        q.b(s[++x], s[++x], w), q.b(s[++x], 5), q.b(s[++x], s[++x], w);
                    else if (256 === z) break;
                this.a = q.finish();
                this.c = this.a.length;
                break;
            case la:
                var B = new K(C ? new Uint8Array(this.a.buffer) : this.a, this.c),
                    ta,
                    J,
                    O,
                    P,
                    Q,
                    La = [
                        16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15,
                    ],
                    X,
                    ua,
                    Y,
                    va,
                    ga,
                    ja = Array(19),
                    wa,
                    R,
                    ha,
                    y,
                    xa;
                ta = la;
                B.b(1, 1, w);
                B.b(ta, 2, w);
                J = await oa(this, b);
                X = pa(this.m, 15);
                ua = qa(X);
                Y = pa(this.l, 7);
                va = qa(Y);
                for (O = 286; 257 < O && 0 === X[O - 1]; O--);
                for (P = 30; 1 < P && 0 === Y[P - 1]; P--);
                var ya = O,
                    za = P,
                    F = new (C ? Uint32Array : Array)(ya + za),
                    r,
                    G,
                    v,
                    Z,
                    E = new (C ? Uint32Array : Array)(316),
                    D,
                    A,
                    H = new (C ? Uint8Array : Array)(19);
                for (r = G = 0; r < ya; r++) F[G++] = X[r];
                for (r = 0; r < za; r++) F[G++] = Y[r];
                if (!C) {
                    r = 0;
                    for (Z = H.length; r < Z; ++r) H[r] = 0;
                }
                r = D = 0;
                for (Z = F.length; r < Z; r += G) {
                    for (G = 1; r + G < Z && F[r + G] === F[r]; ++G);
                    v = G;
                    if (0 === F[r])
                        if (3 > v) for (; 0 < v--;) (E[D++] = 0), H[0]++;
                        else
                            for (; 0 < v;)
                                (A = 138 > v ? v : 138),
                                    A > v - 3 && A < v && (A = v - 3),
                                    10 >= A
                                        ? ((E[D++] = 17), (E[D++] = A - 3), H[17]++)
                                        : ((E[D++] = 18), (E[D++] = A - 11), H[18]++),
                                    (v -= A);
                    else if (((E[D++] = F[r]), H[F[r]]++, v--, 3 > v))
                        for (; 0 < v--;) (E[D++] = F[r]), H[F[r]]++;
                    else
                        for (; 0 < v;)
                            (A = 6 > v ? v : 6),
                                A > v - 3 && A < v && (A = v - 3),
                                (E[D++] = 16),
                                (E[D++] = A - 3),
                                H[16]++,
                                (v -= A);
                }
                f = C ? E.subarray(0, D) : E.slice(0, D);
                ga = pa(H, 7);
                for (y = 0; 19 > y; y++) ja[y] = ga[La[y]];
                for (Q = 19; 4 < Q && 0 === ja[Q - 1]; Q--);
                wa = qa(ga);
                B.b(O - 257, 5, w);
                B.b(P - 1, 5, w);
                B.b(Q - 4, 4, w);
                for (y = 0; y < Q; y++) B.b(ja[y], 3, w);
                y = 0;
                for (xa = f.length; y < xa; y++)
                    if (((R = f[y]), B.b(wa[R], ga[R], w), 16 <= R)) {
                        y++;
                        switch (R) {
                            case 16:
                                ha = 2;
                                break;
                            case 17:
                                ha = 3;
                                break;
                            case 18:
                                ha = 7;
                                break;
                            default:
                                throw "invalid code: " + R;
                        }
                        B.b(f[y], ha, w);
                    }
                var Aa = [ua, X],
                    Ba = [va, Y],
                    I,
                    Ca,
                    $,
                    ma,
                    Da,
                    Ea,
                    Fa,
                    Ga;
                Da = Aa[0];
                Ea = Aa[1];
                Fa = Ba[0];
                Ga = Ba[1];
                I = 0;
                for (Ca = J.length; I < Ca; ++I)
                    if ((($ = J[I]), B.b(Da[$], Ea[$], w), 256 < $))
                        B.b(J[++I], J[++I], w),
                            (ma = J[++I]),
                            B.b(Fa[ma], Ga[ma], w),
                            B.b(J[++I], J[++I], w);
                    else if (256 === $) break;
                this.a = B.finish();
                this.c = this.a.length;
                break;
            default:
                throw "invalid compression type";
        }
        return this.a;
    };
    function ra(f, d) {
        this.length = f;
        this.k = d;
    }
    var sa = (function () {
        function f(b) {
            switch (w) {
                case 3 === b:
                    return [257, b - 3, 0];
                case 4 === b:
                    return [258, b - 4, 0];
                case 5 === b:
                    return [259, b - 5, 0];
                case 6 === b:
                    return [260, b - 6, 0];
                case 7 === b:
                    return [261, b - 7, 0];
                case 8 === b:
                    return [262, b - 8, 0];
                case 9 === b:
                    return [263, b - 9, 0];
                case 10 === b:
                    return [264, b - 10, 0];
                case 12 >= b:
                    return [265, b - 11, 1];
                case 14 >= b:
                    return [266, b - 13, 1];
                case 16 >= b:
                    return [267, b - 15, 1];
                case 18 >= b:
                    return [268, b - 17, 1];
                case 22 >= b:
                    return [269, b - 19, 2];
                case 26 >= b:
                    return [270, b - 23, 2];
                case 30 >= b:
                    return [271, b - 27, 2];
                case 34 >= b:
                    return [272, b - 31, 2];
                case 42 >= b:
                    return [273, b - 35, 3];
                case 50 >= b:
                    return [274, b - 43, 3];
                case 58 >= b:
                    return [275, b - 51, 3];
                case 66 >= b:
                    return [276, b - 59, 3];
                case 82 >= b:
                    return [277, b - 67, 4];
                case 98 >= b:
                    return [278, b - 83, 4];
                case 114 >= b:
                    return [279, b - 99, 4];
                case 130 >= b:
                    return [280, b - 115, 4];
                case 162 >= b:
                    return [281, b - 131, 5];
                case 194 >= b:
                    return [282, b - 163, 5];
                case 226 >= b:
                    return [283, b - 195, 5];
                case 257 >= b:
                    return [284, b - 227, 5];
                case 258 === b:
                    return [285, b - 258, 0];
                default:
                    throw "invalid length: " + b;
            }
        }
        var d = [],
            c,
            e;
        for (c = 3; 258 >= c; c++)
            (e = f(c)), (d[c] = (e[2] << 24) | (e[1] << 16) | e[0]);
        return d;
    })(),
        Ha = C ? new Uint32Array(sa) : sa;
    async function oa(f, d) {
        //d -> dataArray
        if (d && !d.get) {
            if (d instanceof Array || d instanceof Uint8Array) {
                d.get = (idx) => d[idx];
            } else {
                throw new Error(
                    "input object not support member method 'get(number)=>any'"
                );
            }
        }
        if (d && !d.getLen) {
            if (d instanceof Array || d instanceof Uint8Array) {
                d.getLen = () => d.length;
            } else {
                throw new Error(
                    "input object not support member method 'getLen()=>number'"
                );
            }
        }
        function c(b, c) {
            var a = b.k,
                d = [],
                e = 0,
                f;
            f = Ha[b.length];
            d[e++] = f & 65535;
            d[e++] = (f >> 16) & 255;
            d[e++] = f >> 24;
            var g;
            switch (w) {
                case 1 === a:
                    g = [0, a - 1, 0];
                    break;
                case 2 === a:
                    g = [1, a - 2, 0];
                    break;
                case 3 === a:
                    g = [2, a - 3, 0];
                    break;
                case 4 === a:
                    g = [3, a - 4, 0];
                    break;
                case 6 >= a:
                    g = [4, a - 5, 1];
                    break;
                case 8 >= a:
                    g = [5, a - 7, 1];
                    break;
                case 12 >= a:
                    g = [6, a - 9, 2];
                    break;
                case 16 >= a:
                    g = [7, a - 13, 2];
                    break;
                case 24 >= a:
                    g = [8, a - 17, 3];
                    break;
                case 32 >= a:
                    g = [9, a - 25, 3];
                    break;
                case 48 >= a:
                    g = [10, a - 33, 4];
                    break;
                case 64 >= a:
                    g = [11, a - 49, 4];
                    break;
                case 96 >= a:
                    g = [12, a - 65, 5];
                    break;
                case 128 >= a:
                    g = [13, a - 97, 5];
                    break;
                case 192 >= a:
                    g = [14, a - 129, 6];
                    break;
                case 256 >= a:
                    g = [15, a - 193, 6];
                    break;
                case 384 >= a:
                    g = [16, a - 257, 7];
                    break;
                case 512 >= a:
                    g = [17, a - 385, 7];
                    break;
                case 768 >= a:
                    g = [18, a - 513, 8];
                    break;
                case 1024 >= a:
                    g = [19, a - 769, 8];
                    break;
                case 1536 >= a:
                    g = [20, a - 1025, 9];
                    break;
                case 2048 >= a:
                    g = [21, a - 1537, 9];
                    break;
                case 3072 >= a:
                    g = [22, a - 2049, 10];
                    break;
                case 4096 >= a:
                    g = [23, a - 3073, 10];
                    break;
                case 6144 >= a:
                    g = [24, a - 4097, 11];
                    break;
                case 8192 >= a:
                    g = [25, a - 6145, 11];
                    break;
                case 12288 >= a:
                    g = [26, a - 8193, 12];
                    break;
                case 16384 >= a:
                    g = [27, a - 12289, 12];
                    break;
                case 24576 >= a:
                    g = [28, a - 16385, 13];
                    break;
                case 32768 >= a:
                    g = [29, a - 24577, 13];
                    break;
                default:
                    throw "invalid distance";
            }
            f = g;
            d[e++] = f[0];
            d[e++] = f[1];
            d[e++] = f[2];
            var k, m;
            k = 0;
            for (m = d.length; k < m; ++k)
                l[h++] = d[k];
            s[d[0]]++;
            x[d[3]]++;
            q = b.length + c - 1;
            u = null;
        }
        var e,
            b,
            a,
            g,
            m,
            k = {},
            p,
            t,
            u,
            l = /*C ? new Uint16Array(2 * d.length) :*/[],
            h = 0,
            q = 0,
            s = new (C ? Uint32Array : Array)(286),
            x = new (C ? Uint32Array : Array)(30),
            fa = f.i,
            z;
        if (!C) {
            for (a = 0; 285 >= a;) s[a++] = 0;
            for (a = 0; 29 >= a;) x[a++] = 0;
        }
        s[256] = 1;
        e = 0;

        for (b = await d.getLen(e); e < b; (++e), (b = await d.getLen(e + 32768))) {
            let isEOF = d.end === undefined ? true : d.end;
            let z = d.get(e);

            a = m = 0;
            for (g = 3; a < g && e + a !== b; ++a) m = (m << 8) | d.get(e + a);
            k[m] === n && (k[m] = []);
            p = k[m];
            if (!(0 < q--)) {
                for (; 0 < p.length && 32768 < e - p[0];) p.shift();
                if (e + 3 >= b && isEOF) {
                    u && c(u, -1);
                    a = 0;
                    for (g = b - e; a < g; ++a) (z = d.get(e + a)), (l[h++] = z), ++s[z];
                    break;
                }
                0 < p.length
                    ? ((t = await Ia(d, e, p)),
                        u
                            ? u.length < t.length
                                ? ((z = d.get(e - 1)), (l[h++] = z), ++s[z], c(t, 0))
                                : c(u, -1)
                            : t.length < fa
                                ? (u = t)
                                : c(t, 0))
                    : u
                        ? c(u, -1)
                        : ((z = d.get(e)), (l[h++] = z), ++s[z]);
            }
            p.push(e);
        }
        l[h++] = 256;
        s[256]++;
        f.m = s;
        f.l = x;
        return C ? (l.subarray ? l.subarray(0, h) : l.splice(0, h + 1)) : l;
    }
    async function Ia(data, position, matchList) {
        var match,
            currentMatch,
            matchMax = 0, matchLength,
            i, j, l, dl = await data.getLen(position + 258);

        // 候補を後ろから 1 つずつ絞り込んでゆく
        permatch:
        for (i = 0, l = matchList.length; i < l; i++) {
            match = matchList[l - i - 1];
            matchLength = 3;

            // 前回までの最長一致を末尾から一致検索する
            if (matchMax > 3) {
                for (j = matchMax; j > 3; j--) {
                    if (data.get(match + j - 1) !== data.get(position + j - 1)) {
                        continue permatch;
                    }
                }
                matchLength = matchMax;
            }

            // 最長一致探索
            while (matchLength < 258 &&
                position + matchLength < dl &&
                data.get(match + matchLength) === data.get(position + matchLength)) {
                ++matchLength;
            }

            // マッチ長が同じ場合は後方を優先
            if (matchLength > matchMax) {
                currentMatch = match;
                matchMax = matchLength;
            }

            // 最長が確定したら後の処理は省略
            if (matchLength === 258) {
                break;
            }
        }
        return new ra(matchMax, position - currentMatch);
    }
    function pa(f, d) {
        var c = f.length,
            e = new ia(572),
            b = new (C ? Uint8Array : Array)(c),
            a,
            g,
            m,
            k,
            p;
        if (!C) for (k = 0; k < c; k++) b[k] = 0;
        for (k = 0; k < c; ++k) 0 < f[k] && e.push(k, f[k]);
        a = Array(e.length / 2);
        g = new (C ? Uint32Array : Array)(e.length / 2);
        if (1 === a.length) return (b[e.pop().index] = 1), b;
        k = 0;
        for (p = e.length / 2; k < p; ++k) (a[k] = e.pop()), (g[k] = a[k].value);
        m = Ja(g, g.length, d);
        k = 0;
        for (p = a.length; k < p; ++k) b[a[k].index] = m[k];
        return b;
    }
    function Ja(f, d, c) {
        function e(a) {
            var b = k[a][p[a]];
            b === d ? (e(a + 1), e(a + 1)) : --g[b];
            ++p[a];
        }
        var b = new (C ? Uint16Array : Array)(c),
            a = new (C ? Uint8Array : Array)(c),
            g = new (C ? Uint8Array : Array)(d),
            m = Array(c),
            k = Array(c),
            p = Array(c),
            t = (1 << c) - d,
            u = 1 << (c - 1),
            l,
            h,
            q,
            s,
            x;
        b[c - 1] = d;
        for (h = 0; h < c; ++h)
            t < u ? (a[h] = 0) : ((a[h] = 1), (t -= u)),
                (t <<= 1),
                (b[c - 2 - h] = ((b[c - 1 - h] / 2) | 0) + d);
        b[0] = a[0];
        m[0] = Array(b[0]);
        k[0] = Array(b[0]);
        for (h = 1; h < c; ++h)
            b[h] > 2 * b[h - 1] + a[h] && (b[h] = 2 * b[h - 1] + a[h]),
                (m[h] = Array(b[h])),
                (k[h] = Array(b[h]));
        for (l = 0; l < d; ++l) g[l] = c;
        for (q = 0; q < b[c - 1]; ++q) (m[c - 1][q] = f[q]), (k[c - 1][q] = q);
        for (l = 0; l < c; ++l) p[l] = 0;
        1 === a[c - 1] && (--g[0], ++p[c - 1]);
        for (h = c - 2; 0 <= h; --h) {
            s = l = 0;
            x = p[h + 1];
            for (q = 0; q < b[h]; q++)
                (s = m[h + 1][x] + m[h + 1][x + 1]),
                    s > f[l]
                        ? ((m[h][q] = s), (k[h][q] = d), (x += 2))
                        : ((m[h][q] = f[l]), (k[h][q] = l), ++l);
            p[h] = 0;
            1 === a[h] && e(h);
        }
        return g;
    }
    function qa(f) {
        var d = new (C ? Uint16Array : Array)(f.length),
            c = [],
            e = [],
            b = 0,
            a,
            g,
            m,
            k;
        a = 0;
        for (g = f.length; a < g; a++) c[f[a]] = (c[f[a]] | 0) + 1;
        a = 1;
        for (g = 16; a <= g; a++) (e[a] = b), (b += c[a] | 0), (b <<= 1);
        a = 0;
        for (g = f.length; a < g; a++) {
            b = e[f[a]];
            e[f[a]] += 1;
            m = d[a] = 0;
            for (k = f[a]; m < k; m++) (d[a] = (d[a] << 1) | (b & 1)), (b >>>= 1);
        }
        return d;
    }
    function Ka(f, d) {
        this.input = f;
        this.a = new (C ? Uint8Array : Array)(32768);
        this.d = V.g;
        var c = {},
            e;
        if ((d || !(d = {})) && "number" === typeof d.compressionType)
            this.d = d.compressionType;
        for (e in d) c[e] = d[e];
        c.outputBuffer = this.a;
        this.j = new ka(this.input, c);
    }
    var V = na;
    Ka.prototype.f = async function () {
        var f,
            d,
            c,
            e,
            b,
            a,
            g = 0;
        a = this.a;
        switch (8) {
            case 8:
                f = Math.LOG2E * Math.log(32768) - 8;
                break;
            default:
                throw Error("invalid compression method");
        }
        d = (f << 4) | 8;
        a[g++] = d;
        switch (8) {
            case 8:
                switch (this.d) {
                    case V.NONE:
                        e = 0;
                        break;
                    case V.h:
                        e = 1;
                        break;
                    case V.g:
                        e = 2;
                        break;
                    default:
                        throw Error("unsupported compression type");
                }
                break;
            default:
                throw Error("invalid compression method");
        }
        c = (e << 6) | 0;
        a[g++] = c | (31 - ((256 * d + c) % 31));
        var m = this.input;
        if ("string" === typeof m) {
            var k = m.split(""),
                p,
                t;
            p = 0;
            for (t = k.length; p < t; p++) k[p] = (k[p].charCodeAt(0) & 255) >>> 0;
            m = k;
        }
        for (var u = 1, l = 0, h = m.length, q, s = 0; 0 < h;) {
            q = 1024 < h ? 1024 : h;
            h -= q;
            do (u += m[s++]), (l += u);
            while (--q);
            u %= 65521;
            l %= 65521;
        }
        b = ((l << 16) | u) >>> 0;
        this.j.c = g;
        a = await this.j.f();
        g = a.length;
        C &&
            ((a = new Uint8Array(a.buffer)),
                a.length <= g + 4 &&
                ((this.a = new Uint8Array(a.length + 4)), this.a.set(a), (a = this.a)),
                (a = a.subarray(0, g + 4)));
        a[g++] = (b >> 24) & 255;
        a[g++] = (b >> 16) & 255;
        a[g++] = (b >> 8) & 255;
        a[g++] = b & 255;
        return a;
    };
    ba("Zlib.Deflate", Ka);
    ba("Zlib.Deflate.compress", async function (f, d) {
        return new Ka(f, d).f();
    });
    ba("Zlib.Deflate.prototype.compress", Ka.prototype.f);
    var Ma = { NONE: V.NONE, FIXED: V.h, DYNAMIC: V.g },
        Na,
        Oa,
        W,
        Pa;
    if (Object.keys) Na = Object.keys(Ma);
    else for (Oa in ((Na = []), (W = 0), Ma)) Na[W++] = Oa;
    W = 0;
    for (Pa = Na.length; W < Pa; ++W)
        (Oa = Na[W]), ba("Zlib.Deflate.CompressionType." + Oa, Ma[Oa]);
}.call(this || window || global));
