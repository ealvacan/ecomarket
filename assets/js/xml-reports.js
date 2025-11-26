class XmlReportGenerator {
  constructor() {
    this.api = window.ecoMarketAPI;
  }

  // Generar y mostrar informe XML
  generateReport() {
    try {
      // Obtener XML de la API
      const xml = this.api.generateXmlReport();
      
      // Formatear XML para visualización
      const formattedXml = this.formatXml(xml);
      
      // Mostrar árbol XML
      document.getElementById('xmlTree').textContent = formattedXml;
      
      // Parsear XML para mostrar resumen
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      
      // Extraer valores
      const totalProducts = xmlDoc.querySelector('totalProducts').textContent;
      const totalUsers = xmlDoc.querySelector('totalUsers').textContent;
      const totalEcoPoints = xmlDoc.querySelector('totalEcoPoints').textContent;
      const percentage = xmlDoc.querySelector('percentage').textContent;
      
      // Mostrar resumen con valores totales y porcentajes
      this.displaySummary(totalProducts, totalUsers, totalEcoPoints, percentage);
      
      // Mostrar sección de informes
      document.getElementById('xmlReport').style.display = 'block';
      
      // Desplazarse a la sección
      document.getElementById('reports').scrollIntoView({ behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error al generar informe:', error);
      alert('Error al generar el informe XML. Por favor, inténtalo de nuevo.');
    }
  }

  // Mostrar resumen del informe
  displaySummary(totalProducts, totalUsers, totalEcoPoints, percentage) {
    document.getElementById('reportSummary').innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <div class="stat-box">
            <h5>Total de Productos</h5>
            <p class="display-6">${totalProducts}</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="stat-box">
            <h5>Total de Usuarios</h5>
            <p class="display-6">${totalUsers}</p>
          </div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-md-6">
          <div class="stat-box">
            <h5>Puntos Eco Generados</h5>
            <p class="display-6">${totalEcoPoints}</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="stat-box">
            <h5>Porcentaje de Sostenibilidad</h5>
            <p class="display-6">${percentage}</p>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <h5>Distribución por Categoría:</h5>
        ${this.generateCategoryBreakdown()}
      </div>
    `;
  }

  // Generar desglose por categoría
  generateCategoryBreakdown() {
    const products = this.api.getProducts();
    const categories = {};
    
    // Contar productos por categoría
    products.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });
    
    // Calcular porcentajes
    const total = products.length;
    let breakdown = '<ul class="list-group">';
    
    for (const [category, count] of Object.entries(categories)) {
      const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
      breakdown += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${category}
          <span class="badge bg-eco rounded-pill">${percentage}%</span>
        </li>
      `;
    }
    
    breakdown += '</ul>';
    return breakdown;
  }

  // Formatear XML con sangría
  formatXml(xml) {
    const PADDING = ' '.repeat(2);
    const reg = /(>)(<)(\/*)/g;
    let pad = 0;
    
    xml = xml.replace(reg, '$1\r\n$2$3');
    
    return xml.split('\r\n').map((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/) && pad > 0) {
        pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }
      
      pad += indent;
      return PADDING.repeat(pad - indent) + node;
    }).join('\r\n');
  }
}

// Instancia global del generador de informes
window.xmlReportGenerator = new XmlReportGenerator();