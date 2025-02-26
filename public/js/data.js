// Menu items data
const menuData = {
    products: [
        {
            id: 1,
            name: "Americano 701",
            price: 4.00,
            description: "Our signature Americano blend, perfectly balanced for a smooth taste.",
            images: ["medias/americano-1.jpeg"],
            rating: 4.8,
            reviews: 171,
            options: {
                "Milk Type": ["No Milk", "Whole Milk", "Oat Milk", "Almond Milk"],
                "Sweetness": ["No Sugar", "Less Sugar", "Normal Sugar"],
                "Temperature": ["Hot", "Iced"]
            }
        },
        {
            id: 2,
            name: "Cold Brew 701",
            price: 5.00,
            description: "Smooth, rich cold brew coffee steeped for 12 hours.",
            images: ["medias/coldbrew-1.jpeg", "medias/coldbrew-2.jpeg"],
            rating: 4.9,
            reviews: 289,
            options: {
                "Milk Type": ["No Milk", "Whole Milk", "Oat Milk", "Almond Milk"],
                "Sweetness": ["No Sugar", "Less Sugar", "Normal Sugar"],
                "Temperature": ["Iced"]
            }
        },
        {
            id: 3,
            name: "Latte 701",
            price: 6.00,
            description: "Expertly crafted latte with rich espresso and silky steamed milk.",
            images: ["medias/latte-1.jpeg"],
            rating: 4.7,
            reviews: 302,
            options: {
                "Milk Type": ["Whole Milk", "Oat Milk", "Almond Milk"],
                "Sweetness": ["No Sugar", "Less Sugar", "Normal Sugar"],
                "Temperature": ["Hot", "Iced"]
            }
        },
        {
            id: 4,
            name: "Special 701",
            price: 7.00,
            description: "Our barista's special creation, a unique blend of flavors.",
            images: ["medias/special-1.jpeg"],
            rating: 4.9,
            reviews: 568,
            options: {
                "Milk Type": ["Stay Active"],
                "Sweetness": ["Be Well"],
                "Temperature": ["Be Loved"]
            }
        }
    ]
};

// Prevent accidental modifications
Object.freeze(menuData);
Object.freeze(menuData.products);
menuData.products.forEach(product => Object.freeze(product));

// Export for use in other files
window.menuData = menuData; 