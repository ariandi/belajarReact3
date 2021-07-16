import React, {useReducer} from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
}

const cartReducer = (state, action) => {
  if (action.type === 'ADD') {
    const updateTotalAmount = state.totalAmount + action.item.price * action.item.amount;

    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const existingCartItem = state.items[existingCartItemIndex];
    let updatingItems;

    if (existingCartItem) {
      const updatingItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      }
      updatingItems = [...state.items];
      updatingItems[existingCartItemIndex] = updatingItem;
    } else {
      updatingItems = state.items.concat(action.item);
    }

    return {
      items: updatingItems,
      totalAmount: updateTotalAmount,
    }
  } else if (action.type === 'REMOVE') {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );

    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatingItems;
    if(existingItem.amount === 1) {
      updatingItems = state.items.filter(item => item.id !== action.id);
    } else {
      const updatingItem = {...existingItem, amount: existingItem.amount - 1};
      updatingItems = [...state.items];
      updatingItems[existingCartItemIndex] = updatingItem;
    }

    return {
      items: updatingItems,
      totalAmount: updatedTotalAmount,
    }

  }
  return defaultCartState;
}

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);

  const addItemToCartHandler = item => {
    dispatchCartAction({type: 'ADD', item: item});
  };

  const removeItemFromCartHandler = id => {
    dispatchCartAction({type: 'REMOVE', id: id});
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  }

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
}

export default CartProvider;
