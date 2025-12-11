// src/data/serviceHierarchy.js
import { 
  FiWind, 
  FiZap, 
  FiDroplet, 
  FiHome, 
  FiShield, 
  FiTruck,
  FiTool,
  FiSettings,
  FiGrid,
  FiSun,
  FiShoppingBag
} from 'react-icons/fi';

export const serviceHierarchy = {
  'AC Service': {
    icon: FiWind,
    color: '#06b6d4',
    image: 'https://images.unsplash.com/photo-1631545967298-c7368e12e0b4',
    subCategories: {
      'Split': {
        icon: FiWind,
        services: [
          'AC Service',
          'AC Install',
          'AC Uninstall',
          'Gas Refilling Full',
          'Gas Refilling Topup',
          'Gas Pumpdown Service'
        ]
      },
      'Window': {
        icon: FiWind,
        services: [
          'AC Service',
          'AC Install',
          'AC Uninstall',
          'Gas Refilling Full',
          'Gas Refilling Topup',
          'Gas Pumpdown Service'
        ]
      },
      'Commercial': {
        icon: FiWind,
        services: [
          'AC Service',
          'AC Install',
          'AC Uninstall',
          'Gas Refilling Full',
          'Gas Refilling Topup',
          'Gas Pumpdown Service'
        ]
      },
      'Cassette': {
        icon: FiWind,
        services: [
          'AC Service',
          'AC Install',
          'AC Uninstall',
          'Gas Refilling Full',
          'Gas Refilling Topup',
          'Gas Pumpdown Service'
        ]
      },
      'Ductable AC': {
        icon: FiWind,
        services: [
          'AC Service',
          'AC Install',
          'AC Uninstall',
          'Gas Refilling Full',
          'Gas Refilling Topup',
          'Gas Pumpdown Service'
        ]
      },
      'Tower AC': {
        icon: FiWind,
        services: [
          'AC Service',
          'AC Install',
          'AC Uninstall',
          'Gas Refilling Full',
          'Gas Refilling Topup',
          'Gas Pumpdown Service'
        ]
      },
      'Furstand AC': {
        icon: FiWind,
        services: [
          'AC Service',
          'AC Install',
          'AC Uninstall',
          'Gas Refilling Full',
          'Gas Refilling Topup',
          'Gas Pumpdown Service'
        ]
      },
      'VRF AC': {
        icon: FiWind,
        services: [
          'AC Service',
          'AC Install',
          'AC Uninstall',
          'Gas Refilling Full',
          'Gas Refilling Topup',
          'Gas Pumpdown Service'
        ]
      }
    }
  },
  'Refrigerator': {
    icon: FiHome,
    color: '#10b981',
    image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5',
    subCategories: {
      'All Types': {
        icon: FiHome,
        services: [
          'Refrigerator Service & Repair',
          'Gas Refilling'
        ]
      }
    }
  },
  'Water Purifier': {
    icon: FiDroplet,
    color: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1534066060086-538421d09794',
    subCategories: {
      'All Types': {
        icon: FiDroplet,
        services: [
          'Service & Repair'
        ]
      }
    }
  },
  'Microwave': {
    icon: FiZap,
    color: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd',
    subCategories: {
      'All Types': {
        icon: FiZap,
        services: [
          'Service & Repair',
          'Magnetron Change',
          'Touchpad Repair'
        ]
      }
    }
  },
  'Water Cooler': {
    icon: FiDroplet,
    color: '#06b6d4',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c',
    subCategories: {
      'All Types': {
        icon: FiDroplet,
        services: [
          'Repair Service'
        ]
      }
    }
  },
  'Washing Machine': {
    icon: FiSettings,
    color: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1',
    subCategories: {
      'All Types': {
        icon: FiSettings,
        services: [
          'Repair & Service'
        ]
      }
    }
  },
  'Second Hand Electronics': {
    icon: FiShoppingBag,
    color: '#ef4444',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03',
    subCategories: {
      'AC': {
        icon: FiWind,
        services: ['Buy', 'Sell']
      },
      'Refrigerator': {
        icon: FiHome,
        services: ['Buy', 'Sell']
      },
      'Microwave': {
        icon: FiZap,
        services: ['Buy', 'Sell']
      },
      'Washing Machine': {
        icon: FiSettings,
        services: ['Buy', 'Sell']
      },
      'Water Cooler': {
        icon: FiDroplet,
        services: ['Buy', 'Sell']
      },
      'Water Purifier': {
        icon: FiDroplet,
        services: ['Buy', 'Sell']
      }
    }
  },
  'House Wiring': {
    icon: FiZap,
    color: '#f97316',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e',
    subCategories: {
      'All Types': {
        icon: FiZap,
        services: [
          'Full Wiring'
        ]
      }
    }
  },
  'Solar': {
    icon: FiSun,
    color: '#eab308',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276',
    subCategories: {
      'All Types': {
        icon: FiSun,
        services: [
          'Solar Install',
          'Solar Uninstall',
          'Repair & Service'
        ]
      }
    }
  }
};