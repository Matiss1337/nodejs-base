const deleteProduct = (button) => {
    const { productId, csrf: csrfToken } = button.dataset;

    fetch(`/admin/product/${productId}`, {
        method: "DELETE",
        headers: {
            "csrf-token": csrfToken,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Deleting product failed");
            }

            return response.json();
        })
        .then(() => {
            const productCard = button.closest(".product-card");

            if (productCard) {
                productCard.remove();
            }
        })
        .catch((err) => {
            console.log(err);
        });
};
