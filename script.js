document.addEventListener('DOMContentLoaded', () => {
    const accordion = document.getElementById('accordion');

    const productsByAisleFloorColumn = {
        "Rayon A": {
            "Étage 1": {
                "Colonne 1": [],
                "Colonne 2": [],
                "Colonne 3": [],
                "Colonne 4": [],
                "Colonne 5": [],
                "Colonne 6": [],
            },
            "Étage 2": {
                "Colonne 1": [],
                "Colonne 2": [],
                "Colonne 3": [],
                "Colonne 4": [],
                "Colonne 5": [],
                "Colonne 6": [],
            },
            "Étage 3": {
                "Colonne 1": [],
                "Colonne 2": [],
                "Colonne 3": [],
                "Colonne 4": [],
                "Colonne 5": [],
                "Colonne 6": [],
            },
            "Étage 4": {
                "Colonne 1": [],
                "Colonne 2": [],
                "Colonne 3": [],
                "Colonne 4": [],
                "Colonne 5": [],
                "Colonne 6": [],
            },
        },
        "Rayon B": {
            "Étage 1": {
                "Colonne 1": [],
                "Colonne 2": [],
            },
            "Étage 2": {
                "Colonne 1": [],
                "Colonne 2": [],
            },
            "Étage 3": {
                "Colonne 1": [],
                "Colonne 2": [],
            },
        },
        // ... (autres rayons)
    };

    function addProductToStructure(product) {
        const { aisle, floor, column } = product;

        if (!productsByAisleFloorColumn[aisle]) {
            productsByAisleFloorColumn[aisle] = {};
        }
        if (!productsByAisleFloorColumn[aisle][floor]) {
            productsByAisleFloorColumn[aisle][floor] = {};
        }
        if (!productsByAisleFloorColumn[aisle][floor][column]) {
            productsByAisleFloorColumn[aisle][floor][column] = [];
        }

        productsByAisleFloorColumn[aisle][floor][column].push(product);
    }

    function displayProducts() {
        accordion.innerHTML = '';

        for (const rayon in productsByAisleFloorColumn) {
            let totalProductsToCheck = 0;
            let totalUrgentProducts = 0;
            let totalProductsInRayon = 0;
            const rayonProducts = [];

            for (const floor in productsByAisleFloorColumn[rayon]) {
                for (const column in productsByAisleFloorColumn[rayon][floor]) {
                    productsByAisleFloorColumn[rayon][floor][column].forEach(product => {
                        if (!product.inStock || isExpiredOrDueToday(product.expirationDate)) {
                            rayonProducts.push(product);
                            if (isExpiredOrDueToday(product.expirationDate)) {
                                totalUrgentProducts++;
                            }
                            if (!product.inStock) {
                                totalProductsToCheck++;
                            }
                        }
                    });
                    totalProductsInRayon += productsByAisleFloorColumn[rayon][floor][column].length;
                }
            }

            if (rayonProducts.length > 0) {
                const accordionItem = createAccordionItem(rayon, rayonProducts, totalProductsToCheck, totalUrgentProducts, totalProductsInRayon);
                accordion.appendChild(accordionItem);
            }
        }
    }

    function createAccordionItem(rayon, products, productsToCheck, urgentProducts, totalProducts) {
        const accordionItem = document.createElement('div');
        accordionItem.classList.add('accordion-item');

        const heading = document.createElement('div');
        heading.classList.add('accordion-heading');
        heading.innerHTML = `<h2>${rayon} (${urgentProducts} urgent / ${productsToCheck} à vérifier / ${totalProducts} au total)</h2>`;
        heading.addEventListener('click', () => {
            const content = accordionItem.querySelector('.accordion-content');
            content.classList.toggle('active');
        });

        const content = document.createElement('div');
        content.classList.add('accordion-content');

        // Tableau pour indiquer les produits à vérifier ou urgents
        const table = document.createElement('table');
        for (const floor in productsByAisleFloorColumn[rayon]) {
            const row = document.createElement('tr');
            for (const column in productsByAisleFloorColumn[rayon][floor]) {
                const cell = document.createElement('td');
                const productsInCell = productsByAisleFloorColumn[rayon][floor][column];
                if (productsInCell.some(product => !product.inStock || isExpiredOrDueToday(product.expirationDate))) {
                    cell.classList.add('urgent-cell');
                }
                if (productsInCell.some(product => !product.inStock)) {
                    cell.classList.add('to-check-cell');
                }
                row.appendChild(cell);
            }
            table.appendChild(row);
        }

        content.appendChild(table);

        products.forEach(product => {
            const productElem = document.createElement('div');
            productElem.classList.add('product');
            if (isExpiredOrDueToday(product.expirationDate)) {
                productElem.classList.add('urgent');
            } else if (!product.inStock) {
                productElem.classList.add('to-check');
            }
            productElem.innerHTML = `
                <h3>${product.name}</h3>
                <p>Étage: ${product.floor}</p>
                <p>Colonne: ${product.column}</p>
                <p>Date d'expiration: ${product.expirationDate}</p>
                <p>Code barre: ${product.barcode}</p>
                <p>${product.inStock ? 'En stock' : 'Épuisé'}</p>
            `;
            content.appendChild(productElem);
        });

        accordionItem.appendChild(heading);
        accordionItem.appendChild(content);

        return accordionItem;
    }

    function isExpiredOrDueToday(expirationDate) {
        const today = new Date().toISOString().split('T')[0];
        return expirationDate <= today;
    }

    // Exemple d'utilisation
    addProductToStructure({
        name: "Produit 1",
        aisle: "Rayon A",
        floor: "Étage 1",
        column: "Colonne 1",
        expirationDate: "2023-08-14",
        barcode: "123456789",
        inStock: true
    });
    addProductToStructure({
        name: "Produit 3",
        aisle: "Rayon A",
        floor: "Étage 2",
        column: "Colonne 6",
        expirationDate: "2023-08-15",
        barcode: "123456785",
        inStock: true
    });
    addProductToStructure({
        name: "Produit 4",
        aisle: "Rayon A",
        floor: "Étage 3",
        column: "Colonne 6",
        expirationDate: "2023-08-15",
        barcode: "123456781",
        inStock: true
    });
    addProductToStructure({
        name: "Produit 2",
        aisle: "Rayon A",
        floor: "Étage 2",
        column: "Colonne 2",
        expirationDate: "2023-08-15",
        barcode: "987654321",
        inStock: false
    });
    addProductToStructure({
        name: "Produit 5",
        aisle: "Rayon B",
        floor: "Étage 3",
        column: "Colonne 2",
        expirationDate: "2023-08-15",
        barcode: "123456780",
        inStock: true
    });
    // Ajoutez d'autres produits ici

    // Afficher les produits au chargement initial
    displayProducts();
});
