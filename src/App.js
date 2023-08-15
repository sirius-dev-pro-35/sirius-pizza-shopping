import React, { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Header from './routes/landing/Header.js';
import Footer from './components/footer/Footer';
import {
  About,
  Blog,
  Cart,
  Checkout,
  Contact,
  RootSection,
  Menu,
  Payment,
  Register,
  SingleItem,
} from './routes/index';
import { allProductsData } from './data/AllProductsData.js';
import { AllCategories } from './data/AllCategories';
import CheckoutSummary from './routes/checkout/CheckoutSummary.js';
import CartTotals from './routes/cart/CartTotals.js';
import LoginModal from './components/LoginModal.js';
import CartItem from './routes/cart/CartItem.js';
import NotFound from './routes/not-found/NotFound.js';
import Refunds from './routes/refunds/Refunds.js';
import Terms from './routes/terms/Terms.js';
import Privacy from './routes/privacy/Privacy.js';
import Careers from './routes/careers/Careers.js';
import BlogPost from './routes/blog-post/BlogPost.js';

function App() {
  const [allCategories, setAllCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Menu');
  const [cartItems, setCartItems] = useState([]);
  const [clearedCart, setClearedCart] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [productsQuantity, setProductsQuantity] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [validLogin, setValidLogin] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [loginModalWindow, setLoginModalWindow] = useState(false);

  const activateLoginModal = () => {
    hideMenu();
    setLoginModalWindow(!loginModalWindow);
  }

  const handleLogout = () => {
    setValidLogin(false);
  };

  const findMenuItem = (e) => {
    e.preventDefault();
    const inputValue = e.target.value.toLowerCase();
    const collectData = allProductsData.filter(product =>
      product.ItemName.toLowerCase().includes(inputValue)
    );

    if (collectData.length > 0) {
      setAllProducts(collectData);
    } else {
      setAllProducts([]);
    }
  };

  const showModal = () => {
    setIsModalActive(!isModalActive);
  };
  const hideMenu = () => {
    setIsModalActive(false);
  };

  const getAllCategories = async () => {
    setAllCategories(AllCategories);
  };

  const getAllProducts = () => {
    setAllProducts(allProductsData);
  };
  // CART LOGIC
  /*******************************************************/

  const CheckRepeatableProducts = (cartItems, targetProduct, userSelectedAttributes) => {
    let item;
    let productsById = cartItems.filter((item) => item.id === targetProduct.id);
    productsById.forEach((targetItem) => {
      if (MatchingAttributes(userSelectedAttributes, targetItem)) {
        item = targetItem;
      }
    });
    return item;
  };
  const MatchingAttributes = (userSelectedAttributes, targetProduct) => {
    const attributesMatch = (groupOne, groupTwo) => {
      return Object.values(groupOne)[1] === Object.values(groupTwo)[1];
    };

    let truthyValuesCounter = 0;
    let i = 0;
    while (i < userSelectedAttributes.length) {
      if (
        attributesMatch(
          userSelectedAttributes[i],
          targetProduct?.userSelectedAttributes[i]
        )
      ) {
        truthyValuesCounter += 1;
      }
      i += 1;
    }

    return truthyValuesCounter === userSelectedAttributes?.length;
  };

  const updateCartQuantity = (actionToPerfrom, productAlreadyInCart, userSelectedAttributes) => {
    const repeatableProduct = CheckRepeatableProducts(cartItems, productAlreadyInCart, userSelectedAttributes);
    const indexOfRepeatableProduct = cartItems.indexOf(repeatableProduct);

    const currentProductList = [...cartItems];
    if (actionToPerfrom === 'addProduct') {
      currentProductList[indexOfRepeatableProduct].quantity += 1;
    } else {
      currentProductList[indexOfRepeatableProduct].quantity -= 1;
    }

    return currentProductList;
  };
  const handleAddProduct = (targetProduct, userSelectedAttributes) => {

    const productAlreadyInCart = CheckRepeatableProducts(
      cartItems,
      targetProduct,
      userSelectedAttributes
    );

    let currentCartItems = [...cartItems];
    let newQuantity;

    if (productAlreadyInCart === undefined) {
      const itemToAdd = targetProduct;

      newQuantity = 1;

      currentCartItems.push({
        ...itemToAdd,
        userSelectedAttributes,
        quantity: newQuantity,
      });

    } else {
      const index = cartItems.findIndex(item => item.userSelectedAttributes[0].attributeValue === targetProduct.userSelectedAttributes[0].attributeValue);
      if (index !== -1) {
        newQuantity = cartItems[index].quantity;

        currentCartItems[index] = {
          ...cartItems[index],
          quantity: newQuantity + 1,
        };
      }
    }

    const totalCartQuantity = currentCartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );

    setCartItems(currentCartItems);
    setProductsQuantity(totalCartQuantity);
    successMsg();
  };

  const handleRemoveProduct = (targetProduct, userSelectedAttributes) => {
    let updatedProductList;
    let repeatableProduct = CheckRepeatableProducts(
      cartItems,
      targetProduct,
      userSelectedAttributes
    );

    if (repeatableProduct.quantity > 1) {
      updatedProductList = updateCartQuantity(
        'removeProduct',
        repeatableProduct,
        userSelectedAttributes
      );
    } else {
      const products = [...cartItems];
      const indexOfProduct = products.indexOf(repeatableProduct);
      products.splice(indexOfProduct, 1);
      updatedProductList = products;
    }

    setCartItems(updatedProductList);

    if (updatedProductList.length <= 1) {
      setProductsQuantity(updatedProductList[0]?.quantity || 0);
    } else {
      const productListArray = updatedProductList.map(item => item.quantity);
      const sum = productListArray.reduce((a, b) => a + b, 0);
      setProductsQuantity(sum);
    }

    if (updatedProductList.length === 0) {
      setProductsQuantity(0);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setClearedCart(true);
  };

  const getTotalPrice = (cartItems) => {
    let totalPayment = 0;
    let totalPrice = 0;

    for (let item of cartItems) {
      const correctPrice = item.ItemPrice;
      totalPrice += correctPrice * item.quantity;
    }

    totalPayment = parseFloat(totalPrice.toFixed(2));

    setTotalPayment(totalPayment);
    setTaxes(((totalPayment * 10) / 100).toFixed(2));
  };

  const successMsg = () => {
    const alertMessage = document.querySelector('.success-msg')
    alertMessage.classList.add('visible')
    setTimeout(() => {
      alertMessage.classList.remove('visible')
    }, 1000)
  };


  // Other
  /*******************************************************/
  const getProductsByCategory = (category) => {
    let separateCategoriesByname = []
    //Separate arrays by category names
    const separateCategories = allProductsData.reduce(function (
      singleCategory,
      singleItem,
    ) {
      separateCategoriesByname = Object.keys(singleCategory)

      if (!singleCategory[singleItem.Category])
        singleCategory[singleItem.Category] = singleItem
      else
        singleCategory[singleItem.Category] = Array.isArray(
          singleCategory[singleItem.Category],
        )
          ? singleCategory[singleItem.Category].concat(singleItem)
          : [singleCategory[singleItem.Category]].concat(singleItem)
      return singleCategory
    },
      {})

    const result = Object.keys(separateCategories).map(
      (e) => separateCategories[e],
    )

    let singleCategoryArray = []
    result.map((categories) => {
      return singleCategoryArray.push(categories)
    })
    //Change products by category
    separateCategoriesByname.forEach((cate) => {
      if (cate === category) {
        return setAllProducts(separateCategories[category])
      }
      if (category === 'Menu') {
        return setAllProducts(allProductsData)
      }
    })
  }

  useEffect(() => {
    getAllCategories();
    getAllProducts();
    getProductsByCategory(activeCategory);
    getTotalPrice(cartItems);
  }, [activeCategory, cartItems]);

  const changeCategory = (newCategory) => {
    setActiveCategory(newCategory);
    getProductsByCategory(newCategory);
  };

  useEffect(() => {
    const handleUpdate = (nextState) => {
      const { cartItems: nextCartItems, clearedCart: nextClearedCart, validLogin: nextValidLogin } = nextState;

      if (cartItems !== nextCartItems) {
        getTotalPrice(nextCartItems);
      }
      if (nextClearedCart) {
        clearCart();
      }
    };

    handleUpdate({
      cartItems,
      clearedCart,
      validLogin
    });
  }, [cartItems, clearedCart, validLogin]);

  return (
    <BrowserRouter>
      <Header
        loginModal={
          <LoginModal
            validLogin={validLogin}
            setValidLogin={setValidLogin}
            setLoginModalWindow={setLoginModalWindow}
            loginModalWindow={loginModalWindow}
            hideMenu={hideMenu}
          />
        }
        activateLoginModal={activateLoginModal}
        showModal={showModal}
        isModalActive={isModalActive}
        hideMenu={hideMenu}
        handleLogout={handleLogout}
        validLogin={validLogin}
        productsQuantity={productsQuantity}
      />
      <Routes>
        <Route path="/" element={<RootSection />} />

        <Route
          path="/cart"
          element={
            <Cart
              CartItem={
                <CartItem
                  clearCart={clearCart}
                  cartItems={cartItems}
                  handleAddProduct={handleAddProduct}
                  handleRemoveProduct={handleRemoveProduct}
                />
              }
              cartTotals={
                <CartTotals
                  className="cart-carttotals"
                  totalPayment={totalPayment}
                  productsQuantity={productsQuantity}
                  taxes={taxes}
                  validLogin={validLogin}
                  showModal={showModal}
                  isModalActive={isModalActive}
                  activateLoginModal={activateLoginModal}
                />
              }
              cartItems={cartItems}
              clearedCart={clearedCart}
            />
          }
        />

        <Route
          exact path="/menu"
          element={
            <Menu
              findMenuItem={findMenuItem}
              allProducts={allProducts}
              allCategories={allCategories}
              changeCategory={changeCategory}
              handleAddProduct={handleAddProduct}
              handleRemoveProduct={handleRemoveProduct}
              activeCategory={activeCategory}
            />
          }
        />
        <Route
          path="/menu/:name"
          element={
            <SingleItem
              handleAddProduct={handleAddProduct}
              handleRemoveProduct={handleRemoveProduct}
            />
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route exact path="/blog" element={<Blog />} />
        <Route path="/blog/:name" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={validLogin ? <NotFound /> : <Register />} />
        <Route
          path="/checkout"
          element={
            <Checkout
              checkoutSummary={
                <CheckoutSummary
                  cartItems={cartItems}
                  handleAddProduct={handleAddProduct}
                  handleRemoveProduct={handleRemoveProduct}
                />
              }
              totalPayment={totalPayment}
              cartItems={cartItems}
              productsQuantity={productsQuantity}
              taxes={taxes}
            />
          }
        />
        <Route
          path="/payment"
          element={
            <Payment
              cartItems={cartItems}
              totalPayment={totalPayment}
            />
          }
        />
        <Route path="/careers" element={<Careers />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/refunds" element={<Refunds />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
