function defaultComparator(a, b) {
  return a - b
}

let search = function(item, array, comparator) {
  if(!comparator)
    comparator = defaultComparator

  var low  = 0,
      high = array.length - 1,
      mid, comp

  while(low <= high) {
    mid  = (low + high) >>> 1
    comp = comparator(array[mid], item)

    if(comp < 0)
      low = mid + 1

    else if(comp > 0)
      high = mid - 1

    else
      return mid
  }

  return -(low + 1)
}

let insert = function(item, array, comparator) {
  var i = search(item, array, comparator)

  if(i < 0)
    i = -(i + 1)

  array.splice(i, 0, item)
}
export { search, insert };
