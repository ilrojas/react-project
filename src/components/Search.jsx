import { useState, useTransition } from 'react';

export function Search() {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isPending, startTransition] = useTransition();

  // Lista de elementos simulada
  const items = ['Apple', 'Banana', 'Orange', 'Grape', 'Lemon'];

  const handleSearch = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    // Usamos startTransition para envolver la actualización de los elementos
    setTimeout(()=>{
        startTransition(() => {
        
            const filtered = items.filter(item => 
                item.toLowerCase().includes(newQuery.toLowerCase())
              );
              setFilteredItems(filtered);
        
      
    });
},5000)
    console.log(isPending)
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search fruits..."
      />
      {isPending && <p>Loading...</p>}  {/* Muestra un cargando si la transición está en proceso */}
      <ul>
        {filteredItems.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
