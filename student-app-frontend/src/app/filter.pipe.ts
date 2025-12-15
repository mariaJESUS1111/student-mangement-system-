import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, fields: string[]): any[] {
    if (!items || !searchTerm) return items;

    const lowerSearch = searchTerm.toLowerCase();

    return items.filter(item =>
      fields.some(field =>
        String(item[field] || '').toLowerCase().includes(lowerSearch)
      )
    );
  }
}
