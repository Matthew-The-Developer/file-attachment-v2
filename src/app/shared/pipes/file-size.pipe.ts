import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(size: number): string {
    const gbs = (size / (1024 * 1024 * 1024));

    if (gbs > 1) {
      return `${gbs.toFixed(1)}GB`; 
    } else {
      const mbs = (size / (1024 * 1024));

      if (mbs > 1) {
        return `${mbs.toFixed(2)}MB`; 
      } else {
        const kbs = (size / 1024);
        return `${kbs.toFixed(0)}KB`
      }
    }
  }
}
