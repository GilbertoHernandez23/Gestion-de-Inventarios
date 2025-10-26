// Array para almacenar los productos en memoria
let productos = [];

// Clase Producto para manejar los datos
class Producto {
    constructor(nombre, cantidad, precio) {
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.precio = precio;
        this.id = Date.now() + Math.random(); // ID único
    }

    // Método para calcular el total del producto
    calcularTotal() {
        return this.cantidad * this.precio;
    }

    // Método para validar el producto
    validar() {
        const errores = [];

        if (!this.nombre || this.nombre.trim() === '') {
            errores.push('El nombre del producto es requerido');
        }

        if (this.cantidad === null || this.cantidad === undefined || this.cantidad < 0) {
            errores.push('La cantidad debe ser un número positivo');
        }

        if (this.precio === null || this.precio === undefined || this.precio < 0) {
            errores.push('El precio debe ser un número positivo');
        }

        return errores;
    }
}

// Función para limpiar mensajes de error
function limpiarErrores() {
    const errores = document.querySelectorAll('.error-message');
    errores.forEach(error => {
        error.style.display = 'none';
        error.textContent = '';
    });
    document.getElementById('successMessage').style.display = 'none';
}

// Función para mostrar mensaje de error
function mostrarError(campo, mensaje) {
    const errorElement = document.getElementById(campo + 'Error');
    errorElement.textContent = mensaje;
    errorElement.style.display = 'block';
}

// Función para mostrar mensaje de éxito
function mostrarExito(mensaje) {
    const successElement = document.getElementById('successMessage');
    successElement.textContent = mensaje;
    successElement.style.display = 'block';
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 3000);
}

// Función principal para guardar producto
function guardarProducto() {
    try {
        limpiarErrores();

        // Obtener valores del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const cantidad = parseFloat(document.getElementById('cantidad').value);
        const precio = parseFloat(document.getElementById('precio').value);

        // Validaciones básicas
        if (!nombre) {
            throw new Error('El nombre del producto es obligatorio');
        }

        if (isNaN(cantidad) || cantidad < 0) {
            throw new Error('La cantidad debe ser un número válido mayor o igual a 0');
        }

        if (isNaN(precio) || precio < 0) {
            throw new Error('El precio debe ser un número válido mayor o igual a 0');
        }

        // Crear instancia del producto
        const nuevoProducto = new Producto(nombre, cantidad, precio);

        // Validar usando el método de la clase
        const erroresValidacion = nuevoProducto.validar();
        if (erroresValidacion.length > 0) {
            throw new Error(erroresValidacion.join(', '));
        }

        // Agregar producto al array
        productos.push(nuevoProducto);

        // Limpiar formulario
        document.getElementById('productForm').reset();

        // Actualizar tabla
        actualizarTabla();

        // Mostrar mensaje de éxito
        mostrarExito('✅ Producto guardado correctamente');

        console.log('Producto guardado:', nuevoProducto);

    } catch (error) {
        console.error('Error al guardar producto:', error);

        // Mostrar error específico según el tipo
        if (error.message.includes('nombre')) {
            mostrarError('nombre', error.message);
        } else if (error.message.includes('cantidad')) {
            mostrarError('cantidad', error.message);
        } else if (error.message.includes('precio')) {
            mostrarError('precio', error.message);
        } else {
            // Error general
            mostrarError('nombre', error.message);
        }
    }
}

// Función para actualizar la tabla
function actualizarTabla() {
    const tablaBody = document.getElementById('tablaBody');
    const tabla = document.getElementById('productosTable');
    const noProducts = document.getElementById('noProducts');
    const totalGeneralElement = document.getElementById('totalGeneral');

    // Limpiar tabla
    tablaBody.innerHTML = '';

    if (productos.length === 0) {
        tabla.style.display = 'none';
        noProducts.style.display = 'block';
        totalGeneralElement.innerHTML = '<strong>$0.00</strong>';
        return;
    }

    // Mostrar tabla
    tabla.style.display = 'table';
    noProducts.style.display = 'none';

    let totalGeneral = 0;

    // Llenar tabla con productos
    productos.forEach((producto, index) => {
        const totalProducto = producto.calcularTotal();
        totalGeneral += totalProducto;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producto.nombre}</td>
            <td>${producto.cantidad}</td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td>$${totalProducto.toFixed(2)}</td>
            <td class="actions">
                <button class="delete-btn" onclick="eliminarProducto(${index})">🗑️ Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });

    // Actualizar total general
    totalGeneralElement.innerHTML = `<strong>$${totalGeneral.toFixed(2)}</strong>`;
}

