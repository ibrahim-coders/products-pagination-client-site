import React, { useEffect, useState } from 'react';
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const { count } = useLoaderData();

  const [itemsPerPage, setitemsPerPage] = useState(10);
  const [currentPages, setCurreantPages] = useState(0);
  const numberOfPages = Math.ceil(count / itemsPerPage);
  const pagesArray = [...Array(numberOfPages).keys()];
  //   const pagesArray = [];

  //   for (let i = 0; i < numberOfPages; i++) {
  //     pagesArray.push(i);
  //   }
  //   console.log(pagesArray);
  const handeChangesPages = e => {
    console.log(e.target.value);
    const val = parseInt(e.target.value);
    setitemsPerPage(val);
    setCurreantPages(0);
  };
  useEffect(() => {
    fetch(
      `http://localhost:5000/products?pages=${currentPages}&size=${itemsPerPage}`
    )
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [currentPages, itemsPerPage]);

  useEffect(() => {
    const storedCart = getShoppingCart();
    const savedCart = [];
    // step 1: get id of the addedProduct
    for (const id in storedCart) {
      // step 2: get product from products state by using id
      const addedProduct = products.find(product => product._id === id);
      if (addedProduct) {
        // step 3: add quantity
        const quantity = storedCart[id];
        addedProduct.quantity = quantity;
        // step 4: add the added product to the saved cart
        savedCart.push(addedProduct);
      }
      // console.log('added Product', addedProduct)
    }
    // step 5: set the cart
    setCart(savedCart);
  }, [products]);

  const handleAddToCart = product => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find(pd => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter(pd => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };
  const handlePrevPages = () => {
    if (currentPages > 0) {
      setCurreantPages(currentPages - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPages < pagesArray.length - 1) {
      setCurreantPages(currentPages + 1);
    }
  };
  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map(product => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>

      <div className="pages">
        <p>Pages:{currentPages}</p>
        <button onClick={handlePrevPages}>Prev</button>
        {pagesArray.map(pages => (
          <button
            className={currentPages === pages ? 'current' : ''}
            onClick={() => setCurreantPages(pages)}
          >
            {pages}
          </button>
        ))}
        <button onClick={handleNextPage}>Next</button>
        <select
          name=""
          id=""
          value={setitemsPerPage}
          onChange={handeChangesPages}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
          <option value="60">60</option>
          <option value="70">70</option>
          <option value="76">76</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;
