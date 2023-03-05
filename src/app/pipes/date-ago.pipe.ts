import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
  pure: true,
  standalone: true,
})
export class DateAgoPipe implements PipeTransform {
  transform(date: Date): string {
    if (date) {
      const seconds = Math.floor((+new Date() - +date) / 1000);
      if (seconds < 59) {
        // less than 60 seconds ago will show as 'Just now'
        return 'Just now';
      }

      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
      };

      for (const [key, value] of Object.entries(intervals)) {
        const count = Math.floor(seconds / value);
        if (count > 0) {
          const plural = count > 1 ? 's' : '';
          return `${count} ${key}${plural} ago`;
        }
      }
    }
    return '';
  }
}
