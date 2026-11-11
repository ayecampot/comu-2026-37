// Editá aquí la información de la muestra y los archivos reales.
// Guardá las portadas y audios en assets/ y completá sus rutas.
export const content = {
  school: 'Nombre de la escuela',
  teacher: 'Nombre de la docente',
  year: '2026',
  projects: {
    puentes: Array.from({ length: 3 }, (_, i) => ({
      id: `puentes-${i + 1}`, title: i === 0 ? 'Salud Mental: Ludopatía' : 'Próximamente',
      cover: i === 0 ? 'assets/ludopatia.jpeg' : '',
      audio: i === 0 ? 'assets/ludopatia.mp3' : '',
      label: `PODCAST ${String(i + 1).padStart(2, '0')}`,
      theme: ['pink', 'blue', 'yellow'][i], illustration: ['bridge', 'voices', 'waves'][i],
    })),
    taller: Array.from({ length: 3 }, (_, i) => ({
      id: `taller-${i + 1}`, title: ['Podcast 1', 'Podcast 2', 'Próximamente'][i],
      cover: ['assets/podcast-1.jpeg', 'assets/podcast-2.jpg', ''][i],
      audio: ['assets/podcast-1.mp3', 'assets/podcast-2.mp3', 'assets/podcast-3.mp3'][i],
      label: `PODCAST ${String(i + 1).padStart(2, '0')}`,
      theme: ['blue', 'yellow', 'pink'][i], illustration: ['stairs', 'sun', 'plant'][i],
    })),
  },
};
