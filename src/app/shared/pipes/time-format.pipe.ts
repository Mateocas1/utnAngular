import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeFormat' })
export class TimeFormat implements PipeTransform {
  transform(value: Date | string): string {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const hhmm = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    if (isToday) return hhmm;
    if (isYesterday) return `ayer ${hhmm}`;
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
  }
}
