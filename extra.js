function round(p, callback) {
    return function (element) {
	const [ row , col ] = element.position
	const tt = row === 0 ? null : [row - 1, col]
	const bb = row === p.rows - 1 ? null : [row + 1, col]
	const ll = col === 0 ? null : [row, col - 1]
	const rr = col === p.cols - 1 ? null : [row, col + 1]
	const tl = !tt || !ll ? null : [tt[0], ll[1]]
	const tr = !tt || !rr ? null : [tt[0], rr[1]]
	const bl = !bb || !ll ? null : [bb[0], ll[1]]
	const br = !bb || !rr ? null : [bb[0], rr[1]]
	const dirs = [ tl, tt, tr, ll, rr, bl, bb, br ].filter(Boolean)
	callback && callback(dirs)
	return dirs
    }
}
