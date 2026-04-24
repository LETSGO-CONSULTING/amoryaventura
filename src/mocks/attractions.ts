import type { Attraction } from '@/models'

// Oxapampa
import rioTigre from '@/img/destinations/oxapampa-rio-tigre.jpg'
import wharapo from '@/img/destinations/oxapampa-wharapo.jpg'
import museoSchlaefli from '@/img/destinations/oxapampa-museo-schlaefli.jpg'
import plazaChontabamba from '@/img/destinations/oxapampa-plaza-chontabamba.jpg'
import tunquiCueva from '@/img/destinations/oxapampa-tunqui-cueva.jpg'

// Pozuzo
import aguasTurquesas from '@/img/destinations/pozuzo-aguas-turquesas.jpg'
import rayantambo from '@/img/destinations/pozuzo-rayantambo.jpg'
import portal from '@/img/destinations/pozuzo-portal.jpg'
import plazaColonos from '@/img/destinations/pozuzo-plaza-colonos.jpg'
import barrioPrusia from '@/img/destinations/pozuzo-barrio-prusia.jpg'
import prusia from '@/img/destinations/pozuzo-prusia.jpg'

// Villa Rica
import cascadaLeon from '@/img/destinations/villa-rica-cascada-leon.jpg'
import fincaCafe from '@/img/destinations/villa-rica-finca-cafe.jpg'
import oconal from '@/img/destinations/villa-rica-oconal.jpg'
import plazaVillaRica from '@/img/destinations/villa-rica-plaza.jpg'

// Perené
import catarataBayoz from '@/img/destinations/perene-catarata-bayoz.jpg'
import comunidadAshaninka from '@/img/destinations/perene-comunidad-ashaninka.jpg'
import nativoDormido from '@/img/destinations/perene-nativo-dormido.jpg'
import veloNovia from '@/img/destinations/perene-velo-novia.jpg'

export const attractions: Attraction[] = [
  // — Oxapampa —
  {
    id: 'a1',
    name: 'Catarata Río Tigre',
    zone: 'Oxapampa',
    image: rioTigre,
    description: 'Imponente catarata rodeada de selva nubosa, escondida en el corazón del bosque oxapampino.',
    tag: 'Catarata',
  },
  {
    id: 'a2',
    name: 'Wharapo',
    zone: 'Oxapampa',
    image: wharapo,
    description: 'Laguna cristalina ideal para relajarse y conectar con la naturaleza en plena Reserva de Biosfera.',
    tag: 'Laguna',
  },
  {
    id: 'a3',
    name: 'Museo Schlaefli',
    zone: 'Oxapampa',
    image: museoSchlaefli,
    description: 'Museo que preserva la historia y cultura de los colonos austro-alemanes que fundaron Oxapampa.',
    tag: 'Cultura',
  },
  {
    id: 'a4',
    name: 'Plaza Chontabamba',
    zone: 'Oxapampa',
    image: plazaChontabamba,
    description: 'Pintoresca plaza del pequeño distrito de Chontabamba, con arquitectura típica de la colonia austro-germana.',
    tag: 'Pueblo',
  },
  {
    id: 'a5',
    name: 'Cueva del Tunqui',
    zone: 'Oxapampa',
    image: tunquiCueva,
    description: 'Cueva ancestral hogar del tunqui o gallito de las rocas, ave símbolo del Perú.',
    tag: 'Naturaleza',
  },

  // — Pozuzo —
  {
    id: 'a6',
    name: 'Aguas Turquesas',
    zone: 'Pozuzo',
    image: aguasTurquesas,
    description: 'Playas de río con aguas de un azul turquesa extraordinario, uno de los paisajes más fotogénicos del Perú.',
    tag: 'Río',
  },
  {
    id: 'a7',
    name: 'Catarata Rayantambo',
    zone: 'Pozuzo',
    image: rayantambo,
    description: 'Espectacular catarata de dos caídas en medio de la selva pozucina, de difícil acceso y gran belleza.',
    tag: 'Catarata',
  },
  {
    id: 'a8',
    name: 'Portal de Bienvenida',
    zone: 'Pozuzo',
    image: portal,
    description: 'Arco emblemático que marca la entrada a Pozuzo, la colonia austro-prusiana más remota del Perú.',
    tag: 'Ícono',
  },
  {
    id: 'a9',
    name: 'Plaza de los Colonos',
    zone: 'Pozuzo',
    image: plazaColonos,
    description: 'Corazón de Pozuzo, rodeada de casonas coloniales y la iglesia que recuerda los orígenes europeos del pueblo.',
    tag: 'Pueblo',
  },
  {
    id: 'a10',
    name: 'Barrio de Prusia',
    zone: 'Pozuzo',
    image: barrioPrusia,
    description: 'Barrio histórico donde los descendientes de colonos prusianos mantienen viva su arquitectura y tradiciones.',
    tag: 'Historia',
  },
  {
    id: 'a11',
    name: 'Cervecería Artesanal',
    zone: 'Pozuzo',
    image: prusia,
    description: 'Cervecería local que elabora cervezas artesanales con recetas traídas de Europa hace más de 150 años.',
    tag: 'Gastronomía',
  },

  // — Villa Rica —
  {
    id: 'a12',
    name: 'Cascada León',
    zone: 'Villa Rica',
    image: cascadaLeon,
    description: 'Cascada de aguas blancas entre exuberante vegetación cafetalera, a minutos del centro de Villa Rica.',
    tag: 'Catarata',
  },
  {
    id: 'a13',
    name: 'Finca Cafetera',
    zone: 'Villa Rica',
    image: fincaCafe,
    description: 'Experiencia completa en una finca de café: recorrido, cosecha, beneficio y degustación del mejor café peruano.',
    tag: 'Café',
  },
  {
    id: 'a14',
    name: 'Laguna El Oconal',
    zone: 'Villa Rica',
    image: oconal,
    description: 'Laguna rodeada de palmeras y vegetación tropical, hábitat de aves silvestres y punto de relajación.',
    tag: 'Laguna',
  },
  {
    id: 'a15',
    name: 'Plaza de Armas',
    zone: 'Villa Rica',
    image: plazaVillaRica,
    description: 'Plaza principal de la capital del café peruano, punto de partida para explorar cafeterías y chocolaterías locales.',
    tag: 'Pueblo',
  },

  // — Perené —
  {
    id: 'a16',
    name: 'Catarata Bayoz',
    zone: 'Perené',
    image: catarataBayoz,
    description: 'Una de las cataratas más impresionantes de la selva central, accesible desde el río Perené en lancha.',
    tag: 'Catarata',
  },
  {
    id: 'a17',
    name: 'Comunidad Ashaninka',
    zone: 'Perené',
    image: comunidadAshaninka,
    description: 'Visita cultural a una comunidad nativa Ashaninka: artesanía, gastronomía ancestral y convivencia auténtica.',
    tag: 'Cultura',
  },
  {
    id: 'a18',
    name: 'Nativo Dormido',
    zone: 'Perené',
    image: nativoDormido,
    description: 'Formación natural en el río Perené con forma de figura humana, lugar de leyendas amazónicas y folklore local.',
    tag: 'Naturaleza',
  },
  {
    id: 'a19',
    name: 'Velo de Novia',
    zone: 'Perené',
    image: veloNovia,
    description: 'Delicada cascada en forma de velo que cae entre las rocas de la selva central peruana.',
    tag: 'Catarata',
  },
]
