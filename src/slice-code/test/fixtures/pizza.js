export {makePizza}

const pizzaTypes = [
  'cheese',
  'pepperoni',
  'meatLovers',
  'supreme',
]

const getCrust = (size, crustType) => `${size}: ${crustType || 'Hand tossed pizza'}`
const getSauce = (size, sauceType) => `${size}: ${sauceType}`
const getCheese = (size, cheeseType) => `${size}: ${cheeseType} cheese`
const getMeats = (size, meats) => `${size}: ${meats.join(', ')}`
const getVeggies = (size, veggies) => `${size}: ${veggies.join(', ')}`

function makePizza(order) {
  if (!pizzaTypes.includes(order.type)) {
    throw new Error(`${order.type} pizza 🍕 is not available 😦`)
  }
  const pizza = {
    type: order.type,
    crust: getCrust(order.size, order.crustType),
    crustEdge: order.crustEdge || 'Garlic Buttery Blend',
    sauce: order.sauceType ? getSauce(order.size, order.sauceType) : undefined,
    cheese: order.cheeseType ? getCheese(order.size, order.cheeseType) : undefined,
    meats: order.meats ? getMeats(order.size, order.meats) : undefined,
    veggies: order.veggies ? getVeggies(order.size, order.veggies) : undefined,
  }

  return preparePizza(pizza)
}

function preparePizza(pizza) {
  // todo...
  return pizza
}
