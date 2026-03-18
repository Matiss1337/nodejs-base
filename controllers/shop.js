const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            console.log(products);
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "All Products",
                path: "/products",
            });
        })
        .catch((err) => {
            err.httpStatusCode = 500;
            return next(err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products",
            });
        })
        .catch((err) => {
            err.httpStatusCode = 500;
            return next(err);
        });
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop",
                path: "/",
            });
        })
        .catch((err) => {
            err.httpStatusCode = 500;
            return next(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .execPopulate()
        .then((user) => {
            const products = user.cart.items;
            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your Cart",
                products: products,
            });
        })
        .catch((err) => {
            err.httpStatusCode = 500;
            return next(err);
        });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then((result) => {
            console.log(result);
            res.redirect("/cart");
        })
        .catch((err) => {
            err.httpStatusCode = 500;
            return next(err);
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((err) => {
            err.httpStatusCode = 500;
            return next(err);
        });
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate("cart.items.productId")
        .execPopulate()
        .then((user) => {
            const products = user.cart.items.map((i) => {
                return {
                    quantity: i.quantity,
                    product: { ...i.productId._doc },
                };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user,
                },
                products: products,
            });
            return order.save();
        })
        .then((result) => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect("/orders");
        })
        .catch((err) => {
            err.httpStatusCode = 500;
            return next(err);
        });
};

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .then((orders) => {
            res.render("shop/orders", {
                path: "/orders",
                pageTitle: "Your Orders",
                orders: orders,
            });
        })
        .catch((err) => {
            err.httpStatusCode = 500;
            return next(err);
        });
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const invoiceName = `invoice-${orderId}.pdf`;
    const invoicePath = path.join(
        __dirname,
        "..",
        "data",
        "invoices",
        invoiceName,
    );
    Order.findOne({ _id: orderId, "user.userId": req.user._id })
        .then((order) => {
            if (!order) {
                const error = new Error("Order not found.");
                error.httpStatusCode = 404;
                throw error;
            }
            const pdfDoc = new PDFDocument();
            const file = fs.createWriteStream(invoicePath);

            pdfDoc.pipe(file);
            pdfDoc.pipe(res);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `inline; filename="${invoiceName}"`,
            );

            let totalPrice = 0;

            pdfDoc.fontSize(26).text("Invoice", {
                underline: true,
            });
            pdfDoc.moveDown();
            pdfDoc.fontSize(14).text(`Order ID: ${order._id}`);
            pdfDoc.text(`Customer: ${order.user.email}`);
            pdfDoc.text("-----------------------");
            pdfDoc.moveDown();

            order.products.forEach((prod) => {
                const product = prod.product;
                const lineTotal = prod.quantity * product.price;
                totalPrice += lineTotal;

                pdfDoc.fontSize(16).text(product.title);
                pdfDoc.fontSize(12).text(`Product ID: ${product._id}`);
                pdfDoc.text(`Description: ${product.description}`);
                pdfDoc.text(`Price: $${product.price}`);
                pdfDoc.text(`Quantity: ${prod.quantity}`);
                pdfDoc.text(`Line Total: $${lineTotal}`);
                pdfDoc.moveDown();
            });

            pdfDoc.text("---");
            pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`);
            pdfDoc.end();
        })
        .catch((err) => {
            if (!err.httpStatusCode) {
                err.httpStatusCode = 500;
            }
            return next(err);
        });
};
