type Item = {
    id: number
    name: string
    description?: string
  }
  
  /**
   * Filter items based on a search term
   */
  export function filterItems(items: Item[], searchTerm: string): Item[] {
    if (!searchTerm) {
      return items
    }
    
    const term = searchTerm.toLowerCase().trim()
    
    return items.filter(item =>
      item.name.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term))
    )
  }
  
  /**
   * Format data for display
   */
  export function formatData(data: any[]): Item[] {
    if (!data || !Array.isArray(data)) {
      return []
    }
    
    return data.map(item => ({
      id: item.id,
      name: item.name || item.title || 'Unknown',
      description: item.description || item.summary
    }))
  }