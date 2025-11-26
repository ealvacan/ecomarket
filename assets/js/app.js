document.addEventListener('DOMContentLoaded', () => {
  // Cargar productos al iniciar
  loadProducts();
  
  // Configurar event listeners
  setupEventListeners();
});

// Cargar y mostrar productos
function loadProducts() {
  const products = window.ecoMarketAPI.getProducts();
  const productsGrid = document.getElementById('productsGrid');
  productsGrid.innerHTML = '';
  
  products.forEach(product => {
    const card = createProductCard(product);
    productsGrid.appendChild(card);
  });
}

// Crear tarjeta de producto
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'col-md-4 mb-4';
  card.innerHTML = `
    <div class="card product-card h-100">
      <img src="assets/img/${product.image}" class="card-img-top" alt="${product.name}">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <h5 class="card-title">${product.name}</h5>
          <span class="badge bg-eco">${product.ecoPoints} pts</span>
        </div>
        <p class="card-text">${product.description.substring(0, 80)}...</p>
        <div class="d-flex justify-content-between align-items-center">
          <span class="badge bg-secondary">${product.category}</span>
          <span class="badge ${getTypeBadgeClass(product.type)}">${product.type}</span>
        </div>
      </div>
      <div class="card-footer bg-transparent">
        <div class="btn-group w-100" role="group">
          <button class="btn btn-outline-primary btn-sm" onclick="viewProduct(${product.id})">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-outline-warning btn-sm" onclick="editProduct(${product.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-outline-danger btn-sm" onclick="deleteProduct(${product.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  return card;
}

// Obtener clase CSS para tipo de producto
function getTypeBadgeClass(type) {
  switch(type) {
    case 'Venta': return 'bg-primary';
    case 'Trueque': return 'bg-success';
    case 'Donación': return 'bg-warning text-dark';
    default: return 'bg-secondary';
  }
}

// Ver detalles del producto
function viewProduct(id) {
  const product = window.ecoMarketAPI.getProduct(id);
  if (product) {
    alert(`Detalles del producto:\n\nNombre: ${product.name}\nDescripción: ${product.description}\nCategoría: ${product.category}\nTipo: ${product.type}\nPuntos Eco: ${product.ecoPoints}`);
  }
}

// Editar producto
function editProduct(id) {
  const product = window.ecoMarketAPI.getProduct(id);
  if (product) {
    const newName = prompt('Nuevo nombre:', product.name);
    if (newName && newName.trim() !== '') {
      window.ecoMarketAPI.updateProduct(id, { name: newName.trim() });
      loadProducts();
    }
  }
}

// Eliminar producto
function deleteProduct(id) {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    if (window.ecoMarketAPI.deleteProduct(id)) {
      loadProducts();
      alert('Producto eliminado correctamente');
    } else {
      alert('Error al eliminar el producto');
    }
  }
}

// Configurar event listeners
function setupEventListeners() {
  // Botón para generar informe XML
  document.getElementById('generateReportBtn').addEventListener('click', () => {
    window.xmlReportGenerator.generateReport();
  });
  
  // Botón para agregar nuevo producto
  document.getElementById('addProductBtn').addEventListener('click', showAddProductForm);
}

// Mostrar formulario para agregar producto
function showAddProductForm() {
  const formHtml = `
    <div class="card mt-4">
      <div class="card-body">
        <h5 class="card-title">Agregar Nuevo Producto</h5>
        <form id="addProductForm">
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" id="productName" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" id="productDescription" required></textarea>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Categoría</label>
              <select class="form-select" id="productCategory" required>
                <option value="">Seleccionar...</option>
                <option value="Alimentos">Alimentos</option>
                <option value="Ropa">Ropa</option>
                <option value="Hogar">Hogar</option>
                <option value="Jardinería">Jardinería</option>
                <option value="Artesanías">Artesanías</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Tipo</label>
              <select class="form-select" id="productType" required>
                <option value="">Seleccionar...</option>
                <option value="Venta">Venta</option>
                <option value="Trueque">Trueque</option>
                <option value="Donación">Donación</option>
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Puntos Eco</label>
            <input type="number" class="form-control" id="productEcoPoints" min="1" max="100" required>
          </div>
          <button type="submit" class="btn btn-eco">Guardar Producto</button>
          <button type="button" class="btn btn-secondary ms-2" onclick="hideAddProductForm()">Cancelar</button>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('addProductFormContainer').innerHTML = formHtml;
  
  // Configurar submit del formulario
  document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
}

// Manejar agregar producto
function handleAddProduct(e) {
  e.preventDefault();
  
  const productData = {
    name: document.getElementById('productName').value,
    description: document.getElementById('productDescription').value,
    category: document.getElementById('productCategory').value,
    type: document.getElementById('productType').value,
    ecoPoints: parseInt(document.getElementById('productEcoPoints').value),
    image: 'default-product.jpg',
    available: true
  };
  
  try {
    window.ecoMarketAPI.createProduct(productData);
    loadProducts();
    hideAddProductForm();
    alert('Producto agregado correctamente');
  } catch (error) {
    console.error('Error al agregar producto:', error);
    alert('Error al agregar el producto');
  }
}

// Ocultar formulario de agregar producto
function hideAddProductForm() {
  document.getElementById('addProductFormContainer').innerHTML = '';
}