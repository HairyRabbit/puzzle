function puzzle(row$col) {
  // Puzzle element collects
  const collects = {}
  
  if(typeof row$col === 'string' && row$col.match(/^\d+x\d+$/)) {
    // Match 9x9
    let [ rowsNumber, colsNumber ] = row$col.split('x')
    rowsNumber = Number(rowsNumber)
    colsNumber = Number(colsNumber)        

    collects.rows = rowsNumber
    collects.cols = colsNumber
    
    for(let i = 0; i < rowsNumber; i++) {
      for(let j = 0; j < colsNumber; j++) {
      	const element = { element: ' ', position: [i, j] }
      	collects['P' + i + '_' + j] = element
      }
    }
  } else if(Array.isArray(row$col)) {
    // Math [[A]]
    let rowsNumber = row$col.length
    let colsNumber = row$col[0].length
    collects.rows = rowsNumber
    collects.cols = colsNumber
    
    for(let i = 0; i < rowsNumber; i++) {
      for(let j = 0; j < colsNumber; j++) {
      	const element = { element: row$col[i][j], position: [i, j] }
      	collects['P' + i + '_' + j] = element
      }
    }
  } else {
    // Math `AAA\nBBB\n`
    return puzzle(row$col.split('\n').map(x => x.split('')))
  }

  // Set rows and cols
  collects['R'] = []
  for(let i = 0; i < collects.rows; i++) {
    let arr = []
    for(let j = 0; j < collects.cols; j++) {
      arr.push(collects['P' + i + '_' + j])
    }
    collects['R' + i] = arr
    collects['R'].push(arr)
    arr = []
  }

  collects['C'] = []
  for(let i = 0; i < collects.cols; i++) {
    let arr = []
    for(let j = 0; j < collects.rows; j++) {
      arr.push(collects['P' + j + '_' + i])
    }
    collects['C' + i] = arr
    collects['C'].push(arr)
    arr = []
  }

  return collects
}

function clone(puzzle) {
  const rowsNumber = puzzle.rows
  const colsNumber = puzzle.cols
  
  const collects = {}
  
  collects.rows = rowsNumber
  collects.cols = colsNumber
  
  for(let i = 0; i < rowsNumber; i++) {
    for(let j = 0; j < colsNumber; j++) {
      collects['P' + i + '_' + j] = Object.assign({}, puzzle['P' + i + '_' + j])
    }
  }

  collects['R'] = []
  for(let i = 0; i < collects.rows; i++) {
    let arr = []
    for(let j = 0; j < collects.cols; j++) {
      arr.push(collects['P' + i + '_' + j])
    }
    collects['R' + i] = arr
    collects['R'].push(arr)
    arr = []
  }

  collects['C'] = []
  for(let i = 0; i < collects.cols; i++) {
    let arr = []
    for(let j = 0; j < collects.rows; j++) {
      arr.push(collects['P' + j + '_' + i])
    }
    collects['C' + i] = arr
    collects['C'].push(arr)
    arr = []
  }

  return collects
}

function maprow(puzzle, rowNumber, callback) {
  const elems = puzzle['R' + String(rowNumber)]
  elems.forEach(callback)
}

function mapcol(puzzle, colNumber, callback) {
  const elems = puzzle['C' + String(colNumber)]
  elems.forEach(callback)
}

function map(puzzle, callback) {
  let flag = false
  function done() { flag = true }
  for(let i = 0; i < puzzle.rows; i++) {
    for(let j = 0; j < puzzle.cols; j++) {
      callback(puzzle['P' + i + '_' + j], i * puzzle.cols + j, done)
      if(flag) return
    }
  }
}

function get(puzzle, row, col) {
  if(col === undefined) return puzzle['P' + row.join('_')]
  return puzzle['P' + row + '_' + col]
}

function set(puzzle, row, col, val) {
  return puzzle['P' + row + '_' + col].element = val 
}

function render(puzzle) {
  let rows = [], cols = []
  map(puzzle, (elem, index) => {
    cols.push(elem.element)
    if((index + 1) % puzzle.cols === 0) {
      rows.push(cols.join(' '))
      cols = []
    }
  })
  return rows.join('\n')
}

function find(puzzle, target) {
  const arr = []
  map(puzzle, elem => {
    if(typeof target === 'function') {
      if(target(elem)) arr.push(elem)
    } else {
      if(elem.element === target) arr.push(elem)
    }
  })
  return arr
}

function findOne(puzzle, target) {
  const arr = []
  map(puzzle, (elem, index, done) => {
    if(typeof target === 'function') {
      if(target(elem)) arr.push(elem)
    } else {
      if(elem.element === target) arr.push(elem)
    }
    done()
  })
  return arr.length === 1 ? arr[0] : null
}
