import { Product } from "../models/productModel.js";

// ---------------------controller to get all products<< user controller >>--------------------------------

//get-all-products
export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(201).json({ count: products.length, data: products });
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};

//get single product by id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    return res.status(201).json({ data: product });
  } catch (error) {
    return res.send(500).send("Internal server error");
  }
};

//create  a new  review or edit a review
export const addReview = async (req, res) => {
  const { rating, comment, productId } = req.body;
  try {
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          (rev.rating = rating), (rev.comment = comment);
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save();

    return res.status(201).json({ success: "Added a review" });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error" });
  }
};

//get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    console.log(product);

    if (!product) {
      return res.status(400).json({ error: "Products not found" });
    }

    return res.status(201).json({ reviews: product.reviews });
  } catch (error) { }
};

//delete a review
export const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }

    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.params.reviewId.toString()
    );


    let avg = 0;

    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    console.log(avg);

    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
      req.params.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    // console.log(req.query.productId);

    return res.status(201).json({ success: "Review deleted successfully" });
  } catch (error) { }
};




// ---------------------controller  of << employee >>--------------------------------

//create  a product
export const createProduct = async (req, res) => {
  const { name, description, price, images, category } = req.body;

  try {
    const productDetails = {
      name,
      description,
      price,
      images,
      category,
      user: req.user._id,
    };

    if (!productDetails) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const addProduct = new Product(productDetails);
    await addProduct.save();

    return res.status(201).json({ success: "Data added success fully" });
  } catch (error) {
    return res.status(500).send("Internal server error");
  }
};


//get all created product of employee
export const getEmployeeProducts = async (req, res) => {

  try {
    const product = await Product.find({ user: req.user });

    if (!product) {
      return res.status(401).json({ error: "You do not have any products" });
    }

    return res.status(200).json({count:product.length, data: product });

  } catch (error) {
    return res.status(500).send("Internal server Error")
  }
}

//delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      return res.status(400).json({ error: "Product not found" });
    }

    return res.status(200).json({ success: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).send("Internal server Error");
  }

}


//edit product
export const editProduct = async (req, res) => {
  try {
  const  product = await Product.findByIdAndUpdate(req.params.productId, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

  return res.status(201).json({success:"Product Updated succesfully"});
  } catch (error) {
    return res.status(500).send("Internal server Error");
  }
}
