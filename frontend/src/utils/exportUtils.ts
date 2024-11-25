// frontend/src/utils/exportUtils.ts
export const convertToCSV = (data: any) => {
    const headers = [
      'Date',
      'Total Sales',
      'Orders',
      'Average Order Value'
    ].join(',');
  
    const rows = data.weeklyMetrics.map((metric: any) => {
      return [
        format(new Date(metric.week), 'yyyy-MM-dd'),
        metric.totalSales,
        metric.orderCount,
        (metric.totalSales / metric.orderCount).toFixed(2)
      ].join(',');
    });
  
    return [headers, ...rows].join('\n');
  };