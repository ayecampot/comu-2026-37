// Editá aquí la información de la muestra y los archivos reales.
// Guardá las portadas y audios en assets/ y completá sus rutas.
export const content = {
  school: 'Nombre de la escuela',
  teacher: 'Ayelen Campoy y Carolina Baiguera',
  year: '2026',
  projects: {
    puentes: Array.from({ length: 3 }, (_, i) => ({
      id: `puentes-${i + 1}`, title: ['Puentes · S3 · Capítulo 1: La industria de la moda ultra rápida', 'Puentes · S3 · Capítulo 2: La ludopatía', 'Puentes · S3 · Capítulo 3: Las migraciones'][i],
      cover: '',
      audio: ['assets/modarapida.mp3', 'assets/ludopatia.mp3', 'assets/las-migraciones.mpeg'][i],
      label: `PODCAST ${String(i + 1).padStart(2, '0')}`,
      theme: ['pink', 'blue', 'yellow'][i], illustration: ['bridge', 'voices', 'waves'][i],
    })),
    taller: Array.from({ length: 3 }, (_, i) => ({
      id: `taller-${i + 1}`, title: ['Oportunidades laborales entre jóvenes', 'Descifrando el laberinto del empleo', 'Hablemos de lo que no se ve'][i],
      members: [
        ['Candela Erazo', 'Constanza Gonzalez'],
        ['Nayla Callero', 'Morena Aquino', 'Morena Valdez', 'Nehuen Yanquetruz'],
        ['Aylen Contreras', 'Mariana Rivas', 'Joel Russo', 'Tomás Miramón'],
      ][i],
      cover: ['assets/podcast-1.jpeg', 'assets/podcast-2.jpg', ''][i],
      audio: ['assets/podcast-1.mp3', 'assets/podcast-2.mp3', 'assets/podcast-3.mp3'][i],
      label: `PODCAST ${String(i + 1).padStart(2, '0')}`,
      theme: ['blue', 'yellow', 'pink'][i], illustration: ['stairs', 'sun', 'plant'][i],
    })),
  },
};