// Función para eliminar producto
function eliminarProducto(index) {
    try {
        if (index < 0 || index >= productos.length) {
            throw new Error('Índice de producto inválido');
        }

        const productoEliminado = productos.splice(index, 1)[0];
        actualizarTabla();
        mostrarExito(`🗑️ Producto "${productoEliminado.nombre}" eliminado`);

        console.log('Producto eliminado:', productoEliminado);

    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto: ' + error.message);
    }
}

// Función para exportar a archivo .txt
function exportarATxt() {
    try {
        if (productos.length === 0) {
            throw new Error('No hay productos para exportar');
        }

        // Crear contenido del archivo
        let contenido = 'INVENTARIO DE PRODUCTOS\n';
        contenido += '=======================\n';
        contenido += `Fecha de exportación: ${new Date().toLocaleString()}\n\n`;

        let totalGeneral = 0;

        productos.forEach((producto, index) => {
            const totalProducto = producto.calcularTotal();
            totalGeneral += totalProducto;

            contenido += `Producto ${index + 1}:\n`;
            contenido += `  Nombre: ${producto.nombre}\n`;
            contenido += `  Cantidad: ${producto.cantidad}\n`;
            contenido += `  Precio: $${producto.precio.toFixed(2)}\n`;
            contenido += `  Total: $${totalProducto.toFixed(2)}\n`;
            contenido += '-----------------------\n';
        });

        contenido += `\nTOTAL GENERAL: $${totalGeneral.toFixed(2)}\n`;
        contenido += `Total de productos: ${productos.length}`;

        // Crear blob y descargar
        const blob = new Blob([contenido], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventario_productos_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        mostrarExito('📄 Archivo .txt exportado correctamente');
        console.log('Archivo exportado con éxito');

    } catch (error) {
        console.error('Error al exportar archivo:', error);
        alert('Error al exportar: ' + error.message);
    }
}

// Función para cargar productos (simula lectura de archivo)
function cargarProductos() {
    try {
        // En un entorno real, aquí se leería de un archivo
        // Por ahora, simulamos con datos de ejemplo o localStorage
        
        const productosGuardados = localStorage.getItem('productosInventario');
        
        if (productosGuardados) {
            const datos = JSON.parse(productosGuardados);
            productos = datos.map(p => new Producto(p.nombre, p.cantidad, p.precio));
            actualizarTabla();
            mostrarExito('📂 Productos cargados desde almacenamiento local');
        } else {
            // Datos de ejemplo para prueba
            productos = [
                new Producto('Laptop HP', 5, 899.99),
                new Producto('Mouse Inalámbrico', 15, 25.50),
                new Producto('Teclado Mecánico', 8, 75.00)
            ];
            actualizarTabla();
            mostrarExito('📋 Datos de ejemplo cargados para prueba');
        }

        console.log('Productos cargados:', productos);

    } catch (error) {
        console.error('Error al cargar productos:', error);
        alert('Error al cargar productos: ' + error.message);
    }
}

// Función para guardar en localStorage (simula guardar en archivo)
function guardarEnAlmacenamiento() {
    try {
        const datos = productos.map(p => ({
            nombre: p.nombre,
            cantidad: p.cantidad,
            precio: p.precio
        }));
        
        localStorage.setItem('productosInventario', JSON.stringify(datos));
        console.log('Datos guardados en almacenamiento local');
        
    } catch (error) {
        console.error('Error al guardar en almacenamiento:', error);
        throw new Error('No se pudieron guardar los datos');
    }
}

// Event listeners para mejor UX
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos al iniciar
    cargarProductos();

    // Permitir enviar formulario con Enter
    document.getElementById('productForm').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            guardarProducto();
        }
    });

    // Validación en tiempo real
    document.getElementById('cantidad').addEventListener('input', function() {
        const valor = this.value;
        if (valor && (isNaN(valor) || valor < 0)) {
            mostrarError('cantidad', 'La cantidad debe ser un número positivo');
        } else {
            document.getElementById('cantidadError').style.display = 'none';
        }
    });

    document.getElementById('precio').addEventListener('input', function() {
        const valor = this.value;
        if (valor && (isNaN(valor) || valor < 0)) {
            mostrarError('precio', 'El precio debe ser un número positivo');
        } else {
            document.getElementById('precioError').style.display = 'none';
        }
    });

    console.log('Sistema de registro de productos inicializado');
});

// Guardar en almacenamiento antes de cerrar la página
window.addEventListener('beforeunload', function() {
    guardarEnAlmacenamiento();
});