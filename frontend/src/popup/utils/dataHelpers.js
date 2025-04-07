/**
 * Format data for display in the UI
 * @param {Array} data - Raw data from API or storage
 * @returns {Array} Formatted data
 */
export const formatData = (data) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
  
    return data.map(item => ({
      ...item,
      // Add any formatting logic here
      formattedDate: item.date ? new Date(item.date).toLocaleDateString() : '',
      name: item.name || item.title || 'Unnamed Item',
      description: item.description || item.summary || ''
    }));
  };
  
  /**
   * Filter data based on search term
   * @param {Array} data - Data to filter
   * @param {string} searchTerm - Search term
   * @param {Array} fields - Fields to search in
   * @returns {Array} Filtered data
   */
  export const filterData = (data, searchTerm, fields = ['name', 'description']) => {
    if (!searchTerm || !data || !Array.isArray(data)) {
      return data || [];
    }
  
    const term = searchTerm.toLowerCase().trim();
    
    return data.filter(item => {
      return fields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  };