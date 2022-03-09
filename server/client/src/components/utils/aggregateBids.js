 // Function to aggregate bids and offers if they are the same price
  export const aggregateBids = (array, keys) => {
  return array.reduce((acc, item) => {
    // find the matching index for the item (e.g. offer_to_buy or offer_to_sell price)
    let index = acc.findIndex(index => keys.every(key => index[key] === item[key]))
    // if no matching index then add item to array, otherwise aggregate the price 
    index === -1 ? acc.push(item) : acc[index].number_units += item.number_units
    return acc
  },[])
} 