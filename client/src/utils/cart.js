exports.addToCart = (product, quantity = 1) => {
  let cart = [];

  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }

  const existingProduct = cart.find((item) => item._id === product._id);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({
      _id: product._id,
      productName: product.productName,
      price: product.price,
      image: product.image,
      in_stuck: product.in_stuck,
      quantity: quantity,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};
