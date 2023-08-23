import React from "react";
import CheckoutForm from "./CheckoutForm";
import EmptyCart from "../cart/EmptyCart.js";

export default class Checkout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      delivery: false,
      promoCode: false,
    };
    this.toggleDelivery = this.toggleDelivery.bind(this);
    this.togglePromocode = this.togglePromocode.bind(this);
  }
  toggleDelivery(e) {
    if (e.target.value === "delivery") {
      this.setState({ delivery: true });
    }
    if (e.target.value === "takeaway") {
      this.setState({ delivery: false });
    }
  }
  togglePromocode() {
    this.setState({ promoCode: !this.state.promoCode });
  }
  render() {
    const {
      cartItems,
      productsQuantity,
      totalPayment,
      taxes,
      checkoutSummary,
      currentUser
    } = this.props;
    document.title = "Checkout | Pizza Time";
    return (
      <main className="checkout">
        <h2>Checkout</h2>
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <article className="checkout-content">
            {checkoutSummary}
            <CheckoutForm toggleDelivery={this.toggleDelivery}
              delivery={this.state.delivery} promoCode={this.state.promoCode}
              togglePromocode={this.togglePromocode} className="checkout-carttotals"
              productsQuantity={productsQuantity}
              totalPayment={totalPayment}
              taxes={taxes} currentUser={currentUser} />

          </article>
        )}
      </main>
    );
  }
}
