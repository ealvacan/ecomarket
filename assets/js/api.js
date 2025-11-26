class EcoMarketAPI {
  constructor() {
    this.storageKey = 'ecomarket_products';
    this.initializeData();
  }

  // Inicializar datos de ejemplo
  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialProducts = [
        {
          id: 1,
          name: 'Manzanas Orgánicas',
          description: 'Manzanas frescas cultivadas sin pesticidas',
          category: 'Alimentos',
          type: 'Venta',
          ecoPoints: 10,
          image: 'apple.jpg',
          available: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Camiseta de Algodón Orgánico',
          description: 'Camiseta 100% algodón orgánico',
          category: 'Ropa',
          type: 'Trueque',
          ecoPoints: 15,
          image: 'tshirt.jpg',
          available: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Jabón Natural',
          description: 'Jabón hecho a base de ingredientes naturales',
          category: 'Hogar',
          type: 'Donación',
          ecoPoints: 5,
          image: 'soap.jpg',
          available: true,
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(initialProducts));
    }
  }

  // Obtener todos los productos
  getProducts() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  // Obtener un producto por ID
  getProduct(id) {
    const products = this.getProducts();
    return products.find(p => p.id === id);
  }

  // Crear un nuevo producto
  createProduct(productData) {
    const products = this.getProducts();
    const newProduct = {
      id: Date.now(),
      ...productData,
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    localStorage.setItem(this.storageKey, JSON.stringify(products));
    return newProduct;
  }

  // Actualizar un producto
  updateProduct(id, productData) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
      products[index] = { ...products[index], ...productData };
      localStorage.setItem(this.storageKey, JSON.stringify(products));
      return products[index];
    }
    
    return null;
  }

  // Eliminar un producto
  deleteProduct(id) {
    const products = this.getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length !== products.length) {
      localStorage.setItem(this.storageKey, JSON.stringify(filteredProducts));
      return true;
    }
    
    return false;
  }

  // Generar informe XML
  generateXmlReport() {
    const products = this.getProducts();
    
    // Calcular estadísticas
    const totalProducts = products.length;
    const totalEcoPoints = products.reduce((sum, p) => sum + p.ecoPoints, 0);
    const sustainabilityPercentage = totalProducts > 0 
      ? (totalEcoPoints / totalProducts).toFixed(2) 
      : 0;
    
    // Crear XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<ecoImpactReport>
  <summary>
    <totalProducts>${totalProducts}</totalProducts>
    <totalUsers>85</totalUsers>
    <totalEcoPoints>${totalEcoPoints}</totalEcoPoints>
    <percentage>${sustainabilityPercentage}%</percentage>
  </summary>
  <products>`;

    products.forEach(product => {
      xml += `
    <product>
      <id>${product.id}</id>
      <name>${product.name}</name>
      <category>${product.category}</category>
      <type>${product.type}</type>
      <ecoPoints>${product.ecoPoints}</ecoPoints>
    </product>`;
    });

    xml += `
  </products>
</ecoImpactReport>`;

    return xml;
  }
}

// Instancia global de la API
window.ecoMarketAPI = new EcoMarketAPI();