import rifle1 from '../assets/rifle1.jpg'
import rifle2 from '../assets/rifle2.jpg'
import pistol1 from '../assets/pistol1.jpg'
import vest1 from '../assets/vest1.jpg'

export const mockRaffles = [
  {
    id: 1,
    title: "Rifle Tático M4A1 Lancer Tactical Gen 3 - Edição Limitada",
    image: rifle1,
    ticketPrice: 25.00,
    totalTickets: 1000,
    soldTickets: 750,
    participants: 420,
    drawDate: "15/08 às 20h",
    status: "active",
    category: "rifles",
    description: "Rifle de airsoft de alta qualidade com sistema elétrico AEG, ideal para jogos táticos e competições."
  },
  {
    id: 2,
    title: "Rifle M4 Keymod Tan - Lancer Tactical Premium",
    image: rifle2,
    ticketPrice: 30.00,
    totalTickets: 800,
    soldTickets: 680,
    participants: 380,
    drawDate: "12/08 às 19h",
    status: "ending",
    category: "rifles",
    description: "Rifle tático em cor tan com sistema keymod para acessórios, perfeito para simulações militares."
  },
  {
    id: 3,
    title: "Pistola HPA SUB5 F2 Custom Build - Amped Airsoft",
    image: pistol1,
    ticketPrice: 15.00,
    totalTickets: 1200,
    soldTickets: 240,
    participants: 180,
    drawDate: "20/08 às 21h",
    status: "new",
    category: "pistols",
    description: "Pistola de airsoft customizada com sistema HPA, alta precisão e performance excepcional."
  },
  {
    id: 4,
    title: "Colete Tático Militar Completo - Kit Profissional",
    image: vest1,
    ticketPrice: 20.00,
    totalTickets: 600,
    soldTickets: 480,
    participants: 290,
    drawDate: "18/08 às 20h",
    status: "active",
    category: "tactical",
    description: "Colete tático militar completo com múltiplos compartimentos e sistema MOLLE para acessórios."
  },
  {
    id: 5,
    title: "Rifle Sniper L96 AWS - Precisão Extrema",
    image: rifle1,
    ticketPrice: 40.00,
    totalTickets: 500,
    soldTickets: 350,
    participants: 220,
    drawDate: "25/08 às 19h",
    status: "active",
    category: "rifles",
    description: "Rifle sniper de alta precisão, ideal para jogadores que buscam alcance e acurácia máxima."
  },
  {
    id: 6,
    title: "Kit Tático Completo - Rifle + Equipamentos",
    image: rifle2,
    ticketPrice: 50.00,
    totalTickets: 400,
    soldTickets: 120,
    participants: 85,
    drawDate: "30/08 às 20h",
    status: "new",
    category: "equipment",
    description: "Kit completo com rifle, colete, capacete e acessórios táticos para jogadores profissionais."
  },
  {
    id: 7,
    title: "Pistola Glock 17 Gen 4 - Réplica Oficial",
    image: pistol1,
    ticketPrice: 18.00,
    totalTickets: 900,
    soldTickets: 720,
    participants: 450,
    drawDate: "14/08 às 18h",
    status: "ending",
    category: "pistols",
    description: "Réplica oficial da Glock 17 com sistema GBB, realismo e performance incomparáveis."
  },
  {
    id: 8,
    title: "Equipamento de Proteção Completo - Gear Pro",
    image: vest1,
    ticketPrice: 35.00,
    totalTickets: 300,
    soldTickets: 180,
    participants: 120,
    drawDate: "22/08 às 21h",
    status: "active",
    category: "equipment",
    description: "Conjunto completo de proteção profissional para jogos de airsoft e paintball."
  }
]

export const getFilteredRaffles = (raffles, filters) => {
  let filtered = [...raffles]

  // Filter by category
  if (filters.category) {
    filtered = filtered.filter(raffle => raffle.category === filters.category)
  }

  // Filter by price range
  if (filters.priceRange) {
    const [min, max] = filters.priceRange.split('-').map(p => p.replace('+', ''))
    filtered = filtered.filter(raffle => {
      if (max) {
        return raffle.ticketPrice >= parseInt(min) && raffle.ticketPrice <= parseInt(max)
      } else {
        return raffle.ticketPrice >= parseInt(min)
      }
    })
  }

  // Filter by status
  if (filters.status) {
    filtered = filtered.filter(raffle => raffle.status === filters.status)
  }

  // Sort
  switch (filters.sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.ticketPrice - b.ticketPrice)
      break
    case 'price-high':
      filtered.sort((a, b) => b.ticketPrice - a.ticketPrice)
      break
    case 'ending-soon':
      filtered.sort((a, b) => {
        const statusOrder = { 'ending': 0, 'active': 1, 'new': 2 }
        return statusOrder[a.status] - statusOrder[b.status]
      })
      break
    case 'popular':
      filtered.sort((a, b) => b.participants - a.participants)
      break
    case 'newest':
    default:
      filtered.sort((a, b) => b.id - a.id)
      break
  }

  return filtered
}

