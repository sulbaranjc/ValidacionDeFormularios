  // Seleccionamos el boton y el parrafo
    const boton = document.getElementById('boton');
    const bienvenido = document.getElementById('bienvenido');
    const agregarCiudadBtn = document.getElementById('agregarCiudadBtn');
    const listaDeCiudades = document.querySelector('#lista-de-ciudades ul');

    // Agregamos un evento al boton para agregar una ciudad a la lista
    agregarCiudadBtn.addEventListener('click', () => {
      const nuevaCiudad = prompt('Ingrese el nombre de la ciudad:');
      if (nuevaCiudad) {
        const li = document.createElement('li');
        li.textContent = nuevaCiudad;
        listaDeCiudades.appendChild(li);
      }
    });

    // Agregamos un evento al boton para cambiar el texto del parrafo
    boton.addEventListener('click', () => {
      bienvenido.textContent = 'El texto ha sido cambiado!';
      bienvenido.style.color = 'red';
      bienvenido.style.fontSize = '1.5em';
      bienvenido.style.fontWeight = 'bold';
      // boton.style.display = 'none'; // Oculta el boton despues de hacer clic
      //cambia el texto del boton
      boton.textContent = '¡Has hecho clic!';
    });

    // --- Cargar ciudades desde ciudades.json y renderizar --- //
async function cargarCiudades() {
  const lista = document.querySelector('#lista-de-ciudades ul');
  if (!lista) return;

  // indicador de carga
  lista.innerHTML = '<li>Cargando ciudades...</li>';

  try {
    // Si ciudades.json está junto a index.html, usa ruta relativa:
    const resp = await fetch('./ciudades.json', { cache: 'no-store' });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    // Limpiar y renderizar
    lista.innerHTML = '';
    (data.ciudades || []).forEach(({ nombre, comunidad_autonoma, poblacion }) => {
      const li = document.createElement('li');
      li.textContent = `${nombre} — ${comunidad_autonoma} — ${poblacion.toLocaleString('es-ES')}`;
      lista.appendChild(li);
    });

    // Si no había ciudades
    if (!lista.children.length) {
      lista.innerHTML = '<li>No hay ciudades para mostrar.</li>';
    }
  } catch (err) {
    console.error(err);
    lista.innerHTML = '<li>Error cargando las ciudades. Revisa la consola.</li>';
  }
}

// Llamar al cargar la página
document.addEventListener('DOMContentLoaded', cargarCiudades);
